import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

const root = process.cwd();
const pointerPath = path.join(root, 'episodes', 'ACTIVE_EPISODE.json');
const failures = [];
const fail = (message) => failures.push(message);
if (!fs.existsSync(pointerPath)) {
  console.error('ASSET GATE FAILED: episodes/ACTIVE_EPISODE.json is missing. Run kidmotion:activate first.');
  process.exit(1);
}

const pointer = JSON.parse(fs.readFileSync(pointerPath, 'utf8'));
const episodeFolder = pointer.episodeFolder;
const paths = resolveEpisodePaths(root, episodeFolder);
if (paths.structure === 'missing') fail('Active episode data is missing.');
if (!fs.existsSync(paths.approvalPath)) fail(`Missing ${path.relative(paths.episodeRoot, paths.approvalPath)}.`);
if (!fs.existsSync(paths.revisionPath)) fail(`Missing ${path.relative(paths.episodeRoot, paths.revisionPath)}.`);
if (failures.length) {
  console.error('ASSET GATE FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

const approval = JSON.parse(fs.readFileSync(paths.approvalPath, 'utf8'));
const revision = fs.readFileSync(paths.revisionPath, 'utf8').trim();
if (approval.status !== 'APPROVED_FOR_RENDER') fail('Asset approval status is not APPROVED_FOR_RENDER.');
if (approval.episodeFolder !== episodeFolder) fail('Asset approval belongs to a different episode.');
if (approval.revision !== revision) fail('Generation revision changed after asset approval. Re-review and re-approve.');

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const approvedFiles = approval.files && typeof approval.files === 'object' ? approval.files : {};
if (!Object.keys(approvedFiles).length) fail('Asset approval contains no locked files.');
for (const [relativePath, metadata] of Object.entries(approvedFiles)) {
  const absolute = path.join(paths.episodeRoot, relativePath);
  if (!fs.existsSync(absolute)) {
    fail(`Approved asset is missing: ${relativePath}`);
    continue;
  }
  if (sha256(absolute) !== metadata.sha256) fail(`Approved asset changed after review: ${relativePath}`);
}

if (paths.structure !== 'missing') {
  const data = readEpisodeData(paths);
  const scenes = Array.isArray(data.scenes) ? data.scenes : [];
  for (const scene of scenes) {
    if (!scene.image) continue;
    const key = `${paths.imageRelativePrefix}/${scene.image}`;
    if (!approvedFiles[key]) fail(`Scene uses image that was never approved: ${key}`);
  }
  const voice = data.voicePolicy?.voiceFile || scenes.find((scene) => scene.type === 'intro')?.voice || 'Voice 01.mp3';
  if (!approvedFiles[`${paths.audioRelativePrefix}/${voice}`]) fail(`Opening Voice was not approved: ${voice}`);
  if (data.audioPolicy?.backgroundMusicRequiredForFinal === true) {
    const music = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';
    if (!approvedFiles[`${paths.audioRelativePrefix}/${music}`]) fail(`Background music was not approved: ${music}`);
  }
}

if (failures.length) {
  console.error('ASSET GATE FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}
console.log(`ASSET GATE PASSED — ${episodeFolder} — ${revision}`);
console.log('All render assets exactly match the visually reviewed SHA-256 manifest.');

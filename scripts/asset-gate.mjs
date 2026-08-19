import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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
const episodeRoot = path.join(root, 'episodes', episodeFolder);
const approvalPath = path.join(episodeRoot, '04-data', 'ASSET_APPROVAL.json');
const revisionPath = path.join(episodeRoot, 'GENERATION-REVISION.txt');

if (!fs.existsSync(approvalPath)) fail('Missing 04-data/ASSET_APPROVAL.json. Run visual review, then npm run assets:approve -- --episode=...');
if (!fs.existsSync(revisionPath)) fail('Missing GENERATION-REVISION.txt.');

if (failures.length) {
  console.error('ASSET GATE FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

const approval = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
const revision = fs.readFileSync(revisionPath, 'utf8').trim();
if (approval.status !== 'APPROVED_FOR_RENDER') fail('Asset approval status is not APPROVED_FOR_RENDER.');
if (approval.episodeFolder !== episodeFolder) fail('Asset approval belongs to a different episode.');
if (approval.revision !== revision) fail('Generation revision changed after asset approval. Re-review and re-approve assets.');

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const approvedFiles = approval.files && typeof approval.files === 'object' ? approval.files : {};
if (!Object.keys(approvedFiles).length) fail('Asset approval contains no locked files.');

for (const [relativePath, metadata] of Object.entries(approvedFiles)) {
  const absolute = path.join(episodeRoot, relativePath);
  if (!fs.existsSync(absolute)) {
    fail(`Approved asset is missing: ${relativePath}`);
    continue;
  }
  const actual = sha256(absolute);
  if (actual !== metadata.sha256) fail(`Approved asset changed after review: ${relativePath}`);
}

const dataPath = path.join(episodeRoot, '04-data', 'data.json');
if (!fs.existsSync(dataPath)) {
  fail('Missing canonical data.json.');
} else {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const scenes = Array.isArray(data.scenes) ? data.scenes : [];
  for (const scene of scenes) {
    if (!scene.image) continue;
    const key = `03-bilder/${scene.image}`;
    if (!approvedFiles[key]) fail(`Scene uses an image that was never approved: ${key}`);
  }
  const voice = data.voicePolicy?.voiceFile || scenes.find((scene) => scene.type === 'intro')?.voice || 'Voice 01.mp3';
  if (!approvedFiles[`02-audio/${voice}`]) fail(`Opening Voice was not included in asset approval: ${voice}`);
  if (data.audioPolicy?.backgroundMusicRequiredForFinal === true) {
    const music = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';
    if (!approvedFiles[`02-audio/${music}`]) fail(`Background music was not included in asset approval: ${music}`);
  }
}

if (failures.length) {
  console.error('ASSET GATE FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`ASSET GATE PASSED — ${episodeFolder} — ${revision}`);
console.log('All rendered source assets exactly match the visually reviewed/approved SHA-256 manifest.');

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

const root = process.cwd();
const pointerPath = path.join(root, 'episodes', 'ACTIVE_EPISODE.json');
const failures = [];
const fail = (message) => failures.push(message);

if (!fs.existsSync(pointerPath)) {
  console.error('SCENE INTEGRITY QA FAILED: episodes/ACTIVE_EPISODE.json is missing.');
  process.exit(1);
}

const pointer = JSON.parse(fs.readFileSync(pointerPath, 'utf8'));
const episodeFolder = pointer.episodeFolder;
const paths = resolveEpisodePaths(root, episodeFolder);
if (paths.structure === 'missing') {
  console.error(`SCENE INTEGRITY QA FAILED: episode not found: ${episodeFolder}`);
  process.exit(1);
}

const data = readEpisodeData(paths);
const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const sceneV3 = Number(data.structureVersion || 0) >= 3;
if (!sceneV3) {
  console.log(`SCENE INTEGRITY QA SKIPPED — ${episodeFolder} is not V3.`);
  process.exit(0);
}

if (scenes.length !== 28) fail(`Expected exactly 28 scenes, found ${scenes.length}.`);

const expectedFiles = scenes.map((scene, index) => {
  const expected = `Szene ${String(index + 1).padStart(2, '0')}.png`;
  if (scene.image !== expected) fail(`Scene ${index + 1} maps ${scene.image || 'MISSING'} instead of ${expected}.`);
  return expected;
});

const actualImageFiles = fs.existsSync(paths.imagesDir)
  ? fs.readdirSync(paths.imagesDir).filter((name) => /\.(png|jpe?g|webp)$/i.test(name)).sort()
  : [];

for (const expected of expectedFiles) {
  if (!actualImageFiles.includes(expected)) fail(`Missing final image: ${expected}`);
}

const allowed = new Set(expectedFiles);
for (const file of actualImageFiles) {
  if (!allowed.has(file)) fail(`Unexpected image file in final image folder: ${file}`);
}

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const exactHashes = new Map();
for (const file of expectedFiles) {
  const full = path.join(paths.imagesDir, file);
  if (!fs.existsSync(full)) continue;
  const hash = sha256(full);
  if (exactHashes.has(hash)) fail(`Exact duplicate image: ${file} is identical to ${exactHashes.get(hash)}.`);
  exactHashes.set(hash, file);
}

const sampleGrayImage = (file) => {
  const result = spawnSync('ffmpeg', [
    '-loglevel', 'error', '-i', file,
    '-frames:v', '1', '-vf', 'scale=96:54,format=gray',
    '-f', 'rawvideo', '-pix_fmt', 'gray', '-',
  ], {encoding: null, maxBuffer: 1024 * 1024});
  return result.status === 0 && result.stdout?.length ? result.stdout : null;
};

const meanAbsDiff = (a, b) => {
  if (!a || !b || a.length !== b.length) return null;
  let total = 0;
  for (let i = 0; i < a.length; i += 1) total += Math.abs(a[i] - b[i]);
  return total / a.length;
};

const fingerprints = expectedFiles
  .map((file) => ({file, buf: fs.existsSync(path.join(paths.imagesDir, file)) ? sampleGrayImage(path.join(paths.imagesDir, file)) : null}));
for (let i = 0; i < fingerprints.length; i += 1) {
  for (let j = i + 1; j < fingerprints.length; j += 1) {
    const diff = meanAbsDiff(fingerprints[i].buf, fingerprints[j].buf);
    if (diff !== null && diff < 0.6) {
      fail(`Near-duplicate image: ${fingerprints[i].file} and ${fingerprints[j].file} are visually almost identical (mean diff ${diff.toFixed(3)}).`);
    }
  }
}

if (!fs.existsSync(paths.imagePlanPath)) {
  fail('Missing 99-technik/IMAGE_PLAN.json.');
} else {
  const plan = JSON.parse(fs.readFileSync(paths.imagePlanPath, 'utf8'));
  const rules = plan.generationRules || {};
  if (rules.selectedCoverBecomesSoleReference !== true) fail('IMAGE_PLAN must declare the selected cover as the sole later-scene reference.');
  if (rules.soleReference !== 'Szene 01.png') fail('IMAGE_PLAN soleReference must be Szene 01.png.');
  if (rules.secondaryImageReferencesForbidden !== true) fail('IMAGE_PLAN must forbid secondary image references.');
  if (rules.generateEachNonCoverSceneExactlyOnce !== true) fail('IMAGE_PLAN must require exactly one generation per non-cover scene.');
  if (Number(rules.maximumGenerationAttemptsPerNonCoverScene) !== 1) fail('IMAGE_PLAN must allow exactly one generation attempt per non-cover scene.');
  if (rules.regenerationForbidden !== true || rules.automaticAlternatesForbidden !== true) fail('IMAGE_PLAN must forbid regeneration and automatic alternates.');

  const images = Array.isArray(plan.images) ? plan.images : [];
  if (images.length !== 28) fail(`IMAGE_PLAN must contain 28 images, found ${images.length}.`);
  for (const image of images) {
    if (Number(image.sceneNumber) === 1) continue;
    if (image.characterReference !== 'selected Szene 01.png ONLY') fail(`${image.imageFile}: only selected Szene 01.png may be the image reference.`);
    if (image.uiReference !== null) fail(`${image.imageFile}: uiReference must be null; no second image reference is allowed.`);
    if (Number(image.generationAttemptsAllowed) !== 1) fail(`${image.imageFile}: generationAttemptsAllowed must be 1.`);
  }
}

if (!fs.existsSync(paths.promptPath)) {
  fail('Missing google-flow-prompt.txt.');
} else {
  const prompt = fs.readFileSync(paths.promptPath, 'utf8');
  for (let candidate = 1; candidate <= 3; candidate += 1) {
    const token = `COVER CANDIDATE 0${candidate}`;
    if (!prompt.includes(token)) fail(`Flow prompt missing ${token}.`);
  }
  for (let scene = 2; scene <= 28; scene += 1) {
    const id = String(scene).padStart(2, '0');
    const marker = `SZENE ${id}`;
    const markerIndex = prompt.indexOf(marker);
    if (markerIndex < 0) {
      fail(`Flow prompt missing ${marker}.`);
      continue;
    }
    const nextMarker = scene < 28 ? prompt.indexOf(`SZENE ${String(scene + 1).padStart(2, '0')}`, markerIndex + marker.length) : prompt.length;
    const block = prompt.slice(markerIndex, nextMarker > markerIndex ? nextMarker : prompt.length);
    if (!block.includes('FINAL GOOGLE FLOW PROMPT:')) fail(`${marker} is missing FINAL GOOGLE FLOW PROMPT.`);
    if (!block.includes('ONLY image reference')) fail(`${marker} must explicitly use Szene 01 as the ONLY image reference.`);
  }
}

if (failures.length) {
  console.error('SCENE INTEGRITY QA FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`SCENE INTEGRITY QA PASSED — ${episodeFolder}`);
console.log('Checked: exact scene set, missing/extra files, exact and near duplicates, one-generation policy, sole reference policy and direct Flow prompts.');

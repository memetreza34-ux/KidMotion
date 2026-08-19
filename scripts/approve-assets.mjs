import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const arg = (name) => {
  const item = args.find((value) => value.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : '';
};

const episodeFolder = arg('episode');
if (!episodeFolder) {
  console.error('ASSET APPROVAL FAILED: use --episode=KM-XXX-slug');
  process.exit(1);
}

const episodeRoot = path.join(root, 'episodes', episodeFolder);
const dataPath = path.join(episodeRoot, '04-data', 'data.json');
const reviewPath = path.join(episodeRoot, '04-data', 'VISUAL_REVIEW.json');
const revisionPath = path.join(episodeRoot, 'GENERATION-REVISION.txt');
const approvalPath = path.join(episodeRoot, '04-data', 'ASSET_APPROVAL.json');
const imageRoot = path.join(episodeRoot, '03-bilder');
const audioRoot = path.join(episodeRoot, '02-audio');

const failures = [];
const fail = (message) => failures.push(message);

if (!fs.existsSync(dataPath)) fail(`Missing ${dataPath}`);
if (!fs.existsSync(reviewPath)) fail('Missing 04-data/VISUAL_REVIEW.json. Visual review must happen before approval.');
if (!fs.existsSync(revisionPath)) fail('Missing GENERATION-REVISION.txt.');

if (failures.length) {
  console.error('ASSET APPROVAL FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
const revision = fs.readFileSync(revisionPath, 'utf8').trim();

const requiredReviewFlags = [
  'sameCharacterEveryScene',
  'allExercisePosesClearFromOneStill',
  'allExerciseTextReadableAndConsistent',
  'allExerciseSafeZonesClear',
  'propBallCountsCorrect',
  'nonExerciseImagesContainNoGeneratedText',
  'noExtraPeople',
  'noAnatomyErrors',
  'noCroppingOfImportantLimbs',
];

if (review.episodeFolder !== episodeFolder) fail('VISUAL_REVIEW.json episodeFolder does not match.');
if (review.revision !== revision) fail('VISUAL_REVIEW.json revision does not match GENERATION-REVISION.txt.');
for (const key of requiredReviewFlags) {
  if (review[key] !== true) fail(`Visual review flag must be true: ${key}`);
}

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const requiredImages = [...new Set(scenes.map((scene) => scene.image).filter(Boolean))];
const voiceFile = data.voicePolicy?.voiceFile || scenes.find((scene) => scene.type === 'intro')?.voice || 'Voice 01.mp3';
const musicFile = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const probeImage = (file) => {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=s=x:p=0',
    file,
  ], {encoding: 'utf8'});
  const [width, height] = String(result.stdout || '').trim().split('x').map(Number);
  return {width, height};
};
const probeDuration = (file) => {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ], {encoding: 'utf8'});
  return Number.parseFloat(result.stdout || '');
};

const files = {};
const imageHashes = new Map();
for (const imageName of requiredImages) {
  const file = path.join(imageRoot, imageName);
  if (!fs.existsSync(file)) {
    fail(`Missing image: ${imageName}`);
    continue;
  }
  const {width, height} = probeImage(file);
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    fail(`Could not read image dimensions: ${imageName}`);
  } else {
    const ratio = width / height;
    if (width < 1280 || height < 720) fail(`${imageName} is too small (${width}x${height}). Minimum is 1280x720.`);
    if (Math.abs(ratio - 16 / 9) > 0.02) fail(`${imageName} is not 16:9 enough (${width}x${height}).`);
  }
  const hash = sha256(file);
  files[`03-bilder/${imageName}`] = {sha256: hash, width, height};
  if (imageName !== 'Bild 00.png') {
    if (imageHashes.has(hash)) fail(`Duplicate source image detected: ${imageName} matches ${imageHashes.get(hash)}.`);
    imageHashes.set(hash, imageName);
  }
}

for (const [name, required] of [[voiceFile, true], [musicFile, data.audioPolicy?.backgroundMusicRequiredForFinal === true]]) {
  const file = path.join(audioRoot, name);
  if (!fs.existsSync(file)) {
    if (required) fail(`Missing required audio: ${name}`);
    continue;
  }
  const duration = probeDuration(file);
  files[`02-audio/${name}`] = {sha256: sha256(file), durationSeconds: Number.isFinite(duration) ? Number(duration.toFixed(3)) : null};
}

const staleVoices = fs.existsSync(audioRoot)
  ? fs.readdirSync(audioRoot).filter((name) => /^Voice (0[2-9]|1[0-6])\.mp3$/i.test(name))
  : [];
if (staleVoices.length) fail(`Remove stale Voice files: ${staleVoices.join(', ')}`);

const voicePath = path.join(audioRoot, voiceFile);
if (fs.existsSync(voicePath)) {
  const duration = probeDuration(voicePath);
  const openingDuration = Number(data.openingDuration || (Number(data.introDuration || 0) + Number(data.safetyDuration || 0) + Number(data.letsBeginDuration || 0)));
  if (Number.isFinite(duration)) {
    if (duration > openingDuration + 0.05) fail(`Opening Voice is ${duration.toFixed(2)}s and exceeds the ${openingDuration}s opening.`);
    if (data.voicePolicy?.openingVoiceTargetSeconds === '11-14' && duration < 10.5) fail(`Opening Voice is too short (${duration.toFixed(2)}s). Target is about 11–14s.`);
  }
}

if (JSON.stringify(data).includes('TBD')) fail('data.json still contains TBD values.');

if (failures.length) {
  console.error('ASSET APPROVAL FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

const approval = {
  status: 'APPROVED_FOR_RENDER',
  episodeFolder,
  revision,
  approvedAt: new Date().toISOString(),
  visualReviewFile: '04-data/VISUAL_REVIEW.json',
  files,
};
fs.writeFileSync(approvalPath, `${JSON.stringify(approval, null, 2)}\n`, 'utf8');
console.log(`ASSET APPROVAL PASSED — ${episodeFolder}`);
console.log(`Locked ${Object.keys(files).length} asset files by SHA-256.`);
console.log('Any later asset change invalidates this approval and blocks render:safe.');

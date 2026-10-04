import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

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

const paths = resolveEpisodePaths(root, episodeFolder);
const failures = [];
const fail = (message) => failures.push(message);
if (paths.structure === 'missing') fail('Episode data is missing.');
if (!fs.existsSync(paths.reviewPath)) fail(`Missing ${path.relative(paths.episodeRoot, paths.reviewPath)}.`);
if (!fs.existsSync(paths.revisionPath)) fail(`Missing ${path.relative(paths.episodeRoot, paths.revisionPath)}.`);
if (paths.isV2 && !fs.existsSync(paths.imagePlanPath)) fail('Missing 99-technik/IMAGE_PLAN.json.');
if (paths.isV2 && !fs.existsSync(paths.promptPath)) fail('Missing 00-bildprompts/google-flow-prompt.txt.');
if (failures.length) {
  console.error('ASSET APPROVAL FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

const data = readEpisodeData(paths);
const structureVersion = Number(data.structureVersion || 1);
const sceneV3 = structureVersion >= 3;
const review = JSON.parse(fs.readFileSync(paths.reviewPath, 'utf8'));
const revision = fs.readFileSync(paths.revisionPath, 'utf8').trim();
const pipeline = JSON.parse(fs.readFileSync(path.join(root, 'config', 'pipeline.json'), 'utf8'));

if (sceneV3) {
  if (!fs.existsSync(paths.coverSelectionPath)) fail('Missing COVER_SELECTION.json.');
  else {
    const selection = JSON.parse(fs.readFileSync(paths.coverSelectionPath, 'utf8'));
    if (selection.status !== 'SELECTED') fail('Cover has not been explicitly selected by the user.');
    if (selection.finalFile !== 'Szene 01.png') fail('Selected cover must be finalized as Szene 01.png.');
  }
  for (const candidate of ['Cover-Kandidat-01.png','Cover-Kandidat-02.png','Cover-Kandidat-03.png']) {
    if (fs.existsSync(path.join(paths.imagesDir, candidate))) fail(`Temporary/rejected cover candidate still exists: ${candidate}`);
  }
}

const requiredReviewFlags = [
  'sameCharacterEveryScene',
  'allExercisePosesClearFromOneStill',
  'allExerciseTextReadableAndConsistent',
  'allExerciseSafeZonesClear',
  'propBallCountsCorrect',
  paths.isV2 ? 'allNonTimerTextGeneratedAndReadable' : 'nonExerciseImagesContainNoGeneratedText',
  'noExtraPeople',
  'noAnatomyErrors',
  'noCroppingOfImportantLimbs',
];
if (review.episodeFolder !== episodeFolder) fail('VISUAL_REVIEW.json episodeFolder does not match.');
if (review.revision !== revision) fail('VISUAL_REVIEW.json revision does not match generation revision.');
for (const key of requiredReviewFlags) if (review[key] !== true) fail(`Visual review flag must be true: ${key}`);

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const requiredImages = [...new Set(scenes.map((scene) => scene.image).filter(Boolean))];
if (paths.isV2) {
  const plan = JSON.parse(fs.readFileSync(paths.imagePlanPath, 'utf8'));
  const planImages = Array.isArray(plan.images) ? plan.images : [];
  if (plan.revision !== revision) fail('IMAGE_PLAN.json revision does not match generation revision.');
  if (planImages.length !== requiredImages.length) fail(`IMAGE_PLAN.json must contain ${requiredImages.length} images, found ${planImages.length}.`);
  for (const [index, image] of planImages.entries()) {
    const expectedFile = sceneV3 ? `Szene ${String(index + 1).padStart(2, '0')}.png` : `Bild ${String(index).padStart(2, '0')}.png`;
    if (image.imageFile !== expectedFile) fail(`IMAGE_PLAN image ${index} must be ${expectedFile}.`);
    for (const field of ['visualPurpose', 'topicAnchor', 'visualForm', 'prompt']) {
      const value = String(image[field] ?? '').trim();
      if (!value || /\bTBD\b/i.test(value)) fail(`IMAGE_PLAN ${expectedFile} has unresolved ${field}.`);
    }
  }
  const prompt = fs.readFileSync(paths.promptPath, 'utf8');
  if (/\bTBD\b/i.test(prompt)) fail('google-flow-prompt.txt still contains TBD values.');
  if (!prompt.includes('Google Flow') && !prompt.includes('GOOGLE FLOW')) fail('Flow prompt must define Google Flow ownership.');
  if (sceneV3) {
    if (!prompt.includes('STOP completely')) fail('Flow prompt must stop after the three cover candidates.');
    if (!prompt.includes('Wait until the user explicitly chooses')) fail('Flow prompt must require explicit user cover selection.');
    for (let i = 1; i <= requiredImages.length; i += 1) {
      if (!prompt.includes(`Szene ${String(i).padStart(2, '0')}`)) fail(`Flow prompt is missing Szene ${String(i).padStart(2, '0')}.`);
    }
  } else {
    for (let i = 0; i < requiredImages.length; i += 1) {
      if (!prompt.includes(`Bild ${String(i).padStart(2, '0')}`)) fail(`Flow prompt is missing Bild ${String(i).padStart(2, '0')}.`);
    }
  }
}

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const probeImage = (file) => {
  const result = spawnSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=s=x:p=0',file], {encoding:'utf8'});
  const [width, height] = String(result.stdout || '').trim().split('x').map(Number);
  return {width, height};
};
const probeDuration = (file) => {
  const result = spawnSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file], {encoding:'utf8'});
  return Number.parseFloat(result.stdout || '');
};

const files = {};
const imageHashes = new Map();
for (const imageName of requiredImages) {
  const file = path.join(paths.imagesDir, imageName);
  if (!fs.existsSync(file)) {
    fail(`Missing image: ${imageName}`);
    continue;
  }
  const {width, height} = probeImage(file);
  if (!Number.isFinite(width) || !Number.isFinite(height)) fail(`Could not read image dimensions: ${imageName}`);
  else {
    const ratio = width / height;
    if (width < 1280 || height < 720) fail(`${imageName} is too small (${width}x${height}).`);
    if (Math.abs(ratio - 16 / 9) > 0.02) fail(`${imageName} is not 16:9 enough (${width}x${height}).`);
  }
  const hash = sha256(file);
  files[`${paths.imageRelativePrefix}/${imageName}`] = {sha256: hash, width, height};
  if (imageName !== (sceneV3 ? 'Szene 01.png' : 'Bild 00.png')) {
    if (imageHashes.has(hash)) fail(`Duplicate source image: ${imageName} matches ${imageHashes.get(hash)}.`);
    imageHashes.set(hash, imageName);
  }
}

const intro = scenes.find((scene) => scene.type === 'intro');
const voiceFile = data.voicePolicy?.voiceFile || intro?.voice || 'Voice 01.mp3';
const musicFile = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';
for (const [name, required] of [[voiceFile, true], [musicFile, data.audioPolicy?.backgroundMusicRequiredForFinal === true]]) {
  const file = path.join(paths.audioDir, name);
  if (!fs.existsSync(file)) {
    if (required) fail(`Missing required audio: ${name}`);
    continue;
  }
  const duration = probeDuration(file);
  files[`${paths.audioRelativePrefix}/${name}`] = {sha256: sha256(file), durationSeconds: Number.isFinite(duration) ? Number(duration.toFixed(3)) : null};
}

const staleVoices = fs.existsSync(paths.audioDir)
  ? fs.readdirSync(paths.audioDir).filter((name) => /^Voice (0[2-9]|1[0-6])\.mp3$/i.test(name))
  : [];
if (staleVoices.length) fail(`Remove stale Voice files: ${staleVoices.join(', ')}`);

const voicePath = path.join(paths.audioDir, voiceFile);
if (fs.existsSync(voicePath)) {
  const duration = probeDuration(voicePath);
  const min = Number(pipeline.audioPolicy?.minimumVoiceSeconds ?? 13.65);
  const max = Number(pipeline.audioPolicy?.maximumVoiceSeconds ?? 14.05);
  if (Number.isFinite(duration) && (duration < min || duration > max)) fail(`Opening Voice is ${duration.toFixed(2)}s; allowed ${min.toFixed(2)}–${max.toFixed(2)}s.`);
}

if (/\bTBD\b/.test(JSON.stringify(data))) fail('Episode data still contains TBD values.');
if (failures.length) {
  console.error('ASSET APPROVAL FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

const approval = {
  schemaVersion: sceneV3 ? 3 : paths.isV2 ? 2 : 1,
  status: 'APPROVED_FOR_RENDER',
  episodeFolder,
  structure: paths.structure,
  revision,
  approvedAt: new Date().toISOString(),
  coverSelectionFile: sceneV3 ? path.relative(paths.episodeRoot, paths.coverSelectionPath).split(path.sep).join('/') : undefined,
  visualReviewFile: path.relative(paths.episodeRoot, paths.reviewPath).split(path.sep).join('/'),
  files,
};
fs.writeFileSync(paths.approvalPath, `${JSON.stringify(approval, null, 2)}\n`, 'utf8');
console.log(`ASSET APPROVAL PASSED — ${episodeFolder}`);
console.log(`Locked ${Object.keys(files).length} files by SHA-256.`);

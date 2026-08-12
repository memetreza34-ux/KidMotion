import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const episodeFolder = getArg('episode', 'KM-001-football-balance-training');
const root = process.cwd();
const dataPath = path.join(root, 'content', 'episodes', episodeFolder, 'data.json');
const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

if (!fs.existsSync(dataPath)) {
  console.error(`PRE-FLIGHT FAILED: missing ${dataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const imageRoot = path.join(root, 'public', data.assetFolder || '00-bildprompts/00-ALLE-BILDER-HIER-REIN');
const audioRoot = path.join(root, 'public', data.audioFolder || '00-audio');
const scenes = Array.isArray(data.scenes) ? data.scenes : [];

if (data.singleCharacterWholeEpisode !== true) fail('singleCharacterWholeEpisode must be true.');
if (data.allowCharacterSwitch !== false) fail('allowCharacterSwitch must be false.');
if (data.allowSecondVisibleCharacter !== false) fail('allowSecondVisibleCharacter must be false.');
if (!data.mainCharacter) fail('mainCharacter is missing.');
if (!scenes.length) fail('No scenes found in data.json.');

const cover = scenes.find((scene) => scene.scene === '00' || scene.type === 'cover');
if (!cover) fail('Cover scene 00 is missing.');
if (cover && cover.inVideo !== false) fail('Cover must have inVideo=false.');
if (cover && Number(cover.duration) !== 0) fail('Cover duration must be 0 because it is thumbnail-only.');

const safety = scenes.find((scene) => scene.scene === '02' || scene.type === 'safety');
if (!safety) fail('Safety scene is missing.');
if (safety?.image) fail('Safety scene must be Remotion-only with no generated image.');

const exerciseScenes = scenes.filter((scene) => scene.type === 'exercise');
if (exerciseScenes.length < 10) warn(`Only ${exerciseScenes.length} exercise scenes found; current long-form target is about 10–12.`);
for (const scene of exerciseScenes) {
  if (Number(scene.duration) !== 20) fail(`Scene ${scene.scene} must be exactly 20s, found ${scene.duration}.`);
  if (!scene.title) fail(`Scene ${scene.scene} is missing exercise title.`);
  if (!scene.instruction) fail(`Scene ${scene.scene} is missing short instruction.`);
}

const sceneIds = new Set();
const imageNames = new Set();
let timelineSeconds = 0;

for (const scene of scenes) {
  const id = String(scene.scene ?? '');
  if (sceneIds.has(id)) fail(`Duplicate scene id: ${id}`);
  sceneIds.add(id);

  if (scene.type !== 'cover') {
    timelineSeconds += Number(scene.duration || 0);
    timelineSeconds += Number(scene.restAfter || 0);
  }

  if (scene.image) {
    if (imageNames.has(scene.image)) fail(`Duplicate image assignment: ${scene.image}`);
    imageNames.add(scene.image);
    const imagePath = path.join(imageRoot, scene.image);
    if (!fs.existsSync(imagePath)) fail(`Missing image: ${path.relative(root, imagePath)}`);
  }

  if (scene.voice) {
    const voicePath = path.join(audioRoot, scene.voice);
    if (!fs.existsSync(voicePath)) fail(`Missing voice: ${path.relative(root, voicePath)}`);
  }
}

const forbiddenBild02 = path.join(imageRoot, 'Bild 02.png');
if (fs.existsSync(forbiddenBild02)) fail('Bild 02.png exists, but Scene 02 is Remotion-only and must keep its number reserved.');

const allowedImages = new Set([...imageNames, 'README.md']);
if (fs.existsSync(imageRoot)) {
  for (const name of fs.readdirSync(imageRoot)) {
    if (!allowedImages.has(name) && /\.(png|jpe?g|webp)$/i.test(name)) {
      fail(`Unexpected image in active staging folder (possible mixed episode): ${name}`);
    }
  }
} else {
  fail(`Missing image staging folder: ${path.relative(root, imageRoot)}`);
}

const allowedVoices = new Set([
  ...scenes.map((scene) => scene.voice).filter(Boolean),
  'README.md',
]);
if (fs.existsSync(audioRoot)) {
  for (const name of fs.readdirSync(audioRoot)) {
    if (!allowedVoices.has(name) && /\.(mp3|wav|m4a|aac|ogg)$/i.test(name)) {
      fail(`Unexpected audio in active staging folder (possible mixed episode): ${name}`);
    }
  }
} else {
  fail(`Missing audio staging folder: ${path.relative(root, audioRoot)}`);
}

if (data.remotion?.subtitles !== false) fail('Remotion subtitles must be false.');
if (data.remotion?.voiceCaptions !== false) fail('Remotion voiceCaptions must be false.');
if (data.remotion?.exerciseNameSource !== 'Remotion') fail('Exercise names must come from Remotion.');
if (data.remotion?.exerciseInstructionSource !== 'Remotion') fail('Exercise instructions must come from Remotion.');
if (data.remotion?.timerMustReachZero !== true) fail('timerMustReachZero must be true.');
if (data.remotion?.progressBarMustReach100Percent !== true) fail('progressBarMustReach100Percent must be true.');

if (timelineSeconds < 300) fail(`Computed video runtime is ${timelineSeconds}s; current long-form target is at least ~300s.`);
if (data.id === 'KM-001' && timelineSeconds !== 320) fail(`KM-001 must be exactly 320s, computed ${timelineSeconds}s.`);

console.log(`Episode: ${data.id || episodeFolder}`);
console.log(`Computed video runtime: ${timelineSeconds}s (${Math.floor(timelineSeconds / 60)}:${String(timelineSeconds % 60).padStart(2, '0')})`);
console.log(`Exercise scenes: ${exerciseScenes.length}`);
console.log(`Required generated images: ${imageNames.size}`);
console.log(`Required voice clips: ${scenes.filter((scene) => scene.voice).length}`);

for (const message of warnings) console.warn(`WARNING: ${message}`);

if (failures.length) {
  console.error('\nPRE-FLIGHT FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log('\nPRE-FLIGHT PASSED — assets and timeline data are ready for typecheck/render QA.');

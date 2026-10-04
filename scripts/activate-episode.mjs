import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

const args = process.argv.slice(2);
const readArg = (name) => {
  const item = args.find((arg) => arg.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : '';
};

const episodeFolder = readArg('episode');
if (!episodeFolder) {
  console.error('Missing --episode="KM-XXX-slug"');
  process.exit(1);
}

const root = process.cwd();
const paths = resolveEpisodePaths(root, episodeFolder);
if (paths.structure === 'missing') {
  console.error(`Episode data not found for ${episodeFolder}.`);
  process.exit(1);
}

const data = readEpisodeData(paths);
const structureVersion = Number(data.structureVersion || 1);
const sceneV3 = structureVersion >= 3;
const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const intro = scenes.find((s) => s.type === 'intro');
const safety = scenes.find((s) => s.type === 'safety');
const start = scenes.find((s) => s.type === 'lets-begin');
const outro = scenes.find((s) => s.type === 'outro');
const exercises = scenes.filter((s) => s.type === 'exercise');
const getReadyScenes = scenes.filter((s) => s.type === 'get-ready');
const errors = [];

if (paths.isV2) {
  if (![2, 3].includes(structureVersion)) errors.push('Modern episode must declare structureVersion 2 or 3.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date || ''))) errors.push('Modern episode must declare date as YYYY-MM-DD.');
  if (!data.topic) errors.push('Modern episode must declare topic.');
  if (!data.slug) errors.push('Modern episode must declare slug.');
  if (!fs.existsSync(paths.promptPath)) errors.push('Missing 00-bildprompts/google-flow-prompt.txt.');
  if (!fs.existsSync(paths.imagePlanPath)) errors.push('Missing 99-technik/IMAGE_PLAN.json.');
}

if (!intro?.image) errors.push('Missing Intro image mapping.');
if (!safety?.image) errors.push('Missing Safety image mapping.');
if (!start?.image) errors.push('Missing LETS BEGIN image mapping.');
if (!outro?.image) errors.push('Missing Outro image mapping.');
if (exercises.length !== 12) errors.push(`Expected 12 exercises, found ${exercises.length}.`);
if (sceneV3 && getReadyScenes.length !== 11) errors.push(`V3 requires 11 dedicated GET READY scenes, found ${getReadyScenes.length}.`);
if (data.singleCharacterWholeEpisode !== true) errors.push('singleCharacterWholeEpisode must be true.');
if (data.allVideoSectionsUseCharacterImage !== true) errors.push('allVideoSectionsUseCharacterImage must be true.');
if (data.exerciseVisualPolicy?.exerciseNameSource !== 'GoogleFlowImage') errors.push('Exercise names must come from Google Flow images.');
if (data.exerciseVisualPolicy?.exerciseInstructionSource !== 'GoogleFlowImage') errors.push('Exercise instructions must come from Google Flow images.');
if (data.voicePolicy?.openingSequenceVoiceOnly !== true) errors.push('Episode must use one opening Voice file only.');

const readyByExercise = new Map();
if (sceneV3) {
  for (const ready of getReadyScenes) {
    if (Number(ready.duration) !== 5) errors.push(`GET READY scene ${ready.scene} must last exactly 5s.`);
    if (!ready.afterExerciseScene) errors.push(`GET READY scene ${ready.scene} must declare afterExerciseScene.`);
    if (!ready.nextExerciseTitle) errors.push(`GET READY scene ${ready.scene} must declare nextExerciseTitle.`);
    if (ready.afterExerciseScene) readyByExercise.set(String(ready.afterExerciseScene), ready);
  }
}

for (const [index, scene] of exercises.entries()) {
  if (!scene.title || !scene.instruction || !scene.image) errors.push(`Exercise scene ${scene.scene} is incomplete.`);
  if (Number(scene.duration) !== 20) errors.push(`Exercise scene ${scene.scene} must last exactly 20s.`);
  if (sceneV3 && index < exercises.length - 1 && !readyByExercise.get(String(scene.scene))) {
    errors.push(`Exercise scene ${scene.scene} needs a dedicated GET READY scene.`);
  }
}

if (errors.length) {
  console.error('EPISODE ACTIVATION FAILED');
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

const ensureAlias = (aliasPath, targetPath) => {
  fs.mkdirSync(path.dirname(aliasPath), {recursive: true});
  fs.rmSync(aliasPath, {recursive: true, force: true});
  const relativeTarget = path.relative(path.dirname(aliasPath), targetPath);
  fs.symlinkSync(relativeTarget, aliasPath, 'dir');
};

const publicEpisodes = path.join(root, 'public', 'episodes');
fs.mkdirSync(publicEpisodes, {recursive: true});

for (const entry of fs.readdirSync(publicEpisodes, {withFileTypes: true})) {
  if (/^KM-\d{3}-(audio|bilder)$/.test(entry.name)) {
    fs.rmSync(path.join(publicEpisodes, entry.name), {recursive: true, force: true});
  }
}

const id = data.id || episodeFolder.split('-').slice(0, 2).join('-');
const episodeDate = paths.isV2 ? String(data.date) : 'legacy';
const publicEpisodeFolder = paths.isV2 ? episodeFolder : `${id}-${data.slug || 'legacy'}`;
const publicEpisodeRoot = path.join(publicEpisodes, episodeDate, publicEpisodeFolder);
const imageAlias = path.join(publicEpisodeRoot, 'images');
const audioAlias = path.join(publicEpisodeRoot, 'audio');
ensureAlias(imageAlias, paths.imagesDir);
ensureAlias(audioAlias, paths.audioDir);

const imageFolder = `episodes/${episodeDate}/${publicEpisodeFolder}/images`;
const audioFolder = `episodes/${episodeDate}/${publicEpisodeFolder}/audio`;
const q = JSON.stringify;
const image = (name) => name ? `imageAsset(${q(name)})` : 'undefined';
const audio = (name) => {
  if (!name) return 'undefined';
  return fs.existsSync(path.join(paths.audioDir, name)) ? `audioAsset(${q(name)})` : 'undefined';
};

const voiceFile = data.voicePolicy?.voiceFile || intro?.voice || 'Voice 01.mp3';
const musicFile = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';

const exerciseRows = exercises.map((scene) => {
  const ready = sceneV3 ? readyByExercise.get(String(scene.scene)) : null;
  const restAfter = sceneV3 ? Number(ready?.duration || 0) : Number(scene.restAfter || 0);
  const readyImage = sceneV3 && ready?.image ? `, readyImage:${image(ready.image)}` : '';
  return `    {id:${q(String(scene.scene))}, title:${q(scene.title)}, instruction:${q(scene.instruction)}, image:${image(scene.image)}${readyImage}, duration:${Number(scene.duration)}, restAfter:${restAfter}},`;
}).join('\n');

const source = `import type {Workout} from '../types';\n\nconst imageAsset = (name: string) => \`${imageFolder}/\${name}\`;\nconst audioAsset = (name: string) => \`${audioFolder}/\${name}\`;\n\n// AUTO-GENERATED ACTIVE EPISODE: ${episodeFolder}\n// Runtime assets: public/episodes/${episodeDate}/${publicEpisodeFolder}/{images,audio}\n// Structure: ${paths.structure} / v${structureVersion}\nexport const activeWorkout: Workout = {\n  id: ${q(data.slug ? `${data.id}-${data.slug}` : (data.id || episodeFolder))},\n  title: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  subtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  fps: ${Number(data.fps || 30)},\n  width: ${Number(data.width || 1920)},\n  height: ${Number(data.height || 1080)},\n  introDuration: ${Number(intro.duration || data.introDuration || 8)},\n  safetyDuration: ${Number(safety.duration || data.safetyDuration || 4)},\n  letsBeginDuration: ${Number(start.duration || data.letsBeginDuration || 2)},\n  outroDuration: ${Number(outro.duration || data.outroDuration || 4)},\n  introImage: ${image(intro.image)},\n  introTitle: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  introSubtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  introBadge: ${q(data.introBadge || 'KIDMOTION')},\n  introVoice: ${audio(voiceFile)},\n  safetyImage: ${image(safety.image)},\n  letsBeginImage: ${image(start.image)},\n  outroImage: ${image(outro.image)},\n  bgMusic: ${audio(musicFile)},\n  exercises: [\n${exerciseRows}\n  ],\n};\n`;

fs.writeFileSync(path.join(root, 'src', 'data', 'active-workout.ts'), source, 'utf8');
fs.writeFileSync(
  path.join(root, 'episodes', 'ACTIVE_EPISODE.json'),
  `${JSON.stringify({episodeFolder,structure:paths.structure,structureVersion,date:episodeDate,topic:data.topic || data.theme || '',publicAssetRoot:`public/episodes/${episodeDate}/${publicEpisodeFolder}`,dataPath:path.relative(root, paths.dataPath)}, null, 2)}\n`,
  'utf8',
);

console.log(`Activated episode: ${episodeFolder} (${paths.structure}, v${structureVersion})`);
console.log(`Date: ${episodeDate}`);
console.log(`Topic: ${data.topic || data.theme || ''}`);
console.log(`Public runtime root: ${publicEpisodeRoot}`);
console.log(`Image source: ${paths.imagesDir}`);
console.log(`Audio source: ${paths.audioDir}`);
if (!fs.existsSync(path.join(paths.audioDir, voiceFile))) console.warn(`WARNING: missing ${voiceFile}`);
if (!fs.existsSync(path.join(paths.audioDir, musicFile))) console.warn(`WARNING: missing ${musicFile}; final preflight will stay blocked.`);

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
const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const intro = scenes.find((s) => s.type === 'intro');
const safety = scenes.find((s) => s.type === 'safety');
const start = scenes.find((s) => s.type === 'lets-begin');
const outro = scenes.find((s) => s.type === 'outro');
const exercises = scenes.filter((s) => s.type === 'exercise');
const errors = [];

if (paths.isV2) {
  if (data.structureVersion !== 2) errors.push('V2 episode must declare structureVersion=2.');
  if (!fs.existsSync(paths.promptPath)) errors.push('Missing 00-bildprompts/google-flow-prompt.txt.');
  if (!fs.existsSync(paths.imagePlanPath)) errors.push('Missing 99-technik/IMAGE_PLAN.json.');
}
if (!intro?.image) errors.push('Missing Intro image mapping.');
if (!safety?.image) errors.push('Missing Safety image mapping.');
if (!start?.image) errors.push('Missing LETS BEGIN image mapping.');
if (!outro?.image) errors.push('Missing Outro image mapping.');
if (exercises.length !== 12) errors.push(`Expected 12 exercises, found ${exercises.length}.`);
if (data.singleCharacterWholeEpisode !== true) errors.push('singleCharacterWholeEpisode must be true.');
if (data.allVideoSectionsUseCharacterImage !== true) errors.push('allVideoSectionsUseCharacterImage must be true.');
if (data.exerciseVisualPolicy?.exerciseNameSource !== 'GoogleFlowImage') errors.push('Exercise names must come from Google Flow images.');
if (data.exerciseVisualPolicy?.exerciseInstructionSource !== 'GoogleFlowImage') errors.push('Exercise instructions must come from Google Flow images.');
if (data.voicePolicy?.openingSequenceVoiceOnly !== true) errors.push('Episode must use one opening Voice file only.');

for (const scene of exercises) {
  if (!scene.title || !scene.instruction || !scene.image) errors.push(`Scene ${scene.scene} is incomplete.`);
  if (Number(scene.duration) !== 20) errors.push(`Scene ${scene.scene} must last exactly 20s.`);
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
const id = data.id || episodeFolder.split('-').slice(0, 2).join('-');
const imageAliasName = `${id}-bilder`;
const audioAliasName = `${id}-audio`;
ensureAlias(path.join(publicEpisodes, imageAliasName), paths.imagesDir);
ensureAlias(path.join(publicEpisodes, audioAliasName), paths.audioDir);

const imageFolder = `episodes/${imageAliasName}`;
const audioFolder = `episodes/${audioAliasName}`;
const q = JSON.stringify;
const image = (name) => name ? `imageAsset(${q(name)})` : 'undefined';
const audio = (name) => {
  if (!name) return 'undefined';
  return fs.existsSync(path.join(paths.audioDir, name)) ? `audioAsset(${q(name)})` : 'undefined';
};
const voiceFile = data.voicePolicy?.voiceFile || intro?.voice || 'Voice 01.mp3';
const musicFile = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';
const exerciseRows = exercises.map((scene) =>
  `    {id:${q(String(scene.scene))}, title:${q(scene.title)}, instruction:${q(scene.instruction)}, image:${image(scene.image)}, duration:${Number(scene.duration)}, restAfter:${Number(scene.restAfter || 0)}},`
).join('\n');

const source = `import type {Workout} from '../types';\n\nconst imageAsset = (name: string) => \`${imageFolder}/\${name}\`;\nconst audioAsset = (name: string) => \`${audioFolder}/\${name}\`;\n\n// AUTO-GENERATED ACTIVE EPISODE: ${episodeFolder}\n// Structure: ${paths.structure}\nexport const activeWorkout: Workout = {\n  id: ${q(data.slug ? `${data.id}-${data.slug}` : (data.id || episodeFolder))},\n  title: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  subtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  fps: ${Number(data.fps || 30)},\n  width: ${Number(data.width || 1920)},\n  height: ${Number(data.height || 1080)},\n  introDuration: ${Number(intro.duration || data.introDuration || 8)},\n  safetyDuration: ${Number(safety.duration || data.safetyDuration || 4)},\n  letsBeginDuration: ${Number(start.duration || data.letsBeginDuration || 2)},\n  outroDuration: ${Number(outro.duration || data.outroDuration || 4)},\n  introImage: ${image(intro.image)},\n  introTitle: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  introSubtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  introBadge: ${q(data.introBadge || 'KIDMOTION')},\n  introVoice: ${audio(voiceFile)},\n  safetyImage: ${image(safety.image)},\n  letsBeginImage: ${image(start.image)},\n  outroImage: ${image(outro.image)},\n  bgMusic: ${audio(musicFile)},\n  exercises: [\n${exerciseRows}\n  ],\n};\n`;

fs.writeFileSync(path.join(root, 'src', 'data', 'active-workout.ts'), source, 'utf8');
fs.writeFileSync(
  path.join(root, 'episodes', 'ACTIVE_EPISODE.json'),
  `${JSON.stringify({episodeFolder, structure: paths.structure, dataPath: path.relative(root, paths.dataPath)}, null, 2)}\n`,
  'utf8',
);

console.log(`Activated episode: ${episodeFolder} (${paths.structure})`);
console.log(`Image source: ${paths.imagesDir}`);
console.log(`Audio source: ${paths.audioDir}`);
if (!fs.existsSync(path.join(paths.audioDir, voiceFile))) console.warn(`WARNING: missing ${voiceFile}`);
if (!fs.existsSync(path.join(paths.audioDir, musicFile))) console.warn(`WARNING: missing ${musicFile}; final preflight will stay blocked.`);

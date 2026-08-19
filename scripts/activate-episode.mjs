import fs from 'node:fs';
import path from 'node:path';

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
const canonicalEpisodeRoot = path.join(root, 'episodes', episodeFolder);
const canonicalDataPath = path.join(canonicalEpisodeRoot, '04-data', 'data.json');
const legacyDataPath = path.join(root, 'content', 'episodes', episodeFolder, 'data.json');
const usingCanonical = fs.existsSync(canonicalDataPath);
const dataPath = usingCanonical ? canonicalDataPath : legacyDataPath;

if (!fs.existsSync(dataPath)) {
  console.error(`Episode data not found. Checked:\n- ${canonicalDataPath}\n- ${legacyDataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const intro = scenes.find((s) => s.type === 'intro');
const safety = scenes.find((s) => s.type === 'safety');
const start = scenes.find((s) => s.type === 'lets-begin');
const outro = scenes.find((s) => s.type === 'outro');
const exercises = scenes.filter((s) => s.type === 'exercise');
const errors = [];

if (!intro?.image) errors.push('Missing Intro image mapping.');
if (!safety?.image) errors.push('Missing Safety image mapping.');
if (!start?.image) errors.push('Missing LETS BEGIN image mapping.');
if (!outro?.image) errors.push('Missing Outro image mapping.');
if (!exercises.length) errors.push('No exercises found.');
if (data.singleCharacterWholeEpisode !== true) errors.push('singleCharacterWholeEpisode must be true.');
if (data.allVideoSectionsUseCharacterImage !== true) errors.push('allVideoSectionsUseCharacterImage must be true.');
if (data.exerciseVisualPolicy?.exerciseNameSource !== 'GoogleFlowImage') errors.push('Exercise names must come from Google Flow images.');
if (data.exerciseVisualPolicy?.exerciseInstructionSource !== 'GoogleFlowImage') errors.push('Exercise instructions must come from Google Flow images.');

const openingVoicePolicyOk =
  data.voicePolicy?.openingSequenceVoiceOnly === true ||
  data.voicePolicy?.voiceOnlyInIntro === true;
if (!openingVoicePolicyOk) errors.push('Episode must use one opening Voice file only.');

for (const scene of exercises) {
  if (!scene.title || !scene.instruction || !scene.image) errors.push(`Scene ${scene.scene} is incomplete.`);
  if (Number(scene.duration) !== 20) errors.push(`Scene ${scene.scene} must last exactly 20s.`);
}

if (errors.length) {
  console.error('EPISODE ACTIVATION FAILED');
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

let imageFolder;
let audioFolder;
let imageSourceRoot;
let audioSourceRoot;

const ensureAlias = (aliasPath, targetPath) => {
  fs.mkdirSync(path.dirname(aliasPath), {recursive: true});
  if (fs.existsSync(aliasPath) || fs.lstatSync(path.dirname(aliasPath)).isDirectory()) {
    try {
      if (fs.lstatSync(aliasPath)) fs.rmSync(aliasPath, {recursive: true, force: true});
    } catch {
      // alias does not exist yet
    }
  }
  const relativeTarget = path.relative(path.dirname(aliasPath), targetPath);
  fs.symlinkSync(relativeTarget, aliasPath, 'dir');
};

if (usingCanonical) {
  imageSourceRoot = path.join(canonicalEpisodeRoot, '03-bilder');
  audioSourceRoot = path.join(canonicalEpisodeRoot, '02-audio');

  const publicEpisodes = path.join(root, 'public', 'episodes');
  const id = data.id || episodeFolder.split('-').slice(0, 2).join('-');
  const imageAliasName = `${id}-bilder`;
  const audioAliasName = `${id}-audio`;

  ensureAlias(path.join(publicEpisodes, imageAliasName), imageSourceRoot);
  ensureAlias(path.join(publicEpisodes, audioAliasName), audioSourceRoot);

  imageFolder = `episodes/${imageAliasName}`;
  audioFolder = `episodes/${audioAliasName}`;
} else {
  imageFolder = data.assetFolder || '00-bildprompts/00-ALLE-BILDER-HIER-REIN';
  audioFolder = data.audioFolder || '00-audio';
  imageSourceRoot = path.join(root, 'public', imageFolder);
  audioSourceRoot = path.join(root, 'public', audioFolder);
}

const q = JSON.stringify;
const image = (name) => name ? `imageAsset(${q(name)})` : 'undefined';
const audio = (name) => {
  if (!name) return 'undefined';
  const absolute = path.join(audioSourceRoot, name);
  return fs.existsSync(absolute) ? `audioAsset(${q(name)})` : 'undefined';
};

const voiceFile = data.voicePolicy?.voiceFile || intro?.voice || 'Voice 01.mp3';
const musicFile = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';
const exerciseRows = exercises.map((scene) =>
  `    {id:${q(String(scene.scene))}, title:${q(scene.title)}, instruction:${q(scene.instruction)}, image:${image(scene.image)}, duration:${Number(scene.duration)}, restAfter:${Number(scene.restAfter || 0)}},`
).join('\n');

const source = `import type {Workout} from '../types';\n\nconst imageAsset = (name: string) => \`${imageFolder}/\${name}\`;\nconst audioAsset = (name: string) => \`${audioFolder}/\${name}\`;\n\n// AUTO-GENERATED ACTIVE EPISODE: ${episodeFolder}\n// One continuous Voice may span Intro + Safety + LET'S BEGIN and must end before exercise 1.\nexport const activeWorkout: Workout = {\n  id: ${q(data.slug ? `${data.id}-${data.slug}` : (data.id || episodeFolder))},\n  title: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  subtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  fps: ${Number(data.fps || 30)},\n  width: ${Number(data.width || 1920)},\n  height: ${Number(data.height || 1080)},\n  introDuration: ${Number(intro.duration || data.introDuration || 8)},\n  safetyDuration: ${Number(safety.duration || data.safetyDuration || 4)},\n  letsBeginDuration: ${Number(start.duration || data.letsBeginDuration || 2)},\n  outroDuration: ${Number(outro.duration || data.outroDuration || 4)},\n  introImage: ${image(intro.image)},\n  introTitle: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  introSubtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  introBadge: ${q(data.introBadge || 'KIDMOTION')},\n  introVoice: ${audio(voiceFile)},\n  safetyImage: ${image(safety.image)},\n  letsBeginImage: ${image(start.image)},\n  outroImage: ${image(outro.image)},\n  bgMusic: ${audio(musicFile)},\n  exercises: [\n${exerciseRows}\n  ],\n};\n`;

fs.writeFileSync(path.join(root, 'src', 'data', 'active-workout.ts'), source, 'utf8');

fs.mkdirSync(path.join(root, 'episodes'), {recursive: true});
fs.writeFileSync(
  path.join(root, 'episodes', 'ACTIVE_EPISODE.json'),
  `${JSON.stringify({episodeFolder, dataPath: path.relative(root, dataPath)}, null, 2)}\n`,
  'utf8',
);

const legacyPointerDir = path.join(root, 'content');
if (fs.existsSync(legacyPointerDir)) {
  fs.writeFileSync(
    path.join(legacyPointerDir, 'ACTIVE_EPISODE.json'),
    `${JSON.stringify({episodeFolder}, null, 2)}\n`,
    'utf8',
  );
}

console.log(`Activated episode: ${episodeFolder}`);
console.log(`Image source: ${imageSourceRoot}`);
console.log(`Audio source: ${audioSourceRoot}`);
console.log('Opening Voice policy: one Voice 01 may span the 14s opening and must end before exercise 1.');
if (!fs.existsSync(path.join(audioSourceRoot, voiceFile))) console.warn(`WARNING: missing ${voiceFile}`);
if (!fs.existsSync(path.join(audioSourceRoot, musicFile))) console.warn(`WARNING: missing ${musicFile}; final preflight must fail until music exists.`);

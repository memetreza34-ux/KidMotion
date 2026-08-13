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
const dataPath = path.join(root, 'content', 'episodes', episodeFolder, 'data.json');
if (!fs.existsSync(dataPath)) {
  console.error(`Episode data not found: ${dataPath}`);
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

if (!intro?.image) errors.push('Missing Intro image.');
if (!safety?.image) errors.push('Missing Safety image.');
if (!start?.image) errors.push('Missing Lets Begin image.');
if (!outro?.image) errors.push('Missing Outro image.');
if (!exercises.length) errors.push('No exercises found.');
if (data.singleCharacterWholeEpisode !== true) errors.push('singleCharacterWholeEpisode must be true.');
if (data.allVideoSectionsUseCharacterImage !== true) errors.push('allVideoSectionsUseCharacterImage must be true.');

for (const scene of exercises) {
  if (!scene.title || !scene.instruction || !scene.image) errors.push(`Scene ${scene.scene} is incomplete.`);
  if (Number(scene.duration) !== 20) errors.push(`Scene ${scene.scene} must last 20s.`);
}

if (errors.length) {
  console.error('EPISODE ACTIVATION FAILED');
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

const q = JSON.stringify;
const imageFolder = data.assetFolder || '00-bildprompts/00-ALLE-BILDER-HIER-REIN';
const audioFolder = data.audioFolder || '00-audio';
const image = (name) => name ? `imageAsset(${q(name)})` : 'undefined';
const voice = (name) => name ? `voiceAsset(${q(name)})` : 'undefined';
const exerciseRows = exercises.map((scene) =>
  `    {id:${q(String(scene.scene))}, title:${q(scene.title)}, instruction:${q(scene.instruction)}, image:${image(scene.image)}, voice:${voice(scene.voice)}, duration:${Number(scene.duration)}, restAfter:${Number(scene.restAfter || 0)}},`
).join('\n');

const source = `import type {Workout} from '../types';\n\nconst imageAsset = (name: string) => \`${imageFolder}/\${name}\`;\nconst voiceAsset = (name: string) => \`${audioFolder}/\${name}\`;\n\n// AUTO-GENERATED ACTIVE EPISODE: ${episodeFolder}\nexport const activeWorkout: Workout = {\n  id: ${q(data.slug ? `${data.id}-${data.slug}` : (data.id || episodeFolder))},\n  title: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  subtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  fps: ${Number(data.fps || 30)},\n  width: ${Number(data.width || 1920)},\n  height: ${Number(data.height || 1080)},\n  introDuration: ${Number(intro.duration || data.introDuration || 12)},\n  safetyDuration: ${Number(safety.duration || data.safetyDuration || 5)},\n  letsBeginDuration: ${Number(start.duration || data.letsBeginDuration || 3)},\n  outroDuration: ${Number(outro.duration || data.outroDuration || 5)},\n  introImage: ${image(intro.image)},\n  introTitle: ${q(data.introTitle || data.title || data.id || episodeFolder)},\n  introSubtitle: ${q(data.introSubtitle || data.subtitle || '')},\n  introBadge: ${q(data.introBadge || 'KIDMOTION')},\n  introVoice: ${voice(intro.voice)},\n  safetyImage: ${image(safety.image)},\n  safetyVoice: ${voice(safety.voice)},\n  letsBeginImage: ${image(start.image)},\n  letsBeginVoice: ${voice(start.voice)},\n  outroImage: ${image(outro.image)},\n  outroVoice: ${voice(outro.voice)},\n  exercises: [\n${exerciseRows}\n  ],\n};\n`;

fs.writeFileSync(path.join(root, 'src', 'data', 'active-workout.ts'), source, 'utf8');
fs.writeFileSync(path.join(root, 'content', 'ACTIVE_EPISODE.json'), `${JSON.stringify({episodeFolder}, null, 2)}\n`, 'utf8');
console.log(`Activated episode: ${episodeFolder}`);

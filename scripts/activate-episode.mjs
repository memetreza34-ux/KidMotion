import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const episodeFolder = getArg('episode');
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
const intro = scenes.find((scene) => scene.type === 'intro');
const safety = scenes.find((scene) => scene.type === 'safety');
const letsBegin = scenes.find((scene) => scene.type === 'lets-begin');
const outro = scenes.find((scene) => scene.type === 'outro');
const exercises = scenes.filter((scene) => scene.type === 'exercise');

const errors = [];
if (!intro) errors.push('Missing intro scene.');
if (!safety) errors.push('Missing safety scene.');
if (!letsBegin) errors.push('Missing lets-begin scene.');
if (!outro) errors.push('Missing outro scene.');
if (!exercises.length) errors.push('No exercise scenes found.');
if (data.singleCharacterWholeEpisode !== true) errors.push('singleCharacterWholeEpisode must be true.');
if (data.allowCharacterSwitch !== false) errors.push('allowCharacterSwitch must be false.');
if (data.allowSecondVisibleCharacter !== false) errors.push('allowSecondVisibleCharacter must be false.');

for (const scene of exercises) {
  if (!scene.title || /TBD/i.test(scene.title)) errors.push(`Scene ${scene.scene}: exercise title is not finalized.`);
  if (!scene.instruction || /TBD/i.test(scene.instruction)) errors.push(`Scene ${scene.scene}: instruction is not finalized.`);
  if (!scene.image) errors.push(`Scene ${scene.scene}: image filename is missing.`);
  if (Number(scene.duration) !== 20) errors.push(`Scene ${scene.scene}: exercise duration must be 20s.`);
}

if (errors.length) {
  console.error('EPISODE ACTIVATION FAILED');
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

const q = (value) => JSON.stringify(value);
const imageFolder = data.assetFolder || '00-bildprompts/00-ALLE-BILDER-HIER-REIN';
const audioFolder = data.audioFolder || '00-audio';
const title = data.remotionTitle || data.title || data.topic || data.id || episodeFolder;
const subtitle = data.remotionSubtitle || data.subtitle || '';
const introCues = Array.isArray(data.introCues) ? data.introCues : [];

const imageExpr = (filename) => filename ? `imageAsset(${q(filename)})` : 'undefined';
const voiceExpr = (filename) => filename ? `voiceAsset(${q(filename)})` : 'undefined';

const exerciseLines = exercises.map((scene) => {
  return `    {id:${q(String(scene.scene))}, title:${q(scene.title)}, instruction:${q(scene.instruction)}, image:${imageExpr(scene.image)}, voice:${voiceExpr(scene.voice)}, duration:${Number(scene.duration)}, restAfter:${Number(scene.restAfter || 0)}},`;
}).join('\n');

const activeSource = `import type {Workout} from '../types';\n\nconst imageAsset = (name: string) => \`${imageFolder}/\${name}\`;\nconst voiceAsset = (name: string) => \`${audioFolder}/\${name}\`;\n\n// AUTO-GENERATED ACTIVE EPISODE: ${episodeFolder}\n// Source: content/episodes/${episodeFolder}/data.json\n// Regenerate with: npm run kidmotion:activate -- --episode=${episodeFolder}\nexport const activeWorkout: Workout = {\n  id: ${q(data.slug ? `${data.id}-${data.slug}` : (data.id || episodeFolder))},\n  title: ${q(title)},\n  subtitle: ${q(subtitle)},\n  fps: ${Number(data.fps || 30)},\n  width: ${Number(data.width || 1920)},\n  height: ${Number(data.height || 1080)},\n  introDuration: ${Number(intro?.duration ?? data.introDuration ?? 12)},\n  safetyDuration: ${Number(safety?.duration ?? data.safetyDuration ?? 5)},\n  letsBeginDuration: ${Number(letsBegin?.duration ?? data.letsBeginDuration ?? 3)},\n  outroDuration: ${Number(outro?.duration ?? data.outroDuration ?? 5)},\n  introImage: ${imageExpr(intro?.image)},\n  introVoice: ${voiceExpr(intro?.voice)},\n  introCues: ${JSON.stringify(introCues, null, 4)},\n  safetyVoice: ${voiceExpr(safety?.voice)},\n  letsBeginImage: ${imageExpr(letsBegin?.image)},\n  letsBeginVoice: ${voiceExpr(letsBegin?.voice)},\n  outroImage: ${imageExpr(outro?.image)},\n  outroVoice: ${voiceExpr(outro?.voice)},\n  exercises: [\n${exerciseLines}\n  ],\n};\n`;

const activeWorkoutPath = path.join(root, 'src', 'data', 'active-workout.ts');
fs.mkdirSync(path.dirname(activeWorkoutPath), {recursive: true});
fs.writeFileSync(activeWorkoutPath, activeSource, 'utf8');

const activeEpisodePath = path.join(root, 'content', 'ACTIVE_EPISODE.json');
fs.writeFileSync(activeEpisodePath, `${JSON.stringify({episodeFolder}, null, 2)}\n`, 'utf8');

console.log(`Activated episode: ${episodeFolder}`);
console.log(`Updated: ${path.relative(root, activeWorkoutPath)}`);
console.log(`Updated: ${path.relative(root, activeEpisodePath)}`);
console.log('Next: stage this episode assets, then run npm run render:safe');

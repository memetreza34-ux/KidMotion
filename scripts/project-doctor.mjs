import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const read = (relative) => {
  const file = path.join(root, relative);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
};

const pkg = JSON.parse(read('package.json') || '{}');
const guardedCommand = 'node scripts/render-guarded.mjs';
if (pkg.scripts?.render !== guardedCommand) fail('npm run render must use scripts/render-guarded.mjs. Raw Remotion render is forbidden.');
if (pkg.scripts?.['render:safe'] !== guardedCommand) fail('npm run render:safe must use scripts/render-guarded.mjs.');
if (pkg.scripts?.['render:short']) fail('render:short must not exist in the current longform-only phase.');

const guarded = read('scripts/render-guarded.mjs');
for (const required of ['typecheck', 'project:doctor', 'preflight', 'asset:gate', 'postrender:qa']) {
  if (!guarded.includes(required)) fail(`render-guarded.mjs must include ${required}.`);
}
if (!guarded.includes("'KidMotionVideo'")) fail('Guarded render must target KidMotionVideo only.');

const rootSource = read('src/Root.tsx');
if (rootSource.includes('KidMotionShort')) fail('Root.tsx still exposes KidMotionShort. Longform-only phase must expose KidMotionVideo only.');

const exercise = read('src/components/ExerciseScene.tsx');
for (const forbidden of ['opacity: fadeIn', 'transform: `scale(', 'ExerciseHeader']) {
  if (exercise.includes(forbidden)) fail(`ExerciseScene regression detected: forbidden token ${forbidden}`);
}
if (!exercise.includes('CircularTimer') || !exercise.includes('KidProgressBar')) fail('ExerciseScene must contain timer + progress.');

const rest = read('src/components/RestScreen.tsx');
for (const forbidden of ['opacity: fadeIn', 'transform: `scale(', 'NEXT:']) {
  if (rest.includes(forbidden)) fail(`RestScreen regression detected: forbidden token ${forbidden}`);
}

const workout = read('src/WorkoutVideo.tsx');
if (!workout.includes('loop')) fail('Background music must use loop in WorkoutVideo.');
if (!workout.includes('openingFrames')) fail('Opening Voice must be scoped to the complete opening sequence.');
if (workout.includes('exercise.voice') || workout.includes('outroVoice') || workout.includes('safetyVoice') || workout.includes('letsBeginVoice')) {
  fail('WorkoutVideo must not play separate spoken Voice after the single opening Voice.');
}

const intro = read('src/components/IntroScreen.tsx');
for (const clutter of ['WELCOME TO', 'COPY • HOLD • HAVE FUN']) {
  if (intro.includes(clutter)) fail(`Intro clutter regression detected: ${clutter}`);
}

const letsBegin = read('src/components/LetsBeginScreen.tsx');
if (!letsBegin.includes("LET'S BEGIN!")) fail("LetsBeginScreen must visibly render LET'S BEGIN!.");

const safety = read('src/components/SafetyDisclaimerScreen.tsx');
if (safety.includes('opacity: fadeIn')) fail('Safety screen must not fade the complete scene from blank.');
const outro = read('src/components/GreatJobScreen.tsx');
if (outro.includes('opacity: fadeIn')) fail('Outro must not fade the complete scene from blank.');

const activate = read('scripts/activate-episode.mjs');
if (!activate.includes("path.join(root, 'episodes', episodeFolder")) fail('activate-episode must use canonical root episodes/<episode>.');
if (!activate.includes("path.join(root, 'episodes', 'ACTIVE_EPISODE.json')")) fail('activate-episode must write canonical episodes/ACTIVE_EPISODE.json.');
if (!activate.includes('bgMusic:')) fail('activate-episode must map background music into active-workout.ts.');

const newEpisode = read('scripts/new-episode.mjs');
if (!newEpisode.includes('VISUAL_REVIEW.json')) fail('new-episode must create a visual review gate.');
if (!newEpisode.includes('GENERATION-REVISION.txt')) fail('new-episode must create a generation revision file.');

if (fs.existsSync(path.join(root, 'content'))) fail('Legacy root content/ directory exists. Canonical episode system is root episodes/ only.');

if (failures.length) {
  console.error('PROJECT DOCTOR FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log('PROJECT DOCTOR PASSED');
console.log('Protected: guarded render command, canonical episode path, longform-only root, opening-only Voice, looped music, static exercise/rest images, clean Intro, mandatory visual review, and no blank-scene fades.');

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
if (pkg.scripts?.render !== guardedCommand) fail('npm run render must use scripts/render-guarded.mjs.');
if (pkg.scripts?.['render:safe'] !== guardedCommand) fail('npm run render:safe must use scripts/render-guarded.mjs.');
if (pkg.scripts?.['render:short']) fail('render:short must not exist in longform-only phase.');

const guarded = read('scripts/render-guarded.mjs');
for (const required of ['typecheck', 'project:doctor', 'preflight', 'asset:gate', 'postrender:qa']) {
  if (!guarded.includes(required)) fail(`render-guarded.mjs must include ${required}.`);
}
if (!guarded.includes("'KidMotionVideo'")) fail('Guarded render must target KidMotionVideo only.');

const pipelineText = read('config/pipeline.json');
const visualText = read('config/visual-policy.json');
if (!pipelineText) fail('config/pipeline.json is required for KidMotion V2.');
if (!visualText) fail('config/visual-policy.json is required for KidMotion V2.');
if (pipelineText) {
  const pipeline = JSON.parse(pipelineText);
  if (pipeline.pipelineVersion !== 2) fail('KidMotion pipelineVersion must be 2.');
  if (pipeline.structure?.finalImageDirectory !== '00-bildprompts/images') fail('V2 final image directory must be 00-bildprompts/images.');
  if (pipeline.coverPolicy?.coverImageNumber !== 0 || pipeline.coverPolicy?.coverCandidateCount !== 3) fail('V2 cover must be Bild 00 with exactly 3 temporary candidates.');
  if (pipeline.imageGenerationPolicy?.primaryReferenceImage !== 'Bild 01.png') fail('V2 primary reference must be Bild 01.png.');
  if (pipeline.imageGenerationPolicy?.exerciseUiReferenceImage !== 'Bild 04.png') fail('V2 exercise UI reference must be Bild 04.png.');
}
if (visualText) {
  const visual = JSON.parse(visualText);
  if (visual.status !== 'READY' || !visual.styleId || visual.styleId === 'UNSET') fail('KidMotion visual policy must be READY with a real styleId.');
  if (visual.visibleTextLanguage !== 'en') fail('KidMotion generated visible text language must be English.');
}

if (!read('scripts/episode-paths.mjs').includes("'00-bildprompts', 'images'")) fail('episode-paths.mjs must resolve the V2 image directory.');
const newEpisode = read('scripts/new-episode.mjs');
for (const required of ['00-bildprompts/images','01-voice-script','03-export','99-technik','IMAGE_PLAN.json','google-flow-prompt.txt','Generate exactly THREE temporary Bild 00 candidates']) {
  if (!newEpisode.includes(required)) fail(`new-episode V2 requirement missing: ${required}`);
}
const activate = read('scripts/activate-episode.mjs');
if (!activate.includes('resolveEpisodePaths')) fail('activate-episode must use shared V2/legacy path resolver.');
if (!activate.includes('paths.imagesDir')) fail('activate-episode must wire the resolved image directory.');
for (const script of ['scripts/preflight.mjs','scripts/approve-assets.mjs','scripts/asset-gate.mjs']) {
  if (!read(script).includes('resolveEpisodePaths')) fail(`${script} must use shared episode paths.`);
}

const rootSource = read('src/Root.tsx');
if (rootSource.includes('KidMotionShort')) fail('Root.tsx must expose KidMotionVideo only.');
const exercise = read('src/components/ExerciseScene.tsx');
for (const forbidden of ['opacity: fadeIn', 'transform: `scale(', 'ExerciseHeader']) if (exercise.includes(forbidden)) fail(`ExerciseScene regression: ${forbidden}`);
if (!exercise.includes('CircularTimer') || !exercise.includes('KidProgressBar')) fail('ExerciseScene must contain timer + progress.');
const rest = read('src/components/RestScreen.tsx');
for (const forbidden of ['opacity: fadeIn', 'transform: `scale(', 'NEXT:']) if (rest.includes(forbidden)) fail(`RestScreen regression: ${forbidden}`);
const workout = read('src/WorkoutVideo.tsx');
if (!workout.includes('loop')) fail('Background music must loop.');
if (!workout.includes('openingFrames')) fail('Opening Voice must span the opening sequence only.');
if (workout.includes('exercise.voice') || workout.includes('outroVoice') || workout.includes('safetyVoice') || workout.includes('letsBeginVoice')) fail('Separate spoken Voice after opening is forbidden.');
const types = read('src/types.ts');
if ((types.match(/export type Exercise = \{[\s\S]*?\n\};/)?.[0] || '').includes('voice?:')) fail('Exercise type must not expose voice.');
for (const forbiddenType of ['safetyVoice?:','letsBeginVoice?:','outroVoice?:']) if (types.includes(forbiddenType)) fail(`Forbidden Workout field: ${forbiddenType}`);

const letsBegin = read('src/components/LetsBeginScreen.tsx');
if (!letsBegin.includes("LET'S BEGIN!") && !letsBegin.includes('LET&apos;S BEGIN!')) fail("LetsBeginScreen must render LET'S BEGIN!.");
if (read('src/components/SafetyDisclaimerScreen.tsx').includes('opacity: fadeIn')) fail('Safety screen must not fade from blank.');
if (read('src/components/GreatJobScreen.tsx').includes('opacity: fadeIn')) fail('Outro must not fade from blank.');

const episodesRoot = path.join(root, 'episodes');
if (fs.existsSync(episodesRoot)) {
  for (const entry of fs.readdirSync(episodesRoot, {withFileTypes:true})) {
    if (!entry.isDirectory() || !/^KM-\d{3}-/.test(entry.name)) continue;
    const episodeRoot = path.join(episodesRoot, entry.name);
    const v2 = fs.existsSync(path.join(episodeRoot, '99-technik', 'episode.json'));
    if (!v2) continue;
    for (const legacy of ['04-data/data.json','03-bilder/bild-prompts.md','01-skript/voice-text.md','GENERATION-REVISION.txt']) {
      if (fs.existsSync(path.join(episodeRoot, legacy))) fail(`${entry.name} is V2 but still contains legacy ${legacy}.`);
    }
    for (const required of ['00-bildprompts/google-flow-prompt.txt','99-technik/IMAGE_PLAN.json','99-technik/VISUAL_REVIEW.json','99-technik/GENERATION-REVISION.txt']) {
      if (!fs.existsSync(path.join(episodeRoot, required))) fail(`${entry.name} V2 missing ${required}.`);
    }
  }
}

const gitignore = read('.gitignore');
if (gitignore.split(/\r?\n/).some((line) => line.trim() === 'package-lock.json')) fail('package-lock.json must not be ignored.');
const qualityWorkflow = read('.github/workflows/quality.yml');
if (!qualityWorkflow.includes('npm run typecheck') || !qualityWorkflow.includes('npm run project:doctor')) fail('Quality workflow must run typecheck + project:doctor.');
if (fs.existsSync(path.join(root, '.DS_Store')) || fs.existsSync(path.join(root, 'public', '.DS_Store'))) fail('.DS_Store metadata must not exist in root/public.');
if (fs.existsSync(path.join(root, 'content'))) fail('Legacy root content/ directory must not exist.');

if (failures.length) {
  console.error('PROJECT DOCTOR FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}
console.log('PROJECT DOCTOR PASSED');
console.log('Protected: KidMotion V2 structure, Flow planning/reference workflow, guarded render, opening-only Voice, static workout scenes, visual review and SHA-256 asset lock.');

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
if (pkg.scripts?.['kidmotion:select-cover'] !== 'node scripts/select-cover.mjs') fail('kidmotion:select-cover script must exist.');

const guarded = read('scripts/render-guarded.mjs');
for (const required of ['typecheck','project:doctor','preflight','asset:gate','postrender:qa']) {
  if (!guarded.includes(required)) fail(`render-guarded.mjs must include ${required}.`);
}
if (!guarded.includes("'KidMotionVideo'")) fail('Guarded render must target KidMotionVideo only.');

const pipelineText = read('config/pipeline.json');
const visualText = read('config/visual-policy.json');
if (!pipelineText) fail('config/pipeline.json is required.');
if (!visualText) fail('config/visual-policy.json is required.');

if (pipelineText) {
  const pipeline = JSON.parse(pipelineText);
  if (pipeline.pipelineVersion !== 3) fail('KidMotion pipelineVersion must be 3.');
  if (pipeline.structure?.finalImageDirectory !== '00-bildprompts/images') fail('Final image directory must be 00-bildprompts/images.');
  if (pipeline.publicRuntimeStructure?.root !== 'public/episodes') fail('Public runtime root must be public/episodes.');
  if (pipeline.publicRuntimeStructure?.layout !== '{date}/{episodeFolder}/{images|audio}') fail('Public runtime layout must group assets by date and episode folder.');
  if (pipeline.publicRuntimeStructure?.legacyFlatAliasesForbidden !== true) fail('Legacy flat public episode aliases must be forbidden.');
  if (pipeline.coverPolicy?.coverSceneNumber !== 1 || pipeline.coverPolicy?.coverCandidateCount !== 3) fail('V3 cover must be Szene 01 with exactly three candidates.');
  if (pipeline.coverPolicy?.mustWaitForExplicitUserSelection !== true) fail('V3 cover workflow must wait for explicit user selection.');
  if (pipeline.coverPolicy?.finalFile !== 'Szene 01.png') fail('Selected cover final file must be Szene 01.png.');
  if (pipeline.imageGenerationPolicy?.primaryReferenceImage !== 'Szene 01.png') fail('V3 primary reference must be Szene 01.png.');
  if (pipeline.imageGenerationPolicy?.exerciseUiReferenceImage !== 'Szene 05.png') fail('V3 exercise UI reference must be Szene 05.png.');
  if (pipeline.imageGenerationPolicy?.allFinalScenesInOneFolder !== true) fail('All final scenes must stay in one image folder.');
  if (pipeline.renderPolicy?.remotionOwnsTimerOnly !== true) fail('Remotion must own only the countdown timer.');
  if (pipeline.renderPolicy?.remotionOwnsProgressBar !== false) fail('Remotion progress bar must be disabled.');
  if (pipeline.renderPolicy?.googleFlowOwnsAllNonTimerVisibleText !== true) fail('Google Flow must own all non-timer visible text.');
}

if (visualText) {
  const visual = JSON.parse(visualText);
  if (visual.status !== 'READY' || !visual.styleId || visual.styleId === 'UNSET') fail('KidMotion visual policy must be READY with a real styleId.');
  if (visual.visibleTextLanguage !== 'en') fail('KidMotion generated visible text language must be English.');
  if (visual.referenceWorkflow?.waitForUserSelection !== true) fail('Visual policy must require user cover selection.');
  if (visual.referenceWorkflow?.primaryCharacterWorldReference !== 'Szene 01.png') fail('Visual policy primary reference must be Szene 01.png.');
}

const episodePaths = read('scripts/episode-paths.mjs');
if (!episodePaths.includes('coverSelectionPath')) fail('episode-paths.mjs must expose coverSelectionPath.');
if (!episodePaths.includes("'00-bildprompts', 'images'")) fail('episode-paths.mjs must resolve the image directory.');

const newEpisode = read('scripts/new-episode.mjs');
for (const required of ['structureVersion:3','Cover-Kandidat-01.png','COVER_SELECTION.json','Szene 01.png','Szene 17.png','stopAfterCoverCandidatesUntilExplicitUserSelection']) {
  if (!newEpisode.includes(required)) fail(`new-episode V3 requirement missing: ${required}`);
}

const selectCover = read('scripts/select-cover.mjs');
for (const required of ['COVER SELECTION FAILED','Szene 01.png','SELECTED','Cover-Kandidat-03.png']) {
  if (!selectCover.includes(required)) fail(`select-cover.mjs requirement missing: ${required}`);
}

const activate = read('scripts/activate-episode.mjs');
if (!activate.includes('resolveEpisodePaths')) fail('activate-episode must use shared episode paths.');
if (!activate.includes('paths.imagesDir')) fail('activate-episode must wire the resolved image directory.');
if (!activate.includes('data.date')) fail('activate-episode must use the episode date.');
if (!activate.includes("path.join(publicEpisodes, episodeDate, publicEpisodeFolder)")) fail('activate-episode must group runtime assets by date and episode folder.');
if (!activate.includes("/^KM-\\d{3}-(audio|bilder)$/")) fail('activate-episode must remove old flat public runtime aliases.');
for (const script of ['scripts/preflight.mjs','scripts/approve-assets.mjs','scripts/asset-gate.mjs']) {
  if (!read(script).includes('resolveEpisodePaths')) fail(`${script} must use shared episode paths.`);
}
if (!read('scripts/preflight.mjs').includes('COVER_SELECTION.json')) fail('preflight must enforce cover selection.');
if (!read('scripts/approve-assets.mjs').includes('Cover has not been explicitly selected')) fail('asset approval must enforce cover selection.');

const rootSource = read('src/Root.tsx');
if (rootSource.includes('KidMotionShort')) fail('Root.tsx must expose KidMotionVideo only.');
const exercise = read('src/components/ExerciseScene.tsx');
for (const forbidden of ['opacity: fadeIn','transform: `scale(','ExerciseHeader','KidProgressBar']) if (exercise.includes(forbidden)) fail(`ExerciseScene regression: ${forbidden}`);
if (!exercise.includes('CircularTimer')) fail('ExerciseScene must contain the countdown timer.');
const rest = read('src/components/RestScreen.tsx');
for (const forbidden of ['opacity: fadeIn','transform: `scale(','NEXT:','>REST<']) if (rest.includes(forbidden)) fail(`RestScreen regression: ${forbidden}`);
if (!rest.includes('CircularTimer')) fail('RestScreen must contain only the countdown timer over the reused image.');
if (fs.existsSync(path.join(root, 'src', 'components', 'KidProgressBar.tsx'))) fail('KidProgressBar.tsx must not exist.');

for (const file of ['IntroScreen.tsx','SafetyDisclaimerScreen.tsx','LetsBeginScreen.tsx','GreatJobScreen.tsx']) {
  const source = read(`src/components/${file}`);
  if (!source.includes('<Img')) fail(`${file} must render the Flow image.`);
  if (source.includes('<div') || source.includes('brand.') || source.includes('interpolate(') || source.includes('spring(')) fail(`${file} must be image-only; Remotion text/graphics are forbidden.`);
}

const workout = read('src/WorkoutVideo.tsx');
if (!workout.includes('loop')) fail('Background music must loop.');
if (!workout.includes('openingFrames')) fail('Opening Voice must span the opening sequence only.');
if (workout.includes('exercise.voice') || workout.includes('outroVoice') || workout.includes('safetyVoice') || workout.includes('letsBeginVoice')) fail('Separate spoken Voice after opening is forbidden.');
const types = read('src/types.ts');
if ((types.match(/export type Exercise = \{[\s\S]*?\n\};/)?.[0] || '').includes('voice?:')) fail('Exercise type must not expose voice.');
for (const forbiddenType of ['safetyVoice?:','letsBeginVoice?:','outroVoice?:']) if (types.includes(forbiddenType)) fail(`Forbidden Workout field: ${forbiddenType}`);

const episodesRoot = path.join(root, 'episodes');
if (fs.existsSync(episodesRoot)) {
  for (const entry of fs.readdirSync(episodesRoot, {withFileTypes:true})) {
    if (!entry.isDirectory() || !/^KM-\d{3}-/.test(entry.name)) continue;
    const episodeRoot = path.join(episodesRoot, entry.name);
    const episodeDataPath = path.join(episodeRoot, '99-technik', 'episode.json');
    if (!fs.existsSync(episodeDataPath)) continue;
    const episodeData = JSON.parse(fs.readFileSync(episodeDataPath, 'utf8'));
    const version = Number(episodeData.structureVersion || 2);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(episodeData.date || ''))) fail(`${entry.name} must declare date as YYYY-MM-DD.`);
    if (!episodeData.topic) fail(`${entry.name} must declare topic.`);
    if (!episodeData.slug) fail(`${entry.name} must declare slug.`);
    for (const legacy of ['04-data/data.json','03-bilder/bild-prompts.md','01-skript/voice-text.md','GENERATION-REVISION.txt']) {
      if (fs.existsSync(path.join(episodeRoot, legacy))) fail(`${entry.name} is modern but still contains legacy ${legacy}.`);
    }
    for (const required of ['00-bildprompts/google-flow-prompt.txt','99-technik/IMAGE_PLAN.json','99-technik/VISUAL_REVIEW.json','99-technik/GENERATION-REVISION.txt']) {
      if (!fs.existsSync(path.join(episodeRoot, required))) fail(`${entry.name} missing ${required}.`);
    }
    if (version >= 3) {
      if (!fs.existsSync(path.join(episodeRoot, '99-technik', 'COVER_SELECTION.json'))) fail(`${entry.name} V3 missing 99-technik/COVER_SELECTION.json.`);
      const scenes = Array.isArray(episodeData.scenes) ? episodeData.scenes : [];
      if (scenes.length !== 17) fail(`${entry.name} V3 must define exactly 17 final scenes.`);
      for (let i = 0; i < scenes.length; i += 1) {
        const expected = `Szene ${String(i + 1).padStart(2, '0')}.png`;
        if (scenes[i]?.image !== expected) fail(`${entry.name} scene ${i + 1} must map ${expected}.`);
      }
      if (scenes[0]?.type !== 'cover' || scenes[0]?.inVideo !== false) fail(`${entry.name} Szene 01 must be the cover outside the MP4.`);
    }
  }
}

const publicEpisodes = path.join(root, 'public', 'episodes');
if (fs.existsSync(publicEpisodes)) {
  for (const entry of fs.readdirSync(publicEpisodes, {withFileTypes:true})) {
    if (/^KM-\d{3}-(audio|bilder)$/.test(entry.name)) fail(`Legacy flat public runtime alias found: public/episodes/${entry.name}. Activate an episode to migrate/clean it.`);
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
console.log('Protected: 3-cover user-selection gate, Szene 01–17 single-folder workflow, selected-cover reference, Flow-owned text, timer-only Remotion and SHA-256 approval.');

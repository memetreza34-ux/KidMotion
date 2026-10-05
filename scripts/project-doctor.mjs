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
  if (pipeline.coverPolicy?.coverSceneNumber !== 1 || pipeline.coverPolicy?.coverCandidateCount !== 3) fail('V3 cover must be Szene 01 with exactly three candidates.');
  if (pipeline.coverPolicy?.mustWaitForExplicitUserSelection !== true) fail('V3 cover workflow must wait for explicit user selection.');
  if (pipeline.coverPolicy?.finalFile !== 'Szene 01.png') fail('Selected cover final file must be Szene 01.png.');
  if (pipeline.coverPolicy?.deleteRejectedCandidatesAfterSelection !== true) fail('Two rejected cover candidates must be deleted after selection.');
  if (pipeline.batchGenerationPolicy?.enabled !== true) fail('Five-image batch generation policy must be enabled.');
  if (pipeline.batchGenerationPolicy?.batchSize !== 5) fail('Image generation batch size must be exactly five.');
  if (pipeline.batchGenerationPolicy?.showBatchToUserBeforeContinuing !== false || pipeline.batchGenerationPolicy?.mustWaitForExplicitUserContinue !== false) fail('Image batches must not pause for user confirmation after cover selection.');
  if (pipeline.batchGenerationPolicy?.autoContinueToNextBatch !== true || pipeline.batchGenerationPolicy?.deliverOnlyAfterAllScenesComplete !== true) fail('Image batches must auto-continue and deliver only after all scenes are complete.');
  const expectedBatches = [[2,3,4,5,6],[7,8,9,10,11],[12,13,14,15,16],[17,18,19,20,21],[22,23,24,25,26],[27,28]];
  if (JSON.stringify(pipeline.batchGenerationPolicy?.batches) !== JSON.stringify(expectedBatches)) fail('Image generation batches must be 02-06, 07-11, 12-16, 17-21, 22-26 and 27-28.');
  if (pipeline.batchGenerationPolicy?.primaryReferenceEveryBatch !== 'Szene 01.png') fail('Selected Szene 01 must remain primary reference in every image batch.');
  if (pipeline.batchGenerationPolicy?.exerciseUiReferenceAfterFirstBatch !== 'Szene 05.png') fail('Szene 05 must be the secondary exercise UI reference after Batch 1.');
  if (pipeline.imageGenerationPolicy?.primaryReferenceImage !== 'Szene 01.png') fail('V3 primary reference must be Szene 01.png.');
  if (pipeline.imageGenerationPolicy?.exerciseUiReferenceImage !== 'Szene 05.png') fail('V3 exercise UI reference must be Szene 05.png.');
  if (pipeline.imageGenerationPolicy?.lastFinalScene !== 28) fail('V3 must end at Szene 28.');
  if (pipeline.imageGenerationPolicy?.dedicatedGetReadyScenes !== true || pipeline.imageGenerationPolicy?.getReadySceneCount !== 11) fail('V3 must define 11 dedicated GET READY scenes.');
  if (pipeline.renderPolicy?.restUsesDedicatedGetReadyImage !== true || pipeline.renderPolicy?.restReusesNextExerciseImage !== false) fail('V3 transitions must use dedicated GET READY images.');
  if (pipeline.renderPolicy?.remotionOwnsTimerOnly !== true) fail('Remotion must own only the countdown timer.');
  if (pipeline.timerPolicy?.sizePixels !== 192 || pipeline.timerPolicy?.requiredSafeZonePixels !== 230) fail('Timer policy must use 192px timer and 230px safe zone.');
  if (pipeline.audioPolicy?.targetBpm !== '120-130' || pipeline.audioPolicy?.vocalsForbidden !== true) fail('Music policy must require upbeat 120-130 BPM instrumental music with no vocals.');
}

if (visualText) {
  const visual = JSON.parse(visualText);
  if (visual.status !== 'READY' || !visual.styleId || visual.styleId === 'UNSET') fail('KidMotion visual policy must be READY.');
  if (visual.visibleTextLanguage !== 'en') fail('Visible text language must be English.');
  if (visual.referenceWorkflow?.waitForUserSelection !== true) fail('Visual policy must require one-time user cover selection.');
  if (visual.referenceWorkflow?.primaryCharacterWorldReference !== 'Szene 01.png') fail('Primary visual reference must be Szene 01.png.');
  if (visual.referenceWorkflow?.batchSizeAfterCover !== 5 || visual.referenceWorkflow?.waitForUserBetweenBatches !== false || visual.referenceWorkflow?.autoContinueAfterCoverSelection !== true) fail('Visual policy must use autonomous five-image batches after cover selection.');
  if (visual.referenceWorkflow?.deliverCompletedFolderAtEnd !== true) fail('Visual policy must deliver the completed image folder at the end.');
  if (!visual.rules?.some((rule) => String(rule).includes('GET READY'))) fail('Visual policy must define dedicated GET READY scenes.');
}

const episodePaths = read('scripts/episode-paths.mjs');
if (!episodePaths.includes('coverSelectionPath')) fail('episode-paths.mjs must expose coverSelectionPath.');
if (!episodePaths.includes("'00-bildprompts', 'images'")) fail('episode-paths.mjs must resolve the image directory.');

const newEpisode = read('scripts/new-episode.mjs');
for (const required of ['structureVersion:3','Cover-Kandidat-01.png','COVER_SELECTION.json','Szene 01.png','Szene 28.png','get-ready','useDedicatedGetReadyImage','stopAfterCoverCandidatesUntilExplicitUserSelection','generationBatches','batchSizeAfterCover:5','waitForExplicitUserContinueBetweenBatches:false','autoContinueToNextBatch:true','FIVE-IMAGE INTERNAL BATCH WORKFLOW']) {
  if (!newEpisode.includes(required)) fail(`new-episode V3 requirement missing: ${required}`);
}

const selectCover = read('scripts/select-cover.mjs');
for (const required of ['COVER SELECTION FAILED','Szene 01.png','SELECTED','Cover-Kandidat-03.png']) {
  if (!selectCover.includes(required)) fail(`select-cover.mjs requirement missing: ${required}`);
}

const activate = read('scripts/activate-episode.mjs');
for (const required of ['resolveEpisodePaths','paths.imagesDir','data.date','readyImage','get-ready']) {
  if (!activate.includes(required)) fail(`activate-episode requirement missing: ${required}`);
}
if (!activate.includes("path.join(publicEpisodes, episodeDate, publicEpisodeFolder)")) fail('activate-episode must group runtime assets by date and episode.');
if (!activate.includes("/^KM-\\d{3}-(audio|bilder)$/")) fail('activate-episode must remove old flat aliases.');

for (const script of ['scripts/preflight.mjs','scripts/approve-assets.mjs','scripts/asset-gate.mjs']) {
  if (!read(script).includes('resolveEpisodePaths')) fail(`${script} must use shared episode paths.`);
}
if (!read('scripts/preflight.mjs').includes('28 final scenes') && !read('scripts/preflight.mjs').includes('exactly 28')) fail('preflight must enforce the 28-scene V3 layout.');
if (!read('scripts/approve-assets.mjs').includes('poseVarietyStrong')) fail('asset approval must enforce pose variety.');
if (!read('scripts/approve-assets.mjs').includes('allGetReadyImagesClearAndNotConfusableWithExercise')) fail('asset approval must review GET READY images.');

const rootSource = read('src/Root.tsx');
if (rootSource.includes('KidMotionShort')) fail('Root.tsx must expose KidMotionVideo only.');

const exercise = read('src/components/ExerciseScene.tsx');
for (const forbidden of ['opacity: fadeIn','transform: `scale(','ExerciseHeader','KidProgressBar']) {
  if (exercise.includes(forbidden)) fail(`ExerciseScene regression: ${forbidden}`);
}
if (!exercise.includes('CircularTimer')) fail('ExerciseScene must contain the countdown timer.');

const rest = read('src/components/RestScreen.tsx');
for (const forbidden of ['opacity: fadeIn','transform: `scale(','NEXT:','>REST<']) {
  if (rest.includes(forbidden)) fail(`RestScreen regression: ${forbidden}`);
}
if (!rest.includes('mode="ready"')) fail('RestScreen must render the dedicated ready timer mode.');

const timer = read('src/components/CircularTimer.tsx');
if (!timer.includes('const size = 192')) fail('CircularTimer must use redesigned 192px size.');
if (!timer.includes('Math.max(1, Math.ceil')) fail('CircularTimer must count down to 1 and cut before showing 0.');

const workout = read('src/WorkoutVideo.tsx');
if (!workout.includes('exercise.readyImage')) fail('WorkoutVideo must use exercise.readyImage for transitions.');
if (workout.includes('nextExercise?.image')) fail('WorkoutVideo must not reuse next exercise image during transitions.');
if (!workout.includes('0.22')) fail('Workout music must rise to the stronger post-opening level.');
if (!workout.includes('loop')) fail('Background music must loop.');

const types = read('src/types.ts');
if (!types.includes('readyImage?: string;')) fail('Exercise type must expose readyImage.');
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
    for (const required of ['00-bildprompts/google-flow-prompt.txt','99-technik/IMAGE_PLAN.json','99-technik/VISUAL_REVIEW.json','99-technik/GENERATION-REVISION.txt']) {
      if (!fs.existsSync(path.join(episodeRoot, required))) fail(`${entry.name} missing ${required}.`);
    }
    if (version >= 3) {
      if (!fs.existsSync(path.join(episodeRoot, '99-technik', 'COVER_SELECTION.json'))) fail(`${entry.name} V3 missing COVER_SELECTION.json.`);
      const scenes = Array.isArray(episodeData.scenes) ? episodeData.scenes : [];
      if (scenes.length !== 28) fail(`${entry.name} V3 must define exactly 28 final scenes.`);
      for (let i = 0; i < scenes.length; i += 1) {
        const expected = `Szene ${String(i + 1).padStart(2, '0')}.png`;
        if (scenes[i]?.image !== expected) fail(`${entry.name} scene ${i + 1} must map ${expected}.`);
      }
      if (scenes[0]?.type !== 'cover' || scenes[0]?.inVideo !== false) fail(`${entry.name} Szene 01 must be the cover outside the MP4.`);
      if (scenes.filter((scene) => scene.type === 'exercise').length !== 12) fail(`${entry.name} must define 12 exercise scenes.`);
      if (scenes.filter((scene) => scene.type === 'get-ready').length !== 11) fail(`${entry.name} must define 11 GET READY scenes.`);
      if (!fs.existsSync(path.join(episodeRoot, '02-audio', 'MUSIC_BRIEF.md'))) fail(`${entry.name} V3 missing 02-audio/MUSIC_BRIEF.md.`);
    }
  }
}

const publicEpisodes = path.join(root, 'public', 'episodes');
if (fs.existsSync(publicEpisodes)) {
  for (const entry of fs.readdirSync(publicEpisodes, {withFileTypes:true})) {
    if (/^KM-\d{3}-(audio|bilder)$/.test(entry.name)) fail(`Legacy flat public runtime alias found: public/episodes/${entry.name}.`);
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
console.log('Protected: one-time 3-cover user choice, rejected-cover cleanup, autonomous five-image Flow batches, Szene 01 primary reference, 28-scene workflow, dedicated GET READY images, pose diversity, redesigned timer, kids-music policy and SHA-256 approval.');

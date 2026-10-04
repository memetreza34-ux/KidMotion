import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

const root = process.cwd();
const pointerPath = path.join(root, 'episodes', 'ACTIVE_EPISODE.json');
if (!fs.existsSync(pointerPath)) {
  console.error('PRE-FLIGHT FAILED: no ACTIVE_EPISODE pointer found. Run kidmotion:activate first.');
  process.exit(1);
}

const pointer = JSON.parse(fs.readFileSync(pointerPath, 'utf8'));
const episodeFolder = pointer.episodeFolder;
const paths = resolveEpisodePaths(root, episodeFolder);
if (paths.structure === 'missing') {
  console.error(`PRE-FLIGHT FAILED: missing episode data for ${episodeFolder}`);
  process.exit(1);
}

const data = readEpisodeData(paths);
const structureVersion = Number(data.structureVersion || 1);
const sceneV3 = structureVersion >= 3;
const pipeline = JSON.parse(fs.readFileSync(path.join(root, 'config', 'pipeline.json'), 'utf8'));
const visual = JSON.parse(fs.readFileSync(path.join(root, 'config', 'visual-policy.json'), 'utf8'));
const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

const activeSource = read(path.join(root, 'src', 'data', 'active-workout.ts'));
const workoutVideoSource = read(path.join(root, 'src', 'WorkoutVideo.tsx'));
const exerciseSceneSource = read(path.join(root, 'src', 'components', 'ExerciseScene.tsx'));
const restScreenSource = read(path.join(root, 'src', 'components', 'RestScreen.tsx'));
const timerSource = read(path.join(root, 'src', 'components', 'CircularTimer.tsx'));
const imageOnlyComponents = [
  read(path.join(root, 'src', 'components', 'IntroScreen.tsx')),
  read(path.join(root, 'src', 'components', 'SafetyDisclaimerScreen.tsx')),
  read(path.join(root, 'src', 'components', 'LetsBeginScreen.tsx')),
  read(path.join(root, 'src', 'components', 'GreatJobScreen.tsx')),
];

if (!activeSource) fail('src/data/active-workout.ts is missing. Run kidmotion:activate first.');
if (activeSource && !activeSource.includes(episodeFolder)) fail(`active-workout.ts is not wired to ${episodeFolder}.`);

if (paths.isV2) {
  if (![2, 3].includes(structureVersion)) fail('Modern episode must declare structureVersion 2 or 3.');
  if (visual.status !== 'READY') fail('config/visual-policy.json must be READY.');
  if (data.visualStyleId !== visual.styleId) fail('Episode visualStyleId does not match active visual policy.');
  if (!fs.existsSync(paths.imagePlanPath)) fail('Missing 99-technik/IMAGE_PLAN.json.');
  if (!fs.existsSync(paths.promptPath)) fail('Missing 00-bildprompts/google-flow-prompt.txt.');
  if (!fs.existsSync(paths.revisionPath)) fail('Missing 99-technik/GENERATION-REVISION.txt.');
  if (data.visibleTextPolicy?.googleFlowOwnsAllNonTimerVisibleText !== true) fail('Google Flow must own every non-timer visible text element.');
  if (data.visibleTextPolicy?.remotionTimerOnly !== true) fail('Remotion overlays must be limited to the countdown timer.');
  if (data.visibleTextPolicy?.progressBarForbidden !== true) fail('Remotion progress bar must be forbidden.');

  if (sceneV3) {
    if (!fs.existsSync(paths.coverSelectionPath)) fail('Missing 99-technik/COVER_SELECTION.json.');
    else {
      const selection = JSON.parse(fs.readFileSync(paths.coverSelectionPath, 'utf8'));
      if (selection.status !== 'SELECTED') fail('Cover selection is not complete. The user must explicitly choose one of the three cover candidates first.');
      if (selection.finalFile !== 'Szene 01.png') fail('Selected cover final file must be Szene 01.png.');
    }
    for (const candidate of ['Cover-Kandidat-01.png','Cover-Kandidat-02.png','Cover-Kandidat-03.png']) {
      if (fs.existsSync(path.join(paths.imagesDir, candidate))) fail(`Rejected/temporary cover candidate still exists: ${candidate}`);
    }
    if (data.restVisualPolicy?.useDedicatedGetReadyImage !== true || data.restVisualPolicy?.reuseNextExerciseImage !== false) {
      fail('V3 must use dedicated GET READY images and must not reuse the next exercise image during the 5-second transition.');
    }
    if (data.restVisualPolicy?.remotionTimerOnly !== true) fail('GET READY scenes may receive only the Remotion timer overlay.');
    if (!fs.existsSync(path.join(paths.audioDir, 'MUSIC_BRIEF.md'))) fail('Missing 02-audio/MUSIC_BRIEF.md.');
  }

  if (fs.existsSync(paths.imagePlanPath)) {
    const plan = JSON.parse(fs.readFileSync(paths.imagePlanPath, 'utf8'));
    const planImages = Array.isArray(plan.images) ? plan.images : [];
    const expectedCount = sceneV3 ? 28 : 17;
    if (planImages.length !== expectedCount) fail(`IMAGE_PLAN must contain ${expectedCount} final scenes, found ${planImages.length}.`);
    for (let i = 0; i < planImages.length; i += 1) {
      const item = planImages[i];
      const expected = sceneV3 ? `Szene ${String(i + 1).padStart(2, '0')}.png` : `Bild ${String(i).padStart(2, '0')}.png`;
      if (item.imageFile !== expected) fail(`IMAGE_PLAN index ${i} must be ${expected}.`);
      for (const field of ['visualPurpose','topicAnchor','visualForm','prompt']) {
        const value = String(item[field] ?? '').trim();
        if (!value || /\bTBD\b/i.test(value)) fail(`IMAGE_PLAN ${expected}: unresolved ${field}.`);
      }
    }
    if (plan.generationRules?.coverCandidateCount !== 3) fail('Exactly three cover candidates are required.');
    if (sceneV3) {
      if (plan.generationRules?.primaryReference !== 'Szene 01.png') fail('Selected Szene 01 must be the primary reference.');
      if (plan.generationRules?.exerciseUiReference !== 'Szene 05.png') fail('Szene 05 must be the exercise UI reference.');
      if (plan.generationRules?.lastFinalScene !== 28) fail('V3 image plan must end at Szene 28.');
      if (plan.generationRules?.dedicatedGetReadyScenes !== true || plan.generationRules?.getReadySceneCount !== 11) fail('V3 image plan must define 11 dedicated GET READY scenes.');
      if (plan.generationRules?.stopAfterCoverCandidatesUntilExplicitUserSelection !== true) fail('Image plan must hard-stop after cover candidates until user selection.');
    }
  }

  const prompt = read(paths.promptPath);
  if (/\bTBD\b/i.test(prompt)) fail('google-flow-prompt.txt still contains TBD values.');
  if (!prompt.includes('Google Flow') && !prompt.includes('GOOGLE FLOW')) fail('Flow prompt must define Google Flow generation rules.');
  if (sceneV3) {
    for (const required of ['Generate ONLY these three cover candidates first','STOP completely','Wait until the user explicitly chooses','POSE DIVERSITY RULE','GET-READY RULE','Szene 01.png','Szene 28.png']) {
      if (!prompt.includes(required)) fail(`V3 Flow prompt missing rule: ${required}`);
    }
  }
}

if (data.singleCharacterWholeEpisode !== true || data.allowCharacterSwitch !== false || data.allowSecondVisibleCharacter !== false || data.allVideoSectionsUseCharacterImage !== true) {
  fail('Single-character continuity policy is invalid.');
}

if (data.imageGenerationRevisionRequired) {
  const revision = fs.existsSync(paths.revisionPath) ? fs.readFileSync(paths.revisionPath, 'utf8').trim().split(/\r?\n/)[0] : '';
  if (revision !== data.imageGenerationRevisionRequired) fail(`Generation revision mismatch. Required ${data.imageGenerationRevisionRequired}, found ${revision || 'MISSING'}.`);
}

if (data.voicePolicy?.openingSequenceVoiceOnly !== true) fail('Exactly one opening Voice policy must be enabled.');
if (data.voicePolicy?.exerciseVoice !== false || data.voicePolicy?.restVoice !== false || data.voicePolicy?.outroVoice !== false) fail('Voice after the opening is forbidden.');
if (data.voicePolicy?.subtitles !== false || data.voicePolicy?.voiceCaptions !== false) fail('Voice captions/subtitles must be disabled.');

if (data.exerciseVisualPolicy?.exerciseNameSource !== 'GoogleFlowImage' || data.exerciseVisualPolicy?.exerciseInstructionSource !== 'GoogleFlowImage') fail('Exercise title/instruction must come from Google Flow images.');
if (data.exerciseVisualPolicy?.remotionExerciseNameForbidden !== true || data.exerciseVisualPolicy?.remotionExerciseInstructionForbidden !== true) fail('Remotion exercise text overlays must be forbidden.');
if (data.exerciseVisualPolicy?.remotionProgressBarForbidden !== true) fail('Remotion progress bar must be forbidden.');

if (exerciseSceneSource.includes('KidProgressBar')) fail('ExerciseScene must not render a progress bar.');
if (!exerciseSceneSource.includes('CircularTimer')) fail('ExerciseScene must render the timer.');
if (!restScreenSource.includes('CircularTimer')) fail('RestScreen must render the timer.');
if (restScreenSource.includes('>REST<') || restScreenSource.includes('NEXT:')) fail('RestScreen must not add REST/NEXT text.');
if (sceneV3 && !restScreenSource.includes('mode="ready"')) fail('GET READY timer must use ready timer mode.');
if (sceneV3 && !workoutVideoSource.includes('exercise.readyImage')) fail('WorkoutVideo must use the dedicated readyImage during the 5-second transition.');
if (sceneV3 && workoutVideoSource.includes('nextExercise?.image')) fail('WorkoutVideo must not reuse the next exercise image during transitions.');
if (sceneV3 && !timerSource.includes('const size = 192')) fail('Timer must use the redesigned 192px layout.');
for (const source of imageOnlyComponents) if (source.includes('<div') || source.includes('brand.') || source.includes('interpolate(') || source.includes('spring(')) fail('Non-timed screens must be pure Flow images with no Remotion graphics/text.');
if (fs.existsSync(path.join(root, 'src', 'components', 'KidProgressBar.tsx'))) fail('KidProgressBar.tsx must not exist.');
if (data.audioPolicy?.backgroundMusicLoop === true && !workoutVideoSource.includes('loop')) fail('WorkoutVideo must loop background music.');

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const cover = scenes.find((scene) => scene.type === 'cover');
const intro = scenes.find((scene) => scene.type === 'intro');
const exercises = scenes.filter((scene) => scene.type === 'exercise');
const readyScenes = scenes.filter((scene) => scene.type === 'get-ready');
let runtime = 0;
const expectedCover = sceneV3 ? 'Szene 01.png' : 'Bild 00.png';
if (!cover || cover.image !== expectedCover || cover.inVideo !== false) fail(`Cover must be ${expectedCover} and stay outside MP4.`);
if (!intro?.voice) fail('Opening must map Voice 01.mp3 on the Intro scene.');

const readyByExercise = new Map();
if (sceneV3) {
  if (scenes.length !== 28) fail(`V3 must define exactly 28 final scenes, found ${scenes.length}.`);
  if (readyScenes.length !== 11) fail(`V3 must define 11 GET READY scenes, found ${readyScenes.length}.`);
  for (const ready of readyScenes) {
    if (Number(ready.duration) !== 5) fail(`GET READY scene ${ready.scene} must last exactly 5s.`);
    if (!ready.afterExerciseScene) fail(`GET READY scene ${ready.scene} needs afterExerciseScene.`);
    if (!ready.nextExerciseTitle) fail(`GET READY scene ${ready.scene} needs nextExerciseTitle.`);
    if (ready.afterExerciseScene) readyByExercise.set(String(ready.afterExerciseScene), ready);
  }
}

for (const scene of scenes) {
  const sceneNumber = String(scene.scene).padStart(2, '0');
  const expectedImage = sceneV3 ? `Szene ${sceneNumber}.png` : `Bild ${sceneNumber}.png`;
  if (scene.type !== 'cover') runtime += sceneV3 ? Number(scene.duration || 0) : Number(scene.duration || 0) + Number(scene.restAfter || 0);
  if (scene.image && scene.image !== expectedImage) fail(`Scene ${sceneNumber} must use ${expectedImage}.`);
  if (scene.type === 'exercise' && Number(scene.duration) !== 20) fail(`Exercise scene ${sceneNumber} must last exactly 20s.`);
  if (scene.type === 'exercise' && (!scene.title || !scene.instruction || /\bTBD\b/i.test(`${scene.title} ${scene.instruction}`))) fail(`Exercise scene ${sceneNumber} needs resolved title + instruction.`);
  if (scene.type !== 'intro' && scene.voice) fail(`Scene ${sceneNumber} must not map a separate Voice file.`);
  if (scene.image && !fs.existsSync(path.join(paths.imagesDir, scene.image))) fail(`Missing image: ${scene.image}`);
  if (activeSource && scene.type === 'exercise') {
    if (!activeSource.includes(scene.title)) fail(`active-workout.ts is stale: missing title ${scene.title}.`);
    if (!activeSource.includes(scene.image)) fail(`active-workout.ts is stale: missing image ${scene.image}.`);
    if (sceneV3) {
      const ready = readyByExercise.get(String(scene.scene));
      if (ready && !activeSource.includes(ready.image)) fail(`active-workout.ts is stale: missing ready image ${ready.image}.`);
    }
  }
}

if (exercises.length !== 12) fail(`Expected 12 exercises, found ${exercises.length}.`);
if (sceneV3) {
  for (const [index, exercise] of exercises.entries()) {
    if (index < exercises.length - 1 && !readyByExercise.get(String(exercise.scene))) fail(`Exercise ${exercise.scene} is missing its dedicated GET READY scene.`);
  }
}
if (Number(data.introDuration) !== 8 || Number(data.safetyDuration) !== 4 || Number(data.letsBeginDuration) !== 2 || Number(data.outroDuration) !== 4) fail('Opening/outro timing must remain 8/4/2/4 seconds.');
if (runtime !== 313) fail(`Runtime must be 313s / 5:13, found ${runtime}s.`);

const voiceFile = data.voicePolicy?.voiceFile || intro?.voice || 'Voice 01.mp3';
const voicePath = path.join(paths.audioDir, voiceFile);
if (!fs.existsSync(voicePath)) fail(`Missing required opening Voice: ${voiceFile}`);
else {
  const result = spawnSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',voicePath], {encoding:'utf8'});
  const duration = Number.parseFloat(result.stdout || '');
  const min = Number(pipeline.audioPolicy?.minimumVoiceSeconds ?? 13.65);
  const max = Number(pipeline.audioPolicy?.maximumVoiceSeconds ?? 14.05);
  if (Number.isFinite(duration) && (duration < min || duration > max)) fail(`Opening Voice is ${duration.toFixed(2)}s; allowed ${min.toFixed(2)}–${max.toFixed(2)}s.`);
  if (!Number.isFinite(duration)) warn('Could not determine Voice 01 duration with ffprobe.');
}

const musicFile = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';
if (data.audioPolicy?.backgroundMusicRequiredForFinal === true && !fs.existsSync(path.join(paths.audioDir, musicFile))) fail(`Missing required background music: ${musicFile}`);

warnings.forEach((message) => console.warn(`WARNING: ${message}`));
if (failures.length) {
  console.error('PRE-FLIGHT FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}
console.log(`PRE-FLIGHT PASSED — ${episodeFolder} — ${paths.structure} — ${runtime}s`);
console.log('Validated: cover selection, 28 final scenes, dedicated GET READY images, varied exercise plan, timer-only Remotion and music policy.');

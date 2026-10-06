import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {loadContract, currentContractErrors} from './contract.mjs';

const root = process.cwd();
const pointerPath = path.join(root, 'episodes', 'ACTIVE_EPISODE.json');
const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

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
const structureVersion = Number(data.structureVersion || 0);
if (structureVersion < 3) fail('Active episode must use KidMotion V3 scene structure.');
const contract = loadContract(root);
for (const error of currentContractErrors(data, contract)) fail(`CURRENT PRODUCTION CONTRACT: ${error}`);
if (!paths.voicePlanPath || !fs.existsSync(paths.voicePlanPath)) fail('Missing required 99-technik/VOICE_PLAN.json.');

const pipeline = JSON.parse(read(path.join(root, 'config', 'pipeline.json')) || '{}');
const visual = JSON.parse(read(path.join(root, 'config', 'visual-policy.json')) || '{}');
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

if (visual.status !== 'READY') fail('config/visual-policy.json must be READY.');
if (data.visualStyleId !== visual.styleId) fail('Episode visualStyleId does not match active visual policy.');
for (const requiredPath of [paths.imagePlanPath, paths.promptPath, paths.revisionPath, paths.coverSelectionPath]) {
  if (!requiredPath || !fs.existsSync(requiredPath)) fail(`Missing required production file: ${requiredPath ? path.relative(paths.episodeRoot, requiredPath) : 'unknown'}.`);
}

if (data.visibleTextPolicy?.googleFlowOwnsAllNonTimerVisibleText !== true) fail('Google Flow must own every non-timer visible text element.');
if (data.visibleTextPolicy?.remotionTimerOnly !== true) fail('Remotion overlays must be limited to the countdown timer.');
if (data.visibleTextPolicy?.progressBarForbidden !== true) fail('Progress bar must be forbidden.');

if (fs.existsSync(paths.coverSelectionPath)) {
  const selection = JSON.parse(fs.readFileSync(paths.coverSelectionPath, 'utf8'));
  if (selection.status !== 'SELECTED') fail('Cover selection is incomplete. User must choose one of the three cover candidates first.');
  if (selection.finalFile !== 'Szene 01.png') fail('Selected cover final file must be Szene 01.png.');
  if (selection.soleReferenceForLaterScenes && selection.soleReferenceForLaterScenes !== 'Szene 01.png') fail('Cover selection must declare Szene 01.png as sole later-scene reference.');
}
for (const candidate of ['Cover-Kandidat-01.png','Cover-Kandidat-02.png','Cover-Kandidat-03.png']) {
  if (fs.existsSync(path.join(paths.imagesDir, candidate))) fail(`Rejected/temporary cover candidate still exists: ${candidate}`);
}

if (fs.existsSync(paths.imagePlanPath)) {
  const plan = JSON.parse(fs.readFileSync(paths.imagePlanPath, 'utf8'));
  const rules = plan.generationRules || {};
  const images = Array.isArray(plan.images) ? plan.images : [];
  if (images.length !== 28) fail(`IMAGE_PLAN must contain 28 scenes, found ${images.length}.`);
  if (rules.selectedCoverBecomesSoleReference !== true || rules.soleReference !== 'Szene 01.png') fail('IMAGE_PLAN must use selected Szene 01.png as the sole later-scene reference.');
  if (rules.secondaryImageReferencesForbidden !== true) fail('IMAGE_PLAN must forbid secondary image references.');
  if (rules.generateEachNonCoverSceneExactlyOnce !== true || Number(rules.maximumGenerationAttemptsPerNonCoverScene) !== 1) fail('Every non-cover scene must be generated exactly once.');
  if (rules.regenerationForbidden !== true || rules.automaticAlternatesForbidden !== true) fail('Regeneration and automatic alternates must be forbidden.');
  if (rules.lastFinalScene !== 28 || rules.getReadySceneCount !== 11 || rules.dedicatedGetReadyScenes !== true) fail('V3 IMAGE_PLAN must define Szene 01–28 with 11 dedicated GET READY scenes.');
  for (let i = 0; i < images.length; i += 1) {
    const item = images[i];
    const expected = `Szene ${String(i + 1).padStart(2, '0')}.png`;
    if (item.imageFile !== expected) fail(`IMAGE_PLAN index ${i} must be ${expected}.`);
    for (const field of ['visualPurpose','topicAnchor','visualForm','prompt']) {
      const value = String(item[field] ?? '').trim();
      if (!value || /\bTBD\b/i.test(value)) fail(`IMAGE_PLAN ${expected}: unresolved ${field}.`);
    }
    if (i > 0) {
      if (item.characterReference !== 'selected Szene 01.png ONLY') fail(`${expected}: selected Szene 01.png must be the only image reference.`);
      if (item.uiReference !== null) fail(`${expected}: uiReference must be null.`);
      if (Number(item.generationAttemptsAllowed) !== 1) fail(`${expected}: generationAttemptsAllowed must be 1.`);
    }
  }
}

const prompt = read(paths.promptPath);
if (/\bTBD\b/i.test(prompt)) fail('google-flow-prompt.txt still contains TBD values.');
for (let candidate = 1; candidate <= 3; candidate += 1) {
  if (!prompt.includes(`COVER CANDIDATE 0${candidate}`)) fail(`Flow prompt missing COVER CANDIDATE 0${candidate}.`);
}
for (let scene = 2; scene <= 28; scene += 1) {
  const id = String(scene).padStart(2, '0');
  const marker = `SZENE ${id}`;
  const start = prompt.indexOf(marker);
  if (start < 0) {
    fail(`Flow prompt missing ${marker}.`);
    continue;
  }
  const next = scene < 28 ? prompt.indexOf(`SZENE ${String(scene + 1).padStart(2, '0')}`, start + marker.length) : prompt.length;
  const block = prompt.slice(start, next > start ? next : prompt.length);
  if (!block.includes('FINAL GOOGLE FLOW PROMPT:')) fail(`${marker} is missing a direct FINAL GOOGLE FLOW PROMPT.`);
  if (!block.includes('ONLY image reference')) fail(`${marker} must explicitly use Szene 01 as the ONLY image reference.`);
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
if (data.restVisualPolicy?.dedicatedGetReadyImageRequired !== true && data.restVisualPolicy?.useDedicatedGetReadyImage !== true) fail('Dedicated GET READY images are required.');
if (data.restVisualPolicy?.reuseNextExerciseImage !== false) fail('GET READY must never reuse the next exercise image.');

if (exerciseSceneSource.includes('KidProgressBar')) fail('ExerciseScene must not render a progress bar.');
if (!exerciseSceneSource.includes('CircularTimer')) fail('ExerciseScene must render the timer.');
if (!restScreenSource.includes('CircularTimer')) fail('RestScreen must render the timer.');
if (restScreenSource.includes('>REST<') || restScreenSource.includes('NEXT:')) fail('RestScreen must not add REST/NEXT text.');
if (!restScreenSource.includes('mode="ready"')) fail('GET READY timer must use ready timer mode.');
if (!workoutVideoSource.includes('exercise.readyImage')) fail('WorkoutVideo must use dedicated readyImage transitions.');
if (workoutVideoSource.includes('nextExercise?.image')) fail('WorkoutVideo must not reuse next exercise images during transitions.');
if (!timerSource.includes('const size = 192')) fail('Timer must use the 192px layout.');
for (const source of imageOnlyComponents) if (source.includes('<div') || source.includes('brand.') || source.includes('interpolate(') || source.includes('spring(')) fail('Non-timed screens must be pure Flow images with no Remotion graphics/text.');
if (fs.existsSync(path.join(root, 'src', 'components', 'KidProgressBar.tsx'))) fail('KidProgressBar.tsx must not exist.');
if (data.audioPolicy?.backgroundMusicLoop === true && !workoutVideoSource.includes('loop')) fail('WorkoutVideo must loop background music.');

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const cover = scenes.find((scene) => scene.type === 'cover');
const intro = scenes.find((scene) => scene.type === 'intro');
const exercises = scenes.filter((scene) => scene.type === 'exercise');
const readyScenes = scenes.filter((scene) => scene.type === 'get-ready');
if (scenes.length !== 28) fail(`V3 must define exactly 28 scenes, found ${scenes.length}.`);
if (!cover || cover.image !== 'Szene 01.png' || cover.inVideo !== false) fail('Szene 01 must be the cover outside the MP4.');
if (!intro?.voice) fail('Opening must map Voice 01.mp3 on the Intro scene.');
if (exercises.length !== 12) fail(`Expected 12 exercises, found ${exercises.length}.`);
if (readyScenes.length !== 11) fail(`Expected 11 GET READY scenes, found ${readyScenes.length}.`);

let runtime = 0;
const readyByExercise = new Map();
for (const ready of readyScenes) {
  if (Number(ready.duration) !== 5) fail(`GET READY scene ${ready.scene} must last exactly 5s.`);
  if (!ready.afterExerciseScene || !ready.nextExerciseTitle) fail(`GET READY scene ${ready.scene} needs afterExerciseScene + nextExerciseTitle.`);
  if (ready.afterExerciseScene) readyByExercise.set(String(ready.afterExerciseScene), ready);
}

for (let i = 0; i < scenes.length; i += 1) {
  const scene = scenes[i];
  const expectedImage = `Szene ${String(i + 1).padStart(2, '0')}.png`;
  if (scene.image !== expectedImage) fail(`Scene ${i + 1} must use ${expectedImage}.`);
  if (scene.type !== 'cover') runtime += Number(scene.duration || 0);
  if (scene.type === 'exercise' && Number(scene.duration) !== 20) fail(`Exercise scene ${scene.scene} must last exactly 20s.`);
  if (scene.type === 'exercise' && (!scene.title || !scene.instruction || /\bTBD\b/i.test(`${scene.title} ${scene.instruction}`))) fail(`Exercise scene ${scene.scene} needs resolved title + instruction.`);
  if (scene.type !== 'intro' && scene.voice) fail(`Scene ${scene.scene} must not map a separate Voice file.`);
  if (!fs.existsSync(path.join(paths.imagesDir, scene.image))) fail(`Missing image: ${scene.image}`);
  if (activeSource && scene.type === 'exercise') {
    if (!activeSource.includes(scene.title)) fail(`active-workout.ts is stale: missing title ${scene.title}.`);
    if (!activeSource.includes(scene.image)) fail(`active-workout.ts is stale: missing image ${scene.image}.`);
    const ready = readyByExercise.get(String(scene.scene));
    if (ready && !activeSource.includes(ready.image)) fail(`active-workout.ts is stale: missing ready image ${ready.image}.`);
  }
}

for (const [index, exercise] of exercises.entries()) {
  if (index < exercises.length - 1 && !readyByExercise.get(String(exercise.scene))) fail(`Exercise ${exercise.scene} is missing its dedicated GET READY scene.`);
}
if (Number(data.introDuration) !== 8 || Number(data.safetyDuration) !== 4 || Number(data.letsBeginDuration) !== 2 || Number(data.outroDuration) !== 4) fail('Opening/outro timing must remain 8/4/2/4 seconds unless the project timing policy is deliberately revised.');
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
console.log(`PRE-FLIGHT PASSED — ${episodeFolder} — ${runtime}s`);
console.log('Validated: one-time cover choice, sole Szene 01 reference, one generation per later scene, direct Flow prompts, exact 28-scene order, dedicated GET READY images, timer-only Remotion and audio policy.');

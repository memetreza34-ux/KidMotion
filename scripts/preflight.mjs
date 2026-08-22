import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root = process.cwd();
const pointerCandidates = [
  path.join(root, 'episodes', 'ACTIVE_EPISODE.json'),
  path.join(root, 'content', 'ACTIVE_EPISODE.json'),
];
const pointerPath = pointerCandidates.find((candidate) => fs.existsSync(candidate));

if (!pointerPath) {
  console.error('PRE-FLIGHT FAILED: no ACTIVE_EPISODE pointer found. Run kidmotion:activate first.');
  process.exit(1);
}

const pointer = JSON.parse(fs.readFileSync(pointerPath, 'utf8'));
const episodeFolder = pointer.episodeFolder;
const canonicalEpisodeRoot = path.join(root, 'episodes', episodeFolder);
const canonicalDataPath = path.join(canonicalEpisodeRoot, '04-data', 'data.json');
const legacyDataPath = path.join(root, 'content', 'episodes', episodeFolder, 'data.json');
const usingCanonical = fs.existsSync(canonicalDataPath);
const dataPath = usingCanonical ? canonicalDataPath : legacyDataPath;

if (!fs.existsSync(dataPath)) {
  console.error(`PRE-FLIGHT FAILED: missing episode data for ${episodeFolder}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const imageRoot = usingCanonical
  ? path.join(canonicalEpisodeRoot, '03-bilder')
  : path.join(root, 'public', data.assetFolder || '00-bildprompts/00-ALLE-BILDER-HIER-REIN');
const audioRoot = usingCanonical
  ? path.join(canonicalEpisodeRoot, '02-audio')
  : path.join(root, 'public', data.audioFolder || '00-audio');
const activeWorkoutPath = path.join(root, 'src', 'data', 'active-workout.ts');
const workoutVideoPath = path.join(root, 'src', 'WorkoutVideo.tsx');
const exerciseScenePath = path.join(root, 'src', 'components', 'ExerciseScene.tsx');
const restScreenPath = path.join(root, 'src', 'components', 'RestScreen.tsx');
const safetyPath = path.join(root, 'src', 'components', 'SafetyDisclaimerScreen.tsx');
const outroPath = path.join(root, 'src', 'components', 'GreatJobScreen.tsx');
const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
let runtime = 0;

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '');
const activeSource = read(activeWorkoutPath);
const workoutVideoSource = read(workoutVideoPath);
const exerciseSceneSource = read(exerciseScenePath);
const restScreenSource = read(restScreenPath);
const safetySource = read(safetyPath);
const outroSource = read(outroPath);

if (!activeSource) fail('src/data/active-workout.ts is missing. Run kidmotion:activate first.');
if (activeSource && !activeSource.includes(episodeFolder)) fail(`active-workout.ts is not wired to ${episodeFolder}. Run kidmotion:activate again.`);

if (data.singleCharacterWholeEpisode !== true) fail('singleCharacterWholeEpisode must be true.');
if (data.allowCharacterSwitch !== false) fail('allowCharacterSwitch must be false.');
if (data.allowSecondVisibleCharacter !== false) fail('allowSecondVisibleCharacter must be false.');
if (data.allVideoSectionsUseCharacterImage !== true) fail('allVideoSectionsUseCharacterImage must be true.');

if (data.imageGenerationRevisionRequired) {
  const revisionPath = path.join(imageRoot, 'GENERATION-REVISION.txt');
  const currentRevision = fs.existsSync(revisionPath) ? fs.readFileSync(revisionPath, 'utf8').trim().split(/\r?\n/)[0] : '';
  if (currentRevision !== data.imageGenerationRevisionRequired) {
    fail(`Image generation revision is not approved. Required ${data.imageGenerationRevisionRequired}, found ${currentRevision || 'MISSING'}. Regenerate/approve the images listed in regenerationRequired before rendering.`);
  }
}

const openingVoicePolicyOk =
  data.voicePolicy?.openingSequenceVoiceOnly === true ||
  data.voicePolicy?.voiceOnlyInIntro === true;
if (!openingVoicePolicyOk) fail('Exactly one opening Voice policy must be enabled.');
if (data.voicePolicy?.exerciseVoice !== false) fail('Exercise Voice must be disabled.');
if (data.voicePolicy?.restVoice !== false) fail('Rest Voice must be disabled.');
if (data.voicePolicy?.outroVoice !== false) fail('Outro Voice must be disabled.');
if (data.voicePolicy?.subtitles !== false) fail('Voice subtitles must be disabled.');
if (data.voicePolicy?.voiceCaptions !== false) fail('Voice captions must be disabled.');

if (data.exerciseVisualPolicy?.exerciseNameSource !== 'GoogleFlowImage') fail('Exercise names must come from Google Flow images.');
if (data.exerciseVisualPolicy?.exerciseInstructionSource !== 'GoogleFlowImage') fail('Exercise instructions must come from Google Flow images.');
if (data.exerciseVisualPolicy?.remotionExerciseNameForbidden !== true) fail('Remotion exercise-name overlays must be forbidden.');
if (data.exerciseVisualPolicy?.remotionExerciseInstructionForbidden !== true) fail('Remotion exercise-instruction overlays must be forbidden.');
if (data.restVisualPolicy?.blankScreenForbidden !== true) fail('Blank Rest screens are forbidden.');
if (data.restVisualPolicy?.reuseNextExerciseImage !== true) fail('Rest must reuse the next exercise image.');
if (data.restVisualPolicy?.remotionNextPoseNameForbidden !== true) fail('Remotion must not add NEXT pose names during Rest.');

if (data.transitionPolicy?.blankFramesForbidden === true) {
  if (exerciseSceneSource.includes('opacity: fadeIn') || exerciseSceneSource.includes('scale(${scale})')) {
    fail('ExerciseScene still contains full-image fade/zoom behavior that can create flashes/crop baked text.');
  }
  if (restScreenSource.includes('opacity: fadeIn') || restScreenSource.includes('scale(${scale})')) {
    fail('RestScreen still contains full-image fade/zoom behavior that can create flashes/crop baked text.');
  }
  if (safetySource.includes('opacity: fadeIn')) fail('Safety screen still fades the entire scene from zero opacity.');
  if (outroSource.includes('opacity: fadeIn')) fail('Outro still fades the entire scene from zero opacity.');
}

if (data.audioPolicy?.backgroundMusicLoop === true && !workoutVideoSource.includes('loop')) {
  fail('WorkoutVideo must loop background music.');
}

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const cover = scenes.find((scene) => scene.type === 'cover');
const intro = scenes.find((scene) => scene.type === 'intro');
const exercises = scenes.filter((scene) => scene.type === 'exercise');

if (!cover || cover.image !== 'Bild 00.png' || cover.inVideo !== false) fail('Cover must be Bild 00.png and stay outside the MP4.');
if (!intro?.voice) fail('Opening must map Voice 01.mp3 on Scene 01.');

for (const scene of scenes) {
  const sceneNumber = String(scene.scene).padStart(2, '0');
  const expectedImage = `Bild ${sceneNumber}.png`;

  if (scene.type !== 'cover') runtime += Number(scene.duration || 0) + Number(scene.restAfter || 0);
  if (scene.type !== 'cover' && !scene.image) fail(`Scene ${sceneNumber} needs its character image.`);
  if (scene.image && scene.image !== expectedImage) fail(`Scene ${sceneNumber} must use ${expectedImage}, found ${scene.image}.`);
  if (scene.type === 'exercise' && Number(scene.duration) !== 20) fail(`Scene ${sceneNumber} must last exactly 20s.`);
  if (scene.type === 'exercise' && (!scene.title || !scene.instruction)) fail(`Scene ${sceneNumber} needs title + instruction for Google Flow.`);
  if (scene.type !== 'intro' && scene.voice) fail(`Scene ${sceneNumber} must not map a separate Voice file.`);

  if (scene.image && !fs.existsSync(path.join(imageRoot, scene.image))) fail(`Missing image: ${scene.image}`);

  if (activeSource && scene.type === 'exercise') {
    if (!activeSource.includes(scene.title)) fail(`active-workout.ts is stale: missing title ${scene.title}.`);
    if (!activeSource.includes(scene.image)) fail(`active-workout.ts is stale: missing image ${scene.image}.`);
  }
}

if (exercises.length !== 12) fail(`Expected 12 exercises, found ${exercises.length}.`);
if (Number(data.introDuration) !== 8) fail(`Intro must be 8s, found ${data.introDuration}s.`);
if (Number(data.safetyDuration) !== 4) fail(`Safety must be 4s, found ${data.safetyDuration}s.`);
if (Number(data.letsBeginDuration) !== 2) fail(`LET'S BEGIN must be 2s, found ${data.letsBeginDuration}s.`);
if (Number(data.outroDuration) !== 4) fail(`Outro must be 4s, found ${data.outroDuration}s.`);
if (runtime !== 313) fail(`Runtime must be 313s / 5:13, found ${runtime}s.`);

const voiceFile = data.voicePolicy?.voiceFile || intro?.voice || 'Voice 01.mp3';
const voicePath = path.join(audioRoot, voiceFile);
if (!fs.existsSync(voicePath)) {
  fail(`Missing required opening Voice: ${voiceFile}`);
} else {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', voicePath], {encoding: 'utf8'});
  const duration = Number.parseFloat(result.stdout || '');
  if (Number.isFinite(duration)) {
    const openingDuration = Number(data.openingDuration || (Number(data.introDuration) + Number(data.safetyDuration) + Number(data.letsBeginDuration)));
    const minimumContinuousCoverage = Math.max(0, openingDuration - 0.35);
    if (duration > openingDuration + 0.05) fail(`Opening Voice is ${duration.toFixed(2)}s and runs past the ${openingDuration}s opening.`);
    if (duration < minimumContinuousCoverage) {
      fail(`Opening Voice is too short (${duration.toFixed(2)}s). It must cover the opening from frame 0 through Safety + LET'S BEGIN and reach at least ${minimumContinuousCoverage.toFixed(2)}s of the ${openingDuration.toFixed(2)}s opening. Music-only dead air before Exercise 1 is forbidden.`);
    }
  } else {
    warn('Could not determine Voice 01 duration with ffprobe.');
  }
}

const musicFile = data.audioPolicy?.backgroundMusicFile || 'bg-music.mp3';
const musicPath = path.join(audioRoot, musicFile);
if (data.audioPolicy?.backgroundMusicRequiredForFinal === true && !fs.existsSync(musicPath)) {
  fail(`Missing required background music: ${musicFile}`);
}
if (data.audioPolicy?.backgroundMusicRequiredForFinal === true && activeSource && !activeSource.includes('bgMusic')) {
  fail('active-workout.ts does not map bgMusic. Run kidmotion:activate again.');
}

if (data.id === 'KM-002') {
  for (let number = 0; number <= 16; number += 1) {
    const filename = `Bild ${String(number).padStart(2, '0')}.png`;
    if (!scenes.some((scene) => scene.image === filename)) fail(`KM-002 is missing image mapping: ${filename}`);
  }
  if (data.exerciseVisualPolicy?.exerciseUiStyleReference !== 'Bild 04.png') fail('KM-002 must lock exercise UI style to Bild 04.png.');
  if (data.restVisualPolicy?.restUiPosition !== 'top-left') fail('KM-002 Rest UI must be top-left.');
  if (data.restVisualPolicy?.topRightRestCountdownForbidden !== true) fail('KM-002 must forbid top-right Rest countdown.');
  if (data.nonExerciseImagePolicy?.outroGeneratedTextAllowed !== false) fail('KM-002 Bild 16 must be generated text-free.');
}

warnings.forEach((message) => console.warn(`WARNING: ${message}`));

if (failures.length) {
  console.error('PRE-FLIGHT FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`PRE-FLIGHT PASSED — ${episodeFolder} — ${runtime}s`);
console.log("Opening Voice: frame 0 through Safety + LET'S BEGIN, near-full opening coverage, and must end before Exercise 1.");
console.log('Music: required/looped for final production when episode policy requires it.');
console.log('Visual: approved image-generation revision required; no blank fades; exercise/rest images static; Google Flow owns title/instruction.');

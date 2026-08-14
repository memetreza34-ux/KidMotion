import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pointerPath = path.join(root, 'content', 'ACTIVE_EPISODE.json');
if (!fs.existsSync(pointerPath)) {
  console.error('PRE-FLIGHT FAILED: content/ACTIVE_EPISODE.json is missing.');
  process.exit(1);
}

const pointer = JSON.parse(fs.readFileSync(pointerPath, 'utf8'));
const episodeFolder = pointer.episodeFolder;
const dataPath = path.join(root, 'content', 'episodes', episodeFolder, 'data.json');
if (!fs.existsSync(dataPath)) {
  console.error(`PRE-FLIGHT FAILED: missing ${dataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const imageRoot = path.join(root, 'public', data.assetFolder);
const audioRoot = path.join(root, 'public', data.audioFolder);
const activeWorkoutPath = path.join(root, 'src', 'data', 'active-workout.ts');
const failures = [];
const fail = (message) => failures.push(message);
let runtime = 0;

if (!fs.existsSync(activeWorkoutPath)) fail('src/data/active-workout.ts is missing. Run kidmotion:activate first.');
const activeSource = fs.existsSync(activeWorkoutPath) ? fs.readFileSync(activeWorkoutPath, 'utf8') : '';
if (activeSource && !activeSource.includes(episodeFolder)) fail(`active-workout.ts is not wired to ${episodeFolder}. Run kidmotion:activate first.`);

if (data.singleCharacterWholeEpisode !== true) fail('singleCharacterWholeEpisode must be true.');
if (data.allowCharacterSwitch !== false) fail('allowCharacterSwitch must be false.');
if (data.allowSecondVisibleCharacter !== false) fail('allowSecondVisibleCharacter must be false.');
if (data.allVideoSectionsUseCharacterImage !== true) fail('allVideoSectionsUseCharacterImage must be true.');
if (data.voicePolicy?.voiceOnlyInIntro !== true) fail('Current standard requires Voice only in Intro.');
if (data.voicePolicy?.safetyVoice !== false) fail('Safety Voice must be disabled.');
if (data.voicePolicy?.letsBeginVoice !== false) fail('LET\'S BEGIN Voice must be disabled.');
if (data.voicePolicy?.exerciseVoice !== false) fail('Exercise Voice must be disabled.');
if (data.voicePolicy?.restVoice !== false) fail('Rest Voice must be disabled.');
if (data.voicePolicy?.outroVoice !== false) fail('Outro Voice must be disabled.');
if (data.voicePolicy?.subtitles !== false) fail('Voice subtitles must be disabled.');
if (data.voicePolicy?.voiceCaptions !== false) fail('Voice captions must be disabled.');
if (data.remotion?.subtitles !== false) fail('Remotion subtitles must be disabled.');
if (data.remotion?.voiceCaptions !== false) fail('Remotion voice captions must be disabled.');
if (data.remotion?.transcriptBars !== false) fail('Transcript bars must be disabled.');
if (data.remotion?.introTextMustNotTrackNarration !== true) fail('Intro must use fixed branded information, not narration-tracking text.');

if (data.exerciseVisualPolicy?.exerciseNameSource !== 'GoogleFlowImage') fail('Exercise names must come from Google Flow images.');
if (data.exerciseVisualPolicy?.exerciseInstructionSource !== 'GoogleFlowImage') fail('Exercise instructions must come from Google Flow images.');
if (data.exerciseVisualPolicy?.instructionBubbleSource !== 'GoogleFlowImage') fail('Exercise instruction cloud must come from Google Flow images.');
if (data.exerciseVisualPolicy?.remotionExerciseNameForbidden !== true) fail('Remotion exercise-name overlays must be forbidden.');
if (data.exerciseVisualPolicy?.remotionExerciseInstructionForbidden !== true) fail('Remotion exercise-instruction overlays must be forbidden.');
if (data.remotion?.exerciseTextOverlay !== false) fail('Remotion exerciseTextOverlay must be false.');

if (data.restVisualPolicy?.blankScreenForbidden !== true) fail('Blank Rest screens are forbidden.');
if (data.restVisualPolicy?.reuseNextExerciseImage !== true) fail('Rest must reuse the next exercise image.');
if (data.restVisualPolicy?.remotionNextPoseNameForbidden !== true) fail('Remotion must not add NEXT pose names during Rest.');

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const cover = scenes.find((scene) => scene.type === 'cover');
const intro = scenes.find((scene) => scene.type === 'intro');
if (!cover || cover.image !== 'Bild 00.png' || cover.inVideo !== false) fail('Cover must be Bild 00.png and stay outside the MP4.');
if (!intro?.voice) console.warn('WARNING: Intro Voice 01 is not mapped; visual QA may still continue silently.');

for (const scene of scenes) {
  const sceneNumber = String(scene.scene).padStart(2, '0');
  const expectedImage = `Bild ${sceneNumber}.png`;

  if (scene.type !== 'cover') runtime += Number(scene.duration || 0) + Number(scene.restAfter || 0);
  if (scene.type !== 'cover' && !scene.image) fail(`Scene ${sceneNumber} needs its character image.`);
  if (scene.image && scene.image !== expectedImage) fail(`Scene ${sceneNumber} must use ${expectedImage}, found ${scene.image}.`);
  if (scene.type === 'exercise' && Number(scene.duration) !== 20) fail(`Scene ${sceneNumber} must last exactly 20s.`);
  if (scene.type === 'exercise' && (!scene.title || !scene.instruction)) fail(`Scene ${sceneNumber} needs title + instruction for Google Flow.`);

  if (scene.type !== 'intro' && scene.voice) fail(`Scene ${sceneNumber} must be silent and must not map ${scene.voice}.`);

  if (scene.image && !fs.existsSync(path.join(imageRoot, scene.image))) fail(`Missing image: ${scene.image}`);

  if (scene.type === 'intro' && scene.voice && (!fs.existsSync(audioRoot) || !fs.existsSync(path.join(audioRoot, scene.voice)))) {
    console.warn(`WARNING: missing Intro voice for visual-QA phase: ${scene.voice}`);
  }

  if (activeSource && scene.type === 'exercise') {
    if (!activeSource.includes(scene.title)) fail(`active-workout.ts is stale: missing title ${scene.title}. Run kidmotion:activate first.`);
    if (!activeSource.includes(scene.image)) fail(`active-workout.ts is stale: missing image ${scene.image}. Run kidmotion:activate first.`);
  }
}

if (!scenes.find((scene) => scene.scene === '02' && scene.image === 'Bild 02.png')) fail('Safety must use Bild 02.png with the episode character.');
if (activeSource && data.introTitle && !activeSource.includes(data.introTitle)) fail('active-workout.ts is stale: Intro title does not match data.json. Run kidmotion:activate first.');

if (data.id === 'KM-001') {
  for (let number = 0; number <= 16; number += 1) {
    const filename = `Bild ${String(number).padStart(2, '0')}.png`;
    if (!scenes.some((scene) => scene.image === filename)) fail(`KM-001 is missing image mapping: ${filename}`);
  }
  if (Number(data.introDuration) !== 8) fail(`KM-001 Intro must be 8s, found ${data.introDuration}s.`);
  if (Number(data.safetyDuration) !== 4) fail(`KM-001 Safety must be 4s, found ${data.safetyDuration}s.`);
  if (Number(data.letsBeginDuration) !== 2) fail(`KM-001 LET'S BEGIN must be 2s, found ${data.letsBeginDuration}s.`);
  if (Number(data.outroDuration) !== 4) fail(`KM-001 Outro must be 4s, found ${data.outroDuration}s.`);
  if (runtime !== 313) fail(`KM-001 runtime must be 313s / 5:13, found ${runtime}s.`);
}

if (failures.length) {
  console.error('PRE-FLIGHT FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`PRE-FLIGHT PASSED — ${episodeFolder} — ${runtime}s`);
console.log('Audio contract: Intro Voice only; every later scene is silent.');
console.log('Visual contract: Google Flow owns exercise title/instruction; Remotion owns timer/progress only.');

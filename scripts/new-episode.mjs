import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const item = args.find((arg) => arg.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : fallback;
};

const topic = getArg('topic');
const requestedId = getArg('id');
const character = getArg('character', 'boy').toLowerCase() === 'girl' ? 'girl' : 'boy';
const requestedScenes = Number(getArg('scenes', '12')) || 12;

if (!topic) {
  console.error('Missing --topic="..."');
  process.exit(1);
}
if (requestedScenes !== 12) {
  console.error('KidMotion V2 longform requires exactly 12 exercises.');
  process.exit(1);
}

const root = process.cwd();
const pipeline = JSON.parse(fs.readFileSync(path.join(root, 'config', 'pipeline.json'), 'utf8'));
const visual = JSON.parse(fs.readFileSync(path.join(root, 'config', 'visual-policy.json'), 'utf8'));
if (visual.status !== 'READY' || !visual.styleId || visual.styleId === 'UNSET') {
  console.error('KidMotion V2 requires config/visual-policy.json status READY and a real styleId.');
  process.exit(1);
}

const pad = (n) => String(n).padStart(2, '0');
const slugify = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 64);

const episodesRoot = path.join(root, 'episodes');
fs.mkdirSync(episodesRoot, {recursive: true});
const existingIds = fs.readdirSync(episodesRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && /^KM-\d{3}-/.test(entry.name))
  .map((entry) => Number(entry.name.slice(3, 6)))
  .filter(Number.isFinite);
const autoNumber = String((existingIds.length ? Math.max(...existingIds) : 0) + 1).padStart(3, '0');
const episodeId = /^KM-\d{3}$/.test(requestedId) ? requestedId : `KM-${autoNumber}`;
const slug = slugify(topic) || `episode-${episodeId.slice(3)}`;
const episodeFolder = `${episodeId}-${slug}`;
const episodeRoot = path.join(episodesRoot, episodeFolder);
const revision = `${episodeId.replace('-', '')}-R1`;

if (fs.existsSync(episodeRoot)) {
  console.error(`Episode already exists: ${episodeRoot}`);
  process.exit(1);
}

const write = (relativePath, content) => {
  const target = path.join(episodeRoot, relativePath);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, content, 'utf8');
};
const mkdir = (relativePath) => fs.mkdirSync(path.join(episodeRoot, relativePath), {recursive: true});
for (const dir of ['00-bildprompts/images', '01-voice-script', '02-audio', '03-export', '99-technik']) mkdir(dir);

const scenes = [
  {scene:'00', type:'cover', image:'Bild 00.png', duration:0, character, inVideo:false},
  {scene:'01', type:'intro', image:'Bild 01.png', voice:'Voice 01.mp3', duration:8, character},
  {scene:'02', type:'safety', image:'Bild 02.png', duration:4, character},
  {scene:'03', type:'lets-begin', image:'Bild 03.png', duration:2, character},
];
for (let i = 0; i < 12; i += 1) {
  const sceneNumber = pad(4 + i);
  scenes.push({
    scene: sceneNumber,
    type: 'exercise',
    title: 'TBD',
    instruction: 'TBD',
    image: `Bild ${sceneNumber}.png`,
    duration: 20,
    restAfter: i === 11 ? 0 : 5,
    character,
    ballCount: null,
  });
}
scenes.push({scene:'16', type:'outro', image:'Bild 16.png', duration:4, character, generatedTextAllowed:false});

const data = {
  schemaVersion: 2,
  structureVersion: 2,
  id: episodeId,
  slug,
  topic,
  status: 'planned',
  visualPolicyFile: 'config/visual-policy.json',
  visualStyleId: visual.styleId,
  imagePlanFile: '99-technik/IMAGE_PLAN.json',
  flowPromptFile: '00-bildprompts/google-flow-prompt.txt',
  format: 'youtube-longform',
  aspectRatio: pipeline.aspectRatio,
  fps: pipeline.fps,
  width: pipeline.resolution.width,
  height: pipeline.resolution.height,
  mainCharacter: character,
  singleCharacterWholeEpisode: true,
  allowCharacterSwitch: false,
  allowSecondVisibleCharacter: false,
  allVideoSectionsUseCharacterImage: true,
  staticPoseOnly: true,
  singleFrameClarityRequired: true,
  silhouetteTestRequired: true,
  maxGoogleFlowAttemptsBeforePoseReplacement: 2,
  characterReference: `approved ${episodeId} Bild 01 reference`,
  exerciseUiReference: `approved ${episodeId} Bild 04 reference for title/cloud style only`,
  outfitLockedForEpisode: true,
  worldLockedForEpisode: true,
  imageGenerationRevisionRequired: revision,
  introDuration: 8,
  introTitle: 'TBD',
  introSubtitle: '12 POSES • 20 SEC EACH',
  introBadge: 'KIDMOTION',
  introExtraInfo: ['FOLLOW ALONG'],
  introVoiceText: 'TBD — one continuous opening paragraph designed to cover approximately 13.65–14.00 seconds and end before Exercise 1.',
  voiceScriptFormat: 'one continuous copy-ready paragraph',
  safetyDuration: 4,
  letsBeginDuration: 2,
  outroDuration: 4,
  exerciseDuration: 20,
  defaultRestAfter: 5,
  openingDuration: 14,
  voicePolicy: {
    openingSequenceVoiceOnly: true,
    voiceStartsAtIntro: true,
    voiceMayContinueAcrossSafety: true,
    voiceMayContinueAcrossLetsBegin: true,
    voiceMustEndBeforeFirstExercise: true,
    exerciseVoice: false,
    restVoice: false,
    outroVoice: false,
    subtitles: false,
    voiceCaptions: false,
    openingVoiceTargetSeconds: '13.65-14.00',
    voiceFile: 'Voice 01.mp3'
  },
  audioPolicy: {
    backgroundMusicRequiredForFinal: true,
    backgroundMusicFile: 'bg-music.mp3',
    backgroundMusicLoop: true,
    backgroundMusicLowDuringOpening: true,
    backgroundMusicContinuesThroughWorkout: true,
    noSpokenVoiceAfterOpening: true
  },
  transitionPolicy: {
    blankFramesForbidden: true,
    blackFlashesForbidden: true,
    whiteFlashesForbidden: true,
    fullSceneFadeFromZeroForbidden: true,
    hardCutWithVisibleImageFromFirstFrame: true
  },
  exerciseVisualPolicy: {
    exerciseNameSource: 'GoogleFlowImage',
    exerciseInstructionSource: 'GoogleFlowImage',
    instructionBubbleSource: 'GoogleFlowImage',
    exerciseNamePosition: 'bottom-left-safe',
    instructionPosition: 'top-right-safe',
    exerciseUiStyleReference: 'Bild 04.png',
    sameUiStyleRequiredAcrossAllExercises: true,
    thoughtBubbleDotsForbidden: true,
    timerSafeZoneTopLeftPixels: 220,
    bottomProgressSafeZonePixels: 90,
    remotionExerciseNameForbidden: true,
    remotionExerciseInstructionForbidden: true,
    googleFlowTimerForbidden: true,
    googleFlowProgressBarForbidden: true,
    remotionKenBurnsOnExerciseForbidden: true,
    remotionExerciseImageFadeFromZeroForbidden: true
  },
  restVisualPolicy: {
    blankScreenForbidden: true,
    reuseNextExerciseImage: true,
    characterMustRemainVisible: true,
    remotionRestTextAllowed: ['REST', 'countdown'],
    remotionNextPoseNameForbidden: true,
    restUiPosition: 'top-left',
    topRightRestCountdownForbidden: true,
    remotionKenBurnsOnRestForbidden: true,
    remotionRestImageFadeFromZeroForbidden: true
  },
  nonExerciseImagePolicy: {
    introGeneratedTextAllowed: false,
    safetyGeneratedTextAllowed: false,
    letsBeginGeneratedTextAllowed: false,
    outroGeneratedTextAllowed: false,
    remotionOwnsIntroGraphic: true,
    remotionOwnsSafetyGraphic: true,
    remotionOwnsLetsBeginGraphic: true,
    remotionOwnsOutroGraphic: true
  },
  scenes,
  runtimeSeconds: 313
};

const imagePlan = {
  schemaVersion: 2,
  episodeFolder,
  revision,
  visualStyleId: visual.styleId,
  generationRules: {
    coverCandidateCount: 3,
    nonCoverAutomaticAlternates: false,
    maxConcurrentGenerations: 5,
    primaryReference: 'Bild 01.png',
    exerciseUiReference: 'Bild 04.png',
    finalDirectory: '00-bildprompts/images'
  },
  images: scenes.map((scene) => ({
    imageNumber: Number(scene.scene),
    imageFile: scene.image,
    sceneRole: scene.type,
    visualPurpose: scene.type === 'cover' ? 'Create the strongest mobile-readable YouTube thumbnail for this workout.' : 'TBD',
    topicAnchor: topic,
    visualForm: scene.type === 'exercise' ? 'single clear static full-body pose' : 'single clean premium 3D scene',
    characterReference: scene.scene === '00' || scene.scene === '01' ? 'KidMotion master identity' : 'approved Bild 01.png',
    uiReference: scene.type === 'exercise' && Number(scene.scene) > 4 ? 'approved Bild 04.png' : null,
    propCount: scene.type === 'exercise' ? scene.ballCount : null,
    generatedText: scene.type === 'exercise' ? {title: scene.title, instruction: scene.instruction} : scene.type === 'cover' ? 'TBD thumbnail text' : null,
    safeZones: scene.type === 'exercise' ? ['top-left 220x220 timer zone clear', 'lowest ~90px progress zone clear'] : [],
    acceptanceCriteria: [
      'same recurring character where applicable',
      'correct anatomy',
      'no extra people',
      'important limbs fully visible',
      'correct prop count',
      '16:9 composition'
    ],
    prompt: 'TBD'
  }))
};

const flowBlocks = imagePlan.images.map((item) => {
  const n = pad(item.imageNumber);
  return `Bild ${n}\nScene Role: ${item.sceneRole}\nVisual Purpose: ${item.visualPurpose}\nTopic Anchor: ${item.topicAnchor}\nVisual Form: ${item.visualForm}\nCharacter Reference: ${item.characterReference}\nUI Reference: ${item.uiReference || 'none'}\nProp Count: ${item.propCount === null ? 'TBD / not applicable' : item.propCount}\nGenerated Text: ${typeof item.generatedText === 'string' ? item.generatedText : item.generatedText ? JSON.stringify(item.generatedText) : 'ZERO generated text'}\nSafe Zones: ${item.safeZones.length ? item.safeZones.join('; ') : 'standard composition only'}\nAcceptance: ${item.acceptanceCriteria.join('; ')}\nPrompt: ${item.prompt}\nFinal file after acceptance: Bild ${n}.png`;
});

const flowPrompt = `VISUAL_POLICY_FILE: config/visual-policy.json\nACTIVE_STYLE_ID: ${visual.styleId}\n\nKIDMOTION GOOGLE FLOW MASTER PROMPT — ${episodeId} — ${topic}\n\nGOAL\nGenerate the complete final KidMotion image set Bild 00 through Bild 16. The final accepted images live flat in 00-bildprompts/images/.\n\nHARD GENERATION WORKFLOW\n1. Read the complete image block before generating.\n2. Generate only the image(s) requested by that block.\n3. Inspect the result against Visual Purpose, references, prop count, safe zones and acceptance criteria.\n4. Rename the accepted result immediately to the exact final filename.\n5. Only then continue.\n\nCOVER RULE\n- Bild 00 is the separate YouTube cover and is NOT part of the MP4.\n- Generate exactly THREE temporary Bild 00 candidates.\n- Select exactly ONE winner and rename only that winner Bild 00.png.\n- Discard the other candidates.\n\nNON-COVER RULE\n- Bild 01 through Bild 16 have one accepted final version each.\n- Do not create automatic alternate versions.\n- Regenerate only after an explicit rejection against the acceptance criteria.\n- Maximum five active generations at once, but reference dependencies still apply.\n\nREFERENCE WORKFLOW\n- Generate and approve Bild 01 first. It becomes the PRIMARY character/world reference for Bild 02 through Bild 16.\n- Generate and approve Bild 04 before Bild 05 through Bild 15. It becomes the SECONDARY exercise title/cloud UI reference.\n- Never copy the pose or wording from Bild 04 into later exercises; copy only its UI system.\n\nEXERCISE RULE\nEvery exercise must pass the one-still clarity test before text is considered. If a pose remains unclear after two serious attempts, replace the pose instead of adding explanatory clutter.\n\nTEXT OWNERSHIP\n- Bild 01, Bild 02, Bild 03 and Bild 16: ZERO generated text.\n- Bild 04 through Bild 15: Google Flow creates exactly one bottom-left exercise title and one top-right instruction cloud.\n- Never generate timer, progress, REST UI, subtitles or transcript bars.\n\nFINAL FOLDER\nOnly final accepted Bild 00.png through Bild 16.png belong in 00-bildprompts/images/.\n\nIMAGE PLAN\n\n${flowBlocks.join('\n\n---\n\n')}\n\nFINAL CHECK\n- visual policy loaded\n- Bild 00 has one winner from three candidates\n- Bild 01 approved before dependent images\n- Bild 04 approved before later exercise images\n- one accepted final image per number\n- no missing numbers\n- no extra people\n- correct prop count\n- safe zones clear\n- final files flat in 00-bildprompts/images/\n`;

write('99-technik/episode.json', `${JSON.stringify(data, null, 2)}\n`);
write('99-technik/IMAGE_PLAN.json', `${JSON.stringify(imagePlan, null, 2)}\n`);
write('99-technik/RENDER_PLAN.json', `${JSON.stringify({schemaVersion:2, staticExerciseImages:true, staticRestImages:true, timer:'remotion', progressBar:'remotion', restCountdown:'remotion', backgroundMusic:true}, null, 2)}\n`);
write('99-technik/VISUAL_REVIEW.json', `${JSON.stringify({
  episodeFolder,
  revision,
  sameCharacterEveryScene:false,
  allExercisePosesClearFromOneStill:false,
  allExerciseTextReadableAndConsistent:false,
  allExerciseSafeZonesClear:false,
  propBallCountsCorrect:false,
  nonExerciseImagesContainNoGeneratedText:false,
  noExtraPeople:false,
  noAnatomyErrors:false,
  noCroppingOfImportantLimbs:false,
  notes:'Set flags true only after inspecting the final images in 00-bildprompts/images/.'
}, null, 2)}\n`);
write('99-technik/status.json', `${JSON.stringify({schemaVersion:2, phase1Ready:false, imagesReady:false, audioReady:false, assetsApproved:false, renderReady:false}, null, 2)}\n`);
write('99-technik/GENERATION-REVISION.txt', `${revision}\n`);
write('00-bildprompts/google-flow-prompt.txt', flowPrompt);
write('01-voice-script/voice-script.txt', `${data.introVoiceText}\n`);
write('02-audio/README.md', `# ${episodeId} Audio\n\nRequired final files:\n- Voice 01.mp3 — one continuous opening Voice, target 13.65–14.00s, must end before Exercise 1\n- bg-music.mp3 — instrumental background music, looped through the workout\n\nDo not add Voice 02+ files.\n`);
write('README.md', `# ${episodeId} — ${topic}\n\nKidMotion Pipeline V2 episode.\n\nStructure:\n- 00-bildprompts/google-flow-prompt.txt + images/\n- 01-voice-script/voice-script.txt\n- 02-audio/\n- 03-export/\n- 99-technik/ episode/image/review/render state\n\nFill every TBD in episode.json, IMAGE_PLAN.json and google-flow-prompt.txt before final generation.\n`);
write('ANTIGRAVITY.md', `# ${episodeId} — Antigravity\n\nRead GEHIRN.md, config/pipeline.json, config/visual-policy.json, then 99-technik/episode.json and 00-bildprompts/google-flow-prompt.txt.\n\nNever bypass the reference workflow, visual review or SHA-256 asset approval.\n`);
write('03-export/.gitkeep', '');
write('00-bildprompts/images/.gitkeep', '');

console.log(`Created KidMotion V2 episode: ${episodeRoot}`);
console.log(`Visual style: ${visual.styleId}`);
console.log('Final render remains blocked until image plan, assets, visual review and asset approval are complete.');

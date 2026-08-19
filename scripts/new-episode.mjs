import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const item = args.find((arg) => arg.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : fallback;
};

const topic = getArg('topic');
const requestedId = getArg('id');
const exerciseCount = Math.max(1, Number(getArg('scenes', '12')) || 12);
const character = getArg('character', 'boy').toLowerCase() === 'girl' ? 'girl' : 'boy';

if (!topic) {
  console.error('Missing --topic="..."');
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

const episodesRoot = path.join(process.cwd(), 'episodes');
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

const firstExerciseScene = 4;
const outroScene = firstExerciseScene + exerciseCount;
const write = (relativePath, content) => {
  const target = path.join(episodeRoot, relativePath);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, content, 'utf8');
};

fs.mkdirSync(path.join(episodeRoot, '01-skript'), {recursive: true});
fs.mkdirSync(path.join(episodeRoot, '02-audio'), {recursive: true});
fs.mkdirSync(path.join(episodeRoot, '03-bilder'), {recursive: true});
fs.mkdirSync(path.join(episodeRoot, '04-data'), {recursive: true});

const scenes = [
  {scene:'00', type:'cover', image:'Bild 00.png', duration:0, character, inVideo:false},
  {scene:'01', type:'intro', image:'Bild 01.png', voice:'Voice 01.mp3', duration:8, character},
  {scene:'02', type:'safety', image:'Bild 02.png', duration:4, character},
  {scene:'03', type:'lets-begin', image:'Bild 03.png', duration:2, character},
];

for (let i = 0; i < exerciseCount; i += 1) {
  const sceneNumber = pad(firstExerciseScene + i);
  scenes.push({
    scene: sceneNumber,
    type: 'exercise',
    title: 'TBD',
    instruction: 'TBD',
    image: `Bild ${sceneNumber}.png`,
    duration: 20,
    restAfter: i === exerciseCount - 1 ? 0 : 5,
    character,
    ballCount: null,
  });
}

scenes.push({
  scene: pad(outroScene),
  type: 'outro',
  image: `Bild ${pad(outroScene)}.png`,
  duration: 4,
  character,
  generatedTextAllowed: false,
});

const runtimeSeconds = 8 + 4 + 2 + exerciseCount * 20 + Math.max(0, exerciseCount - 1) * 5 + 4;

const data = {
  id: episodeId,
  slug,
  topic,
  format: 'youtube-longform',
  aspectRatio: '16:9',
  fps: 30,
  width: 1920,
  height: 1080,
  mainCharacter: character,
  singleCharacterWholeEpisode: true,
  allowCharacterSwitch: false,
  allowSecondVisibleCharacter: false,
  allVideoSectionsUseCharacterImage: true,
  staticPoseOnly: true,
  singleFrameClarityRequired: true,
  silhouetteTestRequired: true,
  maxGoogleFlowAttemptsBeforePoseReplacement: 2,
  characterReference: `approved KidMotion ${character} / clean ${episodeId} Bild 01 reference`,
  exerciseUiReference: `approved ${episodeId} Bild 04 reference for title/cloud style only`,
  outfitLockedForEpisode: true,
  worldLockedForEpisode: true,
  introDuration: 8,
  introTitle: 'TBD',
  introSubtitle: `${exerciseCount} POSES • 20 SEC EACH`,
  introBadge: 'KIDMOTION',
  introExtraInfo: ['FOLLOW ALONG'],
  introVoiceText: 'TBD — write one natural copy-ready opening paragraph that lasts about 11–14 seconds and ends before exercise 1.',
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
    openingVoiceTargetSeconds: '11-14',
    voiceFile: 'Voice 01.mp3',
  },
  audioPolicy: {
    backgroundMusicRequiredForFinal: true,
    backgroundMusicFile: 'bg-music.mp3',
    backgroundMusicLoop: true,
    backgroundMusicLowDuringOpening: true,
    backgroundMusicContinuesThroughWorkout: true,
    noSpokenVoiceAfterOpening: true,
  },
  transitionPolicy: {
    blankFramesForbidden: true,
    blackFlashesForbidden: true,
    whiteFlashesForbidden: true,
    fullSceneFadeFromZeroForbidden: true,
    hardCutWithVisibleImageFromFirstFrame: true,
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
    remotionExerciseImageFadeFromZeroForbidden: true,
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
    remotionRestImageFadeFromZeroForbidden: true,
  },
  nonExerciseImagePolicy: {
    introGeneratedTextAllowed: false,
    safetyGeneratedTextAllowed: false,
    letsBeginGeneratedTextAllowed: false,
    outroGeneratedTextAllowed: false,
    remotionOwnsIntroGraphic: true,
    remotionOwnsSafetyGraphic: true,
    remotionOwnsLetsBeginGraphic: true,
    remotionOwnsOutroGraphic: true,
  },
  scenes,
  runtimeSeconds,
};

write('04-data/data.json', `${JSON.stringify(data, null, 2)}\n`);
write('GENERATION-REVISION.txt', `${revision}\n`);
write('04-data/VISUAL_REVIEW.json', `${JSON.stringify({
  episodeFolder,
  revision,
  sameCharacterEveryScene: false,
  allExercisePosesClearFromOneStill: false,
  allExerciseTextReadableAndConsistent: false,
  allExerciseSafeZonesClear: false,
  propBallCountsCorrect: false,
  nonExerciseImagesContainNoGeneratedText: false,
  noExtraPeople: false,
  noAnatomyErrors: false,
  noCroppingOfImportantLimbs: false,
  notes: 'All flags remain false until the FINAL generated image set has been visually inspected image by image.'
}, null, 2)}\n`);

write('01-skript/voice-text.md', `# ${episodeId} — Voice\n\nUse exactly ONE spoken file: \`Voice 01.mp3\`.\n\nThe Voice starts at 0s and may continue naturally across Intro → Safety → LET'S BEGIN. Target: about 11–14 seconds. It MUST end before the first exercise starts.\n\nAfter the opening: no spoken Voice in exercises, rests or Outro. No subtitles/captions.\n\n## COPY-READY SCRIPT\n\nTBD\n`);

write('02-audio/README.md', `# ${episodeId} — Audio\n\nFinal required files:\n- \`Voice 01.mp3\` — one continuous 11–14s opening Voice\n- \`bg-music.mp3\` — licensed instrumental background music\n\nMusic must be low under the opening Voice, slightly louder afterward, and loop through the full video. No lyrics/spoken samples.\n\nDo not create Voice 02+ files.\n`);

const promptSections = [];
const addPrompt = (number, title, body) => {
  const n = pad(number);
  promptSections.push(`## Bild ${n} — ${title}\n\n\`\`\`text\nIMAGE NUMBER: Bild ${n}\nFINAL FILE NAME: Bild ${n}.png\n\n${body}\n\nAfter generation immediately rename to: Bild ${n}.png\n\`\`\``);
};

addPrompt(0, 'COVER', `Use the approved KidMotion ${character} master identity. Exactly one character. Create a premium 16:9 YouTube thumbnail for ${topic}. Visible English thumbnail text: TBD. No third-party logos.`);
addPrompt(1, 'INTRO / PRIMARY CHARACTER REFERENCE', `Use the approved KidMotion ${character} master identity. Exactly one character. Create the locked episode outfit/world. Put the character full-body on the RIGHT and leave the LEFT clean for Remotion Intro graphics. ABSOLUTELY ZERO generated text, labels, logos, captions, timer or progress.`);
addPrompt(2, 'SAFETY', `Use approved Bild 01 as PRIMARY character/world reference. Same character/outfit/world. Full-body character on RIGHT, LEFT clean for Remotion Safety graphic. ABSOLUTELY ZERO generated text. Prop/ball count: TBD and must be explicit before generation.`);
addPrompt(3, "LET'S BEGIN", `Use approved Bild 01 as PRIMARY character/world reference. Same character/outfit/world. Create one clear STATIC ready pose and leave central-left space for the Remotion LET'S BEGIN graphic. ABSOLUTELY ZERO generated text. Prop/ball count: TBD and must be explicit before generation.`);

for (let i = 0; i < exerciseCount; i += 1) {
  const scene = firstExerciseScene + i;
  const secondaryRef = i === 0
    ? 'This is the UI MASTER image. Once approved, use it as SECONDARY title/cloud reference for every later exercise.'
    : 'PRIMARY reference: approved Bild 01 for character/world. SECONDARY UI reference: approved Bild 04 for title/cloud style.';
  addPrompt(scene, `EXERCISE ${pad(i + 1)} — TBD`, `${secondaryRef}\n\nSTATIC POSE: TBD — must pass one-still clarity and silhouette test. Full body visible.\nPROP/BALL COUNT: TBD — explicitly set ZERO or EXACTLY ONE before generation.\n\nBOTTOM-LEFT TITLE:\nTBD\n\nTOP-RIGHT CLOUD:\nTBD\n\nUse exactly one bold white/navy outlined title and exactly one white/turquoise rounded instruction cloud. NO thought-bubble dots. Keep top-left 220x220 px clear for timer and lowest ~90 px clear for progress. NO subtitles, timer or progress.`);
}

addPrompt(outroScene, 'OUTRO / CLEAN IMAGE ONLY', `Use approved Bild 01 as PRIMARY reference. Same character/outfit/world. Full-body victory pose on RIGHT and LEFT clean for Remotion completion graphic. ABSOLUTELY ZERO generated text/graphics. Do NOT generate GREAT JOB or WORKOUT COMPLETE. Prop/ball count: TBD and must be explicit.`);

write('03-bilder/bild-prompts.md', `# ${episodeId} — Google Flow Image Prompts\n\n## HARD WORKFLOW\n\`PROMPT LESEN → EIN BILD ERZEUGEN → EIN-BILD-KLARHEIT PRÜFEN → TEXT/UI + PROP COUNT PRÜFEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD\`\n\n## REFERENCES\n- Bild 01 = PRIMARY character/world reference\n- Bild 04 = SECONDARY exercise title/cloud UI reference after approval\n\n## SAFE ZONES\n- top-left 220x220 px free for timer\n- lowest ~90 px free for progress\n- instruction cloud top-right with safe margin\n\n## NON-EXERCISE TEXT\nBild 01, 02, 03 and final Outro image contain ZERO generated text.\n\n## PROP RULE\nEvery prompt must explicitly say ZERO or EXACTLY ONE relevant prop/ball. No stray background duplicates.\n\n${promptSections.join('\n\n')}\n\n## REST\nDo not generate Rest cards. Remotion reuses the NEXT exercise image and adds compact REST + countdown TOP-LEFT only.\n`);

write('03-bilder/README.md', `# ${episodeId} — Bilder\n\nRequired: Bild 00 through Bild ${pad(outroScene)} with no gaps.\n\nBild 01 = PRIMARY character reference.\nBild 04 = SECONDARY Exercise UI reference.\n\nReject an exercise image if the pose is unclear, anatomy is wrong, text is clipped/inconsistent, thought-bubble dots appear, safe zones are occupied, the character drifts, or prop/ball count is wrong.\n\nBild 01/02/03/Outro must contain ZERO Google Flow text.\n\nAfter the FINAL image set exists, inspect every image and update \`04-data/VISUAL_REVIEW.json\`. Do not approve from prompts or filenames alone.\n`);

write('README.md', `# ${episodeId} — ${topic}\n\n## Status\nPLANNED — fill all TBD fields before generating final assets.\n\n## Structure\n- Intro 8s\n- Safety 4s\n- LET'S BEGIN 2s\n- ${exerciseCount} static exercises × 20s\n- ${Math.max(0, exerciseCount - 1)} rests × 5s\n- Outro 4s\n- total ${runtimeSeconds}s\n\n## Hard rules\n- exactly one recurring ${character}\n- every exercise must be understandable from one still\n- one continuous opening Voice only, target 11–14s, ends before exercise 1\n- looping background music required final\n- Google Flow owns exercise title + instruction\n- Remotion owns timer + progress during exercises\n- no whole-image fade from black/white\n- no Ken Burns on exercise/rest images\n- Rest UI top-left only\n- non-exercise source images text-free\n- final assets require visual review + SHA-256 approval lock before render\n`);

write('ANTIGRAVITY.md', `# ${episodeId} — Antigravity\n\nRead \`GEHIRN.md\` first, then this episode's README, voice, image prompts and data.json.\n\nDo not render final until all TBD fields are resolved and final assets exist.\n\nHard rules:\n- one character throughout\n- one-still static poses only\n- one Voice 01 may span the 14s opening and ends before exercise 1\n- bg-music.mp3 required and loops throughout\n- no subtitles\n- no full-scene fade from zero\n- no Ken Burns on exercise/rest images\n- Google Flow owns exercise title/cloud\n- Remotion owns timer/progress only during exercises\n- Rest uses next image + REST/countdown top-left only\n- Bild 01/02/03/Outro generated text-free\n\nMANDATORY GATE:\n1. Visually inspect EVERY final image.\n2. Set every required flag in \`04-data/VISUAL_REVIEW.json\` true only after actual inspection.\n3. Run \`npm run assets:approve -- --episode=${episodeFolder}\`.\n4. This creates a SHA-256 lock. Any later asset change invalidates approval.\n5. Activate episode, then run \`npm run render:safe\`.\n\nNever bypass the visual review or asset lock.\n`);

write('RENDER_QA.md', `# ${episodeId} — Render QA\n\n- [ ] all TBD values resolved\n- [ ] one character throughout\n- [ ] all poses pass one-still clarity\n- [ ] all required images exist\n- [ ] Bild 01/02/03/Outro are generated text-free\n- [ ] Bild 04–exercise end use consistent title/cloud UI\n- [ ] correct prop/ball count per scene\n- [ ] Voice 01 about 11–14s and ends before exercise 1\n- [ ] bg-music loops through whole video\n- [ ] no subtitles\n- [ ] no black/white boundary flashes\n- [ ] no Exercise/Rest Ken Burns cropping\n- [ ] Rest countdown top-left only\n- [ ] exactly one GREAT JOB completion graphic\n- [ ] VISUAL_REVIEW.json completed from actual image inspection\n- [ ] assets:approve passes and creates ASSET_APPROVAL.json\n- [ ] typecheck passes\n- [ ] project:doctor passes\n- [ ] preflight passes\n- [ ] asset:gate passes\n- [ ] render passes\n- [ ] postrender QA passes\n- [ ] final MP4 visually inspected\n`);

write('publishing.md', `# ${episodeId} — Publishing\n\nYouTube title: TBD\n\nONE cross-platform caption:\nTBD #Tag1 #Tag2 #Tag3 #Tag4 #KidMotion\n\nExactly five hashtags; final hashtag #KidMotion.\n`);

console.log(`Created canonical episode: ${episodeRoot}`);
console.log(`Revision: ${revision}`);
console.log('Final render is blocked until VISUAL_REVIEW + assets:approve are completed.');

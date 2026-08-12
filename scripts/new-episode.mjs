import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const topic = getArg('topic');
const exerciseCount = Math.max(1, Number(getArg('scenes', '12')) || 12);
const characterArg = getArg('character', 'boy').toLowerCase();
const character = characterArg === 'girl' ? 'girl' : 'boy';

if (!topic) {
  console.error('Missing --topic="..."');
  process.exit(1);
}

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

const pad = (n) => String(n).padStart(2, '0');
const episodesRoot = path.join(process.cwd(), 'content', 'episodes');
fs.mkdirSync(episodesRoot, {recursive: true});

const existingIds = fs
  .readdirSync(episodesRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && /^KM-\d{3}-/.test(entry.name))
  .map((entry) => Number(entry.name.slice(3, 6)))
  .filter(Number.isFinite);

const nextId = String((existingIds.length ? Math.max(...existingIds) : 0) + 1).padStart(3, '0');
const slug = slugify(topic) || `episode-${nextId}`;
const episodeId = `KM-${nextId}`;
const root = path.join(episodesRoot, `${episodeId}-${slug}`);

const introDuration = 12;
const safetyDuration = 5;
const letsBeginDuration = 3;
const exerciseDuration = 20;
const restDuration = 5;
const outroDuration = 5;
const firstExerciseScene = 4;
const outroScene = firstExerciseScene + exerciseCount;

const write = (rel, content) => {
  const target = path.join(root, rel);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, content, 'utf8');
};

fs.mkdirSync(root, {recursive: true});
fs.mkdirSync(path.join(process.cwd(), 'public', '00-bildprompts', '00-ALLE-BILDER-HIER-REIN'), {recursive: true});
fs.mkdirSync(path.join(process.cwd(), 'public', '00-audio'), {recursive: true});

const sceneFolders = ['00-cover', '01-intro', '02-safety', '03-lets-begin'];
for (let i = 0; i < exerciseCount; i += 1) {
  sceneFolders.push(`${pad(firstExerciseScene + i)}-exercise-${pad(i + 1)}`);
}
sceneFolders.push(`${pad(outroScene)}-outro`);
for (const folder of sceneFolders) fs.mkdirSync(path.join(root, 'scenes', folder), {recursive: true});

const timelineRows = [
  '| 00 | Cover / thumbnail | Bild 00.png | thumbnail only | not in video |',
  `| 01 | Intro | Bild 01.png | ${introDuration}s | Remotion timed intro graphics |`,
  `| 02 | Safety | no image | ${safetyDuration}s | Remotion-only |`,
  `| 03 | LET'S BEGIN | Bild 03.png | ${letsBeginDuration}s | Remotion start text |`,
];
for (let i = 0; i < exerciseCount; i += 1) {
  const scene = firstExerciseScene + i;
  timelineRows.push(`| ${pad(scene)} | Exercise ${pad(i + 1)} — TBD | Bild ${pad(scene)}.png | ${exerciseDuration}s | Remotion title + cloud + timer + progress |`);
}
timelineRows.push(`| ${pad(outroScene)} | Outro | Bild ${pad(outroScene)}.png | ${outroDuration}s | Remotion GREAT JOB text |`);

write('episode.md', `# ${episodeId} — ${topic}\n\nStatus: draft\nLanguage: English\nFormat: YouTube long-form 16:9 / 1920x1080\nMain character: ${character.toUpperCase()} — EXACTLY ONE recurring character for the whole episode\nExercise count: ${exerciseCount}\nExercise duration: exactly ${exerciseDuration}s each\n\n# HARD RULES\n- one character from Cover to Outro\n- static standing hold exercises only in current phase\n- no subtitles / voice captions\n- Google Flow video-scene images are CLEAN with no baked-in exercise text/UI\n- Remotion adds title, instruction cloud, timer and progress\n- short voice only when useful; audio length never shortens scenes\n- rests normally silent\n- Cover is thumbnail only and is not played in the video\n- timer reaches 0 and progress reaches 100% on the final exercise frame\n- public image/audio folders are ACTIVE-EPISODE staging only; never mix episodes\n\n# TIMELINE\n| Scene | Purpose | Image | Duration | Render responsibility |\n|---|---|---|---:|---|\n${timelineRows.join('\n')}\n\nRest: default ${restDuration}s after each exercise except the last.\n\n# EXERCISE PLAN\nTBD — choose clear static standing hold poses.\n`);

write('REFERENCE_GUIDE.md', `# ${episodeId} Reference Guide\n\nUse exactly ONE recurring KidMotion ${character} for the entire episode.\nLock face, age, hair, skin tone, proportions, episode outfit, world and 3D style.\nNo second visible child/person.\n\nReference workflow:\n1. generate Cover Bild 00 from the approved ${character} master reference\n2. generate clean Intro Bild 01 from the approved master reference\n3. once Bild 01 is approved, use Bild 01 as the PRIMARY continuity reference for every later generated image\n\nFor normal video-scene images generate only character + pose + background.\nNO exercise title, instruction, cloud, subtitles, timer, progress bar, countdown or UI.\n\nCover is the only standard exception and may contain thumbnail text.\n`);

const promptSections = [];
promptSections.push(`## COVER — Bild 00\n\n\`\`\`text\nIMAGE NUMBER: Bild 00\nSCENE: COVER / YOUTUBE THUMBNAIL\nFINAL FILE NAME: Bild 00.png\n\nUse the approved KidMotion ${character} master reference exactly. Show exactly one character.\nCreate a 16:9 YouTube thumbnail for: ${topic}.\nAdd clear English thumbnail text: TBD.\nNo third-party logos or copyrighted characters.\n\nAfter generation immediately rename to: Bild 00.png\n\`\`\``);
promptSections.push(`## SCENE 01 — INTRO — Bild 01\n\n\`\`\`text\nIMAGE NUMBER: Bild 01\nSCENE: SCENE 01 — INTRO\nFINAL FILE NAME: Bild 01.png\n\nUse the approved KidMotion ${character} master reference exactly. Exactly one character.\nCreate a clean 16:9 episode intro scene with negative space for Remotion intro text.\nNO generated text, subtitles, timer, progress bar or UI.\n\nAfter generation immediately rename to: Bild 01.png\n\`\`\`\n\nAfter Bild 01 is approved, use it as the PRIMARY visual reference for all later generated episode images.`);
promptSections.push('## SCENE 02 — SAFETY — NO IMAGE\nRemotion-only. Do not create `Bild 02.png`. Keep number 02 reserved.');
promptSections.push(`## SCENE 03 — LET'S BEGIN — Bild 03\n\n\`\`\`text\nIMAGE NUMBER: Bild 03\nSCENE: SCENE 03 — LET'S BEGIN\nFINAL FILE NAME: Bild 03.png\n\nUse approved Bild 01 as the PRIMARY visual reference. Exactly one character.\nCreate a clean 16:9 ready-pose scene with space for Remotion LET'S BEGIN text.\nNO generated text, subtitles, timer, progress bar or UI.\n\nAfter generation immediately rename to: Bild 03.png\n\`\`\``);

for (let i = 0; i < exerciseCount; i += 1) {
  const scene = firstExerciseScene + i;
  const n = pad(scene);
  promptSections.push(`## SCENE ${n} — EXERCISE ${pad(i + 1)} — Bild ${n}\n\n\`\`\`text\nIMAGE NUMBER: Bild ${n}\nSCENE: SCENE ${n} — EXERCISE ${pad(i + 1)} — TBD\nFINAL FILE NAME: Bild ${n}.png\n\nUse approved Bild 01 as the PRIMARY visual reference. Exactly one character.\nCreate a clean 16:9 static standing hold pose: TBD.\nFull body clearly visible. Keep overlay-safe space at top-left, top-right, bottom-left and bottom edge.\nNO exercise title, instruction text, cloud, subtitles, timer, progress bar, countdown or UI.\n\nAfter generation immediately rename to: Bild ${n}.png\n\`\`\``);
}

promptSections.push(`## SCENE ${pad(outroScene)} — OUTRO — Bild ${pad(outroScene)}\n\n\`\`\`text\nIMAGE NUMBER: Bild ${pad(outroScene)}\nSCENE: SCENE ${pad(outroScene)} — OUTRO / GREAT JOB\nFINAL FILE NAME: Bild ${pad(outroScene)}.png\n\nUse approved Bild 01 as the PRIMARY visual reference. Exactly one character.\nCreate a clean 16:9 victory pose scene with space for Remotion GREAT JOB text.\nNO generated text, subtitles, timer, progress bar or UI.\n\nAfter generation immediately rename to: Bild ${pad(outroScene)}.png\n\`\`\``);

write('ALL_IMAGE_PROMPTS.md', `# ${episodeId} — All Image Prompts\n\nMandatory workflow:\n\`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD\`\n\nNever batch episode images. Scene number = image number.\n\n${promptSections.join('\n\n')}\n\nAfter ALL images are generated and checked, move them together into:\n\`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/\`\n\nNever mix assets from two episodes in that staging folder.\n`);

const voiceSections = [
  '## 01 INTRO\nVoice: TBD\nThen SILENCE until scene end if the voice finishes early.',
  '## 02 SAFETY\nVoice: short cue, TBD',
  "## 03 LET'S BEGIN\nVoice: optional short cue, TBD",
];
for (let i = 0; i < exerciseCount; i += 1) {
  const scene = firstExerciseScene + i;
  voiceSections.push(`## ${pad(scene)} EXERCISE ${pad(i + 1)} — TBD\nFirst ~2–4s voice: TBD\nThen until ${exerciseDuration}s: SILENCE / NO VOICE.`);
}
voiceSections.push('## REST SCREENS\nDefault: NO VOICE.');
voiceSections.push(`## ${pad(outroScene)} OUTRO\nVoice: TBD`);
write('ALL_VOICE_TEXTS.md', `# ${episodeId} — All Voice Texts\n\nEnglish only. Voice only when useful. No subtitles or voice captions.\nAudio duration does not control video duration.\n\n${voiceSections.join('\n\n')}\n`);

write('publishing.md', `# ${episodeId} — Publishing\n\n## Final YouTube title\nTBD\n\n## ONE CROSS-PLATFORM CAPTION\nTBD #Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #KidMotion\n\nUse the exact same caption across platforms when technically possible. Exactly 5 hashtags.\n\n## YouTube description\nTBD\n\n## Keywords / search phrases\nTBD\n\n## Playlist\nTBD\n\n## Thumbnail text / concept\nTBD\n`);

const scenes = [
  {scene: '00', type: 'cover', image: 'Bild 00.png', duration: 0, inVideo: false, character},
  {scene: '01', type: 'intro', image: 'Bild 01.png', voice: 'Voice 01.mp3', duration: introDuration, character},
  {scene: '02', type: 'safety', image: null, voice: 'Voice 02.mp3', duration: safetyDuration, remotionOnly: true},
  {scene: '03', type: 'lets-begin', image: 'Bild 03.png', voice: 'Voice 03.mp3', duration: letsBeginDuration, character},
];
for (let i = 0; i < exerciseCount; i += 1) {
  const scene = firstExerciseScene + i;
  scenes.push({
    scene: pad(scene),
    type: 'exercise',
    title: 'TBD',
    instruction: 'TBD',
    image: `Bild ${pad(scene)}.png`,
    voice: `Voice ${pad(scene)}.mp3`,
    duration: exerciseDuration,
    restAfter: i === exerciseCount - 1 ? 0 : restDuration,
    character,
  });
}
scenes.push({scene: pad(outroScene), type: 'outro', image: `Bild ${pad(outroScene)}.png`, voice: `Voice ${pad(outroScene)}.mp3`, duration: outroDuration, character});

write('data.json', `${JSON.stringify({
  id: episodeId,
  slug,
  topic,
  status: 'draft',
  language: 'en',
  format: 'youtube-longform',
  aspectRatio: '16:9',
  width: 1920,
  height: 1080,
  fps: 30,
  mainCharacter: character,
  singleCharacterWholeEpisode: true,
  allowCharacterSwitch: false,
  allowSecondVisibleCharacter: false,
  introDuration,
  safetyDuration,
  letsBeginDuration,
  outroDuration,
  exerciseDuration,
  defaultRestAfter: restDuration,
  assetFolder: '00-bildprompts/00-ALLE-BILDER-HIER-REIN',
  audioFolder: '00-audio',
  voicePolicy: {
    speakOnlyWhenNeeded: true,
    continuousNarration: false,
    subtitles: false,
    voiceCaptions: false,
    exerciseCueSecondsApprox: '2-4',
    restVoiceDefault: false,
    videoDurationIndependentFromVoiceDuration: true,
    masterAudioAllowedOnlyIfSplitOrCorrectlyGapped: true,
  },
  remotion: {
    exerciseNameSource: 'Remotion',
    exerciseNamePosition: 'bottom-left',
    exerciseInstructionSource: 'Remotion',
    instructionBubbleSource: 'Remotion',
    instructionPosition: 'upper-right',
    exerciseTimer: 'circular-20-second',
    timerPosition: 'top-left',
    timerMustReachZero: true,
    progressBar: true,
    progressBarMustReach100Percent: true,
    subtitles: false,
    voiceCaptions: false,
  },
  scenes,
}, null, 2)}\n`);

write('RENDER_QA.md', `# ${episodeId} — Pre-Render QA\n\n- [ ] Cover Bild 00 is NOT inside the MP4\n- [ ] exactly one recurring episode character\n- [ ] no second child/person\n- [ ] all normal Google Flow scene images are clean and text/UI-free\n- [ ] exercise title bottom-left from Remotion\n- [ ] instruction cloud upper-right from Remotion\n- [ ] circular timer top-left\n- [ ] every exercise exactly ${exerciseDuration}s\n- [ ] timer starts at 20 and reaches 0\n- [ ] progress reaches 100%\n- [ ] rests use the episode-defined duration\n- [ ] no subtitles / voice captions\n- [ ] short voice never shortens a scene\n- [ ] silent gaps remain silent\n- [ ] public staging folders contain only this episode's assets\n- [ ] final runtime reaches the current long-form target\n`);

write('ANTIGRAVITY_ASSEMBLY.md', `# ${episodeId} — Antigravity / Codex Assembly\n\nRead PROJECT_BRAIN.md, episode.md, data.json, ALL_VOICE_TEXTS.md and RENDER_QA.md first.\n\nImages: public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/\nAudio: public/00-audio/\n\nUse only this episode's staged assets. Never mix files from another episode.\nCover Bild 00 is thumbnail only and must not enter the MP4 timeline.\nDo not create subtitles.\nDo not infer scene duration from audio length.\nEvery exercise stays exactly ${exerciseDuration}s even after its short voice cue ends.\nRest screens are silent by default.\nUse KidMotionVideo / 1920x1080 / 30fps for normal long-form rendering.\nRun every item in RENDER_QA.md before accepting the final MP4.\n`);

write('scenes/00-cover/README.md', '# 00 — Cover\nThumbnail only. `Bild 00.png`. Not played inside video.\n');
write('scenes/01-intro/README.md', '# 01 — Intro\nClean `Bild 01.png` + Remotion intro text. Once approved, use Bild 01 as the continuity reference for later generated images.\n');
write('scenes/02-safety/README.md', '# 02 — Safety\nRemotion-only. No `Bild 02.png`. Number stays reserved.\n');
write('scenes/03-lets-begin/README.md', "# 03 — LET'S BEGIN\nClean `Bild 03.png`; Remotion adds the start text.\n");
for (let i = 0; i < exerciseCount; i += 1) {
  const scene = firstExerciseScene + i;
  const n = pad(scene);
  write(`scenes/${n}-exercise-${pad(i + 1)}/scene.md`, `# ${n} — Exercise ${pad(i + 1)} — TBD\n- Image: \`Bild ${n}.png\` — clean image, no text/UI\n- Duration: exactly ${exerciseDuration}s\n- Rest after: ${i === exerciseCount - 1 ? 0 : restDuration}s\n- Character: same single approved episode ${character}\n- Pose: TBD static standing hold\n- Remotion title: TBD\n- Remotion cloud: TBD\n- Timer: 20s circular, reaches 0 on final frame\n- Progress bar: reaches 100% on final frame\n- Voice: short cue at start only if useful; remaining hold silent\n`);
}
write(`scenes/${pad(outroScene)}-outro/README.md`, `# ${pad(outroScene)} — Outro\nClean \`Bild ${pad(outroScene)}.png\`; Remotion adds GREAT JOB / completion text.\n`);

console.log(`Created ${root} with ${exerciseCount} exercise scenes.`);
console.log('Image staging: public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/');
console.log('Audio staging: public/00-audio/');
console.log('IMPORTANT: staging folders may contain assets from ONE active episode only.');

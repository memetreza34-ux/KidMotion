import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const item = args.find((arg) => arg.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : fallback;
};

const topic = getArg('topic');
const exerciseCount = Math.max(1, Number(getArg('scenes', '12')) || 12);
const character = getArg('character', 'boy').toLowerCase() === 'girl' ? 'girl' : 'boy';
if (!topic) {
  console.error('Missing --topic="..."');
  process.exit(1);
}

const pad = (n) => String(n).padStart(2, '0');
const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
const episodesRoot = path.join(process.cwd(), 'content', 'episodes');
fs.mkdirSync(episodesRoot, {recursive: true});

const ids = fs.readdirSync(episodesRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && /^KM-\d{3}-/.test(entry.name))
  .map((entry) => Number(entry.name.slice(3, 6)))
  .filter(Number.isFinite);
const nextId = String((ids.length ? Math.max(...ids) : 0) + 1).padStart(3, '0');
const episodeId = `KM-${nextId}`;
const slug = slugify(topic) || `episode-${nextId}`;
const root = path.join(episodesRoot, `${episodeId}-${slug}`);
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
for (let i = 0; i < exerciseCount; i += 1) sceneFolders.push(`${pad(firstExerciseScene + i)}-exercise-${pad(i + 1)}`);
sceneFolders.push(`${pad(outroScene)}-outro`);
for (const folder of sceneFolders) fs.mkdirSync(path.join(root, 'scenes', folder), {recursive: true});

const scenes = [
  {scene:'00', type:'cover', image:'Bild 00.png', duration:0, inVideo:false, character},
  {scene:'01', type:'intro', image:'Bild 01.png', voice:'Voice 01.mp3', duration:12, character},
  {scene:'02', type:'safety', image:'Bild 02.png', voice:'Voice 02.mp3', duration:5, character},
  {scene:'03', type:'lets-begin', image:'Bild 03.png', voice:'Voice 03.mp3', duration:3, character},
];
for (let i = 0; i < exerciseCount; i += 1) {
  const n = pad(firstExerciseScene + i);
  scenes.push({scene:n, type:'exercise', title:'TBD', instruction:'TBD', image:`Bild ${n}.png`, voice:`Voice ${n}.mp3`, duration:20, restAfter:i === exerciseCount - 1 ? 0 : 5, character});
}
scenes.push({scene:pad(outroScene), type:'outro', image:`Bild ${pad(outroScene)}.png`, voice:`Voice ${pad(outroScene)}.mp3`, duration:5, character});

write('data.json', `${JSON.stringify({
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
  assetFolder: '00-bildprompts/00-ALLE-BILDER-HIER-REIN',
  audioFolder: '00-audio',
  introDuration: 12,
  introTitle: 'TBD',
  introSubtitle: 'TBD',
  introBadge: 'KIDMOTION',
  introTextPolicy: 'fixed branded graphic independent from narration',
  safetyDuration: 5,
  letsBeginDuration: 3,
  outroDuration: 5,
  exerciseDuration: 20,
  defaultRestAfter: 5,
  voicePolicy: {speakOnlyWhenNeeded:true, continuousNarration:false, subtitles:false, voiceCaptions:false, transcriptBars:false, restVoice:false, videoDurationIndependentFromVoiceDuration:true},
  restVisualPolicy: {blankScreenForbidden:true, reuseNextExerciseImage:true, characterMustRemainVisible:true},
  remotion: {introTextMustNotTrackNarration:true, subtitles:false, voiceCaptions:false, transcriptBars:false, exerciseNameSource:'Remotion', exerciseNamePosition:'bottom-left', exerciseInstructionSource:'Remotion', instructionPosition:'upper-right', timerPosition:'top-left', timerMustReachZero:true, progressBar:true, progressBarMustReach100Percent:true},
  scenes,
}, null, 2)}\n`);

write('episode.md', `# ${episodeId} — ${topic}\n\n- 16:9 / 1920x1080\n- one recurring ${character} for the complete episode\n- every actual video section uses an image with that character\n- no subtitles / transcript bars\n- Intro uses fixed branded title graphics, never phrase-by-phrase narration text\n- Safety uses Bild 02\n- Rest reuses the NEXT exercise image\n- exercises last exactly 20s\n- voice only when useful\n\nExercise plan: TBD.\n`);

write('REFERENCE_GUIDE.md', `# ${episodeId} Reference Guide\n\nUse exactly ONE recurring KidMotion ${character}. Lock face, age, hair, skin tone, proportions, episode outfit, world and 3D style.\n\nReference order:\n1. Cover Bild 00 from master reference\n2. clean Intro Bild 01 from master reference\n3. approve Bild 01\n4. use Bild 01 as PRIMARY reference for Bild 02 through Bild ${pad(outroScene)}\n\nExcept Cover, generate clean character + pose + environment only. No video text/UI.\n`);

const prompts = [];
const addPrompt = (number, name, body) => {
  const n = pad(number);
  prompts.push(`## Bild ${n} — ${name}\n\n\`\`\`text\nIMAGE NUMBER: Bild ${n}\nSCENE: SCENE ${n} — ${name}\nFINAL FILE NAME: Bild ${n}.png\n\n${body}\n\nAfter generation immediately rename to: Bild ${n}.png\n\`\`\``);
};

addPrompt(0, 'COVER / YOUTUBE THUMBNAIL', `Use the approved KidMotion ${character} master reference. Exactly one character. Create a 16:9 thumbnail for: ${topic}. Add clear English thumbnail text: TBD. No third-party logos.`);
addPrompt(1, 'INTRO', `Use the approved KidMotion ${character} master reference. Exactly one character. Create a clean 16:9 themed scene with negative space for a fixed Remotion Intro title graphic. No generated video text/UI.`);
addPrompt(2, 'SAFETY FIRST', `Use approved Bild 01 as PRIMARY reference. Exactly the same ${character}. Create a clean 16:9 themed standing pose with negative space for the Safety panel. No generated video text/UI.`);
addPrompt(3, "LET'S BEGIN", `Use approved Bild 01 as PRIMARY reference. Exactly the same ${character}. Create an energetic clean ready-pose image. No generated video text/UI.`);
for (let i = 0; i < exerciseCount; i += 1) {
  const scene = firstExerciseScene + i;
  addPrompt(scene, `EXERCISE ${pad(i + 1)} — TBD`, `Use approved Bild 01 as PRIMARY reference. Exactly the same ${character}. Static hold pose: TBD. Full body visible. Keep overlay-safe space top-left, top-right, bottom-left and bottom edge. No generated video text/UI.`);
}
addPrompt(outroScene, 'OUTRO / GREAT JOB', `Use approved Bild 01 as PRIMARY reference. Exactly the same ${character}. Create a clean victory-pose scene with negative space for the Remotion Outro graphic. No generated video text/UI.`);

write('ALL_IMAGE_PROMPTS.md', `# ${episodeId} — All Image Prompts\n\nHard rules: one character, no subtitles, clean scene images except Cover, continuous image numbering.\n\nWorkflow: PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD\n\n${prompts.join('\n\n')}\n\nRest uses the NEXT exercise image; do not generate blank Rest cards.\n`);

const voice = ['## 01 INTRO\nVoice: TBD\nThen silence if the clip ends early.', '## 02 SAFETY\nVoice: TBD', "## 03 LET'S BEGIN\nVoice: optional short cue"];
for (let i = 0; i < exerciseCount; i += 1) voice.push(`## ${pad(firstExerciseScene + i)} EXERCISE ${pad(i + 1)}\nFirst ~2–4s: TBD\nThen silence until 20s.`);
voice.push('## REST\nNo voice by default.');
voice.push(`## ${pad(outroScene)} OUTRO\nVoice: TBD`);
write('ALL_VOICE_TEXTS.md', `# ${episodeId} — Voice\n\nNo subtitles or voice captions. Audio never controls scene duration.\n\n${voice.join('\n\n')}\n`);

write('publishing.md', `# ${episodeId} — Publishing\n\nYouTube title: TBD\n\nONE CROSS-PLATFORM CAPTION:\nTBD #Tag1 #Tag2 #Tag3 #Tag4 #KidMotion\n\nExactly 5 hashtags.\n`);
write('RENDER_QA.md', `# ${episodeId} — Render QA\n\n- [ ] one character throughout\n- [ ] every actual scene uses a character image\n- [ ] Safety uses Bild 02\n- [ ] Rest uses next exercise image\n- [ ] no subtitles / transcript bars\n- [ ] Intro is fixed title graphic, not narration text\n- [ ] every exercise exactly 20s\n- [ ] timer reaches 0\n- [ ] progress reaches 100%\n- [ ] Cover not inside MP4\n`);
write('ANTIGRAVITY_ASSEMBLY.md', `# ${episodeId} — Assembly\n\nUse the same character image throughout. No blank scenes. No subtitles or narration transcript. Intro uses a fixed title graphic. Safety uses Bild 02. Rest reuses the next exercise image. Audio length never changes scene duration. Run npm run render:safe after assets are staged.\n`);

write('scenes/00-cover/README.md', '# 00 Cover\nBild 00.png — thumbnail only.\n');
write('scenes/01-intro/README.md', '# 01 Intro\nBild 01.png + fixed Remotion title graphic.\n');
write('scenes/02-safety/README.md', '# 02 Safety\nBild 02.png + Remotion Safety panel. Same episode character.\n');
write('scenes/03-lets-begin/README.md', "# 03 LET'S BEGIN\nBild 03.png + Remotion start graphic.\n");
for (let i = 0; i < exerciseCount; i += 1) {
  const n = pad(firstExerciseScene + i);
  write(`scenes/${n}-exercise-${pad(i + 1)}/scene.md`, `# ${n} Exercise ${pad(i + 1)} — TBD\nImage: Bild ${n}.png\nDuration: 20s\nRest after: ${i === exerciseCount - 1 ? 0 : 5}s\nSame episode ${character}. Clean image. Remotion adds title/instruction/timer/progress.\n`);
}
write(`scenes/${pad(outroScene)}-outro/README.md`, `# ${pad(outroScene)} Outro\nBild ${pad(outroScene)}.png + Remotion GREAT JOB graphic.\n`);

console.log(`Created ${root}`);

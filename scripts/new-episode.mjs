import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const topic = getArg('topic');
const sceneCount = Math.max(1, Number(getArg('scenes', '6')) || 6);
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

const episodesRoot = path.join(process.cwd(), 'episodes');
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

const dirs = [
  '01-plan',
  '02-all-prompts',
  '03-scenes/00-cover',
  '04-voice',
  '05-publishing',
  '06-render',
];
for (let i = 1; i <= sceneCount; i += 1) {
  dirs.push(`03-scenes/scene-${String(i).padStart(2, '0')}`);
}
dirs.push('03-scenes/outro');
for (const dir of dirs) fs.mkdirSync(path.join(root, dir), {recursive: true});

const write = (rel, content) => fs.writeFileSync(path.join(root, rel), content, 'utf8');

const sceneRows = Array.from({length: sceneCount}, (_, index) => {
  const n = String(index + 1).padStart(2, '0');
  return `| ${index + 1} | scene-${n} | TBD | TBD | TBD | TBD | TBD |`;
}).join('\n');

write('01-plan/episode.md', `# ${episodeId} — ${topic}\n\nStatus: draft\nLanguage: English\nProduction: static images + Remotion\n\n## Concept\n\nTBD\n\n## Timeline\n\n| # | Folder | Pose / action | On-screen title | Cue | Voice | Duration |\n|---|---|---|---|---|---|---|\n${sceneRows}\n\n## Safety / suitability\n\n- [ ] age-appropriate movement\n- [ ] static-image format works\n- [ ] no copyrighted characters\n- [ ] no unsupported health claims\n`);

const promptSections = Array.from({length: sceneCount}, (_, index) => {
  const n = String(index + 1).padStart(2, '0');
  return `## Scene ${n}\n\nTBD\n`;
}).join('\n');
write('02-all-prompts/ALL_IMAGE_PROMPTS.md', `# ${episodeId} — All Image Prompts\n\nUse this file to generate all episode visuals in order.\n\n## 00 Cover\n\nTBD\n\n${promptSections}\n## Outro\n\nTBD\n`);

const voiceSections = Array.from({length: sceneCount}, (_, index) => {
  const n = String(index + 1).padStart(2, '0');
  return `## Scene ${n}\n\nTBD\n`;
}).join('\n');
write('04-voice/ALL_VOICE_TEXTS.md', `# ${episodeId} — All Voice Texts\n\nEnglish only. Keep instructions short, clear and child-friendly.\n\n## Intro\n\nTBD\n\n${voiceSections}\n## Outro\n\nTBD\n`);

write('05-publishing/publishing.md', `# ${episodeId} — Publishing\n\n## Final YouTube title\nTBD\n\n## Main caption\nTBD\n\n## Short caption\nTBD\n\n## Description\nTBD\n\n## Hashtags\nTBD\n\n## Keywords / search phrases\nTBD\n\n## Playlist\nTBD\n`);

write('03-scenes/00-cover/cover-prompt.txt', 'TBD\n');
write('03-scenes/00-cover/cover-text.txt', 'TBD\n');
write('03-scenes/00-cover/README.md', 'Place the approved cover image in this folder.\n');

const scenes = [];
for (let i = 1; i <= sceneCount; i += 1) {
  const n = String(i).padStart(2, '0');
  const folder = `03-scenes/scene-${n}`;
  write(`${folder}/image-prompt.txt`, 'TBD\n');
  write(`${folder}/voice.txt`, 'TBD\n');
  write(`${folder}/on-screen-text.txt`, 'TITLE: TBD\nCUE: TBD\nSHORT INSTRUCTION: TBD\n');
  write(`${folder}/scene.md`, `# Scene ${n}\n\n- Character: TBD\n- Pose / action: TBD\n- Background: TBD\n- Duration: TBD\n- Timer: TBD\n- Rest after: TBD\n- Image filename: scene-${n}.png\n- Audio filename: scene-${n}.wav\n`);
  write(`${folder}/README.md`, `Place scene-${n}.png and scene-${n}.wav here when approved.\n`);
  scenes.push({
    id: `scene-${n}`,
    title: 'TBD',
    cue: 'TBD',
    instruction: 'TBD',
    image: `episodes/${episodeId}-${slug}/03-scenes/scene-${n}/scene-${n}.png`,
    audio: `episodes/${episodeId}-${slug}/03-scenes/scene-${n}/scene-${n}.wav`,
    duration: 30,
    restAfter: 10,
  });
}

write('03-scenes/outro/image-prompt.txt', 'TBD\n');
write('03-scenes/outro/voice.txt', 'TBD\n');
write('03-scenes/outro/on-screen-text.txt', 'GREAT JOB!\nTBD\n');
write('03-scenes/outro/README.md', 'Place the approved outro visual/audio here if the episode uses custom outro assets.\n');

write('data.json', `${JSON.stringify({
  id: episodeId,
  topic,
  slug,
  status: 'draft',
  language: 'en',
  format: 'static-images-remotion',
  introDuration: 5,
  outroDuration: 5,
  scenes,
}, null, 2)}\n`);
write('06-render/README.md', 'Final Remotion renders for this episode belong here.\n');

console.log(`Created ${root} with ${sceneCount} scene folders.`);

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const topic = getArg('topic');
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
for (const dir of dirs) fs.mkdirSync(path.join(root, dir), {recursive: true});

const write = (rel, content) => fs.writeFileSync(path.join(root, rel), content, 'utf8');

write('01-plan/episode.md', `# ${episodeId} — ${topic}\n\nStatus: draft\nLanguage: English\nProduction: static images + Remotion\n\n## Concept\n\nTBD\n\n## Scene plan\n\nTBD\n`);
write('02-all-prompts/ALL_IMAGE_PROMPTS.md', `# ${episodeId} — All Image Prompts\n\n## 00 Cover\n\nTBD\n\n## Scene prompts\n\nTBD\n`);
write('04-voice/ALL_VOICE_TEXTS.md', `# ${episodeId} — All Voice Texts\n\nEnglish only.\n\n## Intro\nTBD\n\n## Scenes\nTBD\n\n## Outro\nTBD\n`);
write('05-publishing/publishing.md', `# ${episodeId} — Publishing\n\n## Final YouTube title\nTBD\n\n## Caption\nTBD\n\n## Description\nTBD\n\n## Hashtags\nTBD\n\n## Keywords\nTBD\n`);
write('03-scenes/00-cover/cover-prompt.txt', 'TBD\n');
write('03-scenes/00-cover/cover-text.txt', 'TBD\n');
write('03-scenes/00-cover/README.md', 'Place the approved cover image in this folder.\n');
write('data.json', `${JSON.stringify({id: episodeId, topic, slug, status: 'draft', language: 'en', scenes: []}, null, 2)}\n`);
write('06-render/README.md', 'Final Remotion renders for this episode belong here.\n');

console.log(`Created ${root}`);

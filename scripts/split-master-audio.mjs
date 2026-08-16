import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const episodeArg = args.find((arg) => arg.startsWith('--episode='));
const episodeFolder = episodeArg ? episodeArg.slice('--episode='.length) : 'KM-001-football';

const audioDir = path.join(process.cwd(), 'episodes', episodeFolder, '02-audio');
const masterFile = path.join(audioDir, 'master.mp3');
const voice01 = path.join(audioDir, 'Voice 01.mp3');

if (!fs.existsSync(masterFile)) {
  console.error(`Error: Could not find ${masterFile}`);
  console.error('Record ONLY the short Intro voice and save it as master.mp3, or provide Voice 01.mp3 directly.');
  process.exit(1);
}

fs.mkdirSync(audioDir, {recursive: true});
fs.copyFileSync(masterFile, voice01);

// Remove stale voice files from older multi-voice versions.
for (let number = 2; number <= 16; number += 1) {
  const stale = path.join(audioDir, `Voice ${String(number).padStart(2, '0')}.mp3`);
  if (fs.existsSync(stale)) fs.unlinkSync(stale);
}

console.log(`Prepared Intro voice: ${voice01}`);
console.log('Audio contract: Voice 01 only. Safety, Let\'s Begin, Exercises, Rest and Outro remain silent.');

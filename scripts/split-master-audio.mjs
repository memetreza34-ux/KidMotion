import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const episodeArg = args.find((arg) => arg.startsWith('--episode='));
const episodeFolder = episodeArg ? episodeArg.slice('--episode='.length) : 'KM-002-basketball';

const episodeRoot = path.join(process.cwd(), 'episodes', episodeFolder);
const audioDir = path.join(episodeRoot, '02-audio');
const dataPath = path.join(episodeRoot, '04-data', 'data.json');
const masterFile = path.join(audioDir, 'master.mp3');
const voice01 = path.join(audioDir, 'Voice 01.mp3');

if (!fs.existsSync(masterFile)) {
  console.error(`Error: Could not find ${masterFile}`);
  console.error('Record the ONE continuous opening Voice as master.mp3, or provide Voice 01.mp3 directly.');
  process.exit(1);
}

fs.mkdirSync(audioDir, {recursive: true});
fs.copyFileSync(masterFile, voice01);

// Remove stale voice files from older multi-voice versions.
for (let number = 2; number <= 16; number += 1) {
  const stale = path.join(audioDir, `Voice ${String(number).padStart(2, '0')}.mp3`);
  if (fs.existsSync(stale)) fs.unlinkSync(stale);
}

let openingSeconds = 14;
let minSeconds = 0;
if (fs.existsSync(dataPath)) {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  openingSeconds = Number(data.openingDuration || (Number(data.introDuration || 8) + Number(data.safetyDuration || 4) + Number(data.letsBeginDuration || 2)));
  if (data.id === 'KM-002') minSeconds = 10.5;
}

const probe = spawnSync('ffprobe', [
  '-v', 'error',
  '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1',
  voice01,
], {encoding: 'utf8'});
const duration = Number.parseFloat(probe.stdout || '');

if (Number.isFinite(duration)) {
  if (duration > openingSeconds + 0.05) {
    console.error(`Error: Voice 01 is ${duration.toFixed(2)}s but the opening is only ${openingSeconds}s.`);
    console.error('Shorten/re-record the continuous opening Voice so it finishes before exercise 1.');
    process.exit(1);
  }
  if (minSeconds > 0 && duration < minSeconds) {
    console.error(`Error: Voice 01 is only ${duration.toFixed(2)}s. KM-002 needs the current longer opening script (~11–14s).`);
    process.exit(1);
  }
  console.log(`Prepared Voice 01: ${duration.toFixed(2)}s / opening ${openingSeconds}s.`);
} else {
  console.warn('WARNING: Could not measure Voice 01 duration with ffprobe. Preflight will check it again.');
}

console.log(`Prepared opening Voice: ${voice01}`);
console.log('Audio contract: one Voice 01 across Intro + Safety + LET\'S BEGIN; it must end before exercise 1.');
console.log('Exercises, Rest and Outro remain without spoken Voice.');

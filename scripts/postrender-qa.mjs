import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const fileArg = args.find((arg) => arg.startsWith('--file='));
const videoPath = fileArg ? path.resolve(root, fileArg.slice('--file='.length)) : path.join(root, 'out', 'kidmotion.mp4');
const failures = [];
const fail = (message) => failures.push(message);

if (!fs.existsSync(videoPath)) {
  console.error(`POSTRENDER QA FAILED: missing ${videoPath}`);
  process.exit(1);
}

const pointerCandidates = [
  path.join(root, 'episodes', 'ACTIVE_EPISODE.json'),
  path.join(root, 'content', 'ACTIVE_EPISODE.json'),
];
const pointerPath = pointerCandidates.find((candidate) => fs.existsSync(candidate));
if (!pointerPath) {
  console.error('POSTRENDER QA FAILED: no ACTIVE_EPISODE pointer found.');
  process.exit(1);
}

const pointer = JSON.parse(fs.readFileSync(pointerPath, 'utf8'));
const episodeFolder = pointer.episodeFolder;
const canonicalDataPath = path.join(root, 'episodes', episodeFolder, '04-data', 'data.json');
const legacyDataPath = path.join(root, 'content', 'episodes', episodeFolder, 'data.json');
const dataPath = fs.existsSync(canonicalDataPath) ? canonicalDataPath : legacyDataPath;
if (!fs.existsSync(dataPath)) {
  console.error(`POSTRENDER QA FAILED: missing data for ${episodeFolder}`);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const runText = (cmd, cmdArgs) => spawnSync(cmd, cmdArgs, {encoding: 'utf8'});
const durationProbe = runText('ffprobe', [
  '-v', 'error',
  '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1',
  videoPath,
]);
const actualDuration = Number.parseFloat(durationProbe.stdout || '');
const expectedDuration = Number(data.runtimeSeconds || 313);
if (!Number.isFinite(actualDuration)) {
  fail('Could not read MP4 duration with ffprobe.');
} else if (Math.abs(actualDuration - expectedDuration) > 0.15) {
  fail(`MP4 duration is ${actualDuration.toFixed(3)}s; expected ${expectedDuration}s.`);
}

const getMeanVolume = (start, duration = 2) => {
  const result = spawnSync('ffmpeg', [
    '-hide_banner', '-ss', String(start), '-t', String(duration), '-i', videoPath,
    '-af', 'volumedetect', '-f', 'null', '-',
  ], {encoding: 'utf8'});
  const text = `${result.stdout || ''}\n${result.stderr || ''}`;
  const match = text.match(/mean_volume:\s*(-?[\d.]+) dB/);
  return match ? Number.parseFloat(match[1]) : null;
};

if (data.audioPolicy?.backgroundMusicRequiredForFinal === true) {
  const sampleTimes = [20, Math.floor(expectedDuration / 2), Math.max(20, expectedDuration - 12)];
  for (const time of sampleTimes) {
    const mean = getMeanVolume(time, 2);
    if (mean === null) {
      fail(`Could not measure audio around ${time}s.`);
    } else if (mean <= -60) {
      fail(`Audio is effectively silent around ${time}s (${mean.toFixed(1)} dB). Background music must continue through the workout.`);
    }
  }
}

const blackDetect = spawnSync('ffmpeg', [
  '-hide_banner', '-i', videoPath,
  '-vf', 'blackdetect=d=0.08:pix_th=0.04',
  '-an', '-f', 'null', '-',
], {encoding: 'utf8'});
const blackText = `${blackDetect.stdout || ''}\n${blackDetect.stderr || ''}`;
const blackSegments = [...blackText.matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)\s+black_duration:([\d.]+)/g)]
  .map((m) => ({start: Number(m[1]), end: Number(m[2]), duration: Number(m[3])}))
  .filter((segment) => segment.duration >= 0.08);
if (blackSegments.length) {
  fail(`Detected black flash/segment(s): ${blackSegments.map((s) => `${s.start.toFixed(2)}-${s.end.toFixed(2)}s`).join(', ')}`);
}

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const boundaryTimes = [];
let cursor = 0;
for (const scene of scenes) {
  if (scene.type === 'cover') continue;
  if (cursor > 0) boundaryTimes.push(cursor);
  cursor += Number(scene.duration || 0);
  if (Number(scene.restAfter || 0) > 0) {
    boundaryTimes.push(cursor);
    cursor += Number(scene.restAfter || 0);
  }
}

const sampleFrameStats = (time) => {
  const result = spawnSync('ffmpeg', [
    '-loglevel', 'error', '-ss', String(time), '-i', videoPath,
    '-frames:v', '1', '-vf', 'scale=96:54,format=gray',
    '-f', 'rawvideo', '-pix_fmt', 'gray', '-',
  ], {encoding: null, maxBuffer: 1024 * 1024});
  const buf = result.stdout;
  if (!buf || !buf.length) return null;

  let sum = 0;
  let sumSquares = 0;
  let dark = 0;
  let light = 0;
  let min = 255;
  let max = 0;
  for (const value of buf) {
    sum += value;
    sumSquares += value * value;
    if (value < 24) dark += 1;
    if (value > 238) light += 1;
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const mean = sum / buf.length;
  const variance = Math.max(0, sumSquares / buf.length - mean * mean);
  return {
    mean,
    stdDev: Math.sqrt(variance),
    min,
    max,
    darkRatio: dark / buf.length,
    lightRatio: light / buf.length,
  };
};

if (data.transitionPolicy?.blankFramesForbidden === true) {
  for (const boundary of boundaryTimes) {
    for (const offset of [0, 0.05, 0.15]) {
      const t = Math.min(expectedDuration - 0.05, boundary + offset);
      const stats = sampleFrameStats(t);
      if (!stats) {
        fail(`Could not inspect boundary frame around ${t.toFixed(2)}s.`);
        continue;
      }

      if (stats.darkRatio > 0.90) {
        fail(`Near-black blank frame detected around ${t.toFixed(2)}s (${(stats.darkRatio * 100).toFixed(0)}% dark pixels).`);
      }
      if (stats.lightRatio > 0.90) {
        fail(`Near-white blank frame detected around ${t.toFixed(2)}s (${(stats.lightRatio * 100).toFixed(0)}% light pixels).`);
      }

      // The rejected KM-002 Rest frames were not pure white: they were a pale blue/gray
      // full-screen fade plate around mean 227 with very little image detail. Detect that too.
      const paleUniformBlank = stats.mean > 205 && stats.stdDev < 20 && stats.min > 145;
      if (paleUniformBlank) {
        fail(`Pale/uniform blank-looking transition frame detected around ${t.toFixed(2)}s (mean ${stats.mean.toFixed(1)}, std ${stats.stdDev.toFixed(1)}).`);
      }
    }
  }
}

if (failures.length) {
  console.error('POSTRENDER QA FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`POSTRENDER QA PASSED — ${episodeFolder}`);
if (Number.isFinite(actualDuration)) console.log(`Duration: ${actualDuration.toFixed(3)}s`);
console.log('Checked: runtime, ongoing music, black segments, and black/white/pale blank-looking scene-boundary frames.');

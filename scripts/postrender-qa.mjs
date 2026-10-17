import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {hasFrameZeroGreetingPolicy} from './intro-greeting-policy.mjs';

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

const pointerPath = path.join(root, 'episodes', 'ACTIVE_EPISODE.json');
if (!fs.existsSync(pointerPath)) {
  console.error('POSTRENDER QA FAILED: episodes/ACTIVE_EPISODE.json is missing.');
  process.exit(1);
}

const pointer = JSON.parse(fs.readFileSync(pointerPath, 'utf8'));
const episodeFolder = pointer.episodeFolder;
const paths = resolveEpisodePaths(root, episodeFolder);
if (paths.structure === 'missing') {
  console.error(`POSTRENDER QA FAILED: episode data missing for ${episodeFolder}.`);
  process.exit(1);
}
const data = readEpisodeData(paths);
const scenes = Array.isArray(data.scenes) ? data.scenes : [];
const renderedScenes = scenes.filter((scene) => scene.type !== 'cover');
const greetingFromFirstFrame = hasFrameZeroGreetingPolicy(data);

const runText = (cmd, cmdArgs) => spawnSync(cmd, cmdArgs, {encoding: 'utf8'});
const durationProbe = runText('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1', videoPath,
]);
const actualDuration = Number.parseFloat(durationProbe.stdout || '');
const expectedDuration = renderedScenes.reduce((sum, scene) => sum + Number(scene.duration || 0), 0);
if (!Number.isFinite(actualDuration)) fail('Could not read MP4 duration with ffprobe.');
else if (Math.abs(actualDuration - expectedDuration) > 0.15) fail(`MP4 duration is ${actualDuration.toFixed(3)}s; expected ${expectedDuration}s.`);

const streamProbe = runText('ffprobe', [
  '-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'json', videoPath,
]);
try {
  const stream = JSON.parse(streamProbe.stdout || '{}').streams?.[0];
  if (!stream) fail('MP4 has no readable video stream.');
  else {
    if (Number(stream.width) !== Number(data.width || 1920) || Number(stream.height) !== Number(data.height || 1080)) {
      fail(`Wrong render size: ${stream.width}x${stream.height}; expected ${data.width || 1920}x${data.height || 1080}.`);
    }
    const [num, den] = String(stream.r_frame_rate || '').split('/').map(Number);
    const fps = den ? num / den : Number(stream.r_frame_rate);
    if (!Number.isFinite(fps) || Math.abs(fps - Number(data.fps || 30)) > 0.05) fail(`Wrong frame rate: ${Number.isFinite(fps) ? fps.toFixed(3) : 'unknown'}; expected ${data.fps || 30}.`);
  }
} catch {
  fail('Could not parse video stream metadata.');
}

const getMeanVolume = (start, duration = 2) => {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-ss', String(start), '-t', String(duration), '-i', videoPath, '-af', 'volumedetect', '-f', 'null', '-'], {encoding: 'utf8'});
  const text = `${result.stdout || ''}\n${result.stderr || ''}`;
  const match = text.match(/mean_volume:\s*(-?[\d.]+) dB/);
  return match ? Number.parseFloat(match[1]) : null;
};
if (data.audioPolicy?.backgroundMusicRequiredForFinal === true) {
  const samples=[];
  for (const time of [20, Math.floor(expectedDuration / 2), Math.max(20, expectedDuration - 12)]) {
    const mean=getMeanVolume(time,2);
    if(mean===null)fail('Cannot sample music near '+time+' seconds.');
    else{
      samples.push(mean);
      if(mean<=-60)fail('Effectively silent music at '+time+' seconds ('+mean+' dBFS).');
    }
  }
  if(data.stillImageQualityPolicy==='still-workout-v2'&&samples.length===3){
    const music=samples.reduce((a,b)=>a+b,0)/3;
    const intro=getMeanVolume(0,Math.min(8,expectedDuration));
    if(music<Number(data.audioPolicy.minExerciseMeanDbfs??-35))
      fail('MUSIC MIX: exercise music too quiet ('+music.toFixed(1)+' dBFS).');
    if(intro===null)fail('MUSIC MIX: cannot sample opening narration.');
    else if(intro-music>Number(data.audioPolicy.maxIntroVsExerciseMeanGapDb??16))
      fail('MUSIC MIX: introductory audio exceeds music by '+(intro-music).toFixed(1)+' dB.');
    const tail=getMeanVolume(Math.max(0,expectedDuration-0.25),0.23);
    const earlier=getMeanVolume(Math.max(0,expectedDuration-3.2),0.7);
    if(tail===null||earlier===null)fail('MUSIC MIX: cannot measure end fade.');
    else if(tail>earlier-3)fail('MUSIC MIX: final fade not audible (less than 3 dB reduction).');
    console.log('Measured real MP4: intro '+intro?.toFixed(1)+' dBFS; workout music '+music.toFixed(1)+' dBFS.');
  }
}

const blackDetect = spawnSync('ffmpeg', ['-hide_banner', '-i', videoPath, '-vf', 'blackdetect=d=0.08:pix_th=0.04', '-an', '-f', 'null', '-'], {encoding: 'utf8'});
const blackText = `${blackDetect.stdout || ''}\n${blackDetect.stderr || ''}`;
const blackSegments = [...blackText.matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)\s+black_duration:([\d.]+)/g)]
  .map((m) => ({start: Number(m[1]), end: Number(m[2]), duration: Number(m[3])}))
  .filter((segment) => segment.duration >= 0.08);
if (blackSegments.length) fail(`Detected black flash/segment(s): ${blackSegments.map((s) => `${s.start.toFixed(2)}-${s.end.toFixed(2)}s`).join(', ')}`);

const W = 160;
const H = 90;
// Cropped region of the first-scene 8%-from-left, vertically centered HELLO! badge.
// These bounds are intentionally larger than the badge to tolerate font rendering.
const INTRO_GREETING_RECT = {left: 9, right: 73, top: 31, bottom: 60};
const TIMER_MASK_X = 24;
const TIMER_MASK_Y = 24;

const sampleGrayVideo = (time) => {
  const result = spawnSync('ffmpeg', [
    '-loglevel', 'error', '-ss', String(Math.max(0, time)), '-i', videoPath,
    '-frames:v', '1', '-vf', `scale=${W}:${H},format=gray`,
    '-f', 'rawvideo', '-pix_fmt', 'gray', '-',
  ], {encoding: null, maxBuffer: 1024 * 1024});
  return result.status === 0 && result.stdout?.length === W * H ? Buffer.from(result.stdout) : null;
};

const sampleGrayImage = (file) => {
  const result = spawnSync('ffmpeg', [
    '-loglevel', 'error', '-i', file,
    '-frames:v', '1', '-vf', `scale=${W}:${H},format=gray`,
    '-f', 'rawvideo', '-pix_fmt', 'gray', '-',
  ], {encoding: null, maxBuffer: 1024 * 1024});
  return result.status === 0 && result.stdout?.length === W * H ? Buffer.from(result.stdout) : null;
};

const maskTimer = (buf) => {
  if (!buf) return null;
  const copy = Buffer.from(buf);
  for (let y = 0; y < TIMER_MASK_Y; y += 1) {
    for (let x = 0; x < TIMER_MASK_X; x += 1) copy[y * W + x] = 0;
  }
  return copy;
};

const maskGreeting = (buf) => {
  if (!buf) return null;
  const copy = Buffer.from(buf);
  for (let y = INTRO_GREETING_RECT.top; y < INTRO_GREETING_RECT.bottom; y += 1)
    for (let x = INTRO_GREETING_RECT.left; x < INTRO_GREETING_RECT.right; x += 1)
      copy[y * W + x] = 0;
  return copy;
};

const greetingDifference = (rendered, background) => {
  if (!rendered || !background || rendered.length !== background.length) return null;
  let sum = 0, count = 0;
  for (let y = INTRO_GREETING_RECT.top; y < INTRO_GREETING_RECT.bottom; y += 1) {
    for (let x = INTRO_GREETING_RECT.left; x < INTRO_GREETING_RECT.right; x += 1) {
      sum += Math.abs(rendered[y * W + x] - background[y * W + x]);
      count += 1;
    }
  }
  return count ? sum / count : null;
};

const maskForScene = (buf, scene) => {
  const base = maskTimer(buf);
  return greetingFromFirstFrame && scene?.type === 'intro' ? maskGreeting(base) : base;
};

const meanAbsDiff = (a, b) => {
  if (!a || !b || a.length !== b.length) return null;
  let total = 0;
  for (let i = 0; i < a.length; i += 1) total += Math.abs(a[i] - b[i]);
  return total / a.length;
};

const sourceFrames = new Map();
for (const scene of renderedScenes) {
  const sourcePath = path.join(paths.imagesDir, scene.image);
  if (!fs.existsSync(sourcePath)) {
    fail(`Missing source image for rendered scene: ${scene.image}`);
    continue;
  }
  sourceFrames.set(scene.image, maskForScene(sampleGrayImage(sourcePath), scene));
}

// FIRST FRAME GREETING: verify pixels of first frame differ from the text-free
// Google Flow scene 02 background in the documented text badge region.
if (greetingFromFirstFrame) {
  const intro = renderedScenes[0];
  if (!intro || intro.type !== 'intro') fail('FIRST FRAME GREETING: scene 02 must be the first rendered scene.');
  else {
    const background = sampleGrayImage(path.join(paths.imagesDir, intro.image));
    const firstFrame = sampleGrayVideo(0);
    const difference = greetingDifference(firstFrame, background);
    if (difference === null) fail('FIRST FRAME GREETING: cannot inspect actual frame 0 and original Flow background.');
    else if (difference < 10) fail('FIRST FRAME GREETING: HELLO! overlay appears absent at 00:00; actual first frame matches text-free background.');
    else console.log('FIRST FRAME GREETING verified at 00:00 (visible text-region pixel difference '+difference.toFixed(1)+').');
  }
}

const timeline = [];
let cursor = 0;
for (const scene of renderedScenes) {
  const duration = Number(scene.duration || 0);
  timeline.push({scene, start: cursor, end: cursor + duration, center: cursor + duration / 2});
  cursor += duration;
}

// Verify that every planned source image is actually visible in its intended time slot.
const SOURCE_MATCH_MAX_DIFF = 8.0;
for (const item of timeline) {
  const rendered = maskForScene(sampleGrayVideo(item.center), item.scene);
  const source = sourceFrames.get(item.scene.image);
  const diff = meanAbsDiff(rendered, source);
  if (diff === null) fail(`Could not compare rendered ${item.scene.image} at ${item.center.toFixed(2)}s.`);
  else if (diff > SOURCE_MATCH_MAX_DIFF) {
    fail(`${item.scene.image} does not match its planned source at ${item.center.toFixed(2)}s (mean diff ${diff.toFixed(2)}). Possible wrong/missing/reused scene.`);
  }
}

// Verify every cut from both sides. This catches scenes appearing early or late.
for (let i = 0; i < timeline.length - 1; i += 1) {
  const current = timeline[i];
  const next = timeline[i + 1];
  const boundary = current.end;
  const pre = maskForScene(sampleGrayVideo(Math.max(current.start + 0.05, boundary - 0.08)),current.scene);
  const post = maskForScene(sampleGrayVideo(Math.min(next.end - 0.05, boundary + 0.08)),next.scene);
  const preDiff = meanAbsDiff(pre, sourceFrames.get(current.scene.image));
  const postDiff = meanAbsDiff(post, sourceFrames.get(next.scene.image));
  if (preDiff === null || preDiff > SOURCE_MATCH_MAX_DIFF) fail(`Scene before ${boundary.toFixed(2)}s is wrong or changes too early: expected ${current.scene.image}.`);
  if (postDiff === null || postDiff > SOURCE_MATCH_MAX_DIFF) fail(`Scene after ${boundary.toFixed(2)}s is wrong or changes too late: expected ${next.scene.image}.`);
}

// Catch repeated rendered scenes even if files were renamed or re-encoded.
const renderedCenters = timeline.map((item) => ({scene: item.scene.image, buf: maskForScene(sampleGrayVideo(item.center),item.scene)}));
for (let i = 0; i < renderedCenters.length; i += 1) {
  for (let j = i + 1; j < renderedCenters.length; j += 1) {
    const diff = meanAbsDiff(renderedCenters[i].buf, renderedCenters[j].buf);
    if (diff !== null && diff < 0.6) fail(`Rendered scenes ${renderedCenters[i].scene} and ${renderedCenters[j].scene} are visually almost identical (mean diff ${diff.toFixed(3)}). Possible duplicate/reused image.`);
  }
}

if (failures.length) {
  console.error('POSTRENDER QA FAILED');
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`POSTRENDER QA PASSED — ${episodeFolder}`);
if (Number.isFinite(actualDuration)) console.log(`Duration: ${actualDuration.toFixed(3)}s`);
console.log('Checked: runtime, resolution/FPS, ongoing audio, black flashes, exact scene-to-source mapping, cut timing on both sides, rendered duplicate scenes and mandatory frame-zero HELLO greeting when enabled.');

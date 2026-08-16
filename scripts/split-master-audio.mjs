import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUDIO_DIR = path.join(process.cwd(), 'public', '00-audio');
const MASTER_FILE = path.join(AUDIO_DIR, 'master.mp3');

if (!fs.existsSync(MASTER_FILE)) {
  console.error(`Error: Could not find ${MASTER_FILE}`);
  console.error('Please upload your single voice file as "master.mp3" in the public/00-audio folder.');
  process.exit(1);
}

console.log('Detecting silence in master.mp3...');

try {
  // Run silencedetect
  const cmd = `ffmpeg -i "${MASTER_FILE}" -af silencedetect=noise=-30dB:d=0.8 -f null - 2>&1`;
  const output = execSync(cmd, { encoding: 'utf-8' });

  // Parse silence_start and silence_end
  const silenceStarts = [...output.matchAll(/silence_start: ([\d\.]+)/g)].map(m => parseFloat(m[1]));
  const silenceEnds = [...output.matchAll(/silence_end: ([\d\.]+)/g)].map(m => parseFloat(m[1]));

  if (silenceStarts.length === 0) {
    console.error('Could not detect any silence in the audio. Make sure you leave clear pauses between sentences.');
    process.exit(1);
  }

  // Calculate chunks based on silences
  const chunks = [];
  let currentStart = 0;

  for (let i = 0; i < silenceStarts.length; i++) {
    chunks.push({ start: currentStart, end: silenceStarts[i] });
    currentStart = silenceEnds[i];
  }
  // Add the last chunk
  chunks.push({ start: currentStart, end: null });

  console.log(`Detected ${chunks.length} spoken chunks.`);

  // We need exactly 3 chunks for KM-001 (Intro, Safety, Lets Begin)
  // Or if there are more, we just take the first 3.
  const targetFiles = ['Voice 01.mp3', 'Voice 02.mp3', 'Voice 03.mp3'];

  for (let i = 0; i < Math.min(chunks.length, targetFiles.length); i++) {
    const chunk = chunks[i];
    const outputFile = path.join(AUDIO_DIR, targetFiles[i]);
    
    let sliceCmd = `ffmpeg -i "${MASTER_FILE}" -ss ${chunk.start}`;
    if (chunk.end !== null) {
      sliceCmd += ` -to ${chunk.end}`;
    }
    sliceCmd += ` -c copy "${outputFile}" -y`;

    console.log(`Extracting ${targetFiles[i]} (from ${chunk.start.toFixed(2)}s to ${chunk.end ? chunk.end.toFixed(2) + 's' : 'end'})...`);
    execSync(sliceCmd, { stdio: 'ignore' });
  }

  console.log('Success! Split audio into 3 pieces.');

} catch (error) {
  console.error('An error occurred during audio processing:', error.message);
}

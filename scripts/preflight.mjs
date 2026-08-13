import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pointer = JSON.parse(fs.readFileSync(path.join(root, 'content', 'ACTIVE_EPISODE.json'), 'utf8'));
const episodeFolder = pointer.episodeFolder;
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'episodes', episodeFolder, 'data.json'), 'utf8'));
const imageRoot = path.join(root, 'public', data.assetFolder);
const audioRoot = path.join(root, 'public', data.audioFolder);
const failures = [];
const fail = (m) => failures.push(m);
let runtime = 0;

if (data.singleCharacterWholeEpisode !== true) fail('singleCharacterWholeEpisode must be true');
if (data.allowCharacterSwitch !== false) fail('allowCharacterSwitch must be false');
if (data.allowSecondVisibleCharacter !== false) fail('allowSecondVisibleCharacter must be false');
if (data.allVideoSectionsUseCharacterImage !== true) fail('allVideoSectionsUseCharacterImage must be true');
if (data.remotion?.subtitles !== false || data.remotion?.voiceCaptions !== false) fail('subtitles and voice captions must be disabled');
if (data.restVisualPolicy?.blankScreenForbidden !== true) fail('blank rest screens are not allowed');

for (const scene of data.scenes || []) {
  if (scene.type !== 'cover') runtime += Number(scene.duration || 0) + Number(scene.restAfter || 0);
  if (scene.type !== 'cover' && !scene.image) fail(`Scene ${scene.scene} needs a character image`);
  if (scene.type === 'exercise' && Number(scene.duration) !== 20) fail(`Scene ${scene.scene} must last 20s`);
  if (scene.image && !fs.existsSync(path.join(imageRoot, scene.image))) fail(`Missing image: ${scene.image}`);
  if (scene.voice && !fs.existsSync(path.join(audioRoot, scene.voice))) fail(`Missing voice: ${scene.voice}`);
}

if (!data.scenes?.find((s) => s.scene === '02' && s.image === 'Bild 02.png')) fail('Scene 02 must use Bild 02.png');
if (data.id === 'KM-001' && runtime !== 320) fail(`KM-001 runtime must be 320s, found ${runtime}s`);

if (failures.length) {
  console.error('PRE-FLIGHT FAILED');
  failures.forEach((m, i) => console.error(`${i + 1}. ${m}`));
  process.exit(1);
}

console.log(`PRE-FLIGHT PASSED — ${episodeFolder} — ${runtime}s`);

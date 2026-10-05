import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const arg = (name) => {
  const item = args.find((value) => value.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : '';
};

const episodeFolder = arg('episode');
const candidateNumber = Number(arg('candidate'));
if (!episodeFolder || ![1, 2, 3].includes(candidateNumber)) {
  console.error('COVER SELECTION FAILED: use --episode=KM-XXX-slug --candidate=1|2|3');
  process.exit(1);
}

const paths = resolveEpisodePaths(root, episodeFolder);
if (paths.structure === 'missing') {
  console.error(`COVER SELECTION FAILED: episode not found: ${episodeFolder}`);
  process.exit(1);
}
const data = readEpisodeData(paths);
if (Number(data.structureVersion || 0) < 3) {
  console.error('COVER SELECTION FAILED: this command is for scene-numbered V3 episodes only.');
  process.exit(1);
}

const candidates = ['Cover-Kandidat-01.png', 'Cover-Kandidat-02.png', 'Cover-Kandidat-03.png'];
const missing = candidates.filter((name) => !fs.existsSync(path.join(paths.imagesDir, name)));
if (missing.length) {
  console.error(`COVER SELECTION FAILED: all three candidates must exist first. Missing: ${missing.join(', ')}`);
  process.exit(1);
}

const winner = candidates[candidateNumber - 1];
const winnerPath = path.join(paths.imagesDir, winner);
const finalPath = path.join(paths.imagesDir, 'Szene 01.png');
fs.rmSync(finalPath, {force: true});
fs.renameSync(winnerPath, finalPath);

for (const name of candidates) {
  if (name === winner) continue;
  fs.rmSync(path.join(paths.imagesDir, name), {force: true});
}

const selection = {
  schemaVersion: 1,
  episodeFolder,
  status: 'SELECTED',
  selectedCandidate: candidateNumber,
  selectedCandidateOriginalFile: winner,
  finalFile: 'Szene 01.png',
  selectedAt: new Date().toISOString(),
  userSelectionRequired: true,
  soleReferenceForLaterScenes: 'Szene 01.png',
  secondaryImageReferencesForbidden: true
};
fs.writeFileSync(paths.coverSelectionPath, `${JSON.stringify(selection, null, 2)}\n`, 'utf8');

if (paths.statusPath && fs.existsSync(paths.statusPath)) {
  const status = JSON.parse(fs.readFileSync(paths.statusPath, 'utf8'));
  status.coverSelected = true;
  status.coverSelectionPending = false;
  fs.writeFileSync(paths.statusPath, `${JSON.stringify(status, null, 2)}\n`, 'utf8');
}

console.log(`COVER SELECTED — candidate ${candidateNumber} -> Szene 01.png`);
console.log('Pipeline unlocked: generate Szene 02 through Szene 28 exactly once, using Szene 01.png as the ONLY image reference.');

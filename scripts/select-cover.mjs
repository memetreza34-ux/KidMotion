import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {loadContract, currentContractErrors} from './contract.mjs';
import {humanOnlyWorkout,coverHumanReviewErrors} from './workout-character-policy.mjs';

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
const contract = loadContract(root);
const contractErrors = currentContractErrors(data, contract);
if (contractErrors.length) {
  console.error('COVER SELECTION FAILED: episode does not satisfy the current production contract.');
  contractErrors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

const candidates = ['Cover-Kandidat-01.png', 'Cover-Kandidat-02.png', 'Cover-Kandidat-03.png'];
const winner = candidates[candidateNumber - 1];
const winnerPath = path.join(paths.imagesDir, winner);
const finalPath = path.join(paths.imagesDir, 'Szene 01.png');
const selectionAlready = fs.existsSync(paths.coverSelectionPath)
  ? JSON.parse(fs.readFileSync(paths.coverSelectionPath, 'utf8')) : {};

if (humanOnlyWorkout(data) && selectionAlready.status !== 'SELECTED'){
  const reviewFile=path.join(paths.techDir,'COVER_HUMAN_REVIEW.json');
  const errors=coverHumanReviewErrors(paths.imagesDir,reviewFile);
  if(errors.length){
    console.error('COVER SELECTION BLOCKED: three actual HUMAN cover images must pass visual review first.');
    errors.forEach((error,i)=>console.error(String(i+1)+'. '+error));
    process.exit(1);
  }
}
if (selectionAlready.status === 'SELECTED') {
  if (Number(selectionAlready.selectedCandidate) !== candidateNumber) {
    console.error('COVER SELECTION BLOCKED: an existing selection differs. No cover will be overwritten.');
    process.exit(1);
  }
  if (!fs.existsSync(finalPath)) {
    console.error('COVER SELECTION BLOCKED: selected Szene 01.png is missing. Never replace it automatically.');
    process.exit(1);
  }
  for (const name of candidates) {
    const file = path.join(paths.imagesDir, name);
    if (fs.existsSync(file)) fs.rmSync(file, {force:true});
  }
  console.log('COVER ALREADY SELECTED — rejected candidate files cleaned; keep Szene 01.png unchanged.');
  process.exit(0);
}
if (fs.existsSync(finalPath)) {
  console.error('COVER SELECTION BLOCKED: Szene 01.png already exists without confirmed selection. Do not overwrite it.');
  process.exit(1);
}
const missing = candidates.filter((name) => !fs.existsSync(path.join(paths.imagesDir, name)));
if (missing.length) {
  console.error(`COVER SELECTION FAILED: all three candidates must exist first. Missing: ${missing.join(', ')}`);
  process.exit(1);
}

// Only after the explicit user choice, move the selected candidate and delete
// both losers immediately. This is not a Phase-3 task.
fs.renameSync(winnerPath, finalPath);
for (const name of candidates) {
  if (name !== winner) fs.rmSync(path.join(paths.imagesDir, name), {force:true});
}

const selectedCoverSha256 = crypto.createHash('sha256').update(fs.readFileSync(finalPath)).digest('hex');

const selection = {
  schemaVersion: 1,
  episodeFolder,
  status: 'SELECTED',
  selectedCandidate: candidateNumber,
  selectedCandidateOriginalFile: winner,
  finalFile: 'Szene 01.png',
  selectedAt: new Date().toISOString(),
  rejectedCandidatesDeleted: true,
  selectedCoverSha256,
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
console.log('Both other cover candidates deleted immediately; no unused cover remains.');
console.log('Pipeline unlocked: generate Szene 02 through Szene 28 exactly once, using Szene 01.png as the ONLY image reference.');

import {spawnSync} from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const run = (label, command, args) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {stdio:'inherit'});
  if (result.status !== 0) {
    console.error(`\nRENDER BLOCKED at: ${label}`);
    process.exit(result.status || 1);
  }
};

run('TYPECHECK', npm, ['run','typecheck']);
run('PROJECT DOCTOR', npm, ['run','project:doctor']);
run('REPOSITORY CONTRACT QA', npm, ['run','repo:qa']);
run('PROMPT / VOICE PLAN QA', npm, ['run','prompt:qa']);
run('PREFLIGHT', npm, ['run','preflight']);
run('SCENE INTEGRITY QA', npm, ['run','scene:qa']);
run('PHASE 3 INPUT GATE', npm, ['run','phase3:gate']);
run('REMOTION RENDER', npx, ['remotion','render','src/index.ts','KidMotionVideo','out/kidmotion.mp4','--crf','28','--preset','faster']);
run('POSTRENDER QA', npm, ['run','postrender:qa']);
run('EXPORT PACK - VIDEO + COVER + COPY TEXTS + TIMED SRT', npm, ['run','export:pack']);

console.log('\nGUARDED RENDER COMPLETE — all mandatory gates passed.');

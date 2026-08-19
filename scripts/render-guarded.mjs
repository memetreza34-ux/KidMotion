import {spawnSync} from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const run = (label, command, args) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {stdio: 'inherit'});
  if (result.status !== 0) {
    console.error(`\nRENDER BLOCKED at: ${label}`);
    process.exit(result.status || 1);
  }
};

run('TYPECHECK', npm, ['run', 'typecheck']);
run('PROJECT DOCTOR', npm, ['run', 'project:doctor']);
run('PREFLIGHT', npm, ['run', 'preflight']);
run('ASSET GATE', npm, ['run', 'asset:gate']);
run('REMOTION RENDER', npx, ['remotion', 'render', 'src/index.ts', 'KidMotionVideo', 'out/kidmotion.mp4', '--crf', '28', '--preset', 'faster']);
run('POSTRENDER QA', npm, ['run', 'postrender:qa']);

console.log('\nGUARDED RENDER COMPLETE — all mandatory gates passed.');

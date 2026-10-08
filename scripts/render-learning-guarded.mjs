import {spawnSync} from 'node:child_process';

const npm=process.platform==='win32'?'npm.cmd':'npm';
const npx=process.platform==='win32'?'npx.cmd':'npx';
const run=(label,cmd,args)=>{
  console.log('\n=== '+label+' ===');
  const result=spawnSync(cmd,args,{stdio:'inherit'});
  if(result.status!==0){
    console.error('LEARNING RENDER BLOCKED at '+label);
    process.exit(result.status||1);
  }
};

run('TYPECHECK',npm,['run','typecheck']);
run('PROJECT DOCTOR',npm,['run','project:doctor']);
run('REPOSITORY QA',npm,['run','repo:qa']);
run('LEARNING PREFLIGHT',npm,['run','learning:preflight']);
run('LEARNING ASSET GATE',npm,['run','learning:asset:gate']);
run('REMOTION LEARNING RENDER',npx,['remotion','render','src/index.ts','KidMotionLearning','out/kidmotion-learning.mp4','--crf','28','--preset','faster']);

console.log('\nLEARNING RENDER COMPLETE');

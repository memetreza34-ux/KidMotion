import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const fail=(m)=>failures.push(m);
const read=(rel)=>{
  const file=path.join(root,rel);
  return fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
};
const json=(rel)=>JSON.parse(read(rel)||'{}');

const engine=json('config/learning-engine.json');
const contract=json('config/formats/learning.json');
const channel=json('config/channel.json');
const pkg=json('package.json');

if(engine.status!=='ACTIVE') fail('Learning engine must be ACTIVE.');
for(const band of ['3-4','5-8','9-12']) if(!engine.ageBands?.[band]) fail('Missing age band '+band+'.');
for(const mode of ['CONCEPT_STORY','QUESTION_EXPLAINER','SONG_MEMORY','PRACTICE_REVEAL','VISUAL_COMPARE','MINI_DOCUMENTARY']){
  if(!engine.learningModes?.[mode]) fail('Missing learning mode '+mode+'.');
}
for(const role of ['HOOK','TEACH','EXAMPLE','PRACTICE','REVEAL','APPLY','RECAP']){
  if(!(engine.allowedSceneRoles||[]).includes(role)) fail('Missing core scene role '+role+'.');
}
if(engine.objectivePolicy?.exactlyOnePrimaryObjective!==true) fail('Engine must require exactly one primary objective.');
if(engine.interactionPolicy?.practiceRevealPairRequired!==true) fail('Engine must require PRACTICE/REVEAL.');
if(engine.characterPolicy?.default!=='none') fail('Pure learning character default must be none.');

if(contract.engineFile!=='config/learning-engine.json') fail('Learning contract must reference learning-engine.json.');
if(Number(contract.contractVersion)<2) fail('Learning contract must be v2+.');
if(channel.learningEngineFile!=='config/learning-engine.json') fail('Channel must reference learning engine.');

const expected={
  'kidmotion:new:learning':'node scripts/new-learning-episode.mjs',
  'learning:prompt:qa':'node scripts/learning-prompt-qa.mjs',
  'learning:system:doctor':'node scripts/learning-system-doctor.mjs',
  'learning:repo:qa':'node scripts/learning-repo-qa.mjs'
};
for(const [name,command] of Object.entries(expected)) if(pkg.scripts?.[name]!==command) fail('package script '+name+' mismatch.');

const generator=read('scripts/new-learning-episode.mjs');
for(const token of ['age-band','learning-mode','primaryLearningObjective','practiceMoments','misconceptions','SCENE ROLE:']){
  if(!generator.includes(token)) fail('Learning generator missing '+token+'.');
}

const qa=read('scripts/learning-prompt-qa.mjs');
for(const token of ['PRACTICE','REVEAL','transferApplication','sourceNote','characterJustification','learningChannels']){
  if(!qa.includes(token)) fail('Learning prompt QA missing '+token+'.');
}

const agent=read('docs/PHASE2_LEARNING_AGENT.md');
for(const token of ['Age-band behavior','PRACTICE','REVEAL','Character rule','TEACHING JOB']){
  if(!agent.includes(token)) fail('PHASE2_LEARNING_AGENT.md missing '+token+'.');
}
if(!read('docs/LEARNING_ENGINE.md').includes('ONE PRIMARY LEARNING OBJECTIVE')) fail('LEARNING_ENGINE.md is incomplete.');

const renderer=read('src/LearningVideo.tsx');
if(renderer.includes('CircularTimer')) fail('Learning renderer must not use workout timer.');

const workflow=read('.github/workflows/quality.yml');
for(const token of ['npm run learning:system:doctor','npm run learning:repo:qa']){
  if(!workflow.includes(token)) fail('CI workflow missing '+token+'.');
}

if(failures.length){
  console.error('LEARNING SYSTEM DOCTOR FAILED');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}
console.log('LEARNING SYSTEM DOCTOR PASSED');
console.log('Protected: age bands, teaching modes, one objective, active recall, practice/reveal, character optionality and learning-specific CI.');

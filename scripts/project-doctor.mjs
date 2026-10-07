import fs from 'node:fs';
import path from 'node:path';
import {loadContract} from './contract.mjs';

const root=process.cwd();
const contract=loadContract(root);
const failures=[];
const fail=(m)=>failures.push(m);
const read=(rel)=>{
  const file=path.join(root,rel);
  return fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
};

const pkg=JSON.parse(read('package.json')||'{}');
const expectedScripts={
  'scripts:check':'node scripts/syntax-check.mjs',
  'project:doctor':'node scripts/project-doctor.mjs',
  'repo:qa':'node scripts/repo-qa.mjs',
  'prompt:qa':'node scripts/prompt-plan-qa.mjs',
  'scene:qa':'node scripts/scene-integrity-qa.mjs',
  'assets:approve':'node scripts/approve-assets.mjs',
  'phase3:ingest':'node scripts/phase3-ingest.mjs',
  'phase3:prepare':'node scripts/phase3-prepare.mjs',
  'phase3:gate':'node scripts/asset-gate.mjs',
  'render':'node scripts/render-guarded.mjs',
  'render:safe':'node scripts/render-guarded.mjs',
  'kidmotion:new':'node scripts/new-episode.mjs',
  'kidmotion:select-cover':'node scripts/select-cover.mjs',
  'kidmotion:activate':'node scripts/activate-episode.mjs'
};
for(const [name,command] of Object.entries(expectedScripts)){
  if(pkg.scripts?.[name]!==command) fail('package.json script '+name+' must be: '+command);
}
if(pkg.scripts?.['render:short']) fail('render:short is forbidden.');

const p3=contract.phaseContract?.phase3||{};
if(p3.antigravityMayGenerateImages!==false) fail('Contract must forbid Antigravity image generation.');
if(p3.imagePixelModificationForbidden!==true) fail('Contract must forbid image pixel modification during Phase 3 ingest.');
if(p3.assetIngestAllowed!==true || p3.archiveExtractionAllowed!==true || p3.audioTranscodeAllowed!==true) fail('Contract must allow technical raw-handoff ingest.');
if(p3.userManualUnzipRequired!==false || p3.userManualAudioConversionRequired!==false) fail('Contract must not require user-manual ZIP/audio normalization.');
if(p3.rawHandoffEntryPoint!=='phase3:prepare') fail('Raw handoff entry point must be phase3:prepare.');
if(p3.ambiguousSceneMappingBehavior!=='BLOCK_WITH_REPORT') fail('Ambiguous scene mapping must block with a report.');

const pipeline=JSON.parse(read('config/pipeline.json')||'{}');
if(Number(pipeline.pipelineVersion)!==Number(contract.pipelineVersion)) fail('Pipeline version mismatch.');
if(Number(pipeline.productionContractVersion)!==Number(contract.contractVersion)) fail('Production contract version mismatch.');
if(pipeline.phaseWorkflow?.phase3RawHandoffEntryPoint!=='npm run phase3:prepare -- --episode=<episode-folder>') fail('Pipeline raw handoff entry point mismatch.');
if(pipeline.phaseWorkflow?.phase3AgentHandlesTechnicalNormalization!==true) fail('Pipeline must make Antigravity handle technical normalization.');
if(pipeline.phaseWorkflow?.phase3ImagePixelModificationForbidden!==true) fail('Pipeline must forbid image pixel modification.');

const anti=read('ANTIGRAVITY.md');
for(const token of ['ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true','phase3:prepare','assets:approve','phase3:gate','render:safe']){
  if(!anti.includes(token)) fail('ANTIGRAVITY.md missing: '+token);
}
const order=['phase3:prepare','assets:approve','phase3:gate','render:safe'].map((t)=>anti.indexOf(t));
if(order.some((i)=>i<0) || !(order[0]<order[1] && order[1]<order[2] && order[2]<order[3])) fail('ANTIGRAVITY.md has the wrong Phase 3 order.');

const ingest=read('scripts/phase3-ingest.mjs');
for(const token of ['PHASE 3 INGEST','PHASE3_INGEST.json','ffmpeg','ffprobe','coverSelectionReconstructed','pixelContentChanged:false','technicalHandoffReady']){
  if(!ingest.includes(token)) fail('phase3-ingest.mjs missing behavior: '+token);
}
if(/image_gen|generateImage|google\.flow|flow\.google/i.test(ingest)) fail('phase3-ingest.mjs appears to invoke image generation.');

const prepare=read('scripts/phase3-prepare.mjs');
for(const token of ['phase3:ingest','scene:qa','PHASE3_PREPARE.json','ANTIGRAVITY_VISUAL_REVIEW']){
  if(!prepare.includes(token)) fail('phase3-prepare.mjs missing behavior: '+token);
}
if(prepare.includes('assets:approve') && prepare.includes("spawnSync(npm,['run','assets:approve'")) fail('phase3:prepare must not fake visual review or auto-approve assets.');

const approval=read('scripts/approve-assets.mjs');
if(!approval.includes('phase2HandoffComplete') || !approval.includes('phase3InputLocked')) fail('Asset approval must mark Phase 3 input lock.');
const gate=read('scripts/asset-gate.mjs');
if(!gate.includes('phase2HandoffComplete') || !gate.includes('phase3InputLocked')) fail('Asset gate must enforce Phase 3 input lock.');

const guarded=read('scripts/render-guarded.mjs');
for(const token of ['typecheck','project:doctor','repo:qa','prompt:qa','preflight','scene:qa','phase3:gate','postrender:qa']){
  if(!guarded.includes(token)) fail('render-guarded.mjs must run '+token);
}
if(!guarded.includes("'KidMotionVideo'")) fail('Guarded render must target KidMotionVideo.');

const visual=JSON.parse(read('config/visual-policy.json')||'{}');
if(visual.status!=='READY') fail('Visual policy must be READY.');
if(visual.referenceWorkflow?.soleReferenceForAllLaterScenes!=='Szene 01.png') fail('Visual policy must keep Szene 01 as sole Phase 2 reference.');

const sourceChecks=[
  ['src/components/ExerciseScene.tsx','CircularTimer'],
  ['src/components/RestScreen.tsx','CircularTimer'],
  ['src/WorkoutVideo.tsx','exercise.readyImage']
];
for(const [file,token] of sourceChecks) if(!read(file).includes(token)) fail(file+' must include '+token+'.');
if(read('src/WorkoutVideo.tsx').includes('nextExercise?.image')) fail('WorkoutVideo must not reuse next exercise image for GET READY.');
if(read('src/components/ExerciseScene.tsx').includes('KidProgressBar')) fail('ExerciseScene must not render a progress bar.');
if(!read('src/components/CircularTimer.tsx').includes('const size = 192')) fail('CircularTimer must remain 192px.');

const scriptsDir=path.join(root,'scripts');
for(const name of fs.readdirSync(scriptsDir)){
  if(!name.endsWith('.mjs')) continue;
  const content=read(path.join('scripts',name));
  if(/episodes\/KM-\d{3}-[a-z0-9-]+/i.test(content)) fail('scripts/'+name+' hardcodes a specific episode path.');
}

const workflow=read('.github/workflows/quality.yml');
for(const token of ['npm run scripts:check','npm run typecheck','npm run project:doctor','npm run repo:qa']){
  if(!workflow.includes(token)) fail('Quality workflow must run '+token+'.');
}

if(failures.length){
  console.error('PROJECT DOCTOR FAILED');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}
console.log('PROJECT DOCTOR PASSED');
console.log('Protected: raw ZIP/audio handoff, no image generation, deterministic mapping, real visual review, approval-before-gate, timer-only Remotion.');

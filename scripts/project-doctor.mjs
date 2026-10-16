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

const channel=JSON.parse(read('config/channel.json')||'{}');
if(channel.projectType!=='general-kids-channel') fail('config/channel.json must declare general-kids-channel.');
if(channel.subjectPolicy?.childOrMascotRequired!==false) fail('Channel must not globally require a child or mascot.');
for(const format of ['workout','learning','learn-and-move']) if(channel.formats?.[format]?.status!=='ACTIVE') fail('Channel format must be ACTIVE: '+format);
const learningContract=JSON.parse(read('config/formats/learning.json')||'{}');
if(learningContract.format!=='learning') fail('Missing pure learning format contract.');
if(learningContract.characterPolicy?.visibleChildRequired!==false || learningContract.structure?.timerRequired!==false || learningContract.structure?.getReadyRequired!==false) fail('Learning format must not inherit workout/child/timer requirements.');
if(!read('docs/FORMAT_ROUTER.md').includes('LEARNING')) fail('FORMAT_ROUTER.md missing LEARNING route.');

const pkg=JSON.parse(read('package.json')||'{}');
const expectedScripts={
  'scripts:check':'node scripts/syntax-check.mjs',
  'project:doctor':'node scripts/project-doctor.mjs',
  'repo:qa':'node scripts/repo-qa.mjs',
  'prompt:qa':'node scripts/prompt-plan-qa.mjs',
  'flow:batch':'node scripts/flow-batch.mjs',
  'flow:save':'node scripts/save-flow-image.mjs',
  'flow:save:test':'node --test scripts/flow-save-lib.test.mjs',
  'phase2:finalize':'node scripts/phase2-finalize.mjs',
  'phase2:test':'node --test scripts/phase2-finalize.test.mjs',
  'scene:qa':'node scripts/scene-integrity-qa.mjs',
  'assets:approve':'node scripts/approve-assets.mjs',
  'phase3:ingest':'node scripts/phase3-ingest.mjs',
  'phase3:prepare':'node scripts/phase3-prepare.mjs',
  'phase3:gate':'node scripts/asset-gate.mjs',
  'render':'node scripts/render-guarded.mjs',
  'render:safe':'node scripts/render-guarded.mjs',
  'kidmotion:new':'node scripts/new-episode.mjs',
  'kidmotion:new:workout':'node scripts/new-workout-episode.mjs',
  'kidmotion:new:learning':'node scripts/new-learning-episode.mjs',
  'learning:prompt:qa':'node scripts/learning-prompt-qa.mjs',
  'learning:activate':'node scripts/activate-learning.mjs',
  'learning:preflight':'node scripts/learning-preflight.mjs',
  'learning:assets:approve':'node scripts/approve-learning-assets.mjs',
  'learning:asset:gate':'node scripts/learning-asset-gate.mjs',
  'learning:render':'node scripts/render-learning-guarded.mjs',
  'kidmotion:select-cover':'node scripts/select-cover.mjs',
  'kidmotion:activate':'node scripts/activate-episode.mjs'
};
for(const [name,command] of Object.entries(expectedScripts)){
  if(pkg.scripts?.[name]!==command) fail('package.json script '+name+' must be: '+command);
}
if(pkg.scripts?.['render:short']) fail('render:short is forbidden.');

const p3=contract.phaseContract?.phase3||{};
if(p3.antigravityMayGenerateImages!==false) fail('Phase 3 montage must forbid image generation.');
if(p3.userAuthorizedRepairException?.enabledOnlyByExplicitUserInstruction!==true||p3.userAuthorizedRepairException?.realizationPhase!=='PHASE_2_ONLY') fail('Optional image repair must require exact user approval and occur only in Phase 2.');
if(pkg.scripts?.['images:permission']!=='node scripts/image-generation-permission.mjs') fail('Missing scoped explicit-user image permission command.');
if(p3.imagePixelModificationForbidden!==true) fail('Contract must forbid image pixel modification during Phase 3 ingest.');
if(p3.assetIngestAllowed!==true || p3.archiveExtractionAllowed!==true || p3.audioTranscodeAllowed!==true) fail('Contract must allow technical raw-handoff ingest.');
if(p3.userManualUnzipRequired!==false || p3.userManualAudioConversionRequired!==false) fail('Contract must not require user-manual ZIP/audio normalization.');
if(p3.rawHandoffEntryPoint!=='phase3:prepare') fail('Raw handoff entry point must be phase3:prepare.');
if(p3.ambiguousSceneMappingBehavior!=='BLOCK_WITH_REPORT') fail('Ambiguous scene mapping must block with a report.');

const humanWorkout=JSON.parse(read('config/workout-character-policy.json')||'{}');
if(humanWorkout.species!=='human') fail('Workout main character must be human.');
const selector=read('scripts/select-cover.mjs');
if(!selector.includes('coverHumanReviewErrors')) fail('Cover selection must verify inspected human covers.');
const humanQa=read('scripts/prompt-plan-qa.mjs');
if(!humanQa.includes('humanPromptErrors')) fail('Prompt QA must enforce positive human character descriptions.');
const workoutGenerator=read('scripts/new-workout-episode.mjs');
if(!workoutGenerator.includes('COVER_HUMAN_REVIEW.json')||!workoutGenerator.includes('HUMAN ${character}')) fail('New workout generator must plan human covers and scenes.');
const promptQuality=JSON.parse(read('config/prompt-quality.json')||'{}');
if(Number(promptQuality.version)!==Number(contract.promptContract?.currentPromptSpecVersion)) fail('Prompt Quality version mismatch.');
for(const label of ['VIEWER TAKEAWAY:','SHOT / COMPOSITION:','NEGATIVE / STABILITY:','QUALITY CHECK:']) {
  if(!(promptQuality.sceneRequiredSections||[]).includes(label)) fail('Prompt Quality v2 missing required scene section '+label);
}
const flowAgent=read('docs/PHASE2_FLOW_AGENT.md');
for(const token of ['flow:batch','5er-Schritte','VIEWER TAKEAWAY:','SHOT / COMPOSITION:','2-Sekunden-Test']) {
  if(!flowAgent.includes(token)) fail('PHASE2_FLOW_AGENT.md missing '+token);
}
const phase2Finalize=read('scripts/phase2-finalize.mjs');
for(const token of ['PHASE2_FINAL_AUDIT.json','PHASE2_MISSING_SCENES.json','PHASE2_HANDOFF.json','auditImages','repairAllowed']){
  if(!phase2Finalize.includes(token)) fail('phase2:finalize is missing '+token);
}
const phase2Library=read('scripts/phase2-finalize-lib.mjs');
for(const token of ['removedRejectedCovers','unexpected','invalidPng','exactDuplicates','conflicts']){
  if(!phase2Library.includes(token)) fail('Phase 2 final audit is missing '+token);
}

const flowBatchScript=read('scripts/flow-batch.mjs');
for(const token of ['FLOW_BATCH_STATE.json','OUT_OF_ORDER_BLOCKED','CURRENT HARD 5-SCENE STEP','laterBatchOutputsFound']) {
  if(!flowBatchScript.includes(token)) fail('flow-batch.mjs missing '+token);
}

const pipeline=JSON.parse(read('config/pipeline.json')||'{}');
if(Number(pipeline.pipelineVersion)!==Number(contract.pipelineVersion)) fail('Pipeline version mismatch.');
if(Number(pipeline.productionContractVersion)!==Number(contract.contractVersion)) fail('Production contract version mismatch.');
if(pipeline.phaseWorkflow?.phase3RawHandoffEntryPoint!=='npm run phase3:prepare -- --episode=<episode-folder>') fail('Pipeline raw handoff entry point mismatch.');
if(pipeline.phaseWorkflow?.phase3AgentHandlesTechnicalNormalization!==true) fail('Pipeline must make Antigravity handle technical normalization.');
if(pipeline.phaseWorkflow?.phase3ImagePixelModificationForbidden!==true) fail('Pipeline must forbid image pixel modification.');
if(pipeline.batchGenerationPolicy?.hardBatchBoundaries!==true || pipeline.batchGenerationPolicy?.batchMustBeCompleteBeforeNext!==true) fail('Pipeline must enforce hard 5-scene batch boundaries.');

const anti=read('docs/ANTIGRAVITY.md');
for(const token of ['ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN_BY_DEFAULT=true','ANTIGRAVITY_PHASE3_IMAGE_GENERATION_FORBIDDEN=true','images:permission','phase3:prepare','assets:approve','phase3:gate','render:safe']){
  if(!anti.includes(token)) fail('ANTIGRAVITY.md missing: '+token);
}
const order=['npm run phase3:prepare','npm run assets:approve','npm run phase3:gate','npm run render:safe'].map((t)=>anti.indexOf(t));
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

const learningRoot=read('src/Root.tsx');
if(!learningRoot.includes('KidMotionLearning')) fail('Root.tsx must register KidMotionLearning composition.');
const learningVideoSource=read('src/LearningVideo.tsx');
if(!learningVideoSource.includes('LearningVideoData')) fail('LearningVideo.tsx must use LearningVideoData.');
if(learningVideoSource.includes('CircularTimer')) fail('Pure learning renderer must not use workout countdown timer.');
const learningActivateSource=read('scripts/activate-learning.mjs');
if(!learningActivateSource.includes('active-learning.ts')) fail('Learning activation must generate active-learning.ts.');

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
console.log('Protected: default-deny image generation, scoped user-approved Phase 2 repairs, immediate rename, immutable Phase 3 inputs and real review.');

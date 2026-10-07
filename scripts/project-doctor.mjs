import fs from 'node:fs';
import path from 'node:path';
import {loadContract} from './contract.mjs';

const root = process.cwd();
const contract = loadContract(root);
const failures = [];
const fail = (m) => failures.push(m);
const read = (rel) => {
  const file = path.join(root, rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
};

const pkg = JSON.parse(read('package.json') || '{}');
const expectedScripts = {
  'project:doctor':'node scripts/project-doctor.mjs',
  'repo:qa':'node scripts/repo-qa.mjs',
  'prompt:qa':'node scripts/prompt-plan-qa.mjs',
  'scene:qa':'node scripts/scene-integrity-qa.mjs',
  'render':'node scripts/render-guarded.mjs',
  'render:safe':'node scripts/render-guarded.mjs',
  'kidmotion:new':'node scripts/new-episode.mjs',
  'kidmotion:select-cover':'node scripts/select-cover.mjs',
  'kidmotion:activate':'node scripts/activate-episode.mjs',
};
for (const [name,command] of Object.entries(expectedScripts)) {
  if (pkg.scripts?.[name] !== command) fail(`package.json script ${name} must be: ${command}`);
}
if (pkg.scripts?.['render:short']) fail('render:short is forbidden in longform-only KidMotion.');

if (contract.phaseContract?.phase3?.antigravityMayGenerateImages !== false) fail('Contract must forbid Antigravity image generation in Phase 3.');
if (contract.phaseContract?.phase3?.sourceImagesImmutable !== true) fail('Contract must make Phase 2 images immutable in Phase 3.');
if (contract.phaseContract?.phase3?.mayUseOnlyPhase2ApprovedImages !== true) fail('Contract must restrict Phase 3 to approved Phase 2 images.');
if (contract.phaseContract?.phase3?.missingOrChangedImageBehavior !== 'BLOCK_PHASE_3') fail('Missing/changed images must block Phase 3.');
if (contract.voiceContract?.voiceScriptFormat !== 'plain-continuous-text-only') fail('Voice script contract must be plain continuous text only.');
if (contract.voiceContract?.voiceScriptMustEqualExactTtsCopy !== true) fail('Voice script must exactly match VOICE_PLAN exactTtsCopy.');
if (contract.voiceContract?.voiceScriptTimecodesForbidden !== true) fail('Voice script timecodes must be forbidden.');

const globalAntigravity = read('ANTIGRAVITY.md');
if (!globalAntigravity.includes('ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true')) fail('ANTIGRAVITY.md must explicitly forbid image generation.');
if (!globalAntigravity.includes('npm run phase3:gate')) fail('ANTIGRAVITY.md must require phase3:gate.');

const pipeline = JSON.parse(read('config/pipeline.json') || '{}');
if (Number(pipeline.pipelineVersion) !== Number(contract.pipelineVersion)) fail('pipelineVersion must match v3 contract.');
if (Number(pipeline.productionContractVersion) !== Number(contract.contractVersion)) fail('pipeline productionContractVersion mismatch.');
if (pipeline.productionContractFile !== 'config/v3-contract.json') fail('pipeline must point to config/v3-contract.json.');
if (pipeline.imageGenerationPolicy?.soleReferenceImage !== contract.generationContract.soleImageReference) fail('Pipeline must use Szene 01.png as sole later-scene reference.');
if (pipeline.imageGenerationPolicy?.secondaryImageReferencesForbidden !== true) fail('Pipeline must forbid secondary image references.');
if (pipeline.imageGenerationPolicy?.maximumGenerationAttemptsPerNonCoverScene !== 1) fail('Pipeline must allow only one later-scene generation attempt.');
if (pipeline.batchGenerationPolicy?.parallelSceneGenerationForbidden !== true || pipeline.batchGenerationPolicy?.waitForCurrentFlowResultBeforeNextScene !== true) fail('Pipeline must enforce serial Flow generation.');
if (pipeline.renderPolicy?.remotionOwnsTimerOnly !== true || pipeline.renderPolicy?.remotionOwnsProgressBar !== false) fail('Remotion must own timer only and no progress bar.');
if (pipeline.timerPolicy?.sizePixels !== contract.remotionContract.timerSizePixels || pipeline.timerPolicy?.requiredSafeZonePixels !== contract.remotionContract.timerSafeZonePixels) fail('Timer config must match production contract.');
if (pipeline.phaseWorkflow?.phase3ImageGenerationForbidden !== true || pipeline.phaseWorkflow?.phase3UsesOnlyApprovedPhase2Images !== true) fail('Pipeline must enforce Phase 3 assembly-only image ownership.');

const visual = JSON.parse(read('config/visual-policy.json') || '{}');
if (visual.status !== 'READY') fail('config/visual-policy.json must be READY.');
if (visual.referenceWorkflow?.soleReferenceForAllLaterScenes !== 'Szene 01.png') fail('Visual policy must use Szene 01 as sole reference.');
if (visual.referenceWorkflow?.secondaryImageReferencesForbidden !== true) fail('Visual policy must forbid second references.');
if (visual.referenceWorkflow?.generateEachLaterSceneExactlyOnce !== true) fail('Visual policy must require one generation per later scene.');

const guarded = read('scripts/render-guarded.mjs');
for (const required of ['typecheck','project:doctor','repo:qa','prompt:qa','preflight','scene:qa','phase3:gate','postrender:qa']) {
  if (!guarded.includes(required)) fail(`render-guarded.mjs must run ${required}.`);
}
if (!guarded.includes("'KidMotionVideo'")) fail('Guarded render must target KidMotionVideo.');

const generator = read('scripts/new-episode.mjs');
for (const required of ['loadContract','expectedSceneSpecs','sceneFile','productionContractVersion','VOICE_PLAN.json','planning-required','__PLAN_REQUIRED__','ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true','phase3:gate']) {
  if (!generator.includes(required)) fail(`new-episode.mjs missing contract behavior: ${required}`);
}

const promptQa = read('scripts/prompt-plan-qa.mjs');
for (const required of ['loadContract','VOICE_PLAN.json','FINAL GOOGLE FLOW PROMPT','voice-script.txt must contain ONLY']) {
  if (!promptQa.includes(required)) fail(`prompt-plan-qa.mjs missing contract behavior: ${required}`);
}

const sourceChecks = [
  ['src/components/ExerciseScene.tsx','CircularTimer'],
  ['src/components/RestScreen.tsx','CircularTimer'],
  ['src/WorkoutVideo.tsx','exercise.readyImage'],
];
for (const [file,token] of sourceChecks) if (!read(file).includes(token)) fail(`${file} must include ${token}.`);
if (read('src/WorkoutVideo.tsx').includes('nextExercise?.image')) fail('WorkoutVideo must not reuse the next exercise image for GET READY.');
if (read('src/components/ExerciseScene.tsx').includes('KidProgressBar')) fail('ExerciseScene must not render a progress bar.');
if (!read('src/components/CircularTimer.tsx').includes('const size = 192')) fail('CircularTimer must remain 192px.');
if (fs.existsSync(path.join(root,'src','components','KidProgressBar.tsx'))) fail('KidProgressBar.tsx must not exist.');

const scriptsDir = path.join(root,'scripts');
for (const name of fs.readdirSync(scriptsDir)) {
  if (!name.endsWith('.mjs')) continue;
  const content = read(path.join('scripts',name));
  if (/episodes\/KM-\d{3}-[a-z0-9-]+/i.test(content)) fail(`scripts/${name} hardcodes a specific episode. Global production scripts must be generic.`);
}

const approvalScript = read('scripts/approve-assets.mjs');
if (!approvalScript.includes('phase2HandoffComplete') || !approvalScript.includes('phase3ImageGenerationForbidden')) fail('approve-assets.mjs must mark the Phase 2 → Phase 3 handoff.');
const assetGateScript = read('scripts/asset-gate.mjs');
if (!assetGateScript.includes('phase2HandoffComplete') || !assetGateScript.includes('phase3InputLocked')) fail('asset-gate.mjs must enforce the Phase 3 input lock.');

const workflow = read('.github/workflows/quality.yml');
for (const required of ['npm run typecheck','npm run project:doctor','npm run repo:qa']) {
  if (!workflow.includes(required)) fail(`Quality workflow must run ${required}.`);
}

const gitignore = read('.gitignore').split(/\r?\n/).map((x)=>x.trim());
if (gitignore.includes('package-lock.json')) fail('package-lock.json must not be ignored.');
if (fs.existsSync(path.join(root,'.DS_Store')) || fs.existsSync(path.join(root,'public','.DS_Store'))) fail('Tracked .DS_Store files are forbidden.');

if (failures.length) {
  console.error('PROJECT DOCTOR FAILED');
  failures.forEach((m,i)=>console.error(`${i+1}. ${m}`));
  process.exit(1);
}
console.log('PROJECT DOCTOR PASSED');
console.log('Protected: central contract, generic scripts, serial Flow generation, sole Szene 01 reference, timed voice plan, timer-only Remotion and repo-wide QA.');

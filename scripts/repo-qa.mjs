import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {humanOnlyWorkout} from './workout-character-policy.mjs';
import {loadContract, expectedSceneSpecs, sceneFile, hasPlanningPlaceholder, currentContractErrors, validateVoicePlanObject} from './contract.mjs';

const root = process.cwd();
const contract = loadContract(root);
const failures = [];
const warnings = [];
const fail = (m) => failures.push(m);
const warn = (m) => warnings.push(m);
const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
const readJson = (p) => JSON.parse(read(p) || '{}');

for (const rootFile of contract.requiredRootFiles || []) {
  if (!fs.existsSync(path.join(root, rootFile))) fail(`Missing required root file: ${rootFile}`);
}

if (contract.phaseContract?.phase3?.antigravityMayGenerateImages !== false) fail('Contract must forbid Antigravity image generation in Phase 3.');
if (contract.phaseContract?.phase3?.antigravityMayRegenerateImages !== false) fail('Contract must forbid Antigravity image regeneration in Phase 3.');
if (contract.phaseContract?.phase3?.antigravityMayEditImages !== false) fail('Contract must forbid Antigravity image editing in Phase 3.');
if (contract.phaseContract?.phase3?.antigravityMayReplaceImages !== false) fail('Contract must forbid Antigravity image replacement in Phase 3.');
if (contract.phaseContract?.phase3?.mayUseOnlyPhase2ApprovedImages !== true) fail('Phase 3 must use only approved Phase 2 images.');
if (contract.phaseContract?.phase3?.missingOrChangedImageBehavior !== 'BLOCK_PHASE_3') fail('Missing/changed Phase 2 images must block Phase 3 after ingest/approval.');
if (contract.phaseContract?.phase3?.rawHandoffEntryPoint !== 'phase3:prepare') fail('Raw handoff must start with phase3:prepare.');
if (contract.phaseContract?.phase3?.userManualUnzipRequired !== false) fail('User manual unzip must not be required.');
if (contract.phaseContract?.phase3?.userManualAudioConversionRequired !== false) fail('User manual audio conversion must not be required.');
if (contract.phaseContract?.phase3?.ambiguousSceneMappingBehavior !== 'BLOCK_WITH_REPORT') fail('Ambiguous scene mapping must block with a report.');
if (contract.phaseContract?.phase3?.assetIngestAllowed !== true) fail('Phase 3 must allow technical ingest of user-provided Phase 2 assets.');
if (contract.phaseContract?.phase3?.archiveExtractionAllowed !== true) fail('Phase 3 must allow archive extraction.');
if (contract.phaseContract?.phase3?.audioTranscodeAllowed !== true) fail('Phase 3 must allow audio-container conversion.');
if (contract.phaseContract?.phase3?.imagePixelModificationForbidden !== true) fail('Phase 3 must forbid image pixel modification.');

const promptQuality=readJson(path.join(root,'config','prompt-quality.json'));
if(Number(promptQuality.version)!==Number(contract.promptContract?.currentPromptSpecVersion)) fail('Prompt Quality version mismatch.');
const channel=readJson(path.join(root,'config','channel.json'));
if(channel.projectType!=='general-kids-channel') fail('Channel config must declare general-kids-channel.');
if(channel.subjectPolicy?.childOrMascotRequired!==false) fail('Channel config must not require a child/mascot globally.');
const learningContract=readJson(path.join(root,'config','formats','learning.json'));
if(learningContract.characterPolicy?.visibleChildRequired!==false) fail('Learning format must not require visible children.');
if(learningContract.structure?.timerRequired!==false || learningContract.structure?.getReadyRequired!==false) fail('Learning format must not require workout timer/GET READY.');

const pipeline = readJson(path.join(root, 'config', 'pipeline.json'));
if (Number(pipeline.pipelineVersion) !== Number(contract.pipelineVersion)) fail('pipelineVersion does not match production contract.');
if (Number(pipeline.productionContractVersion) !== Number(contract.contractVersion)) fail('config/pipeline.json productionContractVersion does not match contract.');
if (pipeline.productionContractFile !== 'config/v3-contract.json') fail('config/pipeline.json must point to config/v3-contract.json.');
if (pipeline.imageGenerationPolicy?.soleReferenceImage !== contract.generationContract.soleImageReference) fail('Pipeline sole image reference differs from contract.');
if (pipeline.batchGenerationPolicy?.hardBatchBoundaries !== true || pipeline.batchGenerationPolicy?.batchMustBeCompleteBeforeNext !== true) fail('Pipeline must enforce hard 5-scene production steps.');
if (pipeline.batchGenerationPolicy?.controllerCommand !== 'npm run flow:batch -- --episode=<episode-folder>') fail('Pipeline must use flow:batch as the batch controller.');
if (pipeline.imageGenerationPolicy?.maximumGenerationAttemptsPerNonCoverScene !== contract.generationContract.maximumAttemptsPerLaterScene) fail('Pipeline generation attempt count differs from contract.');
if (pipeline.timerPolicy?.sizePixels !== contract.remotionContract.timerSizePixels) fail('Pipeline timer size differs from contract.');
if (pipeline.phaseWorkflow?.phase3ImageGenerationForbidden !== true) fail('Pipeline must forbid image generation in Phase 3.');
if (pipeline.phaseWorkflow?.phase3RawHandoffEntryPoint !== 'npm run phase3:prepare -- --episode=<episode-folder>') fail('Pipeline raw handoff entry point must be phase3:prepare.');
if (pipeline.phaseWorkflow?.phase3AgentHandlesTechnicalNormalization !== true) fail('Pipeline must make the agent handle technical normalization.');
if (pipeline.phaseWorkflow?.phase3UsesOnlyApprovedPhase2Images !== true) fail('Pipeline Phase 3 must use only approved Phase 2 images.');

const rootDocs = ['README.md','START-HIER.md','PROJECT_BRAIN.md','ANTIGRAVITY.md','scripts.md'];
const forbiddenDocPatterns = [
  /Bild 00/i,
  /Bild 01.*Referenz/i,
  /Bild 04.*Referenz/i,
  /03-bilder/i,
  /04-data/i,
  /Rest verwendet das nächste Exercise-Bild/i,
  /Exercise UI Reference/i,
];
const antiRoot = read(path.join(root,'ANTIGRAVITY.md'));
if (!antiRoot.includes('ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true')) fail('Root ANTIGRAVITY.md must declare the Phase 3 image-generation ban.');
if (!antiRoot.includes('phase3:prepare')) fail('Root ANTIGRAVITY.md must require phase3:prepare for raw handoff.');
if (!antiRoot.includes('phase3:gate')) fail('Root ANTIGRAVITY.md must require phase3:gate after approval.');
const antiOrder=['npm run phase3:prepare','npm run assets:approve','npm run phase3:gate','npm run render:safe'].map((token)=>antiRoot.indexOf(token));
if (antiOrder.some((i)=>i<0) || !(antiOrder[0]<antiOrder[1] && antiOrder[1]<antiOrder[2] && antiOrder[2]<antiOrder[3])) fail('Root ANTIGRAVITY.md Phase 3 order is wrong.');

for (const doc of rootDocs) {
  const content = read(path.join(root, doc));
  if (!content) fail(`Missing root documentation: ${doc}`);
  for (const pattern of forbiddenDocPatterns) {
    if (pattern.test(content)) fail(`${doc} contains obsolete production guidance: ${pattern}`);
  }
}

const phase2FlowAgent=read(path.join(root,'PHASE2_FLOW_AGENT.md'));
for(const token of ['flow:batch','5er-Schritte','VIEWER TAKEAWAY:','2-Sekunden-Test']) if(!phase2FlowAgent.includes(token)) fail(`PHASE2_FLOW_AGENT.md missing ${token}.`);

const scriptsDir = path.join(root, 'scripts');
for (const name of fs.readdirSync(scriptsDir)) {
  if (!name.endsWith('.mjs')) continue;
  const content = read(path.join(scriptsDir, name));
  if (/episodes\/KM-\d{3}-[a-z0-9-]+/i.test(content)) fail(`scripts/${name} hardcodes a specific episode path. Global scripts must be episode-agnostic.`);
}

const episodeRoot = path.join(root, 'episodes');
const expectedSpecs = expectedSceneSpecs(contract);
if (fs.existsSync(episodeRoot)) {
  for (const entry of fs.readdirSync(episodeRoot, {withFileTypes:true})) {
    if (!entry.isDirectory() || !/^KM-\d{3}-/.test(entry.name)) continue;
    const base = path.join(episodeRoot, entry.name);
    const dataPath = path.join(base, '99-technik', 'episode.json');
    if (!fs.existsSync(dataPath)) {
      warn(`${entry.name}: legacy episode without modern episode.json; ignored by current production contract.`);
      continue;
    }
    const data = readJson(dataPath);
    if (Number(data.structureVersion) < contract.structureVersion) {
      warn(`${entry.name}: legacy structure v${data.structureVersion}; read-only.`);
      continue;
    }
    if (Number(data.productionContractVersion) !== contract.contractVersion) {
      warn(`${entry.name}: pre-contract V3 episode; read-only until migrated to productionContractVersion ${contract.contractVersion}.`);
      continue;
    }

    const contentFormat=String(data.contentFormat||'workout');
    if(contentFormat==='learning'){
      if(data.timerRequired!==false) fail(`${entry.name}: pure learning must not require a timer.`);
      if(data.getReadyRequired!==false) fail(`${entry.name}: pure learning must not require GET READY.`);
      if(data.childOrMascotRequired!==false) fail(`${entry.name}: pure learning must not require a child/mascot.`);
      if((data.scenes||[]).some((s)=>s.type==='exercise'||s.type==='get-ready')) fail(`${entry.name}: pure learning contains workout scene types.`);
      if(!fs.existsSync(path.join(base,'99-technik','LEARNING_PLAN.json'))) fail(`${entry.name}: missing LEARNING_PLAN.json.`);
      continue;
    }
    for (const error of currentContractErrors(data, contract)) fail(`${entry.name}: ${error}`);
    if(humanOnlyWorkout(data)){
      const reviewFile=path.join(base,'99-technik','COVER_HUMAN_REVIEW.json');
      if(!fs.existsSync(reviewFile)) fail(entry.name+': human-only cover review file missing.');
      if(data.coverPolicy?.humanCoverReviewRequired!==true) fail(entry.name+': human cover selection guard missing.');
      const record=readJson(reviewFile);
      if((record.candidates||[]).length!==3) fail(entry.name+': human visual review needs all three candidate records.');
    }
    const antiPath = path.join(base,'ANTIGRAVITY.md');
    const anti = read(antiPath);
    if (!anti.includes('ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true')) fail(`${entry.name}: ANTIGRAVITY.md must declare Phase 3 image generation forbidden.`);
    if (!anti.includes('phase3:prepare')) fail(`${entry.name}: ANTIGRAVITY.md must require phase3:prepare for raw handoff.`);
    if (!anti.includes('phase3:gate')) fail(`${entry.name}: ANTIGRAVITY.md must require phase3:gate after approval.`);
    const episodeAntiOrder=['npm run phase3:prepare','npm run assets:approve','npm run phase3:gate','npm run render:safe'].map((token)=>anti.indexOf(token));
    if (episodeAntiOrder.some((i)=>i<0) || !(episodeAntiOrder[0]<episodeAntiOrder[1] && episodeAntiOrder[1]<episodeAntiOrder[2] && episodeAntiOrder[2]<episodeAntiOrder[3])) fail(`${entry.name}: ANTIGRAVITY.md Phase 3 order is wrong.`);
    if (/then generate 3 covers|continue Szene 02.?28 serially using ONLY Szene 01\.png/i.test(anti)) fail(`${entry.name}: ANTIGRAVITY.md still assigns image generation to Antigravity.`);
    for (const rel of contract.requiredEpisodeFiles) {
      if (!fs.existsSync(path.join(base, rel))) fail(`${entry.name}: missing ${rel}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date || ''))) fail(`${entry.name}: date must be YYYY-MM-DD.`);
    if (!String(data.topic || '').trim()) fail(`${entry.name}: topic is required.`);
    if (!String(data.slug || '').trim()) fail(`${entry.name}: slug is required.`);

    const scenes = Array.isArray(data.scenes) ? data.scenes : [];
    if (scenes.length !== expectedSpecs.length) fail(`${entry.name}: expected ${expectedSpecs.length} scene records, found ${scenes.length}.`);
    for (let i = 0; i < Math.min(scenes.length, expectedSpecs.length); i += 1) {
      const scene = scenes[i], spec = expectedSpecs[i], number = Number(spec.scene);
      if (Number(scene.scene) !== number) fail(`${entry.name}: scene index ${i + 1} must be Szene ${String(number).padStart(2,'0')}.`);
      if (scene.type !== spec.type) fail(`${entry.name}: Szene ${String(number).padStart(2,'0')} must be type ${spec.type}.`);
      if (scene.image !== sceneFile(number)) fail(`${entry.name}: Szene ${String(number).padStart(2,'0')} image must be ${sceneFile(number)}.`);
      if (Number(scene.duration || 0) !== Number(spec.duration || 0)) fail(`${entry.name}: Szene ${String(number).padStart(2,'0')} duration must be ${spec.duration}s.`);
      if (spec.type === 'cover' && scene.inVideo !== false) fail(`${entry.name}: cover must be outside the MP4.`);
      if (spec.type === 'exercise' && (!String(scene.title||'').trim() || !String(scene.instruction||'').trim())) fail(`${entry.name}: Szene ${scene.scene} exercise title/instruction missing.`);
      if (spec.type === 'get-ready') {
        const previous = expectedSpecs[i - 1];
        const next = expectedSpecs[i + 1];
        if (String(scene.afterExerciseScene) !== String(previous.scene).padStart(2,'0')) fail(`${entry.name}: Szene ${scene.scene} afterExerciseScene mismatch.`);
        const nextTitle = scenes[i + 1]?.title;
        if (!nextTitle || scene.nextExerciseTitle !== nextTitle) fail(`${entry.name}: Szene ${scene.scene} NEXT target must match following exercise title.`);
      }
    }

    const planPath = path.join(base, '99-technik', 'IMAGE_PLAN.json');
    const plan = readJson(planPath);
    const images = Array.isArray(plan.images) ? plan.images : [];
    // Episodes that explicitly opt into the post-generation handoff protocol
    // must keep the exact cover command, repair queue and finalization instructions
    // synchronized between their metadata, IMAGE_PLAN, and Flow agent prompt.
    if(data.imageBatchPolicy?.finalAuditRequired===true){
      const expectedSelect='npm run kidmotion:select-cover -- --episode='+entry.name+' --candidate=<1|2|3>';
      const expectedFinalize='npm run phase2:finalize -- --episode='+entry.name;
      const imageRules=plan.generationRules||{};
      if(data.coverPolicy?.selectionCommandTemplate!==expectedSelect || imageRules.coverSelectionCommandTemplate!==expectedSelect) fail(entry.name+': selected cover cleanup command not anchored to this episode.');
      if(data.coverPolicy?.deleteRejectedCandidatesImmediately!==true || imageRules.deleteRejectedCoversImmediately!==true) fail(entry.name+': nonselected cover cleanup must happen immediately.');
      if(data.imageBatchPolicy?.finalAuditCommand!==expectedFinalize || imageRules.finalAuditCommand!==expectedFinalize) fail(entry.name+': end-of-Phase-2 scene audit not anchored to this episode.');
      if(data.imageBatchPolicy?.exactFinalSceneCount!==28 || imageRules.finalSceneCountRequired!==28) fail(entry.name+': final handoff must require 28 scenes.');
      if(data.imageBatchPolicy?.repairMissingInPhase2GoogleFlow!==true || imageRules.phase2MayGenerateGenuinelyMissingScenesOnce!==true) fail(entry.name+': missing-scene production in Phase 2 is not enabled.');
      if(data.imageBatchPolicy?.regenerateExistingScenesForbidden!==true || imageRules.mayRegenerateAlreadyPresentScenes!==false) fail(entry.name+': existing images must never be regenerated.');
      if(imageRules.repairMustUseOnlySelectedCoverReference!==true || imageRules.repairMustUseOriginalPerScenePrompt!==true) fail(entry.name+': repairs must reuse the original plan and selected cover.');
      if(data.imageBatchPolicy?.requiredHandoffFile!=='99-technik/PHASE2_HANDOFF.json' || imageRules.requiredHandoffFile!=='99-technik/PHASE2_HANDOFF.json') fail(entry.name+': handoff manifest is missing from contract.');
      const runbook=read(path.join(base,'PHASE2_FLOW_RUNBOOK.md'));
      if(!runbook.includes(expectedFinalize) || !runbook.includes('PHASE2_MISSING_SCENES.json') || !runbook.includes('--candidate=2')) fail(entry.name+': dedicated Phase 2 flow runbook missing handoff/repair/cover steps.');
      const flowPlan=read(path.join(base,'00-bildprompts','google-flow-prompt.txt'));
      if(!flowPlan.includes(expectedFinalize) || !flowPlan.includes('PHASE2_MISSING_SCENES.json') || !flowPlan.includes('PHASE2_FLOW_RUNBOOK.md')) fail(entry.name+': actual Flow prompt file must instruct the agent to audit and repair.');
    }
    if (images.length !== contract.sceneContract.sceneCount) fail(`${entry.name}: IMAGE_PLAN must contain ${contract.sceneContract.sceneCount} items.`);
    if (plan.generationRules?.soleReference !== contract.generationContract.soleImageReference) fail(`${entry.name}: IMAGE_PLAN soleReference mismatch.`);
    if (plan.generationRules?.secondaryImageReferencesForbidden !== true) fail(`${entry.name}: IMAGE_PLAN must forbid secondary references.`);
    if (plan.generationRules?.generateEachNonCoverSceneExactlyOnce !== true) fail(`${entry.name}: IMAGE_PLAN must require one generation per later scene.`);
    if (Number(plan.generationRules?.maximumGenerationAttemptsPerNonCoverScene) !== contract.generationContract.maximumAttemptsPerLaterScene) fail(`${entry.name}: IMAGE_PLAN generation attempt count mismatch.`);
    for (let i = 1; i < images.length; i += 1) {
      if (images[i]?.characterReference !== 'selected Szene 01.png ONLY') fail(`${entry.name}: ${images[i]?.imageFile || 'later image'} must use only Szene 01 as reference.`);
      if (images[i]?.uiReference !== null) fail(`${entry.name}: ${images[i]?.imageFile || 'later image'} must not use a UI/second image reference.`);
      if (Number(images[i]?.generationAttemptsAllowed) !== 1) fail(`${entry.name}: ${images[i]?.imageFile || 'later image'} must allow exactly one generation.`);
    }

    const voicePlan = readJson(path.join(base, '99-technik', 'VOICE_PLAN.json'));
    for (const error of validateVoicePlanObject(voicePlan, contract)) fail(`${entry.name}: ${error}`);
    const voiceScript = read(path.join(base, '01-voice-script', 'voice-script.txt'));
    const normalizedVoiceScript = voiceScript.trim();
    const expectedVoiceText = String(voicePlan.exactTtsCopy || '').trim();
    if (normalizedVoiceScript !== expectedVoiceText) fail(`${entry.name}: voice-script.txt must contain only VOICE_PLAN exactTtsCopy.`);
    if (/^\s*#|\b00:\d{2}\b|Timing map|Exact TTS copy|##|Voice Script|Rules:/i.test(voiceScript)) fail(`${entry.name}: voice-script.txt contains forbidden headings/timecodes/instructions.`);

    const completePlanning = String(data.status || '') !== 'planning-required';
    if (completePlanning) {
      const prompt = read(path.join(base, '00-bildprompts', 'google-flow-prompt.txt'));
      const combined = JSON.stringify(data) + JSON.stringify(plan) + prompt + voiceScript + JSON.stringify(voicePlan) + read(path.join(base,'03-export','UPLOAD_METADATA.md'));
      if (hasPlanningPlaceholder(combined)) fail(`${entry.name}: production-ready planning still contains placeholders.`);
      const promptCount = (prompt.match(/FINAL GOOGLE FLOW PROMPT:/g) || []).length;
      if (promptCount !== contract.promptContract.finalGoogleFlowPromptBlocks) fail(`${entry.name}: expected ${contract.promptContract.finalGoogleFlowPromptBlocks} FINAL GOOGLE FLOW PROMPT blocks, found ${promptCount}.`);
      for (let n = 2; n <= contract.sceneContract.sceneCount; n += 1) {
        if (!prompt.includes(`SZENE ${String(n).padStart(2,'0')}`)) fail(`${entry.name}: missing prompt section for Szene ${String(n).padStart(2,'0')}.`);
      }
      if(String(data.compactPromptPolicy||'')==='v2-short'){
        const check=spawnSync(process.execPath,['scripts/prompt-plan-qa.mjs','--episode='+entry.name],{cwd:root,encoding:'utf8'});
        if(check.status!==0) fail(entry.name+': full prompt:qa failed: '+String(check.stderr||check.stdout||'').trim());
      }
      if(String(data.compactPromptPolicy||'')==='v2-short'){
        for(let n=2;n<=contract.sceneContract.sceneCount;n++){
          const number=String(n).padStart(2,'0');
          const begin=prompt.indexOf('SZENE '+number+' —');
          const after=n<contract.sceneContract.sceneCount?prompt.indexOf('SZENE '+String(n+1).padStart(2,'0')+' —',begin+1):prompt.length;
          const block=begin>=0?prompt.slice(begin,after>begin?after:prompt.length):'';
          const actual=block.split('FINAL GOOGLE FLOW PROMPT:')[1]?.trim()||'';
          if(actual.length<Number(promptQuality.minimumScenePromptCharacters)||actual.length>Number(promptQuality.maximumScenePromptCharacters)) fail(entry.name+': Szene '+number+' compact prompt length invalid.');
          if(actual!==String(images[n-1]?.prompt||'').trim()) fail(entry.name+': Szene '+number+' prompt mismatch with IMAGE_PLAN.');
        }
      }
      if(Number(data.promptSpecVersion||1)>=2){
        for(const label of promptQuality.sceneRequiredSections||[]) if(!prompt.includes(label)) fail(`${entry.name}: Prompt Quality v2 section missing from prompt file: ${label}`);
        if(Number(plan.promptSpecVersion||0)!==Number(data.promptSpecVersion)) fail(`${entry.name}: IMAGE_PLAN promptSpecVersion must match episode.json.`);
      }
    }
  }
}

warnings.forEach((m) => console.warn(`WARNING: ${m}`));
if (failures.length) {
  console.error('REPO QA FAILED');
  failures.forEach((m,i) => console.error(`${i+1}. ${m}`));
  process.exit(1);
}
console.log('REPO QA PASSED');
console.log(`Contract v${contract.contractVersion}: global config, docs, scripts and all current-contract episodes are consistent.`);

import fs from 'node:fs';
import path from 'node:path';
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

const pipeline = readJson(path.join(root, 'config', 'pipeline.json'));
if (Number(pipeline.pipelineVersion) !== Number(contract.pipelineVersion)) fail('pipelineVersion does not match production contract.');
if (Number(pipeline.productionContractVersion) !== Number(contract.contractVersion)) fail('config/pipeline.json productionContractVersion does not match contract.');
if (pipeline.productionContractFile !== 'config/v3-contract.json') fail('config/pipeline.json must point to config/v3-contract.json.');
if (pipeline.imageGenerationPolicy?.soleReferenceImage !== contract.generationContract.soleImageReference) fail('Pipeline sole image reference differs from contract.');
if (pipeline.imageGenerationPolicy?.maximumGenerationAttemptsPerNonCoverScene !== contract.generationContract.maximumAttemptsPerLaterScene) fail('Pipeline generation attempt count differs from contract.');
if (pipeline.timerPolicy?.sizePixels !== contract.remotionContract.timerSizePixels) fail('Pipeline timer size differs from contract.');

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
for (const doc of rootDocs) {
  const content = read(path.join(root, doc));
  if (!content) fail(`Missing root documentation: ${doc}`);
  for (const pattern of forbiddenDocPatterns) {
    if (pattern.test(content)) fail(`${doc} contains obsolete production guidance: ${pattern}`);
  }
}

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

    for (const error of currentContractErrors(data, contract)) fail(`${entry.name}: ${error}`);
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
    for (const label of ['00:00','00:08','00:12','Exact TTS copy']) {
      if (!voiceScript.includes(label)) fail(`${entry.name}: voice-script.txt missing ${label}.`);
    }
    if (!voiceScript.includes(String(voicePlan.exactTtsCopy || ''))) fail(`${entry.name}: voice-script Exact TTS copy must match VOICE_PLAN.json.`);

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

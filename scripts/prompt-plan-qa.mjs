import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {loadContract, expectedSceneSpecs, sceneFile, hasPlanningPlaceholder, currentContractErrors, validateVoicePlanObject} from './contract.mjs';

const root = process.cwd();
const contract = loadContract(root);
const args = process.argv.slice(2);
const episodeArg = args.find((arg)=>arg.startsWith('--episode='));
let episodeFolder = episodeArg ? episodeArg.slice('--episode='.length) : '';
if (!episodeFolder) {
  const pointer = path.join(root,'episodes','ACTIVE_EPISODE.json');
  if (fs.existsSync(pointer)) episodeFolder = JSON.parse(fs.readFileSync(pointer,'utf8')).episodeFolder || '';
}
if (!episodeFolder) {
  console.error('PROMPT PLAN QA FAILED: pass --episode=<episode-folder>.');
  process.exit(1);
}
const paths = resolveEpisodePaths(root,episodeFolder);
if (!paths.isV2) {
  console.error('PROMPT PLAN QA FAILED: current production requires modern V3 episode structure.');
  process.exit(1);
}
const failures=[];
const fail=(m)=>failures.push(m);
const data=readEpisodeData(paths);
for (const error of currentContractErrors(data,contract)) fail(error);

for (const rel of contract.requiredEpisodeFiles) {
  const abs=path.join(paths.episodeRoot,rel);
  if (!fs.existsSync(abs)) fail(`Missing ${rel}.`);
}
const plan=fs.existsSync(paths.imagePlanPath)?JSON.parse(fs.readFileSync(paths.imagePlanPath,'utf8')):{};
const prompt=fs.existsSync(paths.promptPath)?fs.readFileSync(paths.promptPath,'utf8'):'';
const voiceScript=fs.existsSync(paths.voiceScriptPath)?fs.readFileSync(paths.voiceScriptPath,'utf8'):'';
const voicePlan=fs.existsSync(paths.voicePlanPath)?JSON.parse(fs.readFileSync(paths.voicePlanPath,'utf8')):null;
const upload=fs.existsSync(path.join(paths.exportDir,'UPLOAD_METADATA.md'))?fs.readFileSync(path.join(paths.exportDir,'UPLOAD_METADATA.md'),'utf8'):'';

const combined=JSON.stringify(data)+JSON.stringify(plan)+prompt+voiceScript+JSON.stringify(voicePlan)+upload;
if (hasPlanningPlaceholder(combined)) fail('Planning still contains TBD/__PLAN_REQUIRED__/PLACEHOLDER values.');

const expected=expectedSceneSpecs(contract);
const scenes=Array.isArray(data.scenes)?data.scenes:[];
if (scenes.length!==expected.length) fail(`Expected ${expected.length} scenes, found ${scenes.length}.`);
for(let i=0;i<Math.min(scenes.length,expected.length);i+=1){
  const scene=scenes[i],spec=expected[i],n=Number(spec.scene);
  if(Number(scene.scene)!==n) fail(`Scene index ${i+1} must be Szene ${String(n).padStart(2,'0')}.`);
  if(scene.type!==spec.type) fail(`Szene ${String(n).padStart(2,'0')} must be type ${spec.type}.`);
  if(scene.image!==sceneFile(n)) fail(`Szene ${String(n).padStart(2,'0')} must map to ${sceneFile(n)}.`);
  if(Number(scene.duration||0)!==Number(spec.duration||0)) fail(`Szene ${String(n).padStart(2,'0')} must last ${spec.duration}s.`);
  if(scene.type==='exercise' && (!String(scene.title||'').trim() || !String(scene.instruction||'').trim())) fail(`Szene ${scene.scene} exercise title/instruction missing.`);
  if(scene.type==='get-ready'){
    const next=scenes[i+1];
    if(!next || next.type!=='exercise' || scene.nextExerciseTitle!==next.title) fail(`Szene ${scene.scene} NEXT target must match following exercise.`);
  }
}

const images=Array.isArray(plan.images)?plan.images:[];
if(images.length!==contract.sceneContract.sceneCount) fail(`IMAGE_PLAN must contain ${contract.sceneContract.sceneCount} images.`);
const rules=plan.generationRules||{};
if(rules.soleReference!==contract.generationContract.soleImageReference) fail('IMAGE_PLAN soleReference must be Szene 01.png.');
if(rules.secondaryImageReferencesForbidden!==true) fail('IMAGE_PLAN must forbid secondary references.');
if(rules.generateEachNonCoverSceneExactlyOnce!==true || Number(rules.maximumGenerationAttemptsPerNonCoverScene)!==1 || rules.regenerationForbidden!==true) fail('IMAGE_PLAN must enforce exactly one later-scene generation and no regeneration.');
for(let i=0;i<images.length;i+=1){
  const item=images[i],expectedFile=sceneFile(i+1);
  if(item.imageFile!==expectedFile) fail(`IMAGE_PLAN item ${i+1} must be ${expectedFile}.`);
  for(const field of ['visualPurpose','topicAnchor','visualForm','prompt']) if(!String(item[field]||'').trim()) fail(`${expectedFile} unresolved ${field}.`);
  if(i>0){
    if(item.characterReference!=='selected Szene 01.png ONLY') fail(`${expectedFile} must use selected Szene 01.png ONLY.`);
    if(item.uiReference!==null) fail(`${expectedFile} must not use a second/UI image reference.`);
    if(Number(item.generationAttemptsAllowed)!==1) fail(`${expectedFile} must allow exactly one generation.`);
  }
}

const promptCount=(prompt.match(/FINAL GOOGLE FLOW PROMPT:/g)||[]).length;
if(promptCount!==contract.promptContract.finalGoogleFlowPromptBlocks) fail(`Expected exactly ${contract.promptContract.finalGoogleFlowPromptBlocks} FINAL GOOGLE FLOW PROMPT blocks, found ${promptCount}.`);
for(let c=1;c<=3;c+=1){
  const marker=`COVER CANDIDATE 0${c}`;
  const start=prompt.indexOf(marker);
  const next=c<3?prompt.indexOf(`COVER CANDIDATE 0${c+1}`,start+marker.length):prompt.indexOf('SZENE 02',start+marker.length);
  const block=start>=0?prompt.slice(start,next>start?next:prompt.length):'';
  if(!block) fail(`Missing ${marker}.`);
  if(!/fictional/i.test(block) || !/fully clothed/i.test(block)) fail(`${marker} must explicitly describe a fictional, fully clothed stylized character.`);
  if(/\bage\s*[:=]?\s*\d{1,2}\b/i.test(block) || /skin tone|skin color|body measurements|body type|photorealistic child|young boy|young girl/i.test(block)) fail(`${marker} contains disallowed detailed minor/photorealistic cover wording.`);
}
for(let n=2;n<=28;n+=1){
  const id=String(n).padStart(2,'0'),marker=`SZENE ${id}`;
  const start=prompt.indexOf(marker);
  const next=n<28?prompt.indexOf(`SZENE ${String(n+1).padStart(2,'0')}`,start+marker.length):prompt.length;
  const block=start>=0?prompt.slice(start,next>start?next:prompt.length):'';
  if(!block.includes('FINAL GOOGLE FLOW PROMPT:')) fail(`${marker} missing FINAL GOOGLE FLOW PROMPT.`);
  if(!block.includes('ONLY image reference')) fail(`${marker} must explicitly use Szene 01 as the ONLY image reference.`);
  const scene=scenes[n-1];
  if(scene?.type==='exercise'){
    if(!block.includes(scene.title) || !block.includes(scene.instruction)) fail(`${marker} must contain exact exercise title and instruction.`);
    if(!/bottom-left/i.test(block) || !/dark semi-transparent navy/i.test(block) || !/top-right/i.test(block) || !/light cream rounded/i.test(block)) fail(`${marker} must include the locked exercise UI contract.`);
  }
  if(scene?.type==='get-ready'){
    if(!block.includes(`NEXT: ${scene.nextExerciseTitle}`)) fail(`${marker} has wrong GET READY target.`);
    if(!/dark semi-transparent navy/i.test(block) || !/bright-cyan/i.test(block)) fail(`${marker} must include the locked GET READY UI contract.`);
  }
}

for(const error of validateVoicePlanObject(voicePlan,contract)) fail(error);
for(const label of ['00:00','00:08','00:12','Exact TTS copy']) if(!voiceScript.includes(label)) fail(`voice-script.txt missing ${label}.`);
if(voicePlan?.exactTtsCopy && !voiceScript.includes(voicePlan.exactTtsCopy)) fail('voice-script Exact TTS copy must match VOICE_PLAN.json.');

if(failures.length){
  console.error(`PROMPT PLAN QA FAILED — ${episodeFolder}`);
  failures.forEach((m,i)=>console.error(`${i+1}. ${m}`));
  process.exit(1);
}
console.log(`PROMPT PLAN QA PASSED — ${episodeFolder}`);
console.log('Validated central contract, scene order, 30 direct Flow prompts, cover safety wording, locked UI prompts, sole reference, one-generation policy and timed voice plan.');

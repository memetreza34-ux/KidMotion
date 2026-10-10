import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {loadContract, expectedSceneSpecs, sceneFile, hasPlanningPlaceholder, currentContractErrors, validateVoicePlanObject} from './contract.mjs';
import {humanOnlyWorkout,humanPromptErrors} from './workout-character-policy.mjs';
import {validateArtDirectionPrompts} from './art-direction-qa.mjs';
import {publishPhase1Handoff,printPhase1Links} from './phase1-links-lib.mjs';
import {generateExportFiles} from './export-content-lib.mjs';

const root = process.cwd();
const contract = loadContract(root);
const promptQualityPath=path.join(root,contract.promptContract?.promptQualityFile||'config/prompt-quality.json');
const promptQuality=fs.existsSync(promptQualityPath)?JSON.parse(fs.readFileSync(promptQualityPath,'utf8')):{};
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
  if (!fs.existsSync(abs) && !fs.existsSync(path.join(paths.techDir,rel))) fail(`Missing ${rel}.`);
}
const plan=fs.existsSync(paths.imagePlanPath)?JSON.parse(fs.readFileSync(paths.imagePlanPath,'utf8')):{};
const prompt=fs.existsSync(paths.promptPath)?fs.readFileSync(paths.promptPath,'utf8'):'';
const voiceScript=fs.existsSync(paths.voiceScriptPath)?fs.readFileSync(paths.voiceScriptPath,'utf8'):'';
const voicePlan=fs.existsSync(paths.voicePlanPath)?JSON.parse(fs.readFileSync(paths.voicePlanPath,'utf8')):null;
const upload=fs.existsSync(path.join(paths.exportDir,'UPLOAD_METADATA.md'))?fs.readFileSync(path.join(paths.exportDir,'UPLOAD_METADATA.md'),'utf8'):'';
const promptSpecVersion=Number(data.promptSpecVersion||plan.promptSpecVersion||1);
const compact=String(data.compactPromptPolicy||'')==='v2-short';

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
const sectionPresent=(block,label)=>block.includes(label);
const sectionValue=(block,label,nextLabels=[])=>{
  const start=block.indexOf(label);
  if(start<0) return '';
  const from=start+label.length;
  let end=block.length;
  for(const next of nextLabels){
    const idx=block.indexOf(next,from);
    if(idx>=0 && idx<end) end=idx;
  }
  return block.slice(from,end).trim();
};

for(let c=1;c<=3;c+=1){
  const marker=`COVER CANDIDATE 0${c}`;
  const start=prompt.indexOf(marker);
  const next=c<3?prompt.indexOf(`COVER CANDIDATE 0${c+1}`,start+marker.length):prompt.indexOf('SZENE 02',start+marker.length);
  const block=start>=0?prompt.slice(start,next>start?next:prompt.length):'';
  if(!block) fail(`Missing ${marker}.`);
  if(compact){
    const pure=block.split('FINAL GOOGLE FLOW PROMPT:')[1]?.trim()||'';
    if(pure.length<Number(promptQuality.minimumCoverPromptCharacters)||pure.length>Number(promptQuality.maximumCoverPromptCharacters)) fail(`${marker} must be ${promptQuality.minimumCoverPromptCharacters}-${promptQuality.maximumCoverPromptCharacters} chars, got ${pure.length}.`);
  }
  if(data.sceneNumberingPolicy==='explicit-v1'){
    const actual=block.split('FINAL GOOGLE FLOW PROMPT:')[1]?.trim()||'';
    if(!actual.startsWith(`COVER_ID: 0${c} | OUTPUT_FILE: Cover-Kandidat-0${c}.png | ID is file metadata ONLY.`)) fail(`${marker}: missing explicit cover ID and filename.`);
  }
  if(data.kidFriendlyVisualPolicy==='warm-playful-v1'){
    const actual=block.split('FINAL GOOGLE FLOW PROMPT:')[1]||'';
    if(!/WARMTH \/ MOOD:/i.test(actual)||!/(smile|grin|friendly|warm)/i.test(actual)) fail(`${marker}: warm child-friendly cover direction missing.`);
  }
  if(humanOnlyWorkout(data)) for(const error of humanPromptErrors(block.split('FINAL GOOGLE FLOW PROMPT:')[1]||'',{cover:true})) fail(`${marker}: ${error}`);
  if(!/fictional/i.test(block) || !/fully clothed/i.test(block)) fail(`${marker} must explicitly describe a fictional, fully clothed stylized character.`);
  if(/\bage\s*[:=]?\s*\d{1,2}\b/i.test(block) || /skin tone|skin color|body measurements|body type|photorealistic child|young boy|young girl/i.test(block)) fail(`${marker} contains disallowed detailed minor/photorealistic cover wording.`);
}
for(let n=2;n<=28;n+=1){
  const id=String(n).padStart(2,'0'),marker=`SZENE ${id}`;
  const start=prompt.indexOf(marker);
  const next=n<28?prompt.indexOf(`SZENE ${String(n+1).padStart(2,'0')}`,start+marker.length):prompt.length;
  const block=start>=0?prompt.slice(start,next>start?next:prompt.length):'';
  if(!block.includes('FINAL GOOGLE FLOW PROMPT:')) fail(`${marker} missing FINAL GOOGLE FLOW PROMPT.`);
  if(compact){
    const pure=block.split('FINAL GOOGLE FLOW PROMPT:')[1]?.trim()||'';
    if(pure.length<Number(promptQuality.minimumScenePromptCharacters)||pure.length>Number(promptQuality.maximumScenePromptCharacters)) fail(`${marker} must be ${promptQuality.minimumScenePromptCharacters}-${promptQuality.maximumScenePromptCharacters} chars, got ${pure.length}.`);
    if(pure!==String(images[n-1]?.prompt||'').trim()) fail(`${marker}: IMAGE_PLAN prompt differs from Flow prompt.`);
  }
  if(data.sceneNumberingPolicy==='explicit-v1'){
    const actual=block.split('FINAL GOOGLE FLOW PROMPT:')[1]?.trim()||'';
    if(!actual.startsWith(`SCENE_ID: ${id} | OUTPUT_FILE: Szene ${id}.png | ID is file metadata ONLY; do not draw scene numbers.`)) fail(`${marker}: missing explicit scene ID and filename.`);
    if(images[n-1]?.flowSceneId!==id || images[n-1]?.downloadedFileMustBeSavedAs!==`Szene ${id}.png`) fail(`${marker}: image plan does not match numbered output.`);
  }
  if(data.kidFriendlyVisualPolicy==='warm-playful-v1'){
    const actual=block.split('FINAL GOOGLE FLOW PROMPT:')[1]||'';
    if(!/WARMTH \/ MOOD:/i.test(actual)||!/(smile|grin|friendly|warm)/i.test(actual)) fail(`${marker}: warm kid-friendly scene direction missing.`);
    if(!/(abstract|sterile|uncanny|eerie|cold)/i.test(actual)) fail(`${marker}: must explicitly reject sterile/abstract imagery.`);
  }
  if(humanOnlyWorkout(data)) for(const error of humanPromptErrors(block.split('FINAL GOOGLE FLOW PROMPT:')[1]||'')) fail(`${marker}: ${error}`);
  if(!block.includes('ONLY image reference')) fail(`${marker} must explicitly use Szene 01 as the ONLY image reference.`);
  if(promptSpecVersion>=2){
    for(const label of promptQuality.sceneRequiredSections||[]) if(!sectionPresent(block,label)) fail(`${marker} missing Prompt Quality v2 section ${label}`);
    if(block.length<Number(promptQuality.minimumScenePromptCharacters||0)) fail(`${marker} is too short for Prompt Quality v2.`);
    if(!/do not copy.*cover.*(pose|camera|composition)|do not copy the cover pose/i.test(block)) fail(`${marker} must state that the cover reference does not dictate scene composition.`);
  }
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

if(promptSpecVersion>=2){
  const exerciseBlocks=[];
  for(let n=2;n<=28;n+=1){
    const scene=scenes[n-1];
    if(scene?.type!=='exercise') continue;
    const id=String(n).padStart(2,'0'),marker=`SZENE ${id}`;
    const start=prompt.indexOf(marker);
    const next=n<28?prompt.indexOf(`SZENE ${String(n+1).padStart(2,'0')}`,start+marker.length):prompt.length;
    const block=start>=0?prompt.slice(start,next>start?next:prompt.length):'';
    const composition=sectionValue(block,'SHOT / COMPOSITION:',promptQuality.sceneRequiredSections||[]);
    exerciseBlocks.push({id,composition});
  }
  for(let i=1;i<exerciseBlocks.length;i+=1){
    if(exerciseBlocks[i].composition && exerciseBlocks[i].composition===exerciseBlocks[i-1].composition) fail(`Adjacent exercise prompts reuse the exact same SHOT / COMPOSITION: Szene ${exerciseBlocks[i-1].id} and ${exerciseBlocks[i].id}.`);
  }
}

if(data.introVisualPolicy==='greeting-only-v1'){
  const openingStart=prompt.indexOf('SZENE 02');
  const openingEnd=prompt.indexOf('SZENE 03',openingStart+1);
  const opening=openingStart>=0?prompt.slice(openingStart,openingEnd>openingStart?openingEnd:prompt.length):'';
  const imagePrompt=opening.split('FINAL GOOGLE FLOW PROMPT:')[1]||'';
  if(!/\bHELLO\b/i.test(imagePrompt)) fail('Szene 02 must be a small HELLO greeting.');
  if(/12 FREEZE MOVES|large episode title|giant intro title|title card/i.test(imagePrompt)) fail('Szene 02 must not repeat cover/title imagery.');
}
for(const error of validateArtDirectionPrompts({episode:data,plan,prompt})) fail('ART DIRECTION: '+error);
for(const error of validateVoicePlanObject(voicePlan,contract)) fail(error);
const normalizedVoiceScript=voiceScript.trim();
const expectedVoiceText=String(voicePlan?.exactTtsCopy||'').trim();
if(normalizedVoiceScript!==expectedVoiceText) fail('voice-script.txt must contain ONLY the exact continuous spoken text from VOICE_PLAN.json exactTtsCopy.');
if(/^\s*#|\b00:\d{2}\b|Timing map|Exact TTS copy|##|Voice Script|Rules:/i.test(voiceScript)) fail('voice-script.txt must not contain headings, timecodes, labels or instructions.');

if(failures.length){
  console.error(`PROMPT PLAN QA FAILED — ${episodeFolder}`);
  failures.forEach((m,i)=>console.error(`${i+1}. ${m}`));
  process.exit(1);
}
const exportContent=generateExportFiles({root,episodeFolder});
const phase1Handoff=publishPhase1Handoff({root,episodeFolder,format:data.contentFormat||'workout'});
console.log(`PROMPT PLAN QA PASSED — ${episodeFolder}`);
console.log('Validated central contract, hard 5-scene planning, Prompt Quality v2, scene order, 30 direct Flow prompts, cover safety wording, locked UI prompts, sole reference, one-generation policy, plain-text voice script and timed VOICE_PLAN.');

printPhase1Links(phase1Handoff);
console.log('EXPORT COPY TEXTS: '+exportContent.files.join(', '));

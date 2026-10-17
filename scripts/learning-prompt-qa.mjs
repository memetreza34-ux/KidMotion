import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';
import {loadLearningEngine,normalizeAgeBand,normalizeLearningMode,requiredRolesForMode} from './learning-engine.mjs';
import {publishPhase1Handoff,printPhase1Links} from './phase1-links-lib.mjs';
import {validateImprovementApplication} from './continuous-improvement-lib.mjs';
import {generateExportFiles} from './export-content-lib.mjs';

const root=process.cwd();
const args=process.argv.slice(2);
const epArg=args.find((v)=>v.startsWith('--episode='));
const episodeFolder=epArg?epArg.slice('--episode='.length):'';
if(!episodeFolder){
  console.error('LEARNING PROMPT QA FAILED: pass --episode=KM-XXX-slug');
  process.exit(1);
}

const engine=loadLearningEngine(root);
const paths=resolveEpisodePaths(root,episodeFolder);
const data=readEpisodeData(paths);
const failures=[];
const fail=(m)=>failures.push(m);
const read=(rel)=>fs.existsSync(path.join(paths.episodeRoot,rel))?fs.readFileSync(path.join(paths.episodeRoot,rel),'utf8'):'';
const hasPlaceholder=(value)=>/\bTBD\b|__PLAN_REQUIRED__|PLACEHOLDER/i.test(String(value||''));

if(data.contentFormat!=='learning') fail('Episode is not contentFormat=learning.');

const required=[
  '99-technik/LEARNING_PLAN.json','99-technik/IMAGE_PLAN.json','99-technik/VOICE_PLAN.json',
  '00-bildprompts/google-flow-prompt.txt','01-voice-script/voice-script.txt','99-technik/UPLOAD_METADATA.md'
];
for(const rel of required) if(!fs.existsSync(path.join(paths.episodeRoot,rel))) fail('Missing '+rel);

const learning=JSON.parse(read('99-technik/LEARNING_PLAN.json')||'{}');
const images=JSON.parse(read('99-technik/IMAGE_PLAN.json')||'{}');
const voice=JSON.parse(read('99-technik/VOICE_PLAN.json')||'{}');
const prompt=read('00-bildprompts/google-flow-prompt.txt');
const voiceScript=read('01-voice-script/voice-script.txt').trim();
const combined=JSON.stringify(data)+JSON.stringify(learning)+JSON.stringify(images)+JSON.stringify(voice)+prompt+read('99-technik/UPLOAD_METADATA.md');

const ageBand=normalizeAgeBand(data.ageBand||learning.ageBand,engine);
const learningMode=normalizeLearningMode(data.learningMode||learning.learningMode,engine);
if(!ageBand) fail('Invalid/missing ageBand.');
if(!learningMode) fail('Invalid/missing learningMode.');

if(hasPlaceholder(combined)) fail('Planning contains unresolved placeholders.');

const objective=String(data.primaryLearningObjective||learning.primaryLearningObjective||'').trim();
if(!objective) fail('Exactly one primaryLearningObjective is required.');
if(String(learning.primaryLearningObjective||'').trim()!==objective) fail('LEARNING_PLAN primary objective must match episode.json.');
if(!String(data.successCriteria||learning.successCriteria||'').trim()) fail('successCriteria is required.');
if(Array.isArray(data.secondaryObjectives) && data.secondaryObjectives.length>Number(engine.objectivePolicy.secondaryObjectivesMax||2)) fail('Too many secondary objectives.');

if(data.timerRequired!==false) fail('Pure learning must not require a timer.');
if(data.getReadyRequired!==false) fail('Pure learning must not require GET READY.');
if(data.childOrMascotRequired!==false) fail('Pure learning must not require a child/mascot.');

if(!Array.isArray(learning.facts)||!learning.facts.length) fail('LEARNING_PLAN facts are required.');
for(const fact of learning.facts||[]){
  if(!String(fact.claim||'').trim()||!String(fact.sourceNote||'').trim()) fail('Every fact needs claim + sourceNote.');
}
if(!Array.isArray(learning.misconceptions)) fail('LEARNING_PLAN misconceptions array is required.');
if(!Array.isArray(learning.vocabulary)) fail('LEARNING_PLAN vocabulary is required.');
if(!Array.isArray(learning.recapPoints)) fail('LEARNING_PLAN recapPoints are required.');

const profile=engine.ageBands?.[ageBand]||{};
if((learning.recapPoints||[]).length<Number(profile.recapMinimum||1)) fail('Not enough recapPoints for age band '+ageBand+'.');

const scenes=Array.isArray(data.scenes)?data.scenes:[];
const videoScenes=scenes.filter((s)=>s.inVideo!==false);
if(videoScenes.length<6) fail('Learning episode needs at least 6 video scenes.');
if(videoScenes.some((s)=>s.type==='exercise'||s.type==='get-ready')) fail('Pure learning must not contain exercise/get-ready scene types.');

const allowedRoles=new Set(engine.allowedSceneRoles||[]);
const roleList=[];
for(const scene of videoScenes){
  const role=String(scene.role||'').toUpperCase();
  roleList.push(role);
  if(!allowedRoles.has(role)) fail('Invalid learning scene role '+role+' at Szene '+scene.scene+'.');
  if(!String(scene.learningPoint||'').trim()) fail('Scene '+scene.scene+' missing learningPoint.');
  if(!String(scene.narration||'').trim()) fail('Scene '+scene.scene+' missing narration.');
  if(!String(scene.visualStrategy||'').trim()) fail('Scene '+scene.scene+' missing visualStrategy.');
  if(!String(scene.visualPurpose||'').trim()) fail('Scene '+scene.scene+' missing visualPurpose.');
  const channels=Array.isArray(scene.learningChannels)?scene.learningChannels:[];
  if(['TEACH','EXAMPLE','COMPARE','APPLY','RECAP','REVEAL'].includes(role) && channels.length<Number(engine.learningChannels.minimumForCoreTeachingScenes||2)) fail('Scene '+scene.scene+' needs at least two learning channels.');
  if(String(scene.characterMode||'none')!=='none' && !String(scene.characterJustification||'').trim()) fail('Scene '+scene.scene+' uses a character without teaching justification.');
}

for(const requiredRole of requiredRolesForMode(learningMode,engine)){
  if(!roleList.includes(requiredRole)) fail('Learning mode '+learningMode+' requires scene role '+requiredRole+'.');
}
if(roleList[0]!=='HOOK') fail('First video scene must be HOOK.');
if(!roleList.includes('RECAP')) fail('A RECAP scene is required.');

const practiceScenes=videoScenes.filter((s)=>String(s.role).toUpperCase()==='PRACTICE');
const revealScenes=videoScenes.filter((s)=>String(s.role).toUpperCase()==='REVEAL');
if(practiceScenes.length<Number(profile.practiceMinimum||1)) fail('Not enough PRACTICE scenes for age band '+ageBand+'.');
if(revealScenes.length<practiceScenes.length) fail('Every PRACTICE needs a later REVEAL.');

for(const practice of practiceScenes){
  if(!String(practice.question||'').trim()) fail('PRACTICE scene '+practice.scene+' missing question.');
  if(!String(practice.answer||'').trim()) fail('PRACTICE scene '+practice.scene+' missing planned answer.');
  const pause=Number(practice.thinkingPauseSeconds||0);
  if(pause<Number(engine.interactionPolicy.minimumThinkingPauseSeconds||2)||pause>Number(engine.interactionPolicy.maximumThinkingPauseSeconds||6)) fail('PRACTICE scene '+practice.scene+' thinking pause outside allowed range.');
  const index=videoScenes.indexOf(practice);
  const nextReveal=videoScenes.slice(index+1).find((s)=>String(s.role).toUpperCase()==='REVEAL');
  if(!nextReveal) fail('PRACTICE scene '+practice.scene+' has no later REVEAL.');
}
if((learning.practiceMoments||[]).length<practiceScenes.length) fail('LEARNING_PLAN practiceMoments must map every PRACTICE scene.');
if(roleList.includes('APPLY') && !String(learning.transferApplication||'').trim()) fail('transferApplication is required when APPLY is used.');

const seq=Array.isArray(learning.sceneLearningSequence)?learning.sceneLearningSequence:[];
if(seq.length!==videoScenes.length) fail('LEARNING_PLAN sceneLearningSequence must match video scenes.');
for(let i=0;i<Math.min(seq.length,videoScenes.length);i++){
  if(String(seq[i].scene)!==String(videoScenes[i].scene)) fail('LEARNING_PLAN scene sequence mismatch at index '+i+'.');
  if(String(seq[i].role).toUpperCase()!==String(videoScenes[i].role).toUpperCase()) fail('LEARNING_PLAN role mismatch at Szene '+videoScenes[i].scene+'.');
}

if((images.images||[]).length!==scenes.length) fail('IMAGE_PLAN count must match episode scenes.');
for(const item of images.images||[]){
  if(String(item.characterMode||'none')!=='none' && !String(item.characterJustification||'').trim()) fail('IMAGE_PLAN '+item.imageFile+' uses character without justification.');
}

if(voiceScript!==String(voice.exactTtsCopy||'').trim()) fail('voice-script.txt must equal VOICE_PLAN exactTtsCopy.');
if(/^\s*#|\b00:\d{2}\b|VOICE PLAN|TIMING/i.test(voiceScript)) fail('voice-script.txt must remain plain spoken text only.');
const voiceSections=Array.isArray(voice.sections)?voice.sections:[];
if(voiceSections.length!==videoScenes.length) fail('VOICE_PLAN sections must match every video scene.');

const promptBlocks=(prompt.match(/FINAL GOOGLE FLOW PROMPT:/g)||[]).length;
if(promptBlocks!==3+videoScenes.length) fail('Expected 3 cover prompts plus one prompt per video scene.');

for(const label of ['SCENE ROLE:','VIEWER TAKEAWAY:','TEACHING JOB:','SHOT / COMPOSITION:','SUBJECT / ACTION:','WORLD / CONTEXT:','TEXT / LABELS:','NEGATIVE / STABILITY:','ACCURACY CHECK:','OUTPUT:']){
  if(!prompt.includes(label)) fail('Learning prompts missing section '+label);
}
if(/GET READY|countdown timer|12 exercises/i.test(prompt)) fail('Learning prompt file contains workout-only concepts.');

for(const error of validateImprovementApplication({root,episodeFolder,format:'learning',episode:data})) fail('CONTINUOUS IMPROVEMENT: '+error);

if(failures.length){
  console.error('LEARNING PROMPT QA FAILED');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}

const publicUpload=generateExportFiles({root,episodeFolder});
const phase1Handoff=publishPhase1Handoff({root,episodeFolder,format:'learning'});
console.log('LEARNING PROMPT QA PASSED — '+episodeFolder);
console.log('Age band: '+ageBand);
console.log('Learning mode: '+learningMode);
console.log('Validated objective, facts, misconceptions, scene roles, practice/reveal, application, recap, narration and visual teaching plan.');

printPhase1Links(phase1Handoff);
console.log('ONE PUBLIC YOUTUBE TEXT: '+publicUpload.files.join(', '));

import fs from 'node:fs';
import path from 'node:path';
import {loadLearningEngine,normalizeAgeBand,normalizeLearningMode,defaultRolesForMode,expandRoles} from './learning-engine.mjs';

const args=process.argv.slice(2);
const getArg=(name,fallback='')=>{
  const item=args.find((arg)=>arg.startsWith('--'+name+'='));
  return item?item.slice(name.length+3):fallback;
};

const topic=getArg('topic');
const requestedId=getArg('id');
const requestedDate=getArg('date',new Date().toISOString().slice(0,10));
const root=process.cwd();
const engine=loadLearningEngine(root);
const ageBand=normalizeAgeBand(getArg('age-band',engine.defaultAgeBand),engine);
const learningMode=normalizeLearningMode(getArg('learning-mode'),engine);
const requestedScenes=Number(getArg('scenes','0'))||0;

if(!topic){
  console.error('Missing --topic="..."');
  process.exit(1);
}
if(!ageBand){
  console.error('Invalid --age-band. Choose: '+Object.keys(engine.ageBands).join(' | '));
  process.exit(1);
}
if(!learningMode){
  console.error('Missing/invalid --learning-mode. Choose: '+Object.keys(engine.learningModes).join(' | '));
  process.exit(1);
}
if(!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)){
  console.error('Invalid --date. Use YYYY-MM-DD.');
  process.exit(1);
}

const slugify=(value)=>String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,64);
const episodesRoot=path.join(root,'episodes');
fs.mkdirSync(episodesRoot,{recursive:true});
const ids=fs.readdirSync(episodesRoot,{withFileTypes:true})
  .filter((e)=>e.isDirectory()&&/^KM-\d{3}-/.test(e.name))
  .map((e)=>Number(e.name.slice(3,6))).filter(Number.isFinite);
const autoNumber=String((ids.length?Math.max(...ids):0)+1).padStart(3,'0');
const episodeId=/^KM-\d{3}$/.test(requestedId)?requestedId:'KM-'+autoNumber;
const slug=slugify(topic)||'learning-'+episodeId.slice(3);
const episodeFolder=episodeId+'-'+slug;
const episodeRoot=path.join(episodesRoot,episodeFolder);
if(fs.existsSync(episodeRoot)) throw new Error('Episode already exists: '+episodeFolder);

const write=(rel,content)=>{
  const target=path.join(episodeRoot,rel);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,content,'utf8');
};
for(const dir of ['00-bildprompts/images','01-voice-script','02-audio','03-export','99-technik']) fs.mkdirSync(path.join(episodeRoot,dir),{recursive:true});

const placeholder=(label)=>'__PLAN_REQUIRED__ '+label;
const pad=(n)=>String(n).padStart(2,'0');
const baseRoles=defaultRolesForMode(learningMode,engine);
const roles=expandRoles(baseRoles,requestedScenes);
const videoSceneCount=roles.length;
const totalImages=videoSceneCount+1;
const batches=[];
for(let start=2;start<=totalImages;start+=5){
  const group=[];
  for(let n=start;n<=Math.min(totalImages,start+4);n++) group.push(n);
  batches.push(group);
}

const sceneDuration=(role)=>{
  if(role==='PRACTICE') return 7;
  if(role==='REVEAL') return 5;
  if(role==='HOOK') return 6;
  if(role==='RECAP') return 8;
  return 8;
};

const scenes=[{scene:'01',type:'cover',role:'COVER',image:'Szene 01.png',duration:0,inVideo:false}];
for(let i=0;i<roles.length;i++){
  const n=i+2;
  const role=roles[i];
  const practice=role==='PRACTICE';
  const reveal=role==='REVEAL';
  scenes.push({
    scene:pad(n),
    type:'learning',
    role,
    image:'Szene '+pad(n)+'.png',
    duration:sceneDuration(role),
    learningPoint:placeholder('SCENE '+pad(n)+' LEARNING POINT'),
    narration:placeholder('SCENE '+pad(n)+' NARRATION'),
    visualStrategy:placeholder('SCENE '+pad(n)+' VISUAL STRATEGY'),
    visualPurpose:placeholder('SCENE '+pad(n)+' VISUAL PURPOSE'),
    learningChannels:['voice','visual'],
    textOwner:'planned-per-scene',
    characterMode:'none',
    characterJustification:null,
    question:practice?placeholder('SCENE '+pad(n)+' PRACTICE QUESTION'):null,
    answer:(practice||reveal)?placeholder('SCENE '+pad(n)+' ANSWER'):null,
    thinkingPauseSeconds:practice?engine.interactionPolicy.defaultThinkingPauseSeconds:0,
    remotionOverlayText:''
  });
}

const objective=placeholder('ONE PRIMARY LEARNING OBJECTIVE');
const exactNarration=placeholder('FULL CONTINUOUS NARRATION');
const success=placeholder('SUCCESS CRITERIA');

const episode={
  schemaVersion:2,
  structureVersion:2,
  contentFormat:'learning',
  formatContractFile:'config/formats/learning.json',
  learningEngineFile:'config/learning-engine.json',
  learningEngineVersion:engine.schemaVersion,
  id:episodeId,
  slug,
  date:requestedDate,
  day:new Date(requestedDate+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'long',timeZone:'UTC'}),
  topic,
  ageBand,
  targetAge:ageBand,
  learningMode,
  status:'planning-required',
  primaryLearningObjective:objective,
  successCriteria:success,
  keyQuestion:placeholder('KEY QUESTION'),
  secondaryObjectives:[],
  characterMode:'none',
  childOrMascotRequired:false,
  timerRequired:false,
  getReadyRequired:false,
  workoutStructure:false,
  promptSpecVersion:2,
  publicAssetRoot:'public/episodes/'+requestedDate+'/'+episodeFolder,
  fps:30,width:1920,height:1080,aspectRatio:'16:9',
  coverPolicy:{
    candidateCount:3,
    waitForExplicitUserSelection:true,
    finalFile:'Szene 01.png',
    coverIsStyleReferenceOnlyIfHelpful:true,
    coverIsSoleReference:false
  },
  imageBatchPolicy:{
    enabled:true,batchSize:5,batches,
    hardBatchBoundaries:true,
    waitForUserBetweenBatches:false,
    silentVisualQcAfterEachBatch:true
  },
  narrationPolicy:{
    fullVideoNarrationAllowed:true,
    voiceFile:'Voice 01.mp3',
    voiceScriptFormat:'plain continuous text only',
    voiceMayContinueAcrossEntireVideo:true,
    practiceThinkingPauseStoredInVoicePlan:true
  },
  scenes,
  videoSceneCount,
  imageCount:totalImages
};

const learningPlan={
  schemaVersion:2,
  learningEngineVersion:engine.schemaVersion,
  episodeFolder,
  topic,
  ageBand,
  ageBandProfile:engine.ageBands[ageBand].id,
  learningMode,
  primaryLearningObjective:objective,
  secondaryObjectives:[],
  successCriteria:success,
  keyQuestion:placeholder('KEY QUESTION'),
  prerequisites:[placeholder('PRIOR KNOWLEDGE OR NONE')],
  vocabulary:[
    {term:placeholder('VOCABULARY TERM'),kidFriendlyDefinition:placeholder('KID FRIENDLY DEFINITION')}
  ],
  facts:[
    {id:'F1',claim:placeholder('FACT 1'),sourceNote:placeholder('SOURCE NOTE 1'),usedInScenes:[]}
  ],
  misconceptions:[
    {misconception:placeholder('COMMON MISCONCEPTION OR NONE'),correction:placeholder('CORRECTION')}
  ],
  practiceMoments:scenes.filter((s)=>s.role==='PRACTICE').map((s,i)=>({
    id:'P'+String(i+1),
    scene:s.scene,
    question:s.question,
    answer:s.answer,
    thinkingPauseSeconds:s.thinkingPauseSeconds
  })),
  transferApplication:placeholder('REAL WORLD OR NEW SITUATION APPLICATION'),
  recapPoints:[placeholder('RECAP POINT 1'),placeholder('RECAP POINT 2')],
  retentionDevices:[placeholder('OPTIONAL MEMORY DEVICE OR NONE')],
  sceneLearningSequence:scenes.filter((s)=>s.inVideo!==false).map((s)=>({
    scene:s.scene,
    role:s.role,
    learningPoint:s.learningPoint,
    narration:s.narration,
    visualStrategy:s.visualStrategy,
    visualPurpose:s.visualPurpose,
    learningChannels:s.learningChannels,
    characterMode:s.characterMode,
    characterJustification:s.characterJustification,
    question:s.question,
    answer:s.answer,
    thinkingPauseSeconds:s.thinkingPauseSeconds
  }))
};

const imagePlan={
  schemaVersion:2,
  learningEngineVersion:engine.schemaVersion,
  episodeFolder,
  contentFormat:'learning',
  ageBand,
  learningMode,
  promptSpecVersion:2,
  generationRules:{
    coverCandidateCount:3,
    coverSelectionRequired:true,
    batchSize:5,
    batches,
    exactOneGenerationPerScene:true,
    automaticAlternatesForbidden:true,
    coverAsSoleReferenceForbidden:true,
    characterRequired:false,
    userPromptBetweenBatchesForbidden:true,
    sceneRoleDrivesVisualStrategy:true
  },
  images:scenes.map((s)=>({
    sceneNumber:Number(s.scene),
    imageFile:s.image,
    sceneRole:s.role,
    visualPurpose:s.visualPurpose||placeholder('SCENE '+s.scene+' VISUAL PURPOSE'),
    visualForm:s.visualStrategy||placeholder('SCENE '+s.scene+' VISUAL STRATEGY'),
    characterMode:s.characterMode||'none',
    characterJustification:s.characterJustification||null,
    referencePolicy:s.type==='cover'?'cover-candidate-stage':'use references only when the plan explicitly justifies them',
    prompt:placeholder('SCENE '+s.scene+' FINAL FLOW PROMPT')
  }))
};

const voicePlan={
  schemaVersion:2,
  learningEngineVersion:engine.schemaVersion,
  episodeFolder,
  contentFormat:'learning',
  ageBand,
  learningMode,
  voiceFile:'Voice 01.mp3',
  narrationAcrossWholeVideo:true,
  sections:scenes.filter((s)=>s.inVideo!==false).map((s)=>({
    scene:s.scene,
    role:s.role,
    duration:s.duration,
    text:s.narration,
    thinkingPauseSeconds:s.thinkingPauseSeconds||0
  })),
  exactTtsCopy:exactNarration
};

let prompt='KIDMOTION PURE LEARNING — '+episodeId+' — '+topic+'\n\n';
prompt+='AGE BAND: '+ageBand+'\n';
prompt+='LEARNING MODE: '+learningMode+'\n';
prompt+='PRIMARY OBJECTIVE: '+objective+'\n';
prompt+='No workout structure. No timer. No GET READY. No child/mascot requirement.\n';
prompt+='Every scene must serve the primary learning objective.\n\n';

for(let c=1;c<=3;c++){
  prompt+='COVER CANDIDATE 0'+c+' — Cover-Kandidat-0'+c+'.png\n';
  prompt+='FINAL GOOGLE FLOW PROMPT:\n';
  prompt+='CLICK IDEA:\n'+placeholder('COVER '+c+' CLICK IDEA')+'\n\n';
  prompt+='SHOT / COMPOSITION:\n'+placeholder('COVER '+c+' SHOT')+'\n\n';
  prompt+='SUBJECT:\n'+placeholder('COVER '+c+' SUBJECT')+'\n\n';
  prompt+='WORLD / CONTEXT:\n'+placeholder('COVER '+c+' WORLD')+'\n\n';
  prompt+='TEXT:\n'+placeholder('COVER '+c+' TEXT')+'\n\n';
  prompt+='LIGHT / MATERIALS:\n'+placeholder('COVER '+c+' LIGHT')+'\n\n';
  prompt+='NEGATIVE / STABILITY:\n'+placeholder('COVER '+c+' NEGATIVE')+'\n\n';
  prompt+='ACCURACY CHECK:\n'+placeholder('COVER '+c+' ACCURACY')+'\n\n';
  prompt+='OUTPUT:\n16:9 landscape, Cover-Kandidat-0'+c+'.png\n\n';
}

for(const scene of scenes.slice(1)){
  prompt+='SZENE '+scene.scene+' — '+scene.role+' — '+scene.image+'\n';
  prompt+='FINAL GOOGLE FLOW PROMPT:\n';
  prompt+='SCENE ROLE:\n'+scene.role+'\n\n';
  prompt+='VIEWER TAKEAWAY:\n'+placeholder('SCENE '+scene.scene+' VIEWER TAKEAWAY')+'\n\n';
  prompt+='TEACHING JOB:\n'+placeholder('SCENE '+scene.scene+' TEACHING JOB')+'\n\n';
  prompt+='SHOT / COMPOSITION:\n'+placeholder('SCENE '+scene.scene+' SHOT')+'\n\n';
  prompt+='SUBJECT / ACTION:\n'+placeholder('SCENE '+scene.scene+' SUBJECT ACTION')+'\n\n';
  prompt+='WORLD / CONTEXT:\n'+placeholder('SCENE '+scene.scene+' WORLD CONTEXT')+'\n\n';
  prompt+='TEXT / LABELS:\n'+placeholder('SCENE '+scene.scene+' TEXT LABELS')+'\n\n';
  prompt+='LIGHT / MATERIALS:\n'+placeholder('SCENE '+scene.scene+' LIGHT MATERIALS')+'\n\n';
  prompt+='NEGATIVE / STABILITY:\n'+placeholder('SCENE '+scene.scene+' NEGATIVE')+'\n\n';
  prompt+='ACCURACY CHECK:\n'+placeholder('SCENE '+scene.scene+' ACCURACY')+'\n\n';
  prompt+='OUTPUT:\n16:9 landscape, '+scene.image+'\n\n';
}

write('99-technik/episode.json',JSON.stringify(episode,null,2)+'\n');
write('99-technik/LEARNING_PLAN.json',JSON.stringify(learningPlan,null,2)+'\n');
write('99-technik/IMAGE_PLAN.json',JSON.stringify(imagePlan,null,2)+'\n');
write('99-technik/VOICE_PLAN.json',JSON.stringify(voicePlan,null,2)+'\n');
write('99-technik/COVER_SELECTION.json',JSON.stringify({schemaVersion:1,episodeFolder,status:'AWAITING_USER_SELECTION',selectedCandidate:null,finalFile:null},null,2)+'\n');
write('99-technik/VISUAL_REVIEW.json',JSON.stringify({
  schemaVersion:2,
  episodeFolder,
  learningAccuracyVerified:false,
  primaryObjectiveServedByEveryScene:false,
  ageBandAppropriate:false,
  practiceAnswerHiddenUntilReveal:false,
  revealExplainsAnswer:false,
  applicationSceneWorks:false,
  recapMatchesLearningPlan:false,
  sceneOrderMatchesPlan:false,
  visualsTeachIntendedConcept:false,
  textAndSpellingCorrect:false,
  noUnnecessaryCharacterInsertion:false,
  noUnplannedFactualClaims:false,
  noAnatomyOrObjectErrors:false,
  noMissingOrDuplicateScenes:false,
  notes:'Set true only after inspecting actual assets.'
},null,2)+'\n');
write('99-technik/GENERATION-REVISION.txt',episodeId.replace('-','')+'-L2\n');
write('99-technik/status.json',JSON.stringify({schemaVersion:2,contentFormat:'learning',status:'planning-required',learningEngineVersion:engine.schemaVersion,promptPlanReady:false,imagesReady:false,audioReady:false,assetsApproved:false,renderReady:false},null,2)+'\n');
write('00-bildprompts/google-flow-prompt.txt',prompt);
write('01-voice-script/voice-script.txt',exactNarration+'\n');
write('02-audio/MUSIC_BRIEF.md','# Music brief\n\nOptional light child-friendly instrumental under narration. No vocals unless the selected learning mode intentionally uses a song/chant. Narration must stay clearly intelligible.\n');
write('03-export/UPLOAD_METADATA.md','# Upload Metadata\n\n## YouTube Title\n'+placeholder('YOUTUBE TITLE')+'\n\n## Description\n'+placeholder('YOUTUBE DESCRIPTION')+'\n');
write('99-technik/README.md','# '+episodeId+' — '+topic+'\n\nFormat: PURE LEARNING\nAge band: '+ageBand+'\nLearning mode: '+learningMode+'\n\nNo workout, timer, GET READY or mandatory child/mascot.\n');
write('99-technik/ANTIGRAVITY.md','# ANTIGRAVITY — LEARNING ASSEMBLY\n\nDo not generate images in Phase 3. Use only approved learning assets and narration. Preserve the planned HOOK/TEACH/PRACTICE/REVEAL/APPLY/RECAP learning sequence. No workout timer or GET READY rules.\n');

console.log('Created pure learning draft: '+episodeFolder);
console.log('Age band: '+ageBand);
console.log('Learning mode: '+learningMode);
console.log('Scene roles: '+roles.join(' -> '));
console.log('Next: complete LEARNING_PLAN, narration and prompts, then run learning:prompt:qa.');

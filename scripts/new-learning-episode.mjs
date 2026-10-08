import fs from 'node:fs';
import path from 'node:path';

const args=process.argv.slice(2);
const getArg=(name,fallback='')=>{
  const item=args.find((arg)=>arg.startsWith('--'+name+'='));
  return item?item.slice(name.length+3):fallback;
};

const topic=getArg('topic');
const requestedId=getArg('id');
const requestedDate=getArg('date',new Date().toISOString().slice(0,10));
const targetAge=getArg('target-age','6-9');
const sceneCount=Math.max(6,Math.min(24,Number(getArg('scenes','10'))||10));

if(!topic){
  console.error('Missing --topic="..."');
  process.exit(1);
}
if(!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)){
  console.error('Invalid --date. Use YYYY-MM-DD.');
  process.exit(1);
}

const root=process.cwd();
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
const videoSceneCount=sceneCount;
const totalImages=videoSceneCount+1; // cover + video scenes
const pad=(n)=>String(n).padStart(2,'0');
const batches=[];
for(let start=2;start<=totalImages;start+=5){
  const group=[];
  for(let n=start;n<=Math.min(totalImages,start+4);n++) group.push(n);
  batches.push(group);
}

const scenes=[
  {scene:'01',type:'cover',image:'Szene 01.png',duration:0,inVideo:false}
];
for(let i=0;i<videoSceneCount;i++){
  const n=i+2;
  const type=i===0?'intro':i===videoSceneCount-1?'recap':'lesson';
  scenes.push({
    scene:pad(n),
    type,
    image:'Szene '+pad(n)+'.png',
    duration:Number(getArg('scene-seconds','8'))||8,
    learningPoint:placeholder('SCENE '+pad(n)+' LEARNING POINT'),
    narration:placeholder('SCENE '+pad(n)+' NARRATION'),
    visualForm:placeholder('SCENE '+pad(n)+' VISUAL FORM'),
    textOwner:'planned-per-scene',
    characterMode:'none'
  });
}

const exactNarration=placeholder('FULL CONTINUOUS NARRATION');
const episode={
  schemaVersion:1,
  structureVersion:1,
  contentFormat:'learning',
  formatContractFile:'config/formats/learning.json',
  id:episodeId,
  slug,
  date:requestedDate,
  day:new Date(requestedDate+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'long',timeZone:'UTC'}),
  topic,
  targetAge,
  status:'planning-required',
  learningObjective:placeholder('LEARNING OBJECTIVE'),
  keyQuestion:placeholder('KEY QUESTION'),
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
    voiceMayContinueAcrossEntireVideo:true
  },
  scenes,
  videoSceneCount,
  imageCount:totalImages
};

const learningPlan={
  schemaVersion:1,
  episodeFolder,
  topic,
  targetAge,
  learningObjective:placeholder('LEARNING OBJECTIVE'),
  keyQuestion:placeholder('KEY QUESTION'),
  priorKnowledge:placeholder('PRIOR KNOWLEDGE'),
  vocabulary:[placeholder('VOCABULARY')],
  facts:[
    {id:'F1',claim:placeholder('FACT 1'),sourceNote:placeholder('SOURCE NOTE 1')}
  ],
  recapPoints:[placeholder('RECAP POINT')],
  sceneLearningSequence:scenes.filter((s)=>s.inVideo!==false).map((s)=>({
    scene:s.scene,
    learningPoint:s.learningPoint,
    narration:s.narration
  }))
};

const imagePlan={
  schemaVersion:1,
  episodeFolder,
  contentFormat:'learning',
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
    userPromptBetweenBatchesForbidden:true
  },
  images:scenes.map((s)=>({
    sceneNumber:Number(s.scene),
    imageFile:s.image,
    sceneRole:s.type,
    visualPurpose:placeholder('SCENE '+s.scene+' VISUAL PURPOSE'),
    visualForm:s.visualForm||placeholder('SCENE '+s.scene+' VISUAL FORM'),
    characterMode:'none',
    referencePolicy:s.type==='cover'?'cover-candidate-stage':'no image reference required unless plan explicitly justifies one',
    prompt:placeholder('SCENE '+s.scene+' FINAL FLOW PROMPT')
  }))
};

const voicePlan={
  schemaVersion:1,
  episodeFolder,
  contentFormat:'learning',
  voiceFile:'Voice 01.mp3',
  narrationAcrossWholeVideo:true,
  sections:scenes.filter((s)=>s.inVideo!==false).map((s)=>({
    scene:s.scene,
    duration:s.duration,
    text:s.narration
  })),
  exactTtsCopy:exactNarration
};

let prompt='KIDMOTION PURE LEARNING — '+episodeId+' — '+topic+'\n\n';
prompt+='FORMAT: learning\n';
prompt+='No workout structure. No timer. No GET READY. No child/mascot requirement.\n';
prompt+='Choose the visual subject that teaches each concept best.\n\n';
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
  prompt+='QUALITY CHECK:\n'+placeholder('COVER '+c+' QC')+'\n\n';
  prompt+='OUTPUT:\n16:9 landscape, Cover-Kandidat-0'+c+'.png\n\n';
}
for(const scene of scenes.slice(1)){
  prompt+='SZENE '+scene.scene+' — '+scene.image+'\n';
  prompt+='FINAL GOOGLE FLOW PROMPT:\n';
  prompt+='VIEWER TAKEAWAY:\n'+placeholder('SCENE '+scene.scene+' VIEWER TAKEAWAY')+'\n\n';
  prompt+='SHOT / COMPOSITION:\n'+placeholder('SCENE '+scene.scene+' SHOT')+'\n\n';
  prompt+='SUBJECT / ACTION:\n'+placeholder('SCENE '+scene.scene+' SUBJECT ACTION')+'\n\n';
  prompt+='WORLD / CONTEXT:\n'+placeholder('SCENE '+scene.scene+' WORLD CONTEXT')+'\n\n';
  prompt+='TEXT / LABELS:\n'+placeholder('SCENE '+scene.scene+' TEXT LABELS')+'\n\n';
  prompt+='LIGHT / MATERIALS:\n'+placeholder('SCENE '+scene.scene+' LIGHT MATERIALS')+'\n\n';
  prompt+='NEGATIVE / STABILITY:\n'+placeholder('SCENE '+scene.scene+' NEGATIVE')+'\n\n';
  prompt+='QUALITY CHECK:\n'+placeholder('SCENE '+scene.scene+' QC')+'\n\n';
  prompt+='OUTPUT:\n16:9 landscape, '+scene.image+'\n\n';
}

write('99-technik/episode.json',JSON.stringify(episode,null,2)+'\n');
write('99-technik/LEARNING_PLAN.json',JSON.stringify(learningPlan,null,2)+'\n');
write('99-technik/IMAGE_PLAN.json',JSON.stringify(imagePlan,null,2)+'\n');
write('99-technik/VOICE_PLAN.json',JSON.stringify(voicePlan,null,2)+'\n');
write('99-technik/COVER_SELECTION.json',JSON.stringify({schemaVersion:1,episodeFolder,status:'AWAITING_USER_SELECTION',selectedCandidate:null,finalFile:null},null,2)+'\n');
write('99-technik/VISUAL_REVIEW.json',JSON.stringify({
  episodeFolder,
  learningAccuracyVerified:false,
  sceneOrderMatchesPlan:false,
  visualsTeachIntendedConcept:false,
  textAndSpellingCorrect:false,
  noUnnecessaryCharacterInsertion:false,
  noAnatomyOrObjectErrors:false,
  noMissingOrDuplicateScenes:false,
  notes:'Set true only after inspecting actual assets.'
},null,2)+'\n');
write('99-technik/GENERATION-REVISION.txt',episodeId.replace('-','')+'-L1\n');
write('99-technik/status.json',JSON.stringify({schemaVersion:1,contentFormat:'learning',status:'planning-required',promptPlanReady:false,imagesReady:false,audioReady:false,assetsApproved:false,renderReady:false},null,2)+'\n');
write('00-bildprompts/google-flow-prompt.txt',prompt);
write('01-voice-script/voice-script.txt',exactNarration+'\n');
write('02-audio/MUSIC_BRIEF.md','# Music brief\n\nOptional light child-friendly instrumental under narration. No vocals. Keep narration clearly intelligible.\n');
write('03-export/UPLOAD_METADATA.md','# Upload Metadata\n\n## YouTube Title\n'+placeholder('YOUTUBE TITLE')+'\n\n## Description\n'+placeholder('YOUTUBE DESCRIPTION')+'\n');
write('README.md','# '+episodeId+' — '+topic+'\n\nFormat: PURE LEARNING\nTarget age: '+targetAge+'\n\nThis episode intentionally has no workout, timer, GET READY or mandatory child/mascot.\n');
write('ANTIGRAVITY.md','# ANTIGRAVITY — LEARNING ASSEMBLY\n\nDo not generate images in Phase 3. Use the approved learning assets and narration. Learning videos do not inherit Workout timer/GET READY rules.\n');

console.log('Created pure learning draft: '+episodeFolder);
console.log('Scenes: '+videoSceneCount+' video scenes + cover.');
console.log('Next: complete LEARNING_PLAN, scene narration, prompts and upload metadata, then run learning:prompt:qa.');

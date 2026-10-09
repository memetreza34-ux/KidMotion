import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {loadContract, currentContractErrors, sceneFile} from './contract.mjs';

const root=process.cwd();
const args=process.argv.slice(2);
const episodeArg=args.find((v)=>v.startsWith('--episode='));
let episodeFolder=episodeArg?episodeArg.slice('--episode='.length):'';
if(!episodeFolder){
  const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
  if(fs.existsSync(pointer)) episodeFolder=JSON.parse(fs.readFileSync(pointer,'utf8')).episodeFolder||'';
}
if(!episodeFolder){
  console.error('FLOW BATCH FAILED: pass --episode=KM-XXX-slug.');
  process.exit(1);
}
const paths=resolveEpisodePaths(root,episodeFolder);
const data=readEpisodeData(paths);
const contract=loadContract(root);
const failures=currentContractErrors(data,contract);
if(failures.length){
  console.error('FLOW BATCH FAILED: episode does not satisfy the current contract.');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}

const pipeline=JSON.parse(fs.readFileSync(path.join(root,'config','pipeline.json'),'utf8'));
const batches=data.imageBatchPolicy?.batches||pipeline.batchGenerationPolicy?.batches||[];
if(!Array.isArray(batches)||!batches.length){
  console.error('FLOW BATCH FAILED: no generation batches configured.');
  process.exit(1);
}

const exists=(n)=>fs.existsSync(path.join(paths.imagesDir,sceneFile(n)));
const coverReady=exists(1);
let selection={};
if(fs.existsSync(paths.coverSelectionPath)){
  try{selection=JSON.parse(fs.readFileSync(paths.coverSelectionPath,'utf8'));}catch{}
}
const coverSelected=coverReady && selection.status==='SELECTED';

const state={
  schemaVersion:1,
  episodeFolder,
  updatedAt:new Date().toISOString(),
  coverSelected,
  status:'AWAITING_COVER_SELECTION',
  batchIndex:null,
  batchNumber:null,
  scenes:[],
  files:[],
  present:[],
  missing:[],
  laterBatchOutputsFound:[],
  instruction:'Generate exactly three cover candidates, stop, and wait for explicit user selection.'
};

if(coverSelected){
  let current=-1;
  for(let i=0;i<batches.length;i+=1){
    if(batches[i].some((n)=>!exists(n))){
      current=i;
      break;
    }
  }

  if(current===-1){
    state.status='ALL_SCENES_COMPLETE';
    state.instruction='All planned scene files appear present. Run npm run phase2:finalize -- --episode='+episodeFolder+' to verify 28 canonical filenames, clean up rejected covers, detect duplicates and assemble one final image folder. Then run scene:qa and visual review.';
  }else{
    const scenes=batches[current].map(Number);
    const later=batches.slice(current+1).flat().map(Number).filter(exists);
    state.status=later.length?'OUT_OF_ORDER_BLOCKED':'BATCH_ACTIVE';
    state.batchIndex=current;
    state.batchNumber=current+1;
    state.scenes=scenes;
    state.files=scenes.map(sceneFile);
    state.present=scenes.filter(exists);
    state.missing=scenes.filter((n)=>!exists(n));
    state.laterBatchOutputsFound=later;
    if(later.length){
      state.instruction='BLOCK: later scenes exist while an earlier batch is incomplete. Do not advance or shift filenames. At the production END, run phase2:finalize to audit ALL 28 names; if the safe missing-scene queue is produced, generate ONLY those absent scenes in Google Flow before retrying. Phase 3 never generates images.';
    }else{
      const range=String(scenes[0]).padStart(2,'0')+'–'+String(scenes[scenes.length-1]).padStart(2,'0');
      state.instruction='CURRENT HARD 5-SCENE STEP: Szene '+range+'. Generate ONLY these scenes, strictly serially. Finish/save the full block, perform silent QC on all files in the block, then rerun flow:batch and immediately continue. Do not ask the user between blocks.';
    }
  }
}

const numberedTasks=[];
if(data.sceneNumberingPolicy==='explicit-v1' && state.status==='BATCH_ACTIVE'){
  const planFile=paths.imagePlanPath;
  if(!fs.existsSync(planFile))throw Error('FLOW BATCH: IMAGE_PLAN.json missing for numbered scene batch.');
  const plan=JSON.parse(fs.readFileSync(planFile,'utf8'));
  for(const n of state.missing){
    const id=String(n).padStart(2,'0');
    const item=plan.images?.[n-1];
    const file='Szene '+id+'.png';
    if(!item||item.imageFile!==file||item.flowSceneId!==id||!String(item.prompt||'').startsWith('SCENE_ID: '+id+' | OUTPUT_FILE: '+file)){
      throw Error('FLOW BATCH: prompt ID/filename mismatch for '+file+'. Never guess the correct image.');
    }
    numberedTasks.push({
      sceneId:id,outputFile:file,imagePrompt:item.prompt,
      saveCommand:'npm run flow:save -- --episode='+episodeFolder+' --scene='+n+' --source="<actual-downloaded-PNG-path>"',
      note:'Use ONLY Szene 01.png reference, generate this scene one time, save actual PNG under this number immediately. Do not show SCENE_ID in image.'
    });
  }
}
state.numberedTasks=numberedTasks;

fs.mkdirSync(paths.techDir,{recursive:true});
fs.writeFileSync(path.join(paths.techDir,'FLOW_BATCH_STATE.json'),JSON.stringify(state,null,2)+'\n','utf8');

console.log('FLOW BATCH STATE — '+episodeFolder);
console.log('Status: '+state.status);
if(state.batchNumber) console.log('Batch: '+state.batchNumber+'/'+batches.length);
if(state.files.length) console.log('Allowed files: '+state.files.join(', '));
if(state.present.length) console.log('Already present in current block: '+state.present.map(sceneFile).join(', '));
if(state.missing.length) console.log('Still required in current block: '+state.missing.map(sceneFile).join(', '));
if(state.numberedTasks?.length) console.log('Numbered Flow tasks with exact source prompts and save commands written to 99-technik/FLOW_BATCH_STATE.json.');
if(state.laterBatchOutputsFound.length) console.log('OUT-OF-ORDER FILES: '+state.laterBatchOutputsFound.map(sceneFile).join(', '));
console.log(state.instruction);

if(state.status==='OUT_OF_ORDER_BLOCKED') process.exit(1);

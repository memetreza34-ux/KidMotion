import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';
import {loadContract,currentContractErrors} from './contract.mjs';
import {auditImages,sceneName} from './phase2-finalize-lib.mjs';

const root=process.cwd();
const arg=process.argv.slice(2).find(x=>x.startsWith('--episode='));
let episodeFolder=arg?arg.slice('--episode='.length):'';
if(!episodeFolder){
  const active=path.join(root,'episodes','ACTIVE_EPISODE.json');
  if(fs.existsSync(active))episodeFolder=JSON.parse(fs.readFileSync(active,'utf8')).episodeFolder||'';
}
if(!episodeFolder){
  console.error('PHASE 2 FINALIZE FAILED: provide --episode=KM-XXX-slug');
  process.exit(1);
}
const paths=resolveEpisodePaths(root,episodeFolder);
if(paths.structure==='missing'){
  console.error('PHASE 2 FINALIZE FAILED: episode does not exist.');
  process.exit(1);
}
const data=readEpisodeData(paths);
if(Number(data.structureVersion||0)<3||data.contentFormat==='learning'){
  console.error('PHASE 2 FINALIZE FAILED: this command handles V3 workout/learn-and-move images.');
  process.exit(1);
}
const contractErrors=currentContractErrors(data,loadContract(root));
if(contractErrors.length){
  console.error('PHASE 2 FINALIZE FAILED: episode contract invalid: '+contractErrors.join('; '));
  process.exit(1);
}
if(fs.existsSync(paths.approvalPath)){
  console.error('PHASE 2 FINALIZE BLOCKED: assets are already approved and immutable. Do not rename/delete them.');
  process.exit(1);
}

const selection=fs.existsSync(paths.coverSelectionPath)
  ?JSON.parse(fs.readFileSync(paths.coverSelectionPath,'utf8')):{};
const audit=auditImages(paths.imagesDir,{selection,normalize:true});
const plan=JSON.parse(fs.readFileSync(paths.imagePlanPath,'utf8'));
const approvedNames=(plan.images||[]).map(x=>x.imageFile);
const missing=audit.missing.filter(name=>approvedNames.includes(name));
const missingOther=audit.missing.filter(name=>!approvedNames.includes(name));
const queue=missing.filter(name=>name!==sceneName(1)).map(name=>{
  const image=plan.images.find(x=>x.imageFile===name);
  return {
    sceneNumber:image?.sceneNumber??Number(name.match(/\d+/)?.[0]||0),
    targetFile:name,
    prompt:image?.prompt||null,
    imageReference:'Szene 01.png ONLY',
    action:'Generate missing scene in Google Flow in Phase 2, exactly once. Save this real output to the exact target filename. No placeholder, clone, image shift or substitution.'
  };
});
const errors=[
  ...audit.conflicts.map(c=>'CONFLICT: '+c.scene+': '+(c.sources||[]).join(', ')+' '+(c.reason||'')),
  ...audit.unexpected.map(x=>'UNRECOGNIZED IMAGE: '+x+' (resolve the real scene identity before generating replacements)'),
  ...audit.invalidPng.map(x=>'INVALID PNG CONTENT: '+x),
  ...audit.exactDuplicates.map(x=>'DUPLICATE SCENE IMAGE: '+x.join(' == ')),
  ...missingOther.map(x=>'MISSING UNPLANNED SCENE: '+x)
];
if(audit.missing.includes(sceneName(1)))errors.push('SELECTED COVER IS MISSING: choose among three covers first. Do not generate a substitute in final repair.');
if(audit.present.length+missing.length!==28)errors.push('Unexpected planned image count.');
if(queue.some(item=>!item.prompt))errors.push('Missing original Flow prompt for at least one missing scene.');
const repairAllowed=errors.length===0&&selection.status==='SELECTED'&&!audit.missing.includes(sceneName(1));
const status=errors.length?'BLOCKED':missing.length?'NEEDS_FLOW_GENERATION':'COMPLETE';
const auditDoc={
  schemaVersion:1,episodeFolder,checkedAt:new Date().toISOString(),status,
  selectedCover:selection.selectedCandidate??null,
  expectedCount:28,presentCount:audit.present.length,
  missing:audit.missing,
  renamed:audit.renamed,
  removedRejectedCovers:audit.removedRejectedCovers,
  removedRedundantCopies:audit.removedRedundantCopies,
  unexpected:audit.unexpected,
  invalidPng:audit.invalidPng,
  exactDuplicates:audit.exactDuplicates,
  conflicts:audit.conflicts,
  errors,
  repairAllowed,
  nextAction:errors.length?'RESOLVE_CONFLICTS':missing.length?'PRODUCE_MISSING_IN_GOOGLE_FLOW_PHASE2':'HANDOFF_IMAGES_READY',
  imageFolder:'00-bildprompts/images'
};
fs.mkdirSync(paths.techDir,{recursive:true});
fs.writeFileSync(path.join(paths.techDir,'PHASE2_FINAL_AUDIT.json'),JSON.stringify(auditDoc,null,2)+'\n');
fs.writeFileSync(path.join(paths.techDir,'PHASE2_MISSING_SCENES.json'),JSON.stringify({
  schemaVersion:1,episodeFolder,status,repairAllowed,
  missingScenes:repairAllowed?queue:[],
  description:repairAllowed?'Generate only listed genuinely missing scenes in Google Flow, do not regenerate present scenes. Run phase2:finalize again after saving every missing output.':'Do not generate until cover/filename conflicts are resolved.'
},null,2)+'\n');
const handoff=path.join(paths.techDir,'PHASE2_HANDOFF.json');
if(status!=='COMPLETE')fs.rmSync(handoff,{force:true});
else{
  const doc={
    schemaVersion:1,episodeFolder,completedAt:new Date().toISOString(),
    imageFolder:'00-bildprompts/images',imageCount:28,
    filenames:audit.present.map(x=>x.name),
    images:audit.present,coverSelected:true,
    allNamesCanonical:true,remainingCoverCandidates:0,
    visualReviewStillRequired:true,assetApprovalStillRequired:true,
    note:'Only actual Phase-2 source images. Scene meaning, anatomy and on-image text still require a real visual review.'
  };
  fs.writeFileSync(handoff,JSON.stringify(doc,null,2)+'\n');
  if(fs.existsSync(paths.statusPath)){
    const episodeStatus=JSON.parse(fs.readFileSync(paths.statusPath,'utf8'));
    episodeStatus.imagesReady=true;
    episodeStatus.coverSelected=true;
    episodeStatus.coverSelectionPending=false;
    fs.writeFileSync(paths.statusPath,JSON.stringify(episodeStatus,null,2)+'\n');
  }
}
console.log('PHASE 2 FINAL AUDIT — '+episodeFolder);
console.log('Cover: '+(selection.status==='SELECTED'?'chosen':'NOT CHOSEN'));
console.log('Images: '+audit.present.length+'/28; status: '+status);
if(audit.renamed.length)console.log('Canonical filenames fixed: '+audit.renamed.map(x=>x.from+' => '+x.to).join(', '));
if(audit.removedRejectedCovers.length)console.log('Rejected cover files deleted: '+audit.removedRejectedCovers.join(', '));
if(missing.length)console.log('Missing: '+missing.join(', '));
if(errors.length)errors.forEach(x=>console.error(x));
if(status==='NEEDS_FLOW_GENERATION')console.log('PHASE 2 FLOW REPAIR QUEUE: 99-technik/PHASE2_MISSING_SCENES.json. Agent must generate each missing scene with its own planned prompt, then rerun phase2:finalize.');
if(status==='COMPLETE')console.log('PHASE 2 HANDOFF READY: all 28 correct PNGs are together in 00-bildprompts/images/. Next: inspect scene content, run scene:qa, approve, then hand over to Phase 3.');
if(status!=='COMPLETE')process.exit(status==='BLOCKED'?1:2);
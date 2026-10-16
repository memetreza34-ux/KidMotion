import fs from 'node:fs';
import path from 'node:path';
import {createImprovementBrief,pendingReviewErrors,loadImprovementPolicy,startActualVideoReview,validateOneReview} from './continuous-improvement-lib.mjs';

const root=process.cwd(),args=process.argv.slice(2),arg=k=>args.find(x=>x.startsWith('--'+k+'='))?.slice(k.length+3)||'';
const action=arg('action');
const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
const folder=arg('episode')||(fs.existsSync(pointer)?JSON.parse(fs.readFileSync(pointer,'utf8')).episodeFolder:'');
try{
 if(action==='gate'){
  loadImprovementPolicy(root);
  const errors=pendingReviewErrors(root);
  if(errors.length)throw Error(errors.join('\n'));
  console.log('QUALITY GATE PASS — no pending recorded review. This does not imply the actual video was inspected automatically.');
 }else if(action==='brief'){
  if(!folder)throw Error('Use --episode=KM-XXX-folder');
  const episode=JSON.parse(fs.readFileSync(path.join(root,'episodes',folder,'99-technik','episode.json'),'utf8'));
  const data=createImprovementBrief({root,episodeFolder:folder,format:episode.contentFormat});
  console.log('Created/updated next-video improvement brief for '+folder+' with rules '+data.items.map(x=>x.id).join(', '));
  console.log('Edit 99-technik/IMPROVEMENT_APPLICATION.json using exact factual excerpts from the episode source files.');
 }else if(action==='review-init'){
  if(!folder)throw Error('Use --episode=KM-XXX-folder or activate the episode');
  const result=startActualVideoReview({root,episodeFolder:folder,videoFile:arg('video')||'out/kidmotion.mp4'});
  console.log((result.created?'CREATED':'PRESERVED')+' POST-VIDEO REVIEW: '+path.relative(root,result.file));
  console.log('PENDING: watch whole actual MP4, verify script/art/voice/timing/child-safety and document concrete changes BEFORE making the next episode.');
 }else if(action==='review-check'){
  if(!folder)throw Error('Use --episode=KM-XXX-folder');
  const file=path.join(root,'quality','reviews',folder+'.json');
  if(!fs.existsSync(file))throw Error('Missing review file');
  const failures=validateOneReview(JSON.parse(fs.readFileSync(file,'utf8')),{root,episodeFolder:folder});
  if(failures.length)throw Error(failures.join('\n'));
  console.log('Review is marked completed and evidence fields checked for '+folder+'. Still verify improvements in the NEXT finished MP4.');
 }else throw Error('Use --action=gate|brief|review-init|review-check');
}catch(e){console.error('CONTINUOUS IMPROVEMENT BLOCKED: '+e.message);process.exit(1)}

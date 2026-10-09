import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';
import {loadContract,currentContractErrors} from './contract.mjs';
import {storeImage} from './flow-save-lib.mjs';

const args=process.argv.slice(2);
const arg=k=>args.find(x=>x.startsWith('--'+k+'='))?.slice(k.length+3)||'';
const folder=arg('episode'),source=arg('source'),scene=arg('scene'),cover=arg('cover'),repair=arg('repair')==='1';
const fail=msg=>{console.error('FLOW SAVE BLOCKED: '+msg);process.exit(1);};
if(!folder||!source||Boolean(scene)===Boolean(cover))fail('Pass --episode, --source and exactly one of --scene=N or --cover=N.');
if(path.extname(source).toLowerCase()!=='.png')fail('Source must be an actual downloaded PNG. Convert a real image to PNG during Phase 2 if necessary, without inventing image content.');
if(!/^(?:0?[1-3])$/.test(cover)&&!(!cover&&/^(?:0?[2-9]|1\d|2[0-8])$/.test(scene)))fail('Cover ID must be 1-3 / 01-03; scene ID must be 2-28 / 02-28.');
const paths=resolveEpisodePaths(process.cwd(),folder);
if(paths.structure==='missing')fail('Episode not found.');
const episode=readEpisodeData(paths);
const errors=currentContractErrors(episode,loadContract(process.cwd()));
if(errors.length)fail(errors.join('; '));
const n=Number(cover||scene),id=String(n).padStart(2,'0');
const imageDir=paths.imagesDir;
const dest=path.join(imageDir,cover?'Cover-Kandidat-'+id+'.png':'Szene '+id+'.png');
const selection=fs.existsSync(paths.coverSelectionPath)?JSON.parse(fs.readFileSync(paths.coverSelectionPath,'utf8')):{};
const plan=JSON.parse(fs.readFileSync(paths.imagePlanPath,'utf8'));

if(cover){
  if(repair)fail('Repair only applies to numbered scenes, never the selected cover.');
  if(selection.status==='SELECTED'||fs.existsSync(path.join(imageDir,'Szene 01.png')))fail('Cover already selected. Do not replace the chosen identity.');
  for(let i=1;i<n;i++)if(!fs.existsSync(path.join(imageDir,'Cover-Kandidat-'+String(i).padStart(2,'0')+'.png')))fail('Produce/download cover candidates in order; missing cover '+i+'.');
}else{
  if(selection.status!=='SELECTED'||selection.finalFile!=='Szene 01.png')fail('User must select a real cover before scenes.');
  const chosen=path.join(imageDir,'Szene 01.png');
  if(!fs.existsSync(chosen))fail('Selected cover file is missing.');
  if(selection.selectedCoverSha256&&crypto.createHash('sha256').update(fs.readFileSync(chosen)).digest('hex')!==selection.selectedCoverSha256)fail('Chosen cover image changed.');
  const expected=plan.images[n-1];
  if(expected?.imageFile!=='Szene '+id+'.png')fail('Scene number does not match IMAGE_PLAN.');
  if(episode.sceneNumberingPolicy==='explicit-v1' && (!expected.prompt?.startsWith('SCENE_ID: '+id+' | OUTPUT_FILE: Szene '+id+'.png')||expected.flowSceneId!==id))fail('Prompt ID and IMAGE_PLAN do not match.');
  if(repair){
    const queue=path.join(paths.techDir,'PHASE2_MISSING_SCENES.json');
    if(!fs.existsSync(queue))fail('No approved missing-scene audit queue. Run phase2:finalize first.');
    const data=JSON.parse(fs.readFileSync(queue,'utf8'));
    if(data.status!=='NEEDS_FLOW_GENERATION'||data.repairAllowed!==true||!data.missingScenes?.some(x=>x.targetFile==='Szene '+id+'.png'))fail('Scene not in authorized missing-scene queue.');
  }else{
    for(let i=2;i<n;i++)if(!fs.existsSync(path.join(imageDir,'Szene '+String(i).padStart(2,'0')+'.png')))fail('Earlier scene '+i+' missing. Do not shift image numbering. Use Phase 2 repair if a previous attempt failed.');
  }
}
try{
  const result=storeImage({source,destination:dest,imagesDir:imageDir});
  console.log('FLOW IMAGE SAVED: '+result.file+' ('+result.width+'x'+result.height+')');
  console.log('SHA256: '+result.sha256);
  console.log('Scene identity still needs human visual inspection. Filename comes from explicit --scene/--cover, not from Google Flow metadata.');
}catch(e){fail(e.message);}

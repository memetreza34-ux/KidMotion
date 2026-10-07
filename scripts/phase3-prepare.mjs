import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

const root=process.cwd();
const args=process.argv.slice(2);
const item=args.find((v)=>v.startsWith('--episode='));
let episodeFolder=item?item.slice('--episode='.length):'';
if(!episodeFolder){
  const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
  if(fs.existsSync(pointer)) episodeFolder=JSON.parse(fs.readFileSync(pointer,'utf8')).episodeFolder||'';
}
if(!episodeFolder){
  console.error('PHASE 3 PREPARE FAILED: use --episode=KM-XXX-slug');
  process.exit(1);
}
const paths=resolveEpisodePaths(root,episodeFolder);
const data=readEpisodeData(paths);
const npm=process.platform==='win32'?'npm.cmd':'npm';

const run=(label,cmdArgs)=>{
  console.log('\n=== '+label+' ===');
  const r=spawnSync(npm,cmdArgs,{stdio:'inherit'});
  return Number(r.status||0);
};

const ingestStatus=run('RAW HANDOFF INGEST',['run','phase3:ingest','--','--episode='+episodeFolder]);
if(ingestStatus!==0){
  console.error('PHASE 3 PREPARE FAILED during ingest.');
  process.exit(ingestStatus);
}

const ingestPath=path.join(paths.techDir,'PHASE3_INGEST.json');
if(!fs.existsSync(ingestPath)){
  console.error('PHASE 3 PREPARE FAILED: PHASE3_INGEST.json was not created.');
  process.exit(1);
}
const ingest=JSON.parse(fs.readFileSync(ingestPath,'utf8'));
if(ingest.technicalHandoffReady!==true){
  console.error('PHASE 3 PREPARE BLOCKED: the raw handoff is incomplete.');
  if(Array.isArray(ingest.missingImages)&&ingest.missingImages.length) console.error('Missing images: '+ingest.missingImages.join(', '));
  if(ingest.voiceReady!==true) console.error('Missing/unresolved opening voice.');
  if(data.audioPolicy?.backgroundMusicRequiredForFinal===true && ingest.backgroundMusicReady!==true) console.error('Missing/unresolved background music.');
  for(const e of ingest.errors||[]) console.error('- '+e);
  console.error('Antigravity must report the missing/ambiguous Phase 2 input. It must NOT generate replacement images.');
  process.exit(1);
}

const sceneStatus=run('SCENE INTEGRITY QA',['run','scene:qa','--','--episode='+episodeFolder]);
if(sceneStatus!==0){
  console.error('PHASE 3 PREPARE BLOCKED: scene integrity QA failed.');
  process.exit(sceneStatus);
}

const result={
  schemaVersion:1,
  episodeFolder,
  preparedAt:new Date().toISOString(),
  ingestManifest:'99-technik/PHASE3_INGEST.json',
  technicalHandoffReady:true,
  sceneQaPassed:true,
  nextRequiredAction:'ANTIGRAVITY_VISUAL_REVIEW',
  instructions:[
    'Inspect the actual Szene 01.png through Szene 28.png files visually.',
    'Update VISUAL_REVIEW.json only from real inspection; never fake flags.',
    'Then run assets:approve for this episode.',
    'Then activate the episode, run phase3:gate, and render:safe.'
  ],
  userManualUnzipRequired:false,
  userManualAudioConversionRequired:false,
  imageGenerationForbidden:true
};
fs.writeFileSync(path.join(paths.techDir,'PHASE3_PREPARE.json'),JSON.stringify(result,null,2)+'\n','utf8');
console.log('\nPHASE 3 TECHNICAL PREPARE PASSED — '+episodeFolder);
console.log('Antigravity must now perform the real visual review itself; do not send the user back to unzip/convert/rename files.');

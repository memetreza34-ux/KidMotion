import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {loadContract, currentContractErrors, sceneFile} from './contract.mjs';

const root=process.cwd();
const args=process.argv.slice(2);
const arg=(name)=>{const item=args.find((v)=>v.startsWith(`--${name}=`));return item?item.slice(name.length+3):'';};
let episodeFolder=arg('episode');
if(!episodeFolder){
  const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
  if(fs.existsSync(pointer)) episodeFolder=JSON.parse(fs.readFileSync(pointer,'utf8')).episodeFolder||'';
}
if(!episodeFolder){
  console.error('PHASE 3 INGEST FAILED: use --episode=KM-XXX-slug');
  process.exit(1);
}

const paths=resolveEpisodePaths(root,episodeFolder);
if(paths.structure==='missing'){
  console.error('PHASE 3 INGEST FAILED: episode is missing.');
  process.exit(1);
}
const data=readEpisodeData(paths);
const contract=loadContract(root);
const contractErrors=currentContractErrors(data,contract);
if(contractErrors.length){
  console.error('PHASE 3 INGEST FAILED: episode is not on the current production contract.');
  contractErrors.forEach((e,i)=>console.error(`${i+1}. ${e}`));
  process.exit(1);
}

fs.mkdirSync(paths.imagesDir,{recursive:true});
fs.mkdirSync(paths.audioDir,{recursive:true});
fs.mkdirSync(paths.techDir,{recursive:true});

const approvalExists=fs.existsSync(paths.approvalPath);
if(approvalExists){
  console.error('PHASE 3 INGEST BLOCKED: ASSET_APPROVAL.json already exists. Approved assets are immutable. Delete/revoke approval in Phase 2 before importing different files.');
  process.exit(1);
}

const sha256=(file)=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk=(dir)=>{
  if(!fs.existsSync(dir)) return [];
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name==='.git'||entry.name==='node_modules'||entry.name==='.phase3-ingest') continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...walk(full)); else out.push(full);
  }
  return out;
};
const isImage=(f)=>/\.(png|jpg|jpeg|webp)$/i.test(f);
const isAudioContainer=(f)=>/\.(mp3|wav|m4a|aac|flac|ogg|mp4|mov|webm)$/i.test(f);
const rel=(f)=>path.relative(paths.episodeRoot,f).split(path.sep).join('/');

const manifest={
  schemaVersion:1,
  episodeFolder,
  startedAt:new Date().toISOString(),
  sourceArchives:[],
  importedImages:[],
  audioConversions:[],
  warnings:[],
  notes:[
    'Phase 3 ingest may unpack/copy/rename files and transcode audio only.',
    'It never generates images and never changes image pixels.'
  ]
};

const staging=path.join(paths.techDir,'.phase3-ingest');
fs.rmSync(staging,{recursive:true,force:true});
fs.mkdirSync(staging,{recursive:true});

const episodeFilesBefore=walk(paths.episodeRoot);
const zipFiles=episodeFilesBefore.filter((f)=>/\.zip$/i.test(f) && !f.startsWith(staging));

function extractZip(zipFile,destination){
  fs.mkdirSync(destination,{recursive:true});
  const unzip=spawnSync('unzip',['-qq','-o',zipFile,'-d',destination],{encoding:'utf8'});
  if(unzip.status===0) return {method:'unzip'};
  const pyCode=[
    'import sys,zipfile,os',
    'z=sys.argv[1]; d=sys.argv[2]',
    'os.makedirs(d,exist_ok=True)',
    'with zipfile.ZipFile(z) as f: f.extractall(d)'
  ].join('; ');
  const py=spawnSync('python3',['-c',pyCode,zipFile,destination],{encoding:'utf8'});
  if(py.status===0) return {method:'python3-zipfile',fallbackFrom:String(unzip.stderr||'').trim()};
  throw new Error(`Could not extract ${path.basename(zipFile)}. unzip: ${String(unzip.stderr||'').trim()} python3: ${String(py.stderr||'').trim()}`);
}

for(let i=0;i<zipFiles.length;i+=1){
  const zip=zipFiles[i];
  const dest=path.join(staging,`zip-${i+1}`);
  try{
    const info=extractZip(zip,dest);
    manifest.sourceArchives.push({file:rel(zip),method:info.method});
  }catch(error){
    console.error(`PHASE 3 INGEST FAILED: ${error.message}`);
    process.exit(1);
  }
}

const sourceRoots=[...Array.from({length:zipFiles.length},(_,i)=>path.join(staging,`zip-${i+1}`)),paths.episodeRoot];
let sourceImages=[];
for(const sr of sourceRoots) sourceImages.push(...walk(sr).filter(isImage));
sourceImages=[...new Set(sourceImages)].filter((f)=>!f.startsWith(paths.imagesDir+path.sep) || !/^Szene \d{2}\.png$/i.test(path.basename(f)));

const sceneNumberFromName=(name)=>{
  const base=path.basename(name,path.extname(name));
  const patterns=[
    /(?:szene|scene)[ _-]*0?(\d{1,2})\b/i,
    /^0?(\d{1,2})$/,
    /(?:image|img|bild)[ _-]*0?(\d{1,2})\b/i
  ];
  for(const re of patterns){
    const m=base.match(re);
    if(m){
      const n=Number(m[1]);
      if(n>=1&&n<=28) return n;
    }
  }
  return null;
};

const byScene=new Map();
for(const file of sourceImages){
  const n=sceneNumberFromName(file);
  if(!n) continue;
  if(!byScene.has(n)) byScene.set(n,[]);
  byScene.get(n).push(file);
}

for(let n=1;n<=28;n+=1){
  const target=path.join(paths.imagesDir,sceneFile(n));
  if(fs.existsSync(target)) continue;
  const candidates=byScene.get(n)||[];
  if(candidates.length===1){
    const source=candidates[0];
    fs.copyFileSync(source,target);
    manifest.importedImages.push({scene:n,from:rel(source),to:rel(target),sha256:sha256(target),pixelContentChanged:false});
  }else if(candidates.length>1){
    manifest.warnings.push(`Szene ${String(n).padStart(2,'0')}: multiple source candidates; not guessed.`);
  }
}

const finalImages=Array.from({length:28},(_,i)=>path.join(paths.imagesDir,sceneFile(i+1)));
const missingImages=finalImages.filter((f)=>!fs.existsSync(f));
if(missingImages.length){
  const allUnmapped=sourceImages.filter((f)=>sceneNumberFromName(f)===null);
  if(allUnmapped.length===missingImages.length && missingImages.length===28){
    manifest.warnings.push('Archive contains exactly 28 unnumbered images. Automatic order guessing is forbidden. Provide numbered filenames or a scene mapping.');
  }
}

// If Phase 2 handed over the already-final cover, record the handoff selection metadata.
const scene01=path.join(paths.imagesDir,'Szene 01.png');
if(fs.existsSync(scene01) && fs.existsSync(paths.coverSelectionPath)){
  const selection=JSON.parse(fs.readFileSync(paths.coverSelectionPath,'utf8'));
  if(selection.status!=='SELECTED'){
    selection.status='SELECTED';
    selection.selectionSource='PHASE2_HANDOFF';
    selection.selectedCandidate=null;
    selection.selectedCandidateOriginalFile=null;
    selection.finalFile='Szene 01.png';
    selection.userSelectionRequired=false;
    selection.soleReferenceForLaterScenes='Szene 01.png';
    selection.secondaryImageReferencesForbidden=true;
    selection.importedAt=new Date().toISOString();
    fs.writeFileSync(paths.coverSelectionPath,`${JSON.stringify(selection,null,2)}\n`,'utf8');
  }
}

function runFfmpeg(source,target){
  const r=spawnSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',source,'-vn','-codec:a','libmp3lame','-b:a','192k',target],{encoding:'utf8'});
  if(r.status!==0) throw new Error(String(r.stderr||'ffmpeg conversion failed').trim());
}

const audioFiles=walk(paths.audioDir).filter(isAudioContainer);
const expectedVoice=path.join(paths.audioDir,data.voicePolicy?.voiceFile||'Voice 01.mp3');
const expectedMusic=path.join(paths.audioDir,data.audioPolicy?.backgroundMusicFile||'bg-music.mp3');

const findAudio=(regexes)=>audioFiles.find((f)=>regexes.some((re)=>re.test(path.basename(f))) && path.resolve(f)!==path.resolve(expectedVoice) && path.resolve(f)!==path.resolve(expectedMusic));

if(!fs.existsSync(expectedVoice)){
  let voiceSource=findAudio([/voice/i,/narrat/i,/speech/i,/kids?\.(mp4|mov|webm|m4a|wav|aac)$/i]);
  if(!voiceSource){
    const nonMusic=audioFiles.filter((f)=>!/music|bg|background|instrumental/i.test(path.basename(f)));
    if(nonMusic.length===1) voiceSource=nonMusic[0];
  }
  if(voiceSource){
    try{
      runFfmpeg(voiceSource,expectedVoice);
      manifest.audioConversions.push({role:'voice',from:rel(voiceSource),to:rel(expectedVoice),sha256:sha256(expectedVoice)});
    }catch(error){
      manifest.warnings.push(`Voice conversion failed: ${error.message}`);
    }
  }
}

if(!fs.existsSync(expectedMusic)){
  const musicSource=findAudio([/bg/i,/background/i,/music/i,/instrumental/i]);
  if(musicSource){
    try{
      runFfmpeg(musicSource,expectedMusic);
      manifest.audioConversions.push({role:'background-music',from:rel(musicSource),to:rel(expectedMusic),sha256:sha256(expectedMusic)});
    }catch(error){
      manifest.warnings.push(`Background-music conversion failed: ${error.message}`);
    }
  }
}

manifest.completedAt=new Date().toISOString();
manifest.finalImageCount=finalImages.filter(fs.existsSync).length;
manifest.missingImages=missingImages.map((f)=>path.basename(f));
manifest.voiceReady=fs.existsSync(expectedVoice);
manifest.backgroundMusicReady=fs.existsSync(expectedMusic);
const manifestPath=path.join(paths.techDir,'PHASE3_INGEST.json');
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
fs.rmSync(staging,{recursive:true,force:true});

console.log(`PHASE 3 INGEST COMPLETE — ${episodeFolder}`);
console.log(`Images ready: ${manifest.finalImageCount}/28`);
console.log(`Voice ready: ${manifest.voiceReady?'yes':'no'}`);
console.log(`Background music ready: ${manifest.backgroundMusicReady?'yes':'no'}`);
if(manifest.warnings.length){
  console.log('Warnings:');
  manifest.warnings.forEach((w)=>console.log(`- ${w}`));
}
if(manifest.missingImages.length){
  console.log(`Missing scene files: ${manifest.missingImages.join(', ')}`);
  console.log('No replacement images were generated. Fix the Phase 2 handoff or provide deterministic numbered filenames.');
}
console.log('Next: scene:qa -> visual review -> assets:approve -> activate -> phase3:gate -> render:safe');

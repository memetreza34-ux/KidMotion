import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';
import {loadContract, currentContractErrors, sceneFile} from './contract.mjs';

const root=process.cwd();
const args=process.argv.slice(2);
const readArg=(name)=>{
  const item=args.find((v)=>v.startsWith('--'+name+'='));
  return item ? item.slice(name.length+3) : '';
};
let episodeFolder=readArg('episode');
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
  console.error('PHASE 3 INGEST FAILED: episode data is missing.');
  process.exit(1);
}
const data=readEpisodeData(paths);
const contract=loadContract(root);
const contractErrors=currentContractErrors(data,contract);
if(contractErrors.length){
  console.error('PHASE 3 INGEST FAILED: episode is not on the current production contract.');
  contractErrors.forEach((e,i)=>console.error(String(i+1)+'. '+e));
  process.exit(1);
}

fs.mkdirSync(paths.imagesDir,{recursive:true});
fs.mkdirSync(paths.audioDir,{recursive:true});
fs.mkdirSync(paths.techDir,{recursive:true});

if(fs.existsSync(paths.approvalPath)){
  console.error('PHASE 3 INGEST BLOCKED: ASSET_APPROVAL.json already exists. Approved assets are immutable.');
  console.error('If the handoff changed, revoke/recreate approval before importing different files.');
  process.exit(1);
}

const sha256=(file)=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const normalizedRel=(file)=>path.relative(paths.episodeRoot,file).split(path.sep).join('/');
const isImage=(file)=>/\.(png|jpg|jpeg|webp)$/i.test(file);
const isAudioContainer=(file)=>/\.(mp3|wav|m4a|aac|flac|ogg|mp4|mov|webm)$/i.test(file);
const isZip=(file)=>/\.zip$/i.test(file);

const walk=(dir)=>{
  if(!fs.existsSync(dir)) return [];
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules','.phase3-ingest'].includes(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
};

const manifest={
  schemaVersion:2,
  episodeFolder,
  startedAt:new Date().toISOString(),
  sourceArchives:[],
  importedImages:[],
  coverSelectionReconstructed:false,
  audioConversions:[],
  ignoredFiles:[],
  warnings:[],
  errors:[],
  invariants:{
    generatedImages:false,
    changedImagePixels:false,
    guessedSceneOrder:false
  }
};

const staging=path.join(paths.techDir,'.phase3-ingest');
fs.rmSync(staging,{recursive:true,force:true});
fs.mkdirSync(staging,{recursive:true});

const safeEntryName=(name)=>{
  const clean=String(name||'').replace(/\\/g,'/');
  if(!clean || clean.startsWith('/') || clean.includes('../') || /^[A-Za-z]:\//.test(clean)) return null;
  return clean;
};

const commandExists=(cmd)=>{
  const probe=spawnSync(cmd,['-version'],{stdio:'ignore'});
  if(probe.status===0) return true;
  const help=spawnSync(cmd,['--version'],{stdio:'ignore'});
  return help.status===0;
};

const pythonAvailable=()=>{
  const p=spawnSync('python3',['--version'],{stdio:'ignore'});
  return p.status===0;
};

const listZipWithPython=(zipFile)=>{
  const code=[
    'import sys,zipfile,json',
    'z=zipfile.ZipFile(sys.argv[1])',
    'print(json.dumps([{"index":i,"name":x.filename,"size":x.file_size,"is_dir":x.is_dir()} for i,x in enumerate(z.infolist())]))'
  ].join(';');
  const r=spawnSync('python3',['-c',code,zipFile],{encoding:'utf8',maxBuffer:20*1024*1024});
  if(r.status!==0) throw new Error(String(r.stderr||'python zip listing failed').trim());
  return JSON.parse(r.stdout||'[]');
};

const listZipWithUnzip=(zipFile)=>{
  const r=spawnSync('unzip',['-Z1',zipFile],{encoding:'utf8',maxBuffer:20*1024*1024});
  if(r.status!==0) throw new Error(String(r.stderr||'unzip listing failed').trim());
  return String(r.stdout||'').split(/\r?\n/).filter(Boolean).map((name,index)=>({index,name,size:null,is_dir:name.endsWith('/')}));
};

const listZip=(zipFile)=>{
  if(pythonAvailable()){
    try{return {method:'python3-zipfile',entries:listZipWithPython(zipFile)};}catch{}
  }
  return {method:'unzip',entries:listZipWithUnzip(zipFile)};
};

const extractPythonEntry=(zipFile,index,target)=>{
  const code=[
    'import sys,zipfile,shutil,os',
    'z=zipfile.ZipFile(sys.argv[1])',
    'info=z.infolist()[int(sys.argv[2])]',
    'os.makedirs(os.path.dirname(sys.argv[3]),exist_ok=True)',
    'src=z.open(info)',
    'dst=open(sys.argv[3],"wb")',
    'shutil.copyfileobj(src,dst)',
    'dst.close()',
    'src.close()'
  ].join(';');
  const r=spawnSync('python3',['-c',code,zipFile,String(index),target],{encoding:'utf8'});
  if(r.status!==0) throw new Error(String(r.stderr||'python zip extraction failed').trim());
};

const extractUnzipEntry=(zipFile,name,target)=>{
  fs.mkdirSync(path.dirname(target),{recursive:true});
  const fd=fs.openSync(target,'w');
  try{
    const r=spawnSync('unzip',['-p',zipFile,name],{stdio:['ignore',fd,'pipe']});
    if(r.status!==0) throw new Error(String(r.stderr||'unzip extraction failed'));
  } finally {
    fs.closeSync(fd);
  }
};

const episodeFiles=walk(paths.episodeRoot);
const zipFiles=episodeFiles.filter(isZip);
const extractedSources=[];

for(let zi=0;zi<zipFiles.length;zi+=1){
  const zipFile=zipFiles[zi];
  let listed;
  try{
    listed=listZip(zipFile);
  }catch(error){
    manifest.errors.push('Could not read ZIP '+normalizedRel(zipFile)+': '+error.message);
    continue;
  }
  const relevant=listed.entries.filter((entry)=>{
    const safe=safeEntryName(entry.name);
    return safe && !entry.is_dir && (isImage(safe)||isAudioContainer(safe));
  });

  let relevantBytes=0;
  let knownSizes=true;
  for(const entry of relevant){
    if(typeof entry.size==='number') relevantBytes+=entry.size;
    else knownSizes=false;
  }
  if(knownSizes && typeof fs.statfsSync==='function'){
    try{
      const stat=fs.statfsSync(paths.techDir);
      const free=Number(stat.bavail)*Number(stat.bsize);
      const required=Math.max(100*1024*1024,relevantBytes*2);
      if(free<required){
        manifest.errors.push('Not enough free disk space to safely import '+normalizedRel(zipFile)+'. Need about '+Math.ceil(required/1024/1024)+' MB free.');
        continue;
      }
    }catch{}
  }

  const archiveDir=path.join(staging,'zip-'+String(zi+1).padStart(2,'0'));
  fs.mkdirSync(archiveDir,{recursive:true});
  let extractedCount=0;
  for(let ei=0;ei<relevant.length;ei+=1){
    const entry=relevant[ei];
    const safe=safeEntryName(entry.name);
    const ext=path.extname(safe).toLowerCase();
    const target=path.join(archiveDir,String(ei+1).padStart(3,'0')+ext);
    try{
      if(listed.method==='python3-zipfile') extractPythonEntry(zipFile,entry.index,target);
      else extractUnzipEntry(zipFile,entry.name,target);
      extractedSources.push({file:target,sourceLabel:normalizedRel(zipFile)+'::'+entry.name,originalName:entry.name});
      extractedCount+=1;
    }catch(error){
      manifest.errors.push('Could not extract '+entry.name+' from '+normalizedRel(zipFile)+': '+error.message);
    }
  }
  manifest.sourceArchives.push({file:normalizedRel(zipFile),method:listed.method,relevantEntries:relevant.length,extractedEntries:extractedCount});
}

// Loose handoff files are also accepted.
for(const file of episodeFiles){
  if(file.startsWith(paths.techDir+path.sep)) continue;
  if(file.startsWith(paths.imagesDir+path.sep) && /^Szene \d{2}\.png$/i.test(path.basename(file))) continue;
  if(isImage(file)||isAudioContainer(file)){
    extractedSources.push({file,sourceLabel:normalizedRel(file),originalName:path.basename(file)});
  }
}

const sceneNumberFromName=(name)=>{
  const base=path.basename(String(name||''),path.extname(String(name||'')));
  const patterns=[
    /(?:szene|scene|image|img|bild|frame)[^0-9]*0?(\d{1,2})(?:\D|$)/i,
    /^\s*0?(\d{1,2})(?:\D|$)/
  ];
  for(const re of patterns){
    const m=base.match(re);
    if(!m) continue;
    const n=Number(m[1]);
    if(n>=1&&n<=28) return n;
  }
  return null;
};

const imageSources=extractedSources.filter((x)=>isImage(x.originalName));
const byScene=new Map();
for(const source of imageSources){
  const n=sceneNumberFromName(source.originalName);
  if(!n) continue;
  if(!byScene.has(n)) byScene.set(n,[]);
  byScene.get(n).push(source);
}

for(let n=1;n<=28;n+=1){
  const target=path.join(paths.imagesDir,sceneFile(n));
  if(fs.existsSync(target)) continue;
  let candidates=byScene.get(n)||[];
  if(candidates.length>1){
    const hashes=new Map();
    for(const c of candidates){
      const h=sha256(c.file);
      if(!hashes.has(h)) hashes.set(h,c);
    }
    candidates=[...hashes.values()];
  }
  if(candidates.length===0) continue;
  if(candidates.length>1){
    manifest.errors.push('Szene '+String(n).padStart(2,'0')+' has multiple different source files. Scene order will not be guessed.');
    continue;
  }
  const source=candidates[0];
  if(path.extname(source.originalName).toLowerCase()!=='.png'){
    manifest.errors.push('Szene '+String(n).padStart(2,'0')+' source is '+path.extname(source.originalName)+'. Phase 3 does not modify image pixels; provide the Phase 2 PNG.');
    continue;
  }
  fs.copyFileSync(source.file,target);
  manifest.importedImages.push({scene:n,from:source.sourceLabel,to:normalizedRel(target),sha256:sha256(target),pixelContentChanged:false});
}

const finalImages=Array.from({length:28},(_,i)=>path.join(paths.imagesDir,sceneFile(i+1)));
const missingImages=finalImages.filter((f)=>!fs.existsSync(f));

const unmappedImages=imageSources.filter((x)=>sceneNumberFromName(x.originalName)===null);
if(unmappedImages.length && missingImages.length){
  manifest.warnings.push(String(unmappedImages.length)+' image file(s) have no deterministic scene number and were not guessed.');
}

// Reconstruct/normalize cover metadata when Phase 2 already delivered the final cover.
const scene01=path.join(paths.imagesDir,'Szene 01.png');
if(fs.existsSync(scene01)){
  let selection={};
  if(fs.existsSync(paths.coverSelectionPath)){
    try{selection=JSON.parse(fs.readFileSync(paths.coverSelectionPath,'utf8'));}catch{}
  }
  if(selection.status!=='SELECTED' || selection.finalFile!=='Szene 01.png'){
    selection={
      ...selection,
      schemaVersion:Number(selection.schemaVersion||1),
      productionContractVersion:Number(data.productionContractVersion||1),
      episodeFolder,
      status:'SELECTED',
      selectionSource:'PHASE2_FINAL_HANDOFF',
      selectedCandidate:null,
      selectedCandidateOriginalFile:null,
      finalFile:'Szene 01.png',
      userSelectionRequired:false,
      soleReferenceForLaterScenes:'Szene 01.png',
      secondaryImageReferencesForbidden:true,
      importedAt:new Date().toISOString()
    };
    fs.writeFileSync(paths.coverSelectionPath,JSON.stringify(selection,null,2)+'\n','utf8');
    manifest.coverSelectionReconstructed=true;
  }
}

const ffprobeDuration=(file)=>{
  const r=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file],{encoding:'utf8'});
  if(r.status!==0) return null;
  const value=Number(String(r.stdout||'').trim());
  return Number.isFinite(value)?value:null;
};

const ffmpegAvailable=()=>{
  const r=spawnSync('ffmpeg',['-version'],{stdio:'ignore'});
  return r.status===0;
};
const ffprobeAvailable=()=>{
  const r=spawnSync('ffprobe',['-version'],{stdio:'ignore'});
  return r.status===0;
};

const audioSources=extractedSources.filter((x)=>isAudioContainer(x.originalName));
const expectedVoice=path.join(paths.audioDir,data.voicePolicy?.voiceFile||'Voice 01.mp3');
const expectedMusic=path.join(paths.audioDir,data.audioPolicy?.backgroundMusicFile||'bg-music.mp3');

const scoreVoice=(source)=>{
  const name=path.basename(source.originalName).toLowerCase();
  let score=0;
  if(/voice|narrat|speech|tts/.test(name)) score+=8;
  if(/^kids?\.(mp4|mov|webm|m4a|wav|aac|mp3)$/i.test(path.basename(source.originalName))) score+=4;
  if(/music|background|instrumental|bg[-_ ]?music/.test(name)) score-=10;
  if(source.duration!=null){
    if(source.duration>=8 && source.duration<=25) score+=7;
    else if(source.duration>60) score-=6;
  }
  return score;
};
const scoreMusic=(source)=>{
  const name=path.basename(source.originalName).toLowerCase();
  let score=0;
  if(/music|background|instrumental|bg[-_ ]?music|soundtrack/.test(name)) score+=8;
  if(/voice|narrat|speech|tts/.test(name)) score-=10;
  if(source.duration!=null){
    if(source.duration>=60) score+=5;
    if(source.duration<=25) score-=4;
  }
  return score;
};

if(ffprobeAvailable()){
  for(const source of audioSources) source.duration=ffprobeDuration(source.file);
}else{
  manifest.warnings.push('ffprobe is unavailable; audio role detection uses filenames only.');
}

const chooseUnique=(sources,scoreFn,minScore)=>{
  const scored=sources.map((s)=>({s,score:scoreFn(s)})).sort((a,b)=>b.score-a.score);
  if(!scored.length || scored[0].score<minScore) return null;
  if(scored.length>1 && scored[1].score===scored[0].score) return null;
  return scored[0].s;
};

const transcodeMp3=(source,target,role)=>{
  if(path.resolve(source.file)===path.resolve(target)) return true;
  fs.mkdirSync(path.dirname(target),{recursive:true});
  if(path.extname(source.originalName).toLowerCase()==='.mp3'){
    fs.copyFileSync(source.file,target);
  }else{
    if(!ffmpegAvailable()){
      manifest.errors.push('ffmpeg is required to convert '+source.sourceLabel+' to '+path.basename(target)+'.');
      return false;
    }
    const r=spawnSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',source.file,'-vn','-codec:a','libmp3lame','-b:a','192k',target],{encoding:'utf8'});
    if(r.status!==0){
      manifest.errors.push('Audio conversion failed for '+source.sourceLabel+': '+String(r.stderr||'ffmpeg failed').trim());
      return false;
    }
  }
  manifest.audioConversions.push({
    role,
    from:source.sourceLabel,
    sourceDurationSeconds:source.duration,
    to:normalizedRel(target),
    sha256:sha256(target)
  });
  return true;
};

if(!fs.existsSync(expectedVoice)){
  const source=chooseUnique(audioSources,scoreVoice,4);
  if(source) transcodeMp3(source,expectedVoice,'voice');
  else manifest.warnings.push('Voice 01.mp3 is missing and no unique voice source could be identified safely.');
}
if(!fs.existsSync(expectedMusic)){
  const source=chooseUnique(audioSources.filter((s)=>path.resolve(s.file)!==path.resolve(expectedVoice)),scoreMusic,4);
  if(source) transcodeMp3(source,expectedMusic,'background-music');
  else if(data.audioPolicy?.backgroundMusicRequiredForFinal===true) manifest.warnings.push('bg-music.mp3 is missing and no unique background-music source could be identified safely.');
}

let status={};
if(fs.existsSync(paths.statusPath)){
  try{status=JSON.parse(fs.readFileSync(paths.statusPath,'utf8'));}catch{}
}
status={
  ...status,
  schemaVersion:Number(status.schemaVersion||3),
  productionContractVersion:Number(data.productionContractVersion||1),
  phase3HandoffIngested:true,
  imagesReady:finalImages.every(fs.existsSync),
  audioReady:fs.existsSync(expectedVoice) && (data.audioPolicy?.backgroundMusicRequiredForFinal!==true || fs.existsSync(expectedMusic)),
  coverSelected:fs.existsSync(scene01),
  coverSelectionPending:!fs.existsSync(scene01),
  assetsApproved:false,
  renderReady:false,
  lastIngestAt:new Date().toISOString()
};
fs.writeFileSync(paths.statusPath,JSON.stringify(status,null,2)+'\n','utf8');

manifest.completedAt=new Date().toISOString();
manifest.finalImageCount=finalImages.filter(fs.existsSync).length;
manifest.missingImages=missingImages.map((f)=>path.basename(f));
manifest.voiceReady=fs.existsSync(expectedVoice);
manifest.backgroundMusicReady=fs.existsSync(expectedMusic);
manifest.technicalHandoffReady=
  manifest.finalImageCount===28 &&
  manifest.voiceReady &&
  (data.audioPolicy?.backgroundMusicRequiredForFinal!==true || manifest.backgroundMusicReady) &&
  manifest.errors.length===0;

const manifestPath=path.join(paths.techDir,'PHASE3_INGEST.json');
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n','utf8');
fs.rmSync(staging,{recursive:true,force:true});

console.log('PHASE 3 INGEST COMPLETE — '+episodeFolder);
console.log('Images ready: '+manifest.finalImageCount+'/28');
console.log('Voice ready: '+(manifest.voiceReady?'yes':'no'));
console.log('Background music ready: '+(manifest.backgroundMusicReady?'yes':'no'));
if(manifest.warnings.length){
  console.log('Warnings:');
  manifest.warnings.forEach((w)=>console.log('- '+w));
}
if(manifest.errors.length){
  console.log('Errors:');
  manifest.errors.forEach((e)=>console.log('- '+e));
}
if(manifest.missingImages.length) console.log('Missing scene files: '+manifest.missingImages.join(', '));
if(!manifest.technicalHandoffReady){
  console.log('TECHNICAL HANDOFF INCOMPLETE. No images were generated and no ambiguous scene order was guessed.');
}else{
  console.log('TECHNICAL HANDOFF READY. Next: scene QA and real visual review.');
}

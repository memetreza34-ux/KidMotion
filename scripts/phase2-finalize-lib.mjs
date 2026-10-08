import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const sceneName=(n)=>'Szene '+String(n).padStart(2,'0')+'.png';
export const coverNames=['Cover-Kandidat-01.png','Cover-Kandidat-02.png','Cover-Kandidat-03.png'];
export const digest=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const numberedScene=(name)=>{
  const match=String(name).match(/^(?:Szene|Scene|Bild|Image|Img)[\s_-]*0?([1-9]|1\d|2[0-8])\.png$/i);
  return match?Number(match[1]):null;
};
export const walkImages=(dir)=>{
  if(!fs.existsSync(dir))return [];
  const result=[];
  const walk=(where)=>{
    for(const entry of fs.readdirSync(where,{withFileTypes:true})){
      if(entry.isSymbolicLink())continue;
      const full=path.join(where,entry.name);
      if(entry.isDirectory())walk(full);
      else if(entry.isFile()&&/\.(png|jpe?g|webp)$/i.test(entry.name))result.push(full);
    }
  };
  walk(dir);
  return result.sort();
};
const validPng=(file)=>{
  const fd=fs.openSync(file,'r');
  try{
    const buffer=Buffer.alloc(8);
    const count=fs.readSync(fd,buffer,0,8,0);
    return count===8&&buffer.equals(Buffer.from([137,80,78,71,13,10,26,10]));
  }finally{fs.closeSync(fd);}
};
export const auditImages=(imagesDir,{selection,normalize=true}={})=>{
  const result={renamed:[],removedRejectedCovers:[],removedRedundantCopies:[],missing:[],present:[],unexpected:[],conflicts:[],invalidPng:[],exactDuplicates:[],finalNames:[]};
  const isSelected=selection?.status==='SELECTED'&&selection?.finalFile==='Szene 01.png';
  const coverPath=path.join(imagesDir,sceneName(1));
  if(isSelected&&fs.existsSync(coverPath)&&normalize){
    for(const name of coverNames){
      const file=path.join(imagesDir,name);
      if(fs.existsSync(file)){
        fs.rmSync(file);
        result.removedRejectedCovers.push(name);
      }
    }
  }
  let sources=walkImages(imagesDir);
  const numbered=new Map();
  for(const file of sources){
    const relative=path.relative(imagesDir,file).split(path.sep).join('/');
    const n=numberedScene(path.basename(file));
    if(n!==null){
      if(!numbered.has(n))numbered.set(n,[]);
      numbered.get(n).push({file,relative});
    }
  }
  // Do not guess among different sources for the same scene. A duplicate with
  // the exact same bytes can be removed, but a different image is a conflict.
  for(let n=1;n<=28;n++){
    const dest=path.join(imagesDir,sceneName(n));
    const found=numbered.get(n)||[];
    const all=found.filter(x=>x.file!==dest);
    const candidates=[...(fs.existsSync(dest)?[{file:dest,relative:sceneName(n)}]:[]),...all];
    if(!candidates.length)continue;
    const byHash=new Map();
    for(const c of candidates){
      const hash=digest(c.file);
      if(!byHash.has(hash))byHash.set(hash,[]);
      byHash.get(hash).push(c);
    }
    if(byHash.size>1){
      result.conflicts.push({scene:sceneName(n),sources:candidates.map(x=>x.relative)});
      continue;
    }
    if(!fs.existsSync(dest)&&normalize){
      if(n===1&&!isSelected){
        // Cover must be chosen by the user. Never infer it from an alias.
        result.conflicts.push({scene:sceneName(1),sources:candidates.map(x=>x.relative),reason:'cover not selected'});
        continue;
      }
      fs.mkdirSync(imagesDir,{recursive:true});
      fs.renameSync(candidates[0].file,dest);
      result.renamed.push({from:candidates[0].relative,to:sceneName(n)});
    }
    if(normalize&&fs.existsSync(dest)){
      for(const c of candidates){
        if(c.file!==dest&&fs.existsSync(c.file)){
          fs.rmSync(c.file);
          result.removedRedundantCopies.push(c.relative);
        }
      }
    }
  }
  sources=walkImages(imagesDir);
  const allowed=new Set(Array.from({length:28},(_,i)=>sceneName(i+1)));
  const hashes=new Map();
  for(const file of sources){
    const relative=path.relative(imagesDir,file).split(path.sep).join('/');
    if(!allowed.has(relative)){
      result.unexpected.push(relative);
      continue;
    }
    if(!validPng(file))result.invalidPng.push(relative);
    const hash=digest(file);
    if(hashes.has(hash))result.exactDuplicates.push([hashes.get(hash),relative]);
    else hashes.set(hash,relative);
  }
  for(let n=1;n<=28;n++){
    const name=sceneName(n);
    const file=path.join(imagesDir,name);
    if(!fs.existsSync(file))result.missing.push(name);
    else result.present.push({name,sha256:digest(file),bytes:fs.statSync(file).size});
  }
  if(!isSelected)result.conflicts.push({scene:sceneName(1),reason:'explicit cover selection missing'});
  result.finalNames=result.present.map(p=>p.name);
  return result;
};
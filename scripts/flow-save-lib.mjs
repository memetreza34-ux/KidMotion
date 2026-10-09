import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const sha256=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export const pngInfo=file=>{
  if(!fs.existsSync(file)||!fs.statSync(file).isFile())throw Error('Downloaded PNG does not exist.');
  const bytes=fs.readFileSync(file);
  if(bytes.length<50||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.toString('ascii',12,16)!=='IHDR'||bytes.toString('ascii',bytes.length-8,bytes.length-4)!=='IEND')throw Error('Actual image is not a valid PNG container; do not rename a JPEG or placeholder to PNG.');
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
  if(!width||!height)throw Error('PNG dimensions invalid.');
  return {width,height,bytes:bytes.length};
};
export const storeImage=({source,destination,imagesDir})=>{
  const sourcePath=path.resolve(source),dest=path.resolve(destination);
  if(sourcePath===dest)throw Error('Source already equals target; refusing accidental self-copy.');
  const info=pngInfo(sourcePath);
  if(fs.existsSync(dest))throw Error('Target image already exists. Never overwrite or silently regenerate.');
  const hash=sha256(sourcePath);
  if(fs.existsSync(imagesDir)){
    for(const file of fs.readdirSync(imagesDir)){
      if(!/^(Szene \d{2}|Cover-Kandidat-\d{2})\.png$/.test(file))continue;
      const other=path.join(imagesDir,file);
      if(fs.statSync(other).isFile()&&sha256(other)===hash)throw Error('Identical image already saved as '+file+'. Never reuse it for a different scene.');
    }
  }
  fs.mkdirSync(imagesDir,{recursive:true});
  fs.copyFileSync(sourcePath,dest,fs.constants.COPYFILE_EXCL);
  if(sha256(dest)!==hash){fs.rmSync(dest,{force:true});throw Error('Saved image differs from source.');}
  return {...info,file:path.basename(dest),sha256:hash};
};
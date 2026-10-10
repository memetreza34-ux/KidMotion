import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pngInfo} from './flow-save-lib.mjs';

const sceneFile=n=>'Szene '+String(n).padStart(2,'0')+'.png';
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

export function inspectFlowInventory({imagesDir,selection,plan,approved=false}){
 const records=[],seen=new Map(),errors=[],tasks=[];
 const selected=selection?.status==='SELECTED'&&selection?.finalFile===sceneFile(1);
 const selectedCover=path.join(imagesDir,sceneFile(1));
 for(let n=1;n<=28;n++){
   const name=sceneFile(n),file=path.join(imagesDir,name),item=plan?.images?.[n-1];
   let status='MISSING',hash=null,bytes=0,width=null,height=null;
   if(fs.existsSync(file)){
     try{
       const info=pngInfo(file);
       hash=sha(file);width=info.width;height=info.height;bytes=info.bytes;status='PRESENT_VALID';
       if(seen.has(hash)){status='DUPLICATE';errors.push(name+' is byte-identical to '+seen.get(hash));}
       else seen.set(hash,name);
     }catch(e){status='INVALID';errors.push(name+': '+e.message);}
   }
   if(n===1&&status==='PRESENT_VALID'&&selected&&selection.selectedCoverSha256&&selection.selectedCoverSha256!==hash){
     status='COVER_CHANGED';errors.push('Selected cover image has changed from the chosen reference');
   }
   records.push({scene:n,file:name,status,sha256:hash,width,height,bytes});
   if(n>1&&status==='MISSING'&&item?.imageFile===name&&item?.flowSceneId===String(n).padStart(2,'0')&&String(item?.prompt||'').startsWith('SCENE_ID: '+String(n).padStart(2,'0')+' | OUTPUT_FILE: '+name)){
     tasks.push({scene:n,outputFile:name,imagePrompt:item.prompt,reference:'Szene 01.png ONLY',saveCommand:'npm run flow:save -- --episode=<EPISODE> --scene='+n+' --source="<downloaded-real-png>"',why:'No valid canonical source file has been saved. Retry this missing output, never overwrite an existing file.'});
   }else if(n>1&&status==='MISSING'){
     errors.push(name+': missing or mismatched original scene prompt in IMAGE_PLAN; do not guess');
   }
 }
 const missing=records.filter(r=>r.status==='MISSING').map(r=>r.scene);
 const bad=records.filter(r=>['INVALID','DUPLICATE','COVER_CHANGED'].includes(r.status)).map(r=>r.scene);
 const extras=[];
 if(fs.existsSync(imagesDir)){
  for(const entry of fs.readdirSync(imagesDir,{withFileTypes:true})){
   if(entry.isFile()&&/\.(png|jpe?g|webp)$/i.test(entry.name)&&!/^Szene (0[1-9]|1\d|2[0-8])\.png$/.test(entry.name)&&!/^Cover-Kandidat-0[1-3]\.png$/.test(entry.name))extras.push(entry.name);
  }
 }
 if(extras.length)errors.push('Unassigned files: '+extras.join(', ')+'; do not guess names from download order');
 const coverReady=selected&&records[0].status==='PRESENT_VALID';
 const completed=coverReady&&missing.length===0&&bad.length===0&&errors.length===0;
 const status=!selected?'AWAITING_COVER_SELECTION':!coverReady||bad.length||extras.length||errors.length?'BLOCKED':missing.length?'MISSING_IMAGES':'ALL_IMAGES_PRESENT';
 return {schemaVersion:1,status,coverReady,expected:28,present:records.filter(r=>r.status==='PRESENT_VALID').length,missing,bad,extras,errors,records,
   missingTasks:coverReady&&!approved&&bad.length===0&&extras.length===0&&errors.length===0?tasks:[],
   complete:completed,remaining:28-records.filter(r=>r.status==='PRESENT_VALID').length,
   reminder:'Only a Google-Flow-connected agent can actually produce absent PNG files. This inventory script NEVER generates art. After EACH real Flow download, save immediately using flow:save; then inspect files again. If Flow returns no downloadable image, retry only that missing scene using the original prompt. Never overwrite a present image.'
 };
}

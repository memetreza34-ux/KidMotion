import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const permissionFilename='ANTIGRAVITY_IMAGE_PERMISSION.json';
export const permissionPath=paths=>path.join(paths.techDir,permissionFilename);
export const validScene=n=>Number.isInteger(Number(n))&&Number(n)>=2&&Number(n)<=28;
export const imageName=n=>'Szene '+String(Number(n)).padStart(2,'0')+'.png';
export const normalizedIds=value=>{
  const ids=String(value||'').split(',').map(s=>s.trim()).filter(Boolean);
  if(!ids.length||ids.some(s=>!/^0?(?:[2-9]|1\d|2[0-8])$/.test(s)))throw Error('Allowed scene IDs are 02-28, comma-separated, with no cover.');
  const out=[...new Set(ids.map(Number))].sort((a,b)=>a-b);
  if(out.length!==ids.length)throw Error('Duplicate authorized scene ID.');
  return out;
};
export const approvalErrors=({permission,episodeFolder,scene,alreadyExists=false,approvalLocked=false})=>{
  const errors=[];
  if(!permission||permission.status!=='USER_AUTHORIZED')errors.push('No active explicit user permission.');
  if(permission?.episodeFolder!==episodeFolder)errors.push('Permission is for another episode.');
  if(!Array.isArray(permission?.allowedScenes)||!permission.allowedScenes.includes(Number(scene)))errors.push('This scene was not explicitly authorized.');
  if(permission?.completedScenes?.some(x=>Number(x.scene)===Number(scene)))errors.push('Permission was already used for this scene.');
  if(alreadyExists)errors.push('Scene already exists; never replace an existing picture.');
  if(approvalLocked)errors.push('Assets are approved/locked.');
  if(!String(permission?.userInstruction||'').trim())errors.push('The authorizing user instruction was not recorded.');
  return errors;
};
export const grantPermission=({episodeFolder,scenes,userInstruction,imagesDir,approvalLocked=false})=>{
  if(approvalLocked)throw Error('Assets are already approved.');
  const ids=normalizedIds(scenes);
  const instruction=String(userInstruction||'').trim();
  if(instruction.length<12||instruction.length>2000)throw Error('Record the actual explicit user instruction (12-2000 chars), not a guessed approval.');
  for(const id of ids)if(fs.existsSync(path.join(imagesDir,imageName(id))))throw Error(imageName(id)+' already exists; no generation permission for existing assets.');
  return {schemaVersion:1,episodeFolder,status:'USER_AUTHORIZED',purpose:'ONE_TIME_MISSING_IMAGES_ONLY',userInstruction:instruction,allowedScenes:ids,completedScenes:[],grantedAt:new Date().toISOString(),noExistingImageReplacement:true,selectedCoverOnly:true};
};
export const recordCompletion=(permission,scene,file)=>{
  const err=approvalErrors({permission,episodeFolder:permission?.episodeFolder,scene});
  if(err.length)throw Error(err.join(' '));
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const updated={...permission,completedScenes:[...(permission.completedScenes||[]),{scene:Number(scene),file:path.basename(file),sha256:hash,completedAt:new Date().toISOString()}]};
  if(updated.completedScenes.length===updated.allowedScenes.length)updated.status='COMPLETED';
  return updated;
};

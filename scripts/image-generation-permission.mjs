import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';
import {permissionPath,grantPermission,approvalErrors,imageName,recordCompletion} from './image-generation-permission-lib.mjs';
const args=process.argv.slice(2);
const get=k=>args.find(x=>x.startsWith('--'+k+'='))?.slice(k.length+3)||'';
const episode=get('episode'),grant=get('grant'),check=get('check'),complete=get('complete');
const revoke=get('revoke');
const modes=[grant,check,complete,revoke].filter(Boolean);
if(!episode||modes.length!==1){console.error('Pass --episode and one of --grant=26,28 / --check=26 / --complete=26 / --revoke=1.');process.exit(1);}
const paths=resolveEpisodePaths(process.cwd(),episode);
if(paths.structure==='missing'){console.error('Episode does not exist.');process.exit(1);}
const data=readEpisodeData(paths);
if(!['workout','learn-and-move'].includes(data.contentFormat||'workout')){console.error('This permission is for the workout pipeline only.');process.exit(1);}
const file=permissionPath(paths);
const locked=fs.existsSync(paths.approvalPath);
const selection=fs.existsSync(paths.coverSelectionPath)?JSON.parse(fs.readFileSync(paths.coverSelectionPath,'utf8')):{};
if(selection.status!=='SELECTED'||!fs.existsSync(path.join(paths.imagesDir,'Szene 01.png'))){console.error('Select the cover first; image repair may not change the character.');process.exit(1);}
try{
  if(revoke){
    if(revoke!=='1'||!fs.existsSync(file))throw Error('No permission to revoke.');
    const old=JSON.parse(fs.readFileSync(file,'utf8'));
    old.status='REVOKED';old.revokedAt=new Date().toISOString();
    fs.writeFileSync(file,JSON.stringify(old,null,2)+'\n');
    console.log('IMAGE PERMISSION REVOKED; no further scene generation is authorized.');
  }else if(grant){
    const previous=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
    if(previous && previous.status!=='COMPLETED' && previous.status!=='REVOKED'){
      console.error('An image authorization is active. Do not expand/replace it. Complete or revoke it first, and require a NEW explicit user instruction.');process.exit(1);
    }
    const permission=grantPermission({episodeFolder:episode,scenes:grant,userInstruction:get('user-instruction'),imagesDir:paths.imagesDir,approvalLocked:locked});
    if(previous){
      permission.previousAuthorizations=[...(previous.previousAuthorizations||[]),{...previous,previousAuthorizations:undefined}];
    }
    fs.mkdirSync(paths.techDir,{recursive:true});
    fs.writeFileSync(file,JSON.stringify(permission,null,2)+'\n',{flag:previous?'w':'wx'});
    console.log('USER-SCOPED IMAGE PERMISSION RECORDED: '+permission.allowedScenes.map(imageName).join(', '));
    console.log('This ONLY records a claimed explicit user authorization; it does not generate an image. The agent must verify the real user message and use Flow in Phase 2.');
  }else{
    const permission=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
    const scene=Number(check||complete);
    const target=path.join(paths.imagesDir,imageName(scene));
    const errors=approvalErrors({permission,episodeFolder:episode,scene,alreadyExists:check?fs.existsSync(target):false,approvalLocked:locked});
    if(errors.length)throw Error(errors.join(' '));
    if(check)console.log('ALLOWED (ONCE): generate '+imageName(scene)+' in Phase 2 using only selected cover reference, then save it immediately. Do not generate another scene.');
    else{
      if(!fs.existsSync(target))throw Error('Cannot complete permission: generated image not saved.');
      const updated=recordCompletion(permission,scene,target);
      fs.writeFileSync(file,JSON.stringify(updated,null,2)+'\n');
      console.log('PERMISSION CONSUMED: '+imageName(scene)+'. '+updated.status);
    }
  }
}catch(e){console.error('IMAGE GENERATION PERMISSION DENIED: '+e.message);process.exit(1);}

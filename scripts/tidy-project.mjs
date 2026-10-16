import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
const episodeRoot=path.join(root,'episodes');
if(!fs.existsSync(episodeRoot)||!fs.statSync(episodeRoot).isDirectory()){
  console.error('PROJECT TIDY: episodes directory does not exist. No changes.');
  process.exit(1);
}
console.log('PROJECT TIDY: keeps all episode directories, images, scripts and video files untouched.');
if(!fs.existsSync(pointer)){
  console.log('No ACTIVE_EPISODE.json exists, so the episodes list is already clean.');
  process.exit(0);
}
if(process.platform!=='darwin'){
  console.log('ACTIVE_EPISODE.json stays in place. Finder hiding applies only on macOS.');
  process.exit(0);
}
const r=spawnSync('chflags',['hidden',pointer],{encoding:'utf8'});
if(r.error||r.status!==0){
  console.error('Could not hide ACTIVE_EPISODE.json in Finder: '+String(r.error?.message||r.stderr||'unknown error'));
  process.exit(1);
}
console.log('ACTIVE_EPISODE.json is now hidden in Finder. All scripts still read the same existing file.');

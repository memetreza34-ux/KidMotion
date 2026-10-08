import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';

const root=process.cwd();
const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
if(!fs.existsSync(pointer)){console.error('LEARNING GATE FAILED: no active episode.');process.exit(1);}
const active=JSON.parse(fs.readFileSync(pointer,'utf8'));
const paths=resolveEpisodePaths(root,active.episodeFolder);
const data=readEpisodeData(paths);
if(data.contentFormat!=='learning'){console.error('LEARNING GATE FAILED: active episode is not learning.');process.exit(1);}
if(!fs.existsSync(paths.approvalPath)){console.error('LEARNING GATE FAILED: missing ASSET_APPROVAL.json.');process.exit(1);}

const approval=JSON.parse(fs.readFileSync(paths.approvalPath,'utf8'));
const hash=(file)=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const failures=[];
for(const item of approval.files||[]){
  const file=path.join(paths.episodeRoot,item.path);
  if(!fs.existsSync(file)) failures.push('Missing '+item.path);
  else if(hash(file)!==item.sha256) failures.push('Changed '+item.path);
}
if(failures.length){
  console.error('LEARNING GATE FAILED');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}
console.log('LEARNING ASSET GATE PASSED — approved learning assets are unchanged.');

import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

export function hideActivePointerOnMac(root) {
  const file=path.join(root,'episodes','ACTIVE_EPISODE.json');
  if(!fs.existsSync(file))return {status:'MISSING',file};
  if(process.platform!=='darwin')return {status:'NOT_MAC',file};
  const result=spawnSync('chflags',['hidden',file],{encoding:'utf8'});
  if(result.error||result.status!==0)return {status:'FAILED',file,error:String(result.error?.message||result.stderr||'chflags error')};
  return {status:'HIDDEN',file};
}

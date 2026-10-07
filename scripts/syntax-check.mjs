import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const dir=path.join(root,'scripts');
const files=fs.readdirSync(dir).filter((name)=>name.endsWith('.mjs')).sort();
const failures=[];
for(const name of files){
  const file=path.join(dir,name);
  const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(r.status!==0) failures.push(name+': '+String(r.stderr||r.stdout||'syntax error').trim());
}
if(failures.length){
  console.error('SCRIPT SYNTAX CHECK FAILED');
  failures.forEach((f,i)=>console.error(String(i+1)+'. '+f));
  process.exit(1);
}
console.log('SCRIPT SYNTAX CHECK PASSED — '+files.length+' script(s).');

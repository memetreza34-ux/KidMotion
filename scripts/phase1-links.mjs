import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {phase1Links} from './phase1-links-lib.mjs';

const raw=process.argv.slice(2).find(a=>a.startsWith('--episode='));
const episodeFolder=raw?.slice('--episode='.length);
if(!episodeFolder){
 console.error('Usage: npm run phase1:links -- --episode=KM-XXX-slug');
 process.exit(1);
}
try{phase1Links(episodeFolder);}catch(e){console.error(e.message);process.exit(1);}
const episodePath=path.join(process.cwd(),'episodes',episodeFolder,'99-technik','episode.json');
if(!fs.existsSync(episodePath)){console.error('Episode does not exist: '+episodeFolder);process.exit(1);}
const episode=JSON.parse(fs.readFileSync(episodePath,'utf8'));
const script=episode.contentFormat==='learning'?'learning-prompt-qa.mjs':'prompt-plan-qa.mjs';
const run=spawnSync(process.execPath,[path.join('scripts',script),'--episode='+episodeFolder],{cwd:process.cwd(),stdio:'inherit'});
if(run.status!==0)process.exit(run.status||1);

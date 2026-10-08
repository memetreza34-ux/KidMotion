import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';
import {loadLearningEngine,normalizeAgeBand,normalizeLearningMode} from './learning-engine.mjs';

const root=process.cwd();
const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
const failures=[];
const fail=(m)=>failures.push(m);
const engine=loadLearningEngine(root);

if(!fs.existsSync(pointer)){console.error('LEARNING PREFLIGHT FAILED: no ACTIVE_EPISODE.');process.exit(1);}
const active=JSON.parse(fs.readFileSync(pointer,'utf8'));
const paths=resolveEpisodePaths(root,active.episodeFolder);
const data=readEpisodeData(paths);

if(data.contentFormat!=='learning') fail('Active episode is not pure learning.');
if(!normalizeAgeBand(data.ageBand,engine)) fail('Invalid ageBand.');
if(!normalizeLearningMode(data.learningMode,engine)) fail('Invalid learningMode.');
if(!String(data.primaryLearningObjective||'').trim()) fail('Missing primaryLearningObjective.');
if(!String(data.successCriteria||'').trim()) fail('Missing successCriteria.');
if(data.timerRequired!==false) fail('Pure learning must not require countdown timer.');
if(data.getReadyRequired!==false) fail('Pure learning must not require GET READY.');
if(data.childOrMascotRequired!==false) fail('Pure learning must not require child/mascot.');

for(const scene of data.scenes||[]){
  if(scene.inVideo===false) continue;
  if(scene.type==='exercise'||scene.type==='get-ready') fail('Workout scene type found: '+scene.scene);
  if(!String(scene.role||'').trim()) fail('Missing learning role on scene '+scene.scene);
  if(!fs.existsSync(path.join(paths.imagesDir,scene.image))) fail('Missing image '+scene.image);
}

const voice=data.narrationPolicy?.voiceFile||'Voice 01.mp3';
if(!fs.existsSync(path.join(paths.audioDir,voice))) fail('Missing narration '+voice);

const activeSource=fs.readFileSync(path.join(root,'src','data','active-learning.ts'),'utf8');
if(!activeSource.includes(active.episodeFolder)) fail('active-learning.ts is stale; run learning:activate.');

const qa=spawnSync(process.execPath,['scripts/learning-prompt-qa.mjs','--episode='+active.episodeFolder],{cwd:root,encoding:'utf8'});
if(qa.status!==0) fail('learning:prompt:qa failed: '+String(qa.stderr||qa.stdout).trim());

if(failures.length){
  console.error('LEARNING PREFLIGHT FAILED');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}
console.log('LEARNING PREFLIGHT PASSED — '+active.episodeFolder);
console.log('Validated active Learning Engine episode before render.');

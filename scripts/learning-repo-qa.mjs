import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {loadLearningEngine,normalizeAgeBand,normalizeLearningMode} from './learning-engine.mjs';

const root=process.cwd();
const engine=loadLearningEngine(root);
const failures=[];
const warnings=[];
const episodeRoot=path.join(root,'episodes');

if(fs.existsSync(episodeRoot)){
  for(const entry of fs.readdirSync(episodeRoot,{withFileTypes:true})){
    if(!entry.isDirectory()||!/^KM-\d{3}-/.test(entry.name)) continue;
    const base=path.join(episodeRoot,entry.name);
    const dataFile=path.join(base,'99-technik','episode.json');
    if(!fs.existsSync(dataFile)) continue;
    const data=JSON.parse(fs.readFileSync(dataFile,'utf8'));
    if(data.contentFormat!=='learning') continue;

    if(!normalizeAgeBand(data.ageBand,engine)) failures.push(entry.name+': invalid ageBand.');
    if(!normalizeLearningMode(data.learningMode,engine)) failures.push(entry.name+': invalid learningMode.');
    if(data.timerRequired!==false||data.getReadyRequired!==false||data.childOrMascotRequired!==false) failures.push(entry.name+': pure learning inherited workout/character requirements.');
    if((data.scenes||[]).some((s)=>s.type==='exercise'||s.type==='get-ready')) failures.push(entry.name+': pure learning contains workout scene type.');

    for(const rel of ['LEARNING_PLAN.json','IMAGE_PLAN.json','VOICE_PLAN.json']){
      if(!fs.existsSync(path.join(base,'99-technik',rel))) failures.push(entry.name+': missing 99-technik/'+rel);
    }
    if(!fs.existsSync(path.join(base,'00-bildprompts','google-flow-prompt.txt'))) failures.push(entry.name+': missing google-flow-prompt.txt.');
    if(!fs.existsSync(path.join(base,'01-voice-script','voice-script.txt'))) failures.push(entry.name+': missing voice-script.txt.');

    if(String(data.status||'')==='planning-required'){
      warnings.push(entry.name+': learning draft still in planning-required.');
      continue;
    }

    const run=spawnSync(process.execPath,['scripts/learning-prompt-qa.mjs','--episode='+entry.name],{cwd:root,encoding:'utf8'});
    if(run.status!==0) failures.push(entry.name+': learning:prompt:qa failed: '+String(run.stderr||run.stdout).trim());
  }
}

warnings.forEach((w)=>console.warn('WARNING: '+w));
if(failures.length){
  console.error('LEARNING REPO QA FAILED');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}
console.log('LEARNING REPO QA PASSED');

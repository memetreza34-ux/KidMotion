import fs from 'node:fs';
import path from 'node:path';
import {inspectFlowInventory} from './flow-continuity-lib.mjs';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';

const root=process.cwd(),args=process.argv.slice(2);
const arg=k=>args.find(x=>x.startsWith('--'+k+'='))?.slice(k.length+3)||'';
let folder=arg('episode');
const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
if(!folder&&fs.existsSync(pointer))folder=JSON.parse(fs.readFileSync(pointer,'utf8')).episodeFolder||'';
if(!folder){console.error('Pass --episode=KM-XXX-slug');process.exit(1);}
const paths=resolveEpisodePaths(root,folder);
if(paths.structure==='missing'){console.error('Episode does not exist');process.exit(1);}
readEpisodeData(paths);
const selection=fs.existsSync(paths.coverSelectionPath)?JSON.parse(fs.readFileSync(paths.coverSelectionPath,'utf8')):{};
const plan=JSON.parse(fs.readFileSync(paths.imagePlanPath,'utf8'));
const state=inspectFlowInventory({imagesDir:paths.imagesDir,selection,plan,approved:fs.existsSync(paths.approvalPath)});
state.episodeFolder=folder;
const episode=readEpisodeData(paths);
const batches=episode.imageBatchPolicy?.batches||[[2,3,4,5,6],[7,8,9,10,11],[12,13,14,15,16],[17,18,19,20,21],[22,23,24,25,26],[27,28]];
const incomplete=batches.find(batch=>batch.some(n=>state.missing.includes(Number(n))));
const allowedNow=new Set((incomplete||[]).map(Number));
const stagedTasks=state.missingTasks.filter(t=>allowedNow.has(t.scene)).map(t=>({...t,saveCommand:t.saveCommand.replace('<EPISODE>',folder)}));
state.activeRetryBatch=incomplete||null;
state.actionableMissingTasks=stagedTasks;
for(const item of state.missingTasks)item.saveCommand=item.saveCommand.replace('<EPISODE>',folder);
fs.mkdirSync(paths.techDir,{recursive:true});
fs.writeFileSync(path.join(paths.techDir,'FLOW_CONTINUITY_STATE.json'),JSON.stringify(state,null,2)+'\n');
fs.writeFileSync(path.join(paths.techDir,'FLOW_RETRY_MISSING.json'),JSON.stringify({episodeFolder:folder,status:state.status,tasks:stagedTasks,allMissingIds:state.missing,activeBatch:state.activeRetryBatch},null,2)+'\n');
console.log('FLOW INVENTORY — '+folder+': '+state.present+'/28 genuine PNGs | '+state.status);
if(state.missing.length)console.log('MISSING: '+state.missing.map(n=>'Szene '+String(n).padStart(2,'0')+'.png').join(', '));
if(state.errors.length)state.errors.forEach(s=>console.error('BLOCKER: '+s));
if(stagedTasks.length)console.log('Only earliest incomplete batch is actionable. Exact prompts + save commands: 99-technik/FLOW_RETRY_MISSING.json');
console.log('Agent: run after EVERY save and at EVERY batch boundary. Repair absent files only. No automatic Google Flow API exists in this script.');
if(state.status==='BLOCKED')process.exit(1);
if(state.status==='AWAITING_COVER_SELECTION')process.exit(2);
if(state.status==='MISSING_IMAGES')process.exit(3);

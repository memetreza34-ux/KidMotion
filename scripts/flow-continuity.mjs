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
for(const item of state.missingTasks)item.saveCommand=item.saveCommand.replace('<EPISODE>',folder);
fs.mkdirSync(paths.techDir,{recursive:true});
fs.writeFileSync(path.join(paths.techDir,'FLOW_CONTINUITY_STATE.json'),JSON.stringify(state,null,2)+'\n');
fs.writeFileSync(path.join(paths.techDir,'FLOW_RETRY_MISSING.json'),JSON.stringify({episodeFolder:folder,status:state.status,tasks:state.missingTasks},null,2)+'\n');
console.log('FLOW INVENTORY — '+folder+': '+state.present+'/28 genuine PNGs | '+state.status);
if(state.missing.length)console.log('MISSING: '+state.missing.map(n=>'Szene '+String(n).padStart(2,'0')+'.png').join(', '));
if(state.errors.length)state.errors.forEach(s=>console.error('BLOCKER: '+s));
if(state.missingTasks.length)console.log('Exact prompts + immediate save commands: 99-technik/FLOW_RETRY_MISSING.json');
console.log('Agent: run after EVERY save and at EVERY batch boundary. Repair absent files only. No automatic Google Flow API exists in this script.');
if(state.status==='BLOCKED')process.exit(1);
if(state.status==='AWAITING_COVER_SELECTION')process.exit(2);
if(state.status==='MISSING_IMAGES')process.exit(3);

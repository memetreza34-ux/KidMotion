import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';

const root=process.cwd();
const args=process.argv.slice(2);
const epArg=args.find((v)=>v.startsWith('--episode='));
const episodeFolder=epArg?epArg.slice('--episode='.length):'';
if(!episodeFolder){
  console.error('LEARNING PROMPT QA FAILED: pass --episode=KM-XXX-slug');
  process.exit(1);
}
const paths=resolveEpisodePaths(root,episodeFolder);
const data=readEpisodeData(paths);
const failures=[];
const fail=(m)=>failures.push(m);
if(data.contentFormat!=='learning') fail('Episode is not contentFormat=learning.');

const required=[
  '99-technik/LEARNING_PLAN.json','99-technik/IMAGE_PLAN.json','99-technik/VOICE_PLAN.json',
  '00-bildprompts/google-flow-prompt.txt','01-voice-script/voice-script.txt','03-export/UPLOAD_METADATA.md'
];
for(const rel of required) if(!fs.existsSync(path.join(paths.episodeRoot,rel))) fail('Missing '+rel);

const read=(rel)=>fs.existsSync(path.join(paths.episodeRoot,rel))?fs.readFileSync(path.join(paths.episodeRoot,rel),'utf8'):'';
const learning=JSON.parse(read('99-technik/LEARNING_PLAN.json')||'{}');
const images=JSON.parse(read('99-technik/IMAGE_PLAN.json')||'{}');
const voice=JSON.parse(read('99-technik/VOICE_PLAN.json')||'{}');
const prompt=read('00-bildprompts/google-flow-prompt.txt');
const voiceScript=read('01-voice-script/voice-script.txt').trim();
const combined=JSON.stringify(data)+JSON.stringify(learning)+JSON.stringify(images)+JSON.stringify(voice)+prompt+read('03-export/UPLOAD_METADATA.md');
if(/\bTBD\b|__PLAN_REQUIRED__|PLACEHOLDER/i.test(combined)) fail('Planning contains unresolved placeholders.');
if(!String(data.learningObjective||'').trim()) fail('learningObjective is required.');
if(!String(data.targetAge||'').trim()) fail('targetAge is required.');
if(data.timerRequired!==false) fail('Pure learning must not require a timer.');
if(data.getReadyRequired!==false) fail('Pure learning must not require GET READY.');
if(data.childOrMascotRequired!==false) fail('Pure learning must not require a child/mascot.');
if(data.voiceScriptFormat!=='plain continuous text only' && data.narrationPolicy?.voiceScriptFormat!=='plain continuous text only') fail('Learning voice script must be plain continuous text only.');
if(voiceScript!==String(voice.exactTtsCopy||'').trim()) fail('voice-script.txt must equal VOICE_PLAN exactTtsCopy.');
if(!Array.isArray(learning.facts)||!learning.facts.length) fail('LEARNING_PLAN facts are required.');
for(const fact of learning.facts||[]){
  if(!String(fact.claim||'').trim()||!String(fact.sourceNote||'').trim()) fail('Every fact needs claim + sourceNote.');
}
const scenes=Array.isArray(data.scenes)?data.scenes:[];
if(scenes.length<7) fail('Learning episode needs cover plus at least 6 video scenes.');
if(scenes.some((s)=>s.type==='exercise'||s.type==='get-ready')) fail('Pure learning must not contain exercise/get-ready scene types.');
if((images.images||[]).length!==scenes.length) fail('IMAGE_PLAN count must match episode scenes.');
const promptBlocks=(prompt.match(/FINAL GOOGLE FLOW PROMPT:/g)||[]).length;
if(promptBlocks!==3+(scenes.length-1)) fail('Expected 3 cover prompts plus one prompt per video scene.');
for(const label of ['VIEWER TAKEAWAY:','SHOT / COMPOSITION:','SUBJECT / ACTION:','WORLD / CONTEXT:','TEXT / LABELS:','NEGATIVE / STABILITY:','QUALITY CHECK:','OUTPUT:']){
  if(!prompt.includes(label)) fail('Learning prompts missing section '+label);
}
if(/GET READY|countdown timer|12 exercises/i.test(prompt)) fail('Learning prompt file contains workout-only concepts.');
if(failures.length){
  console.error('LEARNING PROMPT QA FAILED');
  failures.forEach((m,i)=>console.error(String(i+1)+'. '+m));
  process.exit(1);
}
console.log('LEARNING PROMPT QA PASSED — '+episodeFolder);
console.log('Validated: learning objective, factual plan, flexible learning scenes, full-video narration, no workout/timer/character requirement.');

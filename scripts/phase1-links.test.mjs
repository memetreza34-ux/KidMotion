import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {phase1Links,publishPhase1Handoff,printPhase1Links} from './phase1-links-lib.mjs';

const name='KM-999-mobile-check';
const createTemp=(t)=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'kidmotion-phase1-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const folder=path.join(root,'episodes',name);
 fs.mkdirSync(path.join(folder,'00-bildprompts'),{recursive:true});
 fs.mkdirSync(path.join(folder,'01-voice-script'),{recursive:true});
 fs.writeFileSync(path.join(folder,'00-bildprompts','google-flow-prompt.txt'),'FINAL GOOGLE FLOW PROMPT: brightly lit playground with a star trail');
 fs.writeFileSync(path.join(folder,'01-voice-script','voice-script.txt'),'Welcome to the adventure!');
 return {root,folder};
};
test('creates two stable clickable GitHub paths for mobile',()=>{
 const u=phase1Links(name);
 assert.equal(u.prompt,'https://github.com/memetreza34-ux/KidMotion/blob/main/episodes/'+name+'/00-bildprompts/google-flow-prompt.txt');
 assert.equal(u.script,'https://github.com/memetreza34-ux/KidMotion/blob/main/episodes/'+name+'/01-voice-script/voice-script.txt');
 assert.throws(()=>phase1Links('../secrets'));
});
test('after QA handoff writes both links, a readable Markdown start page and fingerprints',t=>{
 const {root,folder}=createTemp(t);
 const result=publishPhase1Handoff({root,episodeFolder:name,format:'workout'});
 const manifest=JSON.parse(fs.readFileSync(path.join(folder,'99-technik','PHASE1_HANDOFF.json'),'utf8'));
 assert.equal(manifest.status,'QA_PASSED');
 assert.deepEqual(manifest.links,result.links);
 const source=fs.readFileSync(path.join(folder,'01-voice-script','voice-script.txt'));
 assert.equal(manifest.files.voiceOverScript.sha256,crypto.createHash('sha256').update(source).digest('hex'));
 const output=fs.readFileSync(path.join(folder,'99-technik','PHASE1_START_HIER.md'),'utf8');
 assert.ok(output.includes('[Google-Flow-Prompt öffnen]('));
 assert.ok(output.includes('[Voice-over-Skript öffnen]('));
 const lines=[];
 printPhase1Links(result,(line)=>lines.push(line));
 assert.ok(lines.join('\n').includes(result.links.prompt||result.links.googleFlowPrompt));
 assert.ok(lines.join('\n').includes(result.links.voiceOverScript));
});
test('learning format gets the same links',t=>{
 const {root}=createTemp(t);
 assert.equal(publishPhase1Handoff({root,episodeFolder:name,format:'learning'}).format,'learning');
});
test('no link handoff for unfinished placeholders',t=>{
 const {root,folder}=createTemp(t);
 fs.writeFileSync(path.join(folder,'01-voice-script','voice-script.txt'),'__PLAN_REQUIRED__ narration');
 assert.throws(()=>publishPhase1Handoff({root,episodeFolder:name,format:'workout'}),/placeholders/);
 assert.equal(fs.existsSync(path.join(folder,'99-technik','PHASE1_START_HIER.md')),false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {clock,metadataFields,generateExportFiles,descriptionWithFiveHashtags} from './export-content-lib.mjs';

test('time formatting and five tag limit',()=>{
 assert.equal(clock(313),'05:13');
 assert.equal(clock(8,true),'00:00:08,000');
 assert.equal((descriptionWithFiveHashtags('Hello #A #B #C #D #E #F').match(/#[A-Za-z0-9_]+/g)||[]).length,5);
 assert.equal(metadataFields('## YouTube Title\nABC\n## Description\nMove along!\n').title,'ABC');
});
test('copies two YouTube fields and emits three voice SRT cues and timeline without cover',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'km-export-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const b=path.join(root,'episodes','KM-999-export-test');
 for(const sub of ['99-technik','01-voice-script','03-export'])fs.mkdirSync(path.join(b,sub),{recursive:true});
 const scenes=[{type:'cover',scene:'01',duration:0,inVideo:false},{type:'intro',scene:'02',duration:8},{type:'safety',scene:'03',duration:4},{type:'lets-begin',scene:'04',duration:2},{type:'exercise',scene:'05',title:'STAR POSE',duration:20}];
 fs.writeFileSync(path.join(b,'99-technik','episode.json'),JSON.stringify({contentFormat:'workout',introVisualPolicy:'greeting-only-v1',scenes}));
 const sections=[{startSeconds:0,endSeconds:8,text:'Hello world!'},{startSeconds:8,endSeconds:12,text:'Be safe.'},{startSeconds:12,endSeconds:14,text:'Start now.'}];
 const text=sections.map(s=>s.text).join(' ');
 fs.writeFileSync(path.join(b,'99-technik','VOICE_PLAN.json'),JSON.stringify({exactTtsCopy:text,sections}));
 fs.writeFileSync(path.join(b,'01-voice-script','voice-script.txt'),text);
 fs.writeFileSync(path.join(b,'03-export','UPLOAD_METADATA.md'),'## YouTube Title\nAwesome Workout\n## Description\nHave fun moving! #A #B #C #D #E #F\n');
 const result=generateExportFiles({root,episodeFolder:'KM-999-export-test'});
 assert.equal(result.totalSeconds,34);assert.equal(result.hashtags,5);assert.equal(result.cues,3);
 assert.match(fs.readFileSync(path.join(b,'03-export','SUBTITLES.srt'),'utf8'),/00:00:08,000 --> 00:00:12,000/);
 assert.match(fs.readFileSync(path.join(b,'03-export','VIDEO_TIMELINE.txt'),'utf8'),/00:14 - 00:34/);
});

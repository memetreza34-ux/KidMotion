import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {inspectFlowInventory} from './flow-continuity-lib.mjs';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL0nAAAAABJRU5ErkJggg==','base64');
const plan={images:Array.from({length:28},(_,i)=>{
 const n=i+1,id=String(n).padStart(2,'0'),file='Szene '+id+'.png';
 return {imageFile:file,flowSceneId:id,prompt:'SCENE_ID: '+id+' | OUTPUT_FILE: '+file+' | ID is file metadata ONLY'};
})};
const cover={status:'SELECTED',finalFile:'Szene 01.png'};
const fixture=fn=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'km-flow-cont-'));
 try{return fn({dir,save:(n,pngBytes=png)=>fs.writeFileSync(path.join(dir,'Szene '+String(n).padStart(2,'0')+'.png'),pngBytes)});}
 finally{fs.rmSync(dir,{recursive:true,force:true});}
};
test('missing image emits exact scene number, prompt and rename command',()=>fixture(({dir,save})=>{
 save(1);save(2);
 const r=inspectFlowInventory({imagesDir:dir,selection:cover,plan});
 assert.equal(r.status,'MISSING_IMAGES');
 assert.ok(r.missing.includes(3));
 assert.equal(r.missingTasks[0].scene,3);
 assert.match(r.missingTasks[0].saveCommand,/--scene=3/);
 assert.equal(r.records[1].status,'DUPLICATE'); // Identical pixels cannot be different scenes.
}));
test('absent file is a retry candidate, existing files are not',()=>fixture(({dir,save})=>{
 save(1);save(2,Buffer.concat([png,Buffer.from('unique scene 2')]));
 const r=inspectFlowInventory({imagesDir:dir,selection:cover,plan});
 assert.ok(r.missingTasks.some(t=>t.scene===3));
 assert.ok(!r.missingTasks.some(t=>t.scene===2));
 assert.equal(r.records[1].status,'PRESENT_VALID');
}));
test('missing cover cannot be silently generated; cover needs explicit selection',()=>fixture(({dir})=>{
 const r=inspectFlowInventory({imagesDir:dir,selection:{status:'AWAITING_USER_SELECTION'},plan});
 assert.equal(r.status,'AWAITING_COVER_SELECTION');assert.equal(r.missingTasks.length,0);
}));
test('invalid, duplicate or ambiguous files block unsafe recovery',()=>fixture(({dir,save})=>{
 save(1);save(2);fs.writeFileSync(path.join(dir,'Szene 03.png'),'bad');
 fs.writeFileSync(path.join(dir,'random_flow_output.png'),png);
 const r=inspectFlowInventory({imagesDir:dir,selection:cover,plan});
 assert.equal(r.status,'BLOCKED');
 assert.ok(r.bad.includes(2));assert.ok(r.bad.includes(3));
 assert.ok(r.extras.includes('random_flow_output.png'));assert.equal(r.missingTasks.length,0);
}));

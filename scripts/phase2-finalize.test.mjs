import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {auditImages,sceneName,numberedScene} from './phase2-finalize-lib.mjs';

const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL0nAAAAABJRU5ErkJggg==','base64');
const selected={status:'SELECTED',finalFile:'Szene 01.png',selectedCandidate:2};
const fixture=(fn)=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'km-phase2-'));
  const write=(name,n)=>{const file=path.join(dir,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.concat([png,Buffer.from('unique-'+n)]));};
  try{return fn({dir,write});}finally{fs.rmSync(dir,{recursive:true,force:true});}
};

test('normalizes unambiguous scene aliases and deletes rejected covers only after selection',()=>fixture(({dir,write})=>{
  write('Szene 01.png',1);
  write('Cover-Kandidat-01.png',101);write('Cover-Kandidat-03.png',103);
  write('nested/Scene_2.png',2);
  for(let i=3;i<=28;i++)write(sceneName(i),i);
  const result=auditImages(dir,{selection:selected,normalize:true});
  assert.equal(result.missing.length,0);
  assert.equal(result.conflicts.length,0);
  assert.equal(result.unexpected.length,0);
  assert.equal(result.exactDuplicates.length,0);
  assert.equal(result.renamed[0].to,'Szene 02.png');
  assert.equal(result.removedRejectedCovers.length,2);
  assert.equal(result.present.length,28);
  assert.equal(fs.existsSync(path.join(dir,'Szene 02.png')),true);
  assert.equal(fs.existsSync(path.join(dir,'Cover-Kandidat-01.png')),false);
}));

test('never destroys candidates before explicit selection',()=>fixture(({dir,write})=>{
  write('Cover-Kandidat-01.png',1);
  write('Cover-Kandidat-02.png',2);
  write('Cover-Kandidat-03.png',3);
  const result=auditImages(dir,{selection:{status:'AWAITING_USER_SELECTION'},normalize:true});
  assert.equal(result.removedRejectedCovers.length,0);
  assert.ok(result.conflicts.some(c=>c.reason==='explicit cover selection missing'));
  assert.equal(fs.existsSync(path.join(dir,'Cover-Kandidat-01.png')),true);
}));

test('conflicting filenames are reported, never overwritten',()=>fixture(({dir,write})=>{
  write('Szene 01.png',1);
  write('Szene 02.png',2);
  write('Scene-02.png',200);
  const result=auditImages(dir,{selection:selected,normalize:true});
  assert.ok(result.conflicts.some(c=>c.scene==='Szene 02.png'));
  assert.equal(result.missing.length,26);
  assert.equal(fs.existsSync(path.join(dir,'Scene-02.png')),true);
  assert.equal(fs.existsSync(path.join(dir,'Szene 02.png')),true);
}));

test('reports missing scenes and unexpected images without guessing their identity',()=>fixture(({dir,write})=>{
  write('Szene 01.png',1);
  write('Szene 03.png',3);
  write('unknown-picture.png',999);
  const result=auditImages(dir,{selection:selected,normalize:true});
  assert.ok(result.missing.includes('Szene 02.png'));
  assert.ok(result.unexpected.includes('unknown-picture.png'));
  assert.ok(!fs.existsSync(path.join(dir,'Szene 02.png')));
}));

test('detects identical source images and invalid PNG signatures',()=>fixture(({dir,write})=>{
  write('Szene 01.png',1);
  write('Szene 02.png',2);
  fs.copyFileSync(path.join(dir,'Szene 02.png'),path.join(dir,'Szene 03.png'));
  fs.writeFileSync(path.join(dir,'Szene 04.png'),Buffer.from('not a real png'));
  const result=auditImages(dir,{selection:selected,normalize:false});
  assert.ok(result.exactDuplicates.some(pair=>pair.includes('Szene 02.png')&&pair.includes('Szene 03.png')));
  assert.ok(result.invalidPng.includes('Szene 04.png'));
}));

test('canonical parser handles Scene, Bild, Szene and blocks unknown labels',()=>{
  assert.equal(numberedScene('Scene_02.png'),2);
  assert.equal(numberedScene('Bild-8.png'),8);
  assert.equal(numberedScene('Szene 28.png'),28);
  assert.equal(numberedScene('Scene 29.png'),null);
  assert.equal(numberedScene('file.png'),null);
});
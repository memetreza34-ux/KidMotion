import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {storeImage,pngInfo} from './flow-save-lib.mjs';

const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL0nAAAAABJRU5ErkJggg==','base64');
const sandbox=fn=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'km-save-'));try{return fn(dir);}finally{fs.rmSync(dir,{recursive:true,force:true});}};
test('stores real downloaded PNG under exact scene ID, without touching download',()=>sandbox(dir=>{
  const images=path.join(dir,'images'),source=path.join(dir,'Flow generated.png'),dest=path.join(images,'Szene 05.png');
  fs.writeFileSync(source,png);
  const r=storeImage({source,destination:dest,imagesDir:images});
  assert.equal(r.file,'Szene 05.png');
  assert.equal(fs.existsSync(source),true);
  assert.equal(fs.readFileSync(dest).equals(png),true);
}));
test('refuses overwriting a numbered image',()=>sandbox(dir=>{
 const images=path.join(dir,'images'),source=path.join(dir,'Flow.png'),dest=path.join(images,'Szene 02.png');
 fs.mkdirSync(images);fs.writeFileSync(source,png);fs.writeFileSync(dest,png);
 assert.throws(()=>storeImage({source,destination:dest,imagesDir:images}),/already exists/);
}));
test('blocks copying identical pixels to a second scene number',()=>sandbox(dir=>{
 const images=path.join(dir,'images'),source=path.join(dir,'Flow.png');
 fs.mkdirSync(images);fs.writeFileSync(source,png);fs.writeFileSync(path.join(images,'Szene 02.png'),png);
 assert.throws(()=>storeImage({source,destination:path.join(images,'Szene 03.png'),imagesDir:images}),/Identical image/);
}));
test('refuses non-PNG content and never creates target',()=>sandbox(dir=>{
 const images=path.join(dir,'images'),source=path.join(dir,'Flow.png');
 fs.writeFileSync(source,Buffer.from('fake image'));
 assert.throws(()=>storeImage({source,destination:path.join(images,'Szene 02.png'),imagesDir:images}),/not a valid PNG/);
 assert.equal(fs.existsSync(images),false);
}));
test('prevents self copying',()=>sandbox(dir=>{
 const img=path.join(dir,'Szene 02.png');fs.writeFileSync(img,png);
 assert.throws(()=>storeImage({source:img,destination:img,imagesDir:dir}),/self-copy/);
}));
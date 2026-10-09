import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {grantPermission,approvalErrors,normalizedIds,recordCompletion} from './image-generation-permission-lib.mjs';
const fixture=fn=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'km-consent-'));try{return fn(dir);}finally{fs.rmSync(dir,{recursive:true,force:true});}};
test('default denial when no explicit permission exists',()=>assert.ok(approvalErrors({permission:null,episodeFolder:'KM-test',scene:26}).length));
test('user approval scope is exact and only for missing scenes',()=>fixture(dir=>{
 const p=grantPermission({episodeFolder:'KM-test',scenes:'26,28',userInstruction:'Please generate missing scenes 26 and 28',imagesDir:dir});
 assert.deepEqual(p.allowedScenes,[26,28]);
 assert.deepEqual(approvalErrors({permission:p,episodeFolder:'KM-test',scene:26}),[]);
 assert.ok(approvalErrors({permission:p,episodeFolder:'KM-test',scene:27}).length);
 assert.ok(approvalErrors({permission:p,episodeFolder:'other',scene:26}).length);
 assert.ok(approvalErrors({permission:p,episodeFolder:'KM-test',scene:26,alreadyExists:true}).length);
 assert.ok(approvalErrors({permission:p,episodeFolder:'KM-test',scene:26,approvalLocked:true}).length);
}));
test('reject permission for existing images',()=>fixture(dir=>{
 fs.writeFileSync(path.join(dir,'Szene 26.png'),'existing');
 assert.throws(()=>grantPermission({episodeFolder:'KM-test',scenes:'26',userInstruction:'Please generate missing scene 26',imagesDir:dir}),/already exists/);
}));
test('permit cannot be reused after image is saved',()=>fixture(dir=>{
 const p=grantPermission({episodeFolder:'KM-test',scenes:'26',userInstruction:'Please generate missing scene 26',imagesDir:dir});
 const png=path.join(dir,'Szene 26.png');fs.writeFileSync(png,'real file fixture');
 const done=recordCompletion(p,26,png);
 assert.equal(done.status,'COMPLETED');
 assert.ok(approvalErrors({permission:done,episodeFolder:'KM-test',scene:26}).length);
}));
test('reject ambiguous or duplicate scene scopes',()=>{
 assert.throws(()=>normalizedIds('1,26'),/scene IDs/);
 assert.throws(()=>normalizedIds('26,26'),/Duplicate/);
});

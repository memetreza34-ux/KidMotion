import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {humanOnlyWorkout,humanPromptErrors,coverHumanReviewErrors} from './workout-character-policy.mjs';

test('human-only rule applies to workouts, not pure learning',()=>{
  assert.equal(humanOnlyWorkout({contentFormat:'workout',characterPolicy:{species:'human'}}),true);
  assert.equal(humanOnlyWorkout({contentFormat:'learning',characterPolicy:{species:'human'}}),false);
});
test('rejects generic mascot and nonhuman positive character',()=>{
  const generic='CHARACTER: One cartoon mascot.\nWORLD: City\nNEGATIVE / STABILITY: No robot, fox, animal.\nQUALITY CHECK: Good.';
  const fox='CHARACTER: One human-like fox athlete.\nWORLD: City\nNEGATIVE / STABILITY: No robot, fox, animal.\nQUALITY CHECK: Good.';
  assert.ok(humanPromptErrors(generic,{cover:true}).length>0);
  assert.ok(humanPromptErrors(fox,{cover:true}).some(x=>x.includes('nonhuman')));
});
test('passes positive human girl with explicit negative constraints',()=>{
  const cover='CHARACTER: One original fictional fully clothed HUMAN girl athlete.\nWORLD: Robot City.\nNEGATIVE / STABILITY: No robot, fox, animal or anthropomorphic character.\nQUALITY CHECK: Human girl visible.';
  const scene='CHARACTER / POSE: Fully clothed HUMAN girl athlete with arms up.\nWORLD / ENVIRONMENT: Robot City.\nNEGATIVE / STABILITY: No robot, fox, animal as character.\nQUALITY CHECK: Human.';
  assert.deepEqual(humanPromptErrors(cover,{cover:true}),[]);
  assert.deepEqual(humanPromptErrors(scene),[]);
});
test('cover selection review requires all actual inspected files with matching SHA256',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'km-human-'));
  try{
    const rows=[];
    for(let n=1;n<=3;n++){
      const filename='Cover-Kandidat-0'+n+'.png';
      const bytes=Buffer.from('cover'+n);
      fs.writeFileSync(path.join(dir,filename),bytes);
      rows.push({candidate:n,file:filename,humanVisible:true,noRobotOrAnimalMascot:true,fullyClothed:true,actualImageInspected:true,status:'APPROVED',sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
    }
    const review=path.join(dir,'review.json');
    fs.writeFileSync(review,JSON.stringify({status:'APPROVED',candidates:rows}));
    assert.deepEqual(coverHumanReviewErrors(dir,review),[]);
    rows[1].humanVisible=false;
    fs.writeFileSync(review,JSON.stringify({status:'APPROVED',candidates:rows}));
    assert.ok(coverHumanReviewErrors(dir,review).length>0);
    rows[1].humanVisible=true;
    fs.writeFileSync(review,JSON.stringify({status:'APPROVED',candidates:rows}));
    fs.writeFileSync(path.join(dir,'Cover-Kandidat-02.png'),'changed pixels');
    assert.ok(coverHumanReviewErrors(dir,review).some(x=>x.includes('differs')));
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('kid-friendly cover review rejects cold or abstract candidates until visually approved',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'km-warm-cover-'));
  try{
    const candidates=[];
    for(let n=1;n<=3;n++){
      const name='Cover-Kandidat-0'+n+'.png';
      const content=Buffer.from('real-review-test-'+n);
      fs.writeFileSync(path.join(dir,name),content);
      candidates.push({candidate:n,file:name,humanVisible:true,fullyClothed:true,noRobotOrAnimalMascot:true,actualImageInspected:true,sha256:crypto.createHash('sha256').update(content).digest('hex'),status:'APPROVED',warmChildFriendly:true,clearConcreteEnvironment:true,notDisturbing:true,notSterile:true});
    }
    const review=path.join(dir,'review.json');
    fs.writeFileSync(review,JSON.stringify({status:'APPROVED',candidates}));
    assert.deepEqual(coverHumanReviewErrors(dir,review,{requireKidFriendlyWarmth:true}),[]);
    candidates[0].notSterile=false;
    fs.writeFileSync(review,JSON.stringify({status:'APPROVED',candidates}));
    assert.ok(coverHumanReviewErrors(dir,review,{requireKidFriendlyWarmth:true}).some(x=>x.includes('warm child-friendly')));
    assert.deepEqual(coverHumanReviewErrors(dir,review),[]);
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

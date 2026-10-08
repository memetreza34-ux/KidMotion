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

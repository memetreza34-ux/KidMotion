import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {validateArtDirectionPrompts,validateArtDirectionReview} from './art-direction-qa.mjs';

const episode={artDirectionPolicy:'storyworld-v1'};
const scene=(n,detail)=>({sceneRole:n%2?'exercise':'get-ready',prompt:`WORLD / ENVIRONMENT: a sunny neighborhood playground park with leafy trees and safe rubber sports court.
PLAY DETAIL / STORY BEAT: ${detail} beside the athlete, making the current adventure step visible.
WARMTH / MOOD: proud cheerful grin and focused eyes after this exercise.
TEXT / UI: readable.
LIGHT / MATERIALS: tactile materials.`});
const cover=n=>`COVER CANDIDATE 0${n}
FINAL GOOGLE FLOW PROMPT:
WORLD: sunny community park playground with human-scale benches, large green trees and safe activity floor.
PLAY DETAIL / STORY BEAT: hand-painted blue star footprints lead to mission flag ${n}, a visible physical clue for kids.
WARMTH / MOOD: eager smiling expression, curious bright eyes and afternoon sunshine.
TEXT: THE WORKOUT
LIGHT / MATERIALS: tactile rubber floor
`;
test('older episodes remain backward compatible',()=>assert.deepEqual(validateArtDirectionPrompts({episode:{},plan:{},prompt:''}),[]));
test('creative prompt QA blocks vague or fantasy-tower set design',()=>{
 const images=Array.from({length:28},(_,i)=>scene(i+1,'a colored stepping-stone trail leading toward a small painted finish marker'));
 images[1].prompt=images[1].prompt.replace('a sunny neighborhood playground park with leafy trees and safe rubber sports court','giant cylinders and floating platforms');
 const errors=validateArtDirectionPrompts({episode,plan:{images},prompt:cover(1)+cover(2)+cover(3)+'SZENE 02'});
 assert.ok(errors.some(x=>x.includes('Szene 02')&&x.includes('WORLD')));
 assert.ok(errors.some(x=>x.includes('same visual story detail')));
});
test('actual scene inspection must match image SHA and truthfully pass every dimension',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'kidmotion-art-'));
 try{
  const file='Szene 01.png';fs.writeFileSync(path.join(dir,file),'synthetic test image');
  const reviewFile=path.join(dir,'review.json');
  const record={file,imageSha256:'wrong',actuallyInspected:true,engagingCharacterExpression:true,groundedHumanScaleEnvironment:true,purposefulVisiblePlayDetail:true,cohesiveStoryWorld:true,clearCompositionAndPose:true,noGenericAICGIOrOddArchitecture:true,notes:'The star stepping stones show the intended safe movement path.'};
  const doc={artDirectionPolicy:'storyworld-v1',episodeFolder:'example',revision:'R1',scenes:[record]};
  const args={episode,episodeFolder:'example',revision:'R1',imagesDir:dir,reviewFile,requiredImages:[file]};
  fs.writeFileSync(reviewFile,JSON.stringify(doc));
  assert.ok(validateArtDirectionReview(args).some(x=>x.includes('SHA256')));
  record.imageSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,file))).digest('hex');
  fs.writeFileSync(reviewFile,JSON.stringify(doc));
  assert.deepEqual(validateArtDirectionReview(args),[]);
  record.purposefulVisiblePlayDetail=false;fs.writeFileSync(reviewFile,JSON.stringify(doc));
  assert.ok(validateArtDirectionReview(args).some(x=>x.includes('purposefulVisiblePlayDetail')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

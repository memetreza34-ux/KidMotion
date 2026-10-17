import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {checkFrameZeroGreetingPlan,hasFrameZeroGreetingPolicy} from './intro-greeting-policy.mjs';

const valid={
 introVisualPolicy:'greeting-overlay-frame-zero-v1',introOverlayText:'HELLO!',coverInVideo:false,
 scenes:[{type:'cover',inVideo:false},{type:'intro'}],
 nonExerciseImagePolicy:{remotionIntroGreetingException:true}
};
const intro='SCENE_ID: 02\nTEXT / UI: NO BAKED TEXT in this Google Flow image; leave LEFT side clean and quiet. Remotion overlays HELLO! at FRAME ZERO.';
test('new first-scene text policy always requires exact Hello and no baked Flow letters',()=>{
 assert.equal(hasFrameZeroGreetingPolicy(valid),true);
 assert.deepEqual(checkFrameZeroGreetingPlan({episode:valid,scenePrompt:intro}),[]);
 assert.ok(checkFrameZeroGreetingPlan({episode:{...valid,introOverlayText:''},scenePrompt:intro}).length);
 assert.ok(checkFrameZeroGreetingPlan({episode:valid,scenePrompt:'TEXT / UI: small Flow HELLO'}).length);
});
test('old videos remain backward-compatible without a new intro overlay',()=>{
 assert.equal(hasFrameZeroGreetingPolicy({introVisualPolicy:'greeting-only-v1'}),false);
 assert.deepEqual(checkFrameZeroGreetingPlan({episode:{introVisualPolicy:'greeting-only-v1'},scenePrompt:'anything'}),[]);
});
test('integration: generator, activation, Remotion first frame and QA are linked',()=>{
 const root=process.cwd(),read=f=>fs.readFileSync(path.join(root,f),'utf8');
 const generator=read('scripts/new-workout-episode.mjs');
 const activate=read('scripts/activate-episode.mjs');
 const workout=read('src/WorkoutVideo.tsx');
 const introScreen=read('src/components/IntroScreen.tsx');
 const post=read('scripts/postrender-qa.mjs');
 assert.match(generator,/introVisualPolicy:'greeting-overlay-frame-zero-v1'/);
 assert.match(generator,/NO BAKED TEXT/);
 assert.match(activate,/introGreetingText:/);
 assert.match(workout,/greetingText=\{workout\.introGreetingText\}/);
 assert.match(introScreen,/data-testid="intro-greeting-from-frame-zero"/);
 assert.doesNotMatch(introScreen,/useCurrentFrame|interpolate|delayRender|spring/);
 assert.match(post,/FIRST FRAME GREETING/);
});

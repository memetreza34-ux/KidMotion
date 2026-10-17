import test from 'node:test';
import assert from 'node:assert/strict';
import {validateStillWorkoutPlan} from './workout-still-quality.mjs';
const ex=i=>({type:'exercise',scene:String(3+2*i).padStart(2,'0'),image:'Szene '+String(3+2*i).padStart(2,'0')+'.png',title:i===8?'SPYGLASS TURN':i===10?'LOOKOUT TIPTOES':i===11?'CRAB SIDE STEP':'MOVE '+i,instruction:i===8?'Turn your shoulders.':i===10?'Lift your heels slightly.':i===11?'Step one foot sideways.':'Stretch both arms.',poseDescription:i===8?'Keep both feet flat and turn shoulders gently left while hips stay stable.':i===10?'Both heels rise a small amount with arms apart and toes grounded.':i===11?'Step right foot sideways, knees soft, both heels grounded.':'Keep both feet planted and raise arms gently while standing up tall.',storyBeat:'Chalk trail marker '+i+' points to a distinct flag '+(i%3===0?'with checkpoint reward unlocked.':'with a new path clue for kids.'),storyCheckpoint:i%3===0?i/3:null,worldZone:'Community playground garden zone number '+i+' with greenery'});
const scenes=Array.from({length:12},(_,i)=>ex(i+1)),rests=Array.from({length:11},(_,i)=>({type:'get-ready',scene:'R'+i,image:'R'+i+'.png',nextExerciseTitle:scenes[i+1].title}));
const images=[...scenes.map(s=>({imageFile:s.image,prompt:[s.title,s.instruction,s.poseDescription,s.storyBeat].join(' ')})),...rests.map(s=>({imageFile:s.image,prompt:'Compact dark semi-transparent navy panel under one-third image width, bright-cyan NEXT: '+s.nextExerciseTitle+', relaxed boy resting beside next flag.'}))];
const ep={stillImageQualityPolicy:'still-workout-v2',scenes:[...scenes,...rests],exerciseVisualPolicy:{remotionKenBurnsOnExerciseForbidden:true},restVisualPolicy:{remotionKenBurnsOnRestForbidden:true},audioPolicy:{workoutMusicVolume:0.95}};
test('twelve safe photo poses and eleven compact ready scenes can pass',()=>assert.deepEqual(validateStillWorkoutPlan({episode:ep,plan:{images}}),[]));
test('bad turn and missing heel lift are blocked',()=>{
 const wrong={...ep,scenes:ep.scenes.map(s=>({...s}))};wrong.scenes[7].poseDescription='Hold one hand at your eye without showing turn.';wrong.scenes[9].poseDescription='Stand tall on both feet.';
 const errors=validateStillWorkoutPlan({episode:wrong,plan:{images}});assert.ok(errors.some(e=>e.includes('shoulder-turn')));assert.ok(errors.some(e=>e.includes('tiptoe')));
});
test('no animation, missing checkpoint, long instructions are blocked',()=>{
 const bad={...ep,scenes:ep.scenes.map(s=>({...s})),exerciseVisualPolicy:{remotionKenBurnsOnExerciseForbidden:false}};
 bad.scenes[2].storyCheckpoint=null;bad.scenes[0].instruction='Please move both arms slowly and very carefully in this wonderfully exciting treasure hunt adventure with lots of friends.';
 const errors=validateStillWorkoutPlan({episode:bad,plan:{images}});assert.ok(errors.some(e=>e.includes('moving images')));assert.ok(errors.some(e=>e.includes('checkpoint')));assert.ok(errors.some(e=>e.includes('twelve words')));
});
test('older episodes remain compatible',()=>assert.deepEqual(validateStillWorkoutPlan({episode:{},plan:null}),[]));

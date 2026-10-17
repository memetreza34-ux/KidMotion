// Future-only checks for still-image workout plans. These are NOT computer vision.
export const stillV2=episode=>episode?.stillImageQualityPolicy==='still-workout-v2';
const text=s=>String(s||'').trim();
const norm=s=>text(s).toLowerCase().replace(/[^a-z0-9]+/g,' ');
const words=s=>(text(s).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length;
export function validateStillWorkoutPlan({episode,plan}){
 if(!stillV2(episode))return [];
 const errors=[],scenes=episode.scenes||[],exercise=scenes.filter(x=>x.type==='exercise'),ready=scenes.filter(x=>x.type==='get-ready'),images=plan?.images||[];
 if(exercise.length!==12||ready.length!==11)errors.push('Still-image workout requires 12 photos of poses and 11 photo transition scenes.');
 if(episode.exerciseVisualPolicy?.remotionKenBurnsOnExerciseForbidden!==true||episode.restVisualPolicy?.remotionKenBurnsOnRestForbidden!==true)errors.push('No moving images or animated poses: still photographs only.');
 if(Number(episode.audioPolicy?.workoutMusicVolume)<0.75)errors.push('Workout music must be audible in planned mix.');
 const zones=new Set(),beats=new Set();
 for(const [i,scene] of exercise.entries()){
  const pic=images.find(x=>x.imageFile===scene.image),prompt=text(pic?.prompt);
  const {title,instruction,poseDescription,storyBeat,worldZone}=scene;
  const n=scene.scene;
  if(!text(title)||words(title)>5)errors.push(n+': title too long or missing (maximum five words).');
  if(!text(instruction)||words(instruction)>12)errors.push(n+': instruction too long or missing (maximum twelve words).');
  if(text(poseDescription).length<28||!/\b(feet|foot|heel|toe|leg|knee|arm|hand|shoulder|hip|elbow)\b/i.test(text(poseDescription)))errors.push(n+': poseDescription needs specific safe limb placement, not a story gesture.');
  if(text(worldZone).length<25||text(storyBeat).length<30)errors.push(n+': worldZone and storyBeat must be concrete, distinct and child-scale.');
  if(text(poseDescription)&&!prompt.includes(text(poseDescription)))errors.push(n+': Flow prompt missing exact poseDescription.');
  if(text(storyBeat)&&!prompt.includes(text(storyBeat)))errors.push(n+': Flow prompt missing exact storyBeat.');
  if(text(title)&&!prompt.includes(text(title))||text(instruction)&&!prompt.includes(text(instruction)))errors.push(n+': Flow prompt missing exact label/instruction.');
  zones.add(norm(worldZone));beats.add(norm(storyBeat));
  if((i+1)%3===0){
   if(Number(scene.storyCheckpoint)!==(i+1)/3)errors.push(n+': checkpoint '+((i+1)/3)+'/4 is required.');
   if(!/\b(checkpoint|milestone|found|collected|completed|unlocked|reward|progress)\b/i.test(text(storyBeat)))errors.push(n+': checkpoint must show an actual story reward or visible progress.');
  }else if(scene.storyCheckpoint!==undefined&&scene.storyCheckpoint!==null)errors.push(n+': checkpoint may only follow moves 3, 6, 9 or 12.');
  const action=norm(text(title)+' '+text(instruction)),pose=norm(poseDescription);
  if(/\b(turn|twist|spyglass)\b/.test(action)&&(!/\bshoulder/.test(pose)||!/\b(feet|foot|hips|hip)\b/.test(pose)))errors.push(n+': shoulder-turn must show turn with anchored feet or hips.');
  if(/\b(tiptoe|heel|toes)\b/.test(action)&&!/\b(heel|heels)\b/.test(pose))errors.push(n+': tiptoe must clearly specify heel lift.');
  if(/\b(side step|sideways|crab step)\b/.test(action)&&!/\b(step|stepping)\b/.test(pose))errors.push(n+': side step must show actual sideways movement, not a squat.');
 }
 if(zones.size<6)errors.push('At least six distinct activity zones are required inside one coherent storyworld.');
 if(beats.size!==exercise.length)errors.push('Every exercise requires a unique physical play detail.');
 for(const scene of ready){
  const prompt=text(images.find(x=>x.imageFile===scene.image)?.prompt);
  if(!prompt.includes('NEXT: '+text(scene.nextExerciseTitle)))errors.push(scene.scene+': missing exact next-exercise label.');
  if(!/compact/i.test(prompt)||!/(?:under|less than)\s+one.third/i.test(prompt)||!/dark semi-transparent navy/i.test(prompt)||!/bright.cyan/i.test(prompt))errors.push(scene.scene+': inconsistent large GET READY panel; use compact navy/cyan under one-third width.');
  if(!/relaxed|neutral|resting|not the next pose/i.test(prompt))errors.push(scene.scene+': GET READY needs a resting pose, not early exercise demonstration.');
 }
 return errors;
}

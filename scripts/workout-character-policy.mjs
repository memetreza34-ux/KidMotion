import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

export const humanOnlyWorkout=(data)=>['workout','learn-and-move'].includes(String(data?.contentFormat||'workout')) && data?.characterPolicy?.species==='human';

const field=(prompt,label,next)=>{
  const pos=prompt.indexOf(label);
  if(pos<0)return '';
  const from=pos+label.length;
  const end=prompt.indexOf(next,from);
  return prompt.slice(from,end<0?prompt.length:end).trim();
};

export const humanPromptErrors=(prompt,{cover=false}={})=>{
  const errors=[];
  const positive=field(prompt,cover?'CHARACTER:':'CHARACTER / POSE:',cover?'WORLD:':'WORLD / ENVIRONMENT:');
  const negative=field(prompt,'NEGATIVE / STABILITY:','QUALITY CHECK:');
  if(!/\bhuman\b/i.test(positive))errors.push('CHARACTER must positively state HUMAN');
  if(!/\b(girl|boy|woman|man|athlete|person)\b/i.test(positive))errors.push('CHARACTER must describe a human person');
  if(/\b(robot|fox|animal|android|bear|wolf|raccoon|cat|dog|alien)\b/i.test(positive))errors.push('CHARACTER must not be a nonhuman mascot');
  if(!/\bno robot\b/i.test(negative)||!/\bfox\b/i.test(negative)||!/\banimal\b/i.test(negative))errors.push('NEGATIVE must rule out robot, fox and animal characters');
  return errors;
};

export const coverHumanReviewErrors=(imagesDir,reviewFile,{requireKidFriendlyWarmth=false}={})=>{
  if(!fs.existsSync(reviewFile))return ['COVER_HUMAN_REVIEW.json missing'];
  const review=JSON.parse(fs.readFileSync(reviewFile,'utf8'));
  const errors=[];
  if(review.status!=='APPROVED')errors.push('human cover review not APPROVED');
  for(let n=1;n<=3;n++){
    const name='Cover-Kandidat-0'+n+'.png';
    const file=path.join(imagesDir,name);
    const item=(review.candidates||[]).find(x=>Number(x.candidate)===n);
    if(!item||item.file!==name){errors.push(name+': review record missing');continue;}
    if(!fs.existsSync(file)){errors.push(name+': actual image missing');continue;}
    if(item.status!=='APPROVED'||item.humanVisible!==true||item.noRobotOrAnimalMascot!==true||item.fullyClothed!==true||item.actualImageInspected!==true){
      errors.push(name+': visual inspection not approved');continue;
    }
    const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    if(requireKidFriendlyWarmth && (!item.warmChildFriendly||!item.clearConcreteEnvironment||!item.notDisturbing||!item.notSterile)) errors.push(name+': warm child-friendly image review incomplete');
    if(item.sha256!==hash)errors.push(name+': cover image differs from reviewed hash');
  }
  return errors;
};
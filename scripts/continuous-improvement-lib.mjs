import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const KEY='playvilo-continuous-improvement-v1';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const validFolder=s=>/^KM-\d{3}-[a-z0-9-]+$/.test(s);
const active=(config,format)=>(config.activeRules||[]).filter(r=>Array.isArray(r.formats)&&r.formats.includes(format));
const validSource=p=>['00-bildprompts/google-flow-prompt.txt','01-voice-script/voice-script.txt','99-technik/PHASE2_FLOW_RUNBOOK.md','99-technik/LEARNING_PLAN.json','99-technik/IMAGE_PLAN.json','99-technik/episode.json'].includes(p);

export function loadImprovementPolicy(root){
 const data=readJson(path.join(root,'config','continuous-improvement.json'));
 if(data.policyId!==KEY||data.schemaVersion!==1||!Array.isArray(data.activeRules))throw Error('Invalid continuous-improvement policy');
 const ids=data.activeRules.map(r=>r.id);
 if(ids.some(x=>!/^KID-\d{3}$/.test(x))||new Set(ids).size!==ids.length)throw Error('Duplicate or invalid improvement rule IDs');
 return data;
}
const fingerprint=(policy,format)=>sha(JSON.stringify({policyId:policy.policyId,ruleVersion:policy.ruleVersion,rules:active(policy,format)}));

export function validateOneReview(review,{root,episodeFolder}){
 const errors=[];
 if(review.schemaVersion!==1||review.episodeFolder!==episodeFolder)errors.push('wrong review schema/episode');
 if(review.status!=='REVIEWED')errors.push('review pending: full video and feedback must be checked after rendering');
 if(review.reviewMethod!=='historic-video-analysis'&&review.reviewMethod!=='actual-mp4')errors.push('review method must identify real evidence');
 if(!Array.isArray(review.observations)||review.observations.length===0)errors.push('review must contain timestamped observations');
 for(const o of review.observations||[]){
  if(!Number.isFinite(o.atSeconds)||o.atSeconds<0||String(o.finding||'').trim().length<25||String(o.change||'').trim().length<25)errors.push('each observation requires real timestamp, finding and concrete improvement');
 }
 if(!Array.isArray(review.nextActions)||review.nextActions.length===0)errors.push('at least one measurable improvement or experiment required');
 if(review.reviewMethod==='historic-video-analysis'){
  const expected='episodes/KM-009-star-trail-adventure-workout/99-technik/VIDEO_REVIEW_2026-10-10.md';
  if(episodeFolder!=='KM-009-star-trail-adventure-workout'||review.evidenceFile!==expected||!fs.existsSync(path.join(root,expected)))errors.push('historic exemption only for documented KM-009 video');
 }else{
  if(!/^[0-9a-f]{64}$/.test(String(review.videoSha256||'')))errors.push('actual video review requires original MP4 SHA256');
  const checked=['watchedWholeVideo','scriptChecked','visualsChecked','audioChecked','timingChecked','childSafetyChecked','captionsChecked','exportChecked'];
  for(const k of checked)if(review[k]!==true)errors.push('real video review missing '+k);
  if(!review.reviewedAt||!review.reviewer)errors.push('review needs reviewer and date');
  if(review.videoPath && fs.existsSync(path.join(root,review.videoPath))){
   const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,review.videoPath))).digest('hex');
   if(actual!==review.videoSha256)errors.push('reviewed video MP4 hash differs from source');
  }
 }
 return errors;
}
export function pendingReviewErrors(root){
 const dir=path.join(root,'quality','reviews');
 if(!fs.existsSync(dir))return [];
 const errors=[];
 for(const item of fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort()){
  if(!validFolder(item.slice(0,-5))){errors.push('invalid review filename '+item);continue;}
  const folder=item.slice(0,-5);
  try{
   const data=readJson(path.join(dir,item));
   for(const error of validateOneReview(data,{root,episodeFolder:folder}))errors.push(folder+': '+error);
  }catch(e){errors.push(folder+': '+e.message)}
 }
 return errors;
}
export function requireReviewsBeforeNewEpisode(root){
 const failures=pendingReviewErrors(root);
 if(failures.length)throw Error('POST-VIDEO LEARNING BLOCKED. Finish these genuine reviews BEFORE planning another episode:\n'+failures.join('\n'));
}
export function createImprovementBrief({root,episodeFolder,format}){
 if(!validFolder(episodeFolder))throw Error('Invalid episode folder');
 const policy=loadImprovementPolicy(root),rules=active(policy,format);
 if(!rules.length)throw Error('Improvement policy has no active rules for '+format);
 const dir=path.join(root,'episodes',episodeFolder,'99-technik');
 fs.mkdirSync(dir,{recursive:true});
 const brief=[
  '# Continuous improvement — '+episodeFolder,
  '',
  '**Highest priority: prove earlier mistakes are addressed before new Phase 1 passes.**',
  'Review the last video, reuse verified learnings, and deliberately improve every new script, Flow prompt and production plan.',
  'For each required rule, replace PENDING in IMPROVEMENT_APPLICATION.json with APPLIED, cite an exact unchanged passage from the real source file and explain what changed.',
  'Evidence must be grounded in source files, not generic promises. Actual visual results are verified AFTER Google Flow generation, not from prompt wording.',
  '',
  ...rules.flatMap(r=>['## '+r.id+' — '+r.title,'Priority '+r.priority+' | evidence file: '+r.evidenceFile,r.requirement,'']),
  '## Experiments — do not secretly change engine',
  ...(policy.candidateExperiments||[]).map(x=>'- '+x.id+': '+x.title+' — '+x.note),
  '',
  '## Review loop',
  'After rendering, complete a real timestamped quality review (script, stills, intro, narration, captions, voice, rhythm, safe movements and mobile readability). Turn confirmed faults into a tested engine change or a documented improvement rule.',
  'YouTube retention dips/spikes and 30-second intro are useful AFTER data appears; mark metrics unavailable before enough views.',
 ].join('\n')+'\n';
 fs.writeFileSync(path.join(dir,'IMPROVEMENT_BRIEF.md'),brief);
 const target=path.join(dir,'IMPROVEMENT_APPLICATION.json');
 const previous=fs.existsSync(target)?readJson(target):null;
 const previousItems=new Map((previous?.items||[]).map(x=>[x.id,x]));
 const application={schemaVersion:1,policyId:policy.policyId,ruleFingerprint:fingerprint(policy,format),episodeFolder,format,
  items:rules.map(r=>previousItems.get(r.id)||{id:r.id,status:'PENDING',sourceFile:r.evidenceFile,evidence:'',whyItWorks:''}),
  note:'Never set APPLIED without actually checking the complete script and full Flow scene plan.'
 };
 fs.writeFileSync(target,JSON.stringify(application,null,2)+'\n');
 return application;
}
export function validateImprovementApplication({root,episodeFolder,format,episode}){
 if(episode?.qualityLearningPolicy!==KEY)return [];
 const failures=[],policy=loadImprovementPolicy(root),rules=active(policy,format);
 const target=path.join(root,'episodes',episodeFolder,'99-technik','IMPROVEMENT_APPLICATION.json');
 if(!fs.existsSync(target))return ['Missing IMPROVEMENT_APPLICATION.json. Run npm run quality:brief -- --episode='+episodeFolder];
 let application;
 try{application=readJson(target)}catch{return ['Invalid improvement application JSON']}
 if(application.policyId!==policy.policyId||application.ruleFingerprint!==fingerprint(policy,format)||application.episodeFolder!==episodeFolder||application.format!==format)failures.push('Outdated improvement brief/policy fingerprint; run quality:brief and address new rules');
 const items=Array.isArray(application.items)?application.items:[];
 if(items.length!==rules.length||new Set(items.map(x=>x.id)).size!==rules.length)failures.push('Application must cover each currently active rule exactly once');
 for(const r of rules){
  const item=items.find(x=>x.id===r.id);
  if(!item){failures.push(r.id+' missing');continue;}
  if(item.status!=='APPLIED'){failures.push(r.id+' not applied: '+r.title);continue;}
  if(!validSource(item.sourceFile)||item.sourceFile!==r.evidenceFile){failures.push(r.id+' incorrect evidence path');continue;}
  const targetFile=path.join(root,'episodes',episodeFolder,item.sourceFile);
  if(!fs.existsSync(targetFile)){failures.push(r.id+' source file missing');continue;}
  const content=fs.readFileSync(targetFile,'utf8');
  if(!content.includes(r.requiredPhrase))failures.push(r.id+' required scene/production pattern absent');
  if(String(item.evidence||'').trim().length<25||!content.includes(String(item.evidence||'').trim()))failures.push(r.id+' quote exact meaningful source passage (25+ chars)');
  if(String(item.whyItWorks||'').trim().length<30)failures.push(r.id+' explain specifically how the previous failure is avoided');
 }
 return failures;
}
export function startActualVideoReview({root,episodeFolder,videoFile}){
 if(!validFolder(episodeFolder))throw Error('Invalid folder');
 const abs=path.resolve(root,videoFile);
 if(!fs.existsSync(abs)||!fs.statSync(abs).isFile())throw Error('No actual rendered MP4; refusing a fictional video review');
 const rel=path.relative(root,abs).replaceAll(path.sep,'/');
 if(rel.startsWith('..'))throw Error('Video must be located inside repository checkout');
 const dir=path.join(root,'quality','reviews');
 fs.mkdirSync(dir,{recursive:true});
 const file=path.join(dir,episodeFolder+'.json');
 if(fs.existsSync(file))return {created:false,file}; // never overwrite hand-reviewed feedback
 const fileSha=crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
 const review={schemaVersion:1,episodeFolder,status:'PENDING_REAL_VIDEO_REVIEW',reviewMethod:'actual-mp4',videoPath:rel,videoSha256:fileSha,
  reviewer:null,reviewedAt:null,watchedWholeVideo:false,scriptChecked:false,visualsChecked:false,audioChecked:false,
  timingChecked:false,childSafetyChecked:false,captionsChecked:false,exportChecked:false,
  observations:[],nextActions:[],analytics:{status:'UNAVAILABLE',intro30sRetention:null,averagePercentageViewed:null,majorDips:[]},
  note:'Watch the entire actual MP4 and inspect scripts, prompts, timing, images, speech, captions and export. Document timecodes and concrete fixes. Review is NOT completed by this automatic draft.'
 };
 fs.writeFileSync(file,JSON.stringify(review,null,2)+'\n');
 return {created:true,file};
}
export const policyKey=KEY;

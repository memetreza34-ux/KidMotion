import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const clock=(sec,srt=false)=>{
 if(!Number.isFinite(sec)||sec<0)throw new Error('Bad seconds');
 const total=Math.round(sec*1000),p2=n=>String(n).padStart(2,'0');
 const h=Math.floor(total/3600000),m=Math.floor(total%3600000/60000),s=Math.floor(total%60000/1000);
 return srt?p2(h)+':'+p2(m)+':'+p2(s)+','+String(total%1000).padStart(3,'0'):(h?p2(h)+':':'')+p2(m)+':'+p2(s);
};
export function metadataFields(markdown){
 const sections=markdown.split(/^##\s+/m).slice(1);
 const get=(...labels)=>{
  const item=sections.find(x=>labels.some(y=>x.split('\n')[0].trim().toLowerCase()===y.toLowerCase()));
  return item?item.slice(item.indexOf('\n')+1).trim():'';
 };
 return {title:get('YouTube Title'),description:get('Description','Description / Caption'),caption:get('Caption')};
}
const defaultTags=['#KidsWorkout','#ExerciseForKids','#MovementForKids','#Playvilo','#KidsFitness'];
export function descriptionWithFiveHashtags(body){
 const tags=[];
 for(const tag of [...body.matchAll(/#[A-Za-z0-9_]+/g)].map(x=>x[0]).concat(defaultTags))
  if(!tags.some(x=>x.toLowerCase()===tag.toLowerCase())&&tags.length<5)tags.push(tag);
 const description=body.replace(/#[A-Za-z0-9_]+/g,'').replace(/\n{3,}/g,'\n\n').trim();
 if(!description||tags.length!==5)throw new Error('Description and five distinct hashtags required');
 return description+'\n\n'+tags.join(' ');
}
const obsolete=['YOUTUBE_KOPIEREN.txt','YOUTUBE_TITLE.txt','YOUTUBE_DESCRIPTION.txt','VOICE_TIMESTAMPS.txt','VIDEO_TIMELINE.txt','SUBTITLES.srt'];
export function generateExportFiles({root=process.cwd(),episodeFolder}){
 if(!/^KM-\d{3}-[a-z0-9-]+$/.test(episodeFolder))throw new Error('Unsafe folder');
 const base=path.join(root,'episodes',episodeFolder),exportDir=path.join(base,'03-export'),techDir=path.join(base,'99-technik');
 const read=rel=>fs.readFileSync(path.join(base,rel),'utf8');
 const data=JSON.parse(read('99-technik/episode.json'));
 if(!['workout','learn-and-move','learning'].includes(data.contentFormat))throw new Error('Unsupported episode format');
 const metadata=path.join(techDir,'UPLOAD_METADATA.md'),legacy=path.join(exportDir,'UPLOAD_METADATA.md');
 const meta=metadataFields(fs.readFileSync(fs.existsSync(metadata)?metadata:legacy,'utf8'));
 if(!meta.title||!meta.description||/__PLAN_REQUIRED__|PLACEHOLDER|\bTBD\b/.test(meta.title+meta.description))throw new Error('Unfinished upload metadata');
 const description=descriptionWithFiveHashtags(meta.description),upload='TITLE:\n'+meta.title+'\n\nDESCRIPTION:\n'+description+'\n';
 const internal={};let cursor=0,cues=[];
 if(data.contentFormat!=='learning'){
  const vp=JSON.parse(read('99-technik/VOICE_PLAN.json')),voice=read('01-voice-script/voice-script.txt').trim(),sections=vp.sections||[];
  if(!voice||voice!==vp.exactTtsCopy||sections.map(s=>String(s.text||'').trim()).join(' ')!==voice)throw new Error('Voice text and plan differ');
  if(data.scenes?.[0]?.type!=='cover'||data.scenes[0].inVideo!==false)throw new Error('Cover must be outside MP4');
  if(data.introVisualPolicy==='greeting-only-v1'&&!/^hello\b/i.test(voice))throw new Error('Expected HELLO intro');
  const timeline=[];
  for(const scene of data.scenes||[]){
   if(scene.type==='cover'||scene.inVideo===false)continue;
   const seconds=Number(scene.duration);
   if(!Number.isFinite(seconds)||seconds<=0)throw new Error('Bad scene duration');
   const label=scene.type==='exercise'?scene.title:scene.type==='get-ready'?'GET READY - '+scene.nextExerciseTitle:scene.type.toUpperCase();
   timeline.push(clock(cursor)+' - '+clock(cursor+seconds)+' | Szene '+scene.scene+' | '+label);
   cursor+=seconds;
  }
  cues=sections.map((s,i)=>({i:i+1,start:Number(s.startSeconds),end:Number(s.endSeconds),text:String(s.text||'').trim()}));
  if(!cues.length||cues.some((c,i)=>!c.text||!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.end<=c.start||(i===0?c.start!==0:c.start<cues[i-1].end)))throw new Error('Invalid voice cue window');
  if(cues.at(-1).end>cursor)throw new Error('Voice cue exceeds video');
  internal['SUBTITLES.srt']=cues.map(c=>c.i+'\n'+clock(c.start,true)+' --> '+clock(c.end,true)+'\n'+c.text).join('\n\n')+'\n';
  internal['VOICE_TIMESTAMPS.txt']=['PLANNED VOICE TIMESTAMPS; check actual recorded TTS.',...cues.map(c=>clock(c.start)+' - '+clock(c.end)+' | '+c.text),clock(cues.at(-1).end)+' - '+clock(cursor)+' | No spoken voice.'].join('\n')+'\n';
  internal['VIDEO_TIMELINE.txt']=['SCENE TIMELINE - '+episodeFolder,'Cover outside MP4. Total '+clock(cursor),...timeline].join('\n')+'\n';
 }
 fs.mkdirSync(exportDir,{recursive:true});fs.mkdirSync(techDir,{recursive:true});
 if(fs.existsSync(legacy)){
  if(!fs.existsSync(metadata))fs.renameSync(legacy,metadata);
  else fs.rmSync(legacy);
 }
 for(const [name,content] of Object.entries(internal))fs.writeFileSync(path.join(techDir,name),content,'utf8');
 for(const name of obsolete){const file=path.join(exportDir,name);if(fs.existsSync(file))fs.rmSync(file);}
 fs.writeFileSync(path.join(exportDir,'YOUTUBE_UPLOAD.txt'),upload,'utf8');
 return {episodeFolder,totalSeconds:cursor,hashtags:(description.match(/#[A-Za-z0-9_]+/g)||[]).length,cues:cues.length,files:['YOUTUBE_UPLOAD.txt'],internalFiles:Object.keys(internal),exportDir};
}
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export function packApprovedRender({root=process.cwd(),episodeFolder,video=path.join(root,'out','kidmotion.mp4')}){
 const base=path.join(root,'episodes',episodeFolder);
 const approval=JSON.parse(fs.readFileSync(path.join(base,'99-technik','ASSET_APPROVAL.json'),'utf8'));
 const selection=JSON.parse(fs.readFileSync(path.join(base,'99-technik','COVER_SELECTION.json'),'utf8'));
 if(approval.status!=='APPROVED_FOR_RENDER'||approval.phase3InputLocked!==true||selection.status!=='SELECTED')throw new Error('No approved final image/voice handoff');
 const cover=path.join(base,'00-bildprompts','images','Szene 01.png');
 if(!fs.existsSync(cover)||!fs.existsSync(video))throw new Error('Actual PNG or rendered MP4 missing');
 if(selection.selectedCoverSha256&&selection.selectedCoverSha256!==sha(cover))throw new Error('Selected cover image changed since approval');
 const result=generateExportFiles({root,episodeFolder});
 fs.copyFileSync(cover,path.join(result.exportDir,'COVER.png'));
 fs.copyFileSync(video,path.join(result.exportDir,'FINAL_VIDEO.mp4'));
 return {...result,media:['COVER.png','FINAL_VIDEO.mp4']};
}

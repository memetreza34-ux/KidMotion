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
 const get=name=>{
   const segment=sections.find(x=>x.split('\n')[0].trim().toLowerCase()===name.toLowerCase());
   return segment?segment.slice(segment.indexOf('\n')+1).trim():'';
 };
 return {title:get('YouTube Title'),description:get('Description'),caption:get('Caption')};
}
const defaults=['#KidsWorkout','#ExerciseForKids','#MovementForKids','#KidMotion','#KidsFitness'];
export function descriptionWithFiveHashtags(body){
 const all=body.match(/#[A-Za-z0-9_]+/g)||[],tags=[];
 for(const tag of [...all,...defaults])if(!tags.some(x=>x.toLowerCase()===tag.toLowerCase())&&tags.length<5)tags.push(tag);
 const text=body.replace(/#[A-Za-z0-9_]+/g,'').replace(/\n{3,}/g,'\n\n').trim();
 if(!text||tags.length!==5)throw new Error('Need description and five hashtags');
 return text+'\n\n'+tags.join(' ');
}
export function generateExportFiles({root=process.cwd(),episodeFolder}){
 if(!/^KM-\d{3}-[a-z0-9-]+$/.test(episodeFolder))throw new Error('Unsafe folder');
 const base=path.join(root,'episodes',episodeFolder),exportDir=path.join(base,'03-export');
 const read=rel=>fs.readFileSync(path.join(base,rel),'utf8');
 const episode=JSON.parse(read('99-technik/episode.json'));
 if(!['workout','learn-and-move'].includes(episode.contentFormat))throw new Error('This timecoded export engine is for workouts');
 const plan=JSON.parse(read('99-technik/VOICE_PLAN.json'));
 const voice=read('01-voice-script/voice-script.txt').trim();
 const meta=metadataFields(read('03-export/UPLOAD_METADATA.md'));
 if(!meta.title||!meta.description||/__PLAN_REQUIRED__|PLACEHOLDER|\bTBD\b/.test(meta.title+meta.description+voice))throw new Error('Unfinished title/description/voice');
 const sections=Array.isArray(plan.sections)?plan.sections:[];
 if(!sections.length||voice!==plan.exactTtsCopy||sections.map(c=>String(c.text||'').trim()).join(' ')!==voice)throw new Error('Exact voice text does not match voice plan');
 if(episode.scenes?.[0]?.type!=='cover'||episode.scenes[0].inVideo!==false)throw new Error('Cover cannot be in video');
 if(episode.introVisualPolicy==='greeting-only-v1'&&!/^hello\b/i.test(voice))throw new Error('Greeting-only intro must start with Hello');
 let cursor=0;const timeline=[];
 for(const scene of episode.scenes||[]){
  if(scene.type==='cover'||scene.inVideo===false)continue;
  const seconds=Number(scene.duration);
  if(!Number.isFinite(seconds)||seconds<=0)throw new Error('Bad scene duration');
  const label=scene.type==='exercise'?scene.title:scene.type==='get-ready'?'GET READY - '+scene.nextExerciseTitle:scene.type.toUpperCase();
  timeline.push(clock(cursor)+' - '+clock(cursor+seconds)+' | Szene '+scene.scene+' | '+label);
  cursor+=seconds;
 }
 const cues=sections.map((s,i)=>({i:i+1,start:Number(s.startSeconds),end:Number(s.endSeconds),text:String(s.text||'').trim()}));
 if(cues.some((c,i)=>!c.text||!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.end<=c.start||(i===0?c.start!==0:c.start<cues[i-1].end)))throw new Error('Bad or overlapping voice cue windows');
 if(cues.at(-1).end>cursor)throw new Error('Voice exceeds video duration');
 const description=descriptionWithFiveHashtags(meta.description);
 const srt=cues.map(c=>c.i+'\n'+clock(c.start,true)+' --> '+clock(c.end,true)+'\n'+c.text).join('\n\n')+'\n';
 const timeText=['VOICE TIMESTAMPS - '+episodeFolder,'PLANNED windows only, check the real TTS audio before publishing.',...cues.map(c=>clock(c.start)+' - '+clock(c.end)+' | '+c.text),clock(cues.at(-1).end)+' - '+clock(cursor)+' | No spoken voice (music and movement only).'].join('\n')+'\n';
 const generated={
   'YOUTUBE_KOPIEREN.txt':'TITLE\n'+meta.title+'\n\nDESCRIPTION\n'+description+'\n',
   'YOUTUBE_TITLE.txt':meta.title+'\n',
   'YOUTUBE_DESCRIPTION.txt':description+'\n',
   'VOICE_TIMESTAMPS.txt':timeText,
   'SUBTITLES.srt':srt,
   'VIDEO_TIMELINE.txt':['VIDEO TIMELINE - '+episodeFolder,'Thumbnail: Szene 01.png is outside video.','Total '+clock(cursor),'',...timeline].join('\n')+'\n'
 };
 fs.mkdirSync(exportDir,{recursive:true});
 for(const [filename,content] of Object.entries(generated))fs.writeFileSync(path.join(exportDir,filename),content,'utf8');
 return {episodeFolder,totalSeconds:cursor,hashtags:(description.match(/#[A-Za-z0-9_]+/g)||[]).length,cues:cues.length,files:Object.keys(generated),exportDir};
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

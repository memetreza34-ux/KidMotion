import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';

const args=process.argv.slice(2);
const epArg=args.find((v)=>v.startsWith('--episode='));
const episodeFolder=epArg?epArg.slice('--episode='.length):'';
if(!episodeFolder){
  console.error('LEARNING ACTIVATE FAILED: pass --episode=KM-XXX-slug');
  process.exit(1);
}

const root=process.cwd();
const paths=resolveEpisodePaths(root,episodeFolder);
const data=readEpisodeData(paths);
if(data.contentFormat!=='learning'){
  console.error('LEARNING ACTIVATE FAILED: episode is not pure learning.');
  process.exit(1);
}

const scenes=(data.scenes||[]).filter((s)=>s.inVideo!==false);
if(!scenes.length){
  console.error('LEARNING ACTIVATE FAILED: no video scenes.');
  process.exit(1);
}

const publicRoot=path.join(root,'public','episodes',String(data.date),episodeFolder);
fs.mkdirSync(publicRoot,{recursive:true});

const alias=(name,target)=>{
  const dest=path.join(publicRoot,name);
  fs.rmSync(dest,{recursive:true,force:true});
  fs.symlinkSync(path.relative(path.dirname(dest),target),dest,'dir');
};
alias('images',paths.imagesDir);
alias('audio',paths.audioDir);

const imageFolder='episodes/'+data.date+'/'+episodeFolder+'/images';
const audioFolder='episodes/'+data.date+'/'+episodeFolder+'/audio';
const q=JSON.stringify;
const imageExpr=(name)=>name?'imageAsset('+q(name)+')':'undefined';
const voiceFile=data.narrationPolicy?.voiceFile||'Voice 01.mp3';
const musicFile=data.audioPolicy?.backgroundMusicFile||'bg-music.mp3';
const voiceExists=fs.existsSync(path.join(paths.audioDir,voiceFile));
const musicExists=fs.existsSync(path.join(paths.audioDir,musicFile));

const rows=scenes.map((s)=>{
  const overlay=String(s.remotionOverlayText||'').trim();
  return '    {id:'+q(String(s.scene))+', image:'+imageExpr(s.image)+', duration:'+Number(s.duration||8)+', overlayText:'+(overlay?q(overlay):'undefined')+', overlayPosition:'+q(s.overlayPosition||'bottom')+'},';
}).join('\n');

const source=[
  "import type {LearningVideoData} from '../types';",
  '',
  'const imageAsset=(name:string)=>'+q(imageFolder+'/')+'+name;',
  'const audioAsset=(name:string)=>'+q(audioFolder+'/')+'+name;',
  '',
  '// AUTO-GENERATED ACTIVE LEARNING EPISODE: '+episodeFolder,
  'export const activeLearning: LearningVideoData = {',
  '  id:'+q(data.id+'-'+data.slug)+',',
  '  title:'+q(data.topic)+',',
  '  fps:'+Number(data.fps||30)+',',
  '  width:'+Number(data.width||1920)+',',
  '  height:'+Number(data.height||1080)+',',
  '  voice:'+(voiceExists?'audioAsset('+q(voiceFile)+')':'undefined')+',',
  '  bgMusic:'+(musicExists?'audioAsset('+q(musicFile)+')':'undefined')+',',
  '  scenes:[',
  rows,
  '  ],',
  '};',
  ''
].join('\n');

fs.writeFileSync(path.join(root,'src','data','active-learning.ts'),source,'utf8');
fs.writeFileSync(
  path.join(root,'episodes','ACTIVE_EPISODE.json'),
  JSON.stringify({
    episodeFolder,
    contentFormat:'learning',
    structureVersion:data.structureVersion,
    date:data.date,
    topic:data.topic,
    publicAssetRoot:'public/episodes/'+data.date+'/'+episodeFolder,
    dataPath:path.relative(root,paths.dataPath)
  },null,2)+'\n',
  'utf8'
);

console.log('Activated learning episode: '+episodeFolder);
console.log('Video scenes: '+scenes.length);

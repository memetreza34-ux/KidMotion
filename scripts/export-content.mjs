import fs from 'node:fs';
import path from 'node:path';
import {generateExportFiles,packApprovedRender} from './export-content-lib.mjs';
const args=process.argv.slice(2),root=process.cwd();
const arg=name=>args.find(s=>s.startsWith('--'+name+'='))?.slice(name.length+3)||'';
const pointer=path.join(root,'episodes','ACTIVE_EPISODE.json');
const episodeFolder=arg('episode')||(fs.existsSync(pointer)?JSON.parse(fs.readFileSync(pointer,'utf8')).episodeFolder:'');
if(!episodeFolder){console.error('Specify --episode=KM-XXX-slug');process.exit(1);}
try{
 const pack=args.includes('--pack');
 const result=pack?packApprovedRender({root,episodeFolder,video:arg('video')?path.resolve(arg('video')):path.join(root,'out','kidmotion.mp4')}):generateExportFiles({root,episodeFolder});
 console.log('EXPORT READY: '+episodeFolder+' | '+result.totalSeconds+'s, '+result.hashtags+' hashtags, '+result.cues+' planned SRT cues');
 console.log('Files: '+result.files.concat(result.media||[]).join(', '));
 if(!pack)console.log('TEXT ONLY: no MP4 or cover created, and actual TTS sync still requires listening verification.');
}catch(e){console.error('EXPORT BLOCKED: '+e.message);process.exit(1);}

import fs from 'node:fs';
import path from 'node:path';
import {hideActivePointerOnMac} from './finder-layout-lib.mjs';

const root=process.cwd();
if(!fs.existsSync(path.join(root,'episodes'))){
  console.error('No episodes folder was found; nothing changed.');
  process.exit(1);
}
const result=hideActivePointerOnMac(root);
console.log('PROJECT TIDY: all images, episodes, scripts and metadata remain in their original location.');
if(result.status==='HIDDEN')console.log('Active-episode pointer is now hidden in macOS Finder.');
else if(result.status==='MISSING')console.log('No ACTIVE_EPISODE.json exists; episodes list is already tidy.');
else if(result.status==='NOT_MAC')console.log('Finder-only visibility change skipped on non-macOS system.');
else {console.error('Could not hide active episode pointer: '+result.error);process.exit(1);}

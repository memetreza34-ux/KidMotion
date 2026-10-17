import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('render is high quality still-image H264',()=>{const s=read('scripts/render-guarded.mjs');assert.match(s,/'--crf','18','--preset','medium'/);});
test('audio mix recovers level after opening and fades to zero',()=>{const s=read('src/WorkoutVideo.tsx');assert.match(s,/workoutMusicVolume \?\? 0\.95/);assert.match(s,/openingMusicVolume \?\? 0\.10/);assert.match(s,/\[1, 0\]/);});
test('postrender checks actual volume and end fade',()=>{const s=read('scripts/postrender-qa.mjs');for(const x of ['MUSIC MIX: exercise music too quiet','MUSIC MIX: introductory audio exceeds music','MUSIC MIX: final fade not audible'])assert.ok(s.includes(x));});

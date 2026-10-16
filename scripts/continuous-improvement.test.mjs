import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createImprovementBrief,validateImprovementApplication,pendingReviewErrors,requireReviewsBeforeNewEpisode,startActualVideoReview,policyKey} from './continuous-improvement-lib.mjs';

function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'playvilo-quality-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 fs.mkdirSync(path.join(root,'config'),{recursive:true});
 fs.writeFileSync(path.join(root,'config','continuous-improvement.json'),JSON.stringify({schemaVersion:1,policyId:policyKey,ruleVersion:1,activeRules:[{id:'KID-001',formats:['workout'],priority:'P0',title:'Purposeful setting',evidenceFile:'00-bildprompts/google-flow-prompt.txt',requiredPhrase:'PLAY DETAIL / STORY BEAT:',requirement:'Meaningful visible floor markers for each move.'}],candidateExperiments:[]}));
 const folder='KM-999-test-quality',ep=path.join(root,'episodes',folder);
 fs.mkdirSync(path.join(ep,'00-bildprompts'),{recursive:true});
 fs.mkdirSync(path.join(ep,'99-technik'),{recursive:true});
 fs.writeFileSync(path.join(ep,'00-bildprompts','google-flow-prompt.txt'),'PLAY DETAIL / STORY BEAT: hand-painted stepping stones identify the balance target and exercise.');
 return {root,folder,ep};
}
test('every next episode begins with pending proof, never auto-applied',t=>{
 const x=fixture(t);
 const brief=createImprovementBrief({...x,format:'workout'});
 assert.equal(brief.items[0].status,'PENDING');
 assert.match(fs.readFileSync(path.join(x.ep,'99-technik','IMPROVEMENT_BRIEF.md'),'utf8'),/Purposeful setting/);
 assert.ok(validateImprovementApplication({...x,format:'workout',episode:{qualityLearningPolicy:policyKey}}).some(e=>e.includes('not applied')));
});
test('missing and fictional proof do not pass QA; real excerpt with explanation does',t=>{
 const x=fixture(t),a=createImprovementBrief({...x,format:'workout'});
 a.items[0]={id:'KID-001',status:'APPLIED',sourceFile:'00-bildprompts/google-flow-prompt.txt',evidence:'generic made-up details that do not appear in actual prompt',whyItWorks:'The design now refers to specific movement-safe painted floor cues and unique zones.'};
 const file=path.join(x.ep,'99-technik','IMPROVEMENT_APPLICATION.json');
 fs.writeFileSync(file,JSON.stringify(a));
 assert.ok(validateImprovementApplication({...x,format:'workout',episode:{qualityLearningPolicy:policyKey}}).some(x=>x.includes('quote exact')));
 a.items[0].evidence='hand-painted stepping stones identify the balance target and exercise.';
 fs.writeFileSync(file,JSON.stringify(a));
 assert.deepEqual(validateImprovementApplication({...x,format:'workout',episode:{qualityLearningPolicy:policyKey}}),[]);
});
test('a real rendered video creates a pending human review that blocks the next episode',t=>{
 const x=fixture(t),mp4=path.join(x.root,'out','test.mp4');
 fs.mkdirSync(path.dirname(mp4),{recursive:true});
 fs.writeFileSync(mp4,'fake bytes for unit test only');
 assert.equal(startActualVideoReview({...x,videoFile:'out/test.mp4'}).created,true);
 assert.equal(startActualVideoReview({...x,videoFile:'out/test.mp4'}).created,false);
 assert.throws(()=>requireReviewsBeforeNewEpisode(x.root),/POST-VIDEO LEARNING BLOCKED/);
 assert.ok(pendingReviewErrors(x.root).length>0);
});

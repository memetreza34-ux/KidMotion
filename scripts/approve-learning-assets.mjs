import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {resolveEpisodePaths,readEpisodeData} from './episode-paths.mjs';

const root=process.cwd();
const args=process.argv.slice(2);
const epArg=args.find((v)=>v.startsWith('--episode='));
const episodeFolder=epArg?epArg.slice('--episode='.length):'';
if(!episodeFolder){console.error('LEARNING APPROVAL FAILED: pass --episode=...');process.exit(1);}

const paths=resolveEpisodePaths(root,episodeFolder);
const data=readEpisodeData(paths);
if(data.contentFormat!=='learning'){console.error('LEARNING APPROVAL FAILED: not learning format.');process.exit(1);}

const review=fs.existsSync(paths.reviewPath)?JSON.parse(fs.readFileSync(paths.reviewPath,'utf8')):{};
const baseRequired=[
  'learningAccuracyVerified',
  'primaryObjectiveServedByEveryScene',
  'ageBandAppropriate',
  'practiceAnswerHiddenUntilReveal',
  'revealExplainsAnswer',
  'recapMatchesLearningPlan',
  'sceneOrderMatchesPlan',
  'visualsTeachIntendedConcept',
  'textAndSpellingCorrect',
  'noUnnecessaryCharacterInsertion',
  'noUnplannedFactualClaims',
  'noAnatomyOrObjectErrors',
  'noMissingOrDuplicateScenes'
];
const hasApply=(data.scenes||[]).some((s)=>String(s.role||'').toUpperCase()==='APPLY');
const required=hasApply?[...baseRequired,'applicationSceneWorks']:baseRequired;
const incomplete=required.filter((key)=>review[key]!==true);

if(incomplete.length){
  console.error('LEARNING APPROVAL FAILED: pedagogical/visual review incomplete: '+incomplete.join(', '));
  process.exit(1);
}

const hash=(file)=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const files=[];
for(const scene of data.scenes||[]){
  if(scene.inVideo===false) continue;
  const file=path.join(paths.imagesDir,scene.image);
  if(!fs.existsSync(file)){console.error('LEARNING APPROVAL FAILED: missing '+scene.image);process.exit(1);}
  files.push({path:path.relative(paths.episodeRoot,file).split(path.sep).join('/'),sha256:hash(file)});
}

const voice=data.narrationPolicy?.voiceFile||'Voice 01.mp3';
const voicePath=path.join(paths.audioDir,voice);
if(!fs.existsSync(voicePath)){console.error('LEARNING APPROVAL FAILED: missing '+voice);process.exit(1);}
files.push({path:path.relative(paths.episodeRoot,voicePath).split(path.sep).join('/'),sha256:hash(voicePath)});

const musicPath=path.join(paths.audioDir,'bg-music.mp3');
if(fs.existsSync(musicPath)){
  files.push({path:path.relative(paths.episodeRoot,musicPath).split(path.sep).join('/'),sha256:hash(musicPath)});
}

const approval={
  schemaVersion:2,
  contentFormat:'learning',
  learningEngineVersion:data.learningEngineVersion||1,
  ageBand:data.ageBand,
  learningMode:data.learningMode,
  primaryLearningObjective:data.primaryLearningObjective,
  episodeFolder,
  status:'APPROVED_FOR_RENDER',
  pedagogicalReviewComplete:true,
  approvedAt:new Date().toISOString(),
  files
};
fs.writeFileSync(paths.approvalPath,JSON.stringify(approval,null,2)+'\n','utf8');
console.log('LEARNING ASSETS APPROVED — '+episodeFolder);
console.log('Pedagogical review locked: objective, age band, practice/reveal, facts, application/recap and visuals.');

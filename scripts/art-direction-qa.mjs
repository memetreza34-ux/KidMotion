import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// This creative gate is opt-in per episode. Existing episodes remain backward compatible.
export const requiresStoryworld = (episode) => episode?.artDirectionPolicy === 'storyworld-v1';

const headings=['WORLD / ENVIRONMENT:','WORLD:','PLAY DETAIL / STORY BEAT:','WARMTH / MOOD:','TEXT / UI:','TEXT:','LIGHT / MATERIALS:','NEGATIVE / STABILITY:','QUALITY CHECK:','OUTPUT:'];
const extract=(block,label)=>{
  const start=block.indexOf(label);
  if(start<0)return '';
  const from=start+label.length;
  const later=headings.filter(x=>x!==label).map(x=>block.indexOf(x,from)).filter(n=>n>=0);
  return block.slice(from,later.length?Math.min(...later):block.length).trim();
};
const grounded=/\b(?:park|playground|garden|gym|gymnasium|courtyard|court|field|meadow|trail|schoolyard|sports hall|activity hall|activity room|playroom|forest|beach|backyard|campground|school|community center|sports center|training room|play area|sports ground|garden path)\b/i;
const tangible=/\b(?:painted|chalk|footprints?|pawprints?|hopping|stepping|stripes?|flags?|cones?|hoops?|dots?|arrows?|trail|tracks?|flowers?|leaves|leaf|trees?|banners?|ribbons?|puddles?|stars?|stones?|tiles?|mats?|balls?|markers?|kites?|planters?|tape|signposts?|lanterns?|bubbles?|clouds?|seeds?|butterflies|butterfly|badges?|stickers?|discs?|targets?|circles?|paths?|splashes?|shapes?|bells?|beacons?|lights?)\b/i;
const strange=/\b(?:skyscrapers?|towers?|silos?|rooftops?|floating platforms?|spaceports?|megastructures?|endless plazas?|surreal skyline|giant cylinders?|abstract futuristic city|empty showroom)\b/i;
const genericDetail=/^(?:one |a |an )?(?:small |simple |subtle |cute |colorful |fun |playful |meaningful |relevant |nice |warm )*(?:detail|accent|decoration|element|prop|touch|object)\.?$/i;
const emotion=/\b(?:smil\w*|grin\w*|curious|excited|proud|cheer\w*|confident|determined|focused|encourag\w*|relieved|celebrat\w*|delighted|surprised|welcom\w*|playful|joyful|eager|reassur\w*|brave|gentle|concentrat\w*)\b/i;
const placeholders=/__PLAN_REQUIRED__|\bTBD\b|PLACEHOLDER/i;
const normalized=(s)=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

const blockCheck=(block,name,isCover=false)=>{
 const failures=[];
 const world=extract(block,isCover?'WORLD:':'WORLD / ENVIRONMENT:');
 const detail=extract(block,'PLAY DETAIL / STORY BEAT:');
 const mood=extract(block,'WARMTH / MOOD:');
 if(world.length<40||placeholders.test(world)||!grounded.test(world))failures.push(name+': WORLD must specify a recognizable child-scale park, playground, garden, gym or activity setting.');
 if(strange.test(world))failures.push(name+': WORLD contains unexplained odd towers / abstract or floating architecture.');
 if(detail.length<38||placeholders.test(detail)||genericDetail.test(detail)||!tangible.test(detail))failures.push(name+': PLAY DETAIL / STORY BEAT needs a concrete visible scene-specific physical detail, not a generic cute accent.');
 if(mood.length<27||placeholders.test(mood)||!emotion.test(mood))failures.push(name+': WARMTH / MOOD needs a visible, action-specific natural human expression.');
 return {failures,detail:normalized(detail)};
};

export function validateArtDirectionPrompts({episode,plan,prompt}){
 if(!requiresStoryworld(episode))return [];
 const errors=[];
 const coverDetails=[];
 for(let n=1;n<=3;n++){
  const marker='COVER CANDIDATE 0'+n;
  const from=prompt.indexOf(marker);
  const next=n<3?prompt.indexOf('COVER CANDIDATE 0'+(n+1),from+marker.length):prompt.indexOf('SZENE 02',from+marker.length);
  const block=from<0?'':(prompt.slice(from,next>from?next:prompt.length).split('FINAL GOOGLE FLOW PROMPT:')[1]||'');
  const check=blockCheck(block,'Cover 0'+n,true);
  errors.push(...check.failures);coverDetails.push(check.detail);
 }
 if(new Set(coverDetails).size<2)errors.push('Cover candidates must have different visible play/story details.');
 const images=Array.isArray(plan?.images)?plan.images:[];
 if(images.length!==28)errors.push('storyworld-v1 requires 28 separately planned images.');
 const exercises=[];
 for(let n=2;n<=28;n++){
  const item=images[n-1];
  const check=blockCheck(String(item?.prompt||''),'Szene '+String(n).padStart(2,'0'));
  errors.push(...check.failures);
  if(item?.sceneRole==='exercise')exercises.push({n,detail:check.detail});
 }
 for(let i=1;i<exercises.length;i++)if(exercises[i].detail&&exercises[i].detail===exercises[i-1].detail)errors.push('Adjacent exercises '+exercises[i-1].n+'/'+exercises[i].n+' repeat the same visual story detail.');
 if(exercises.length===12&&new Set(exercises.map(x=>x.detail)).size<8)errors.push('At least eight of twelve exercise shots need different physical play/story details.');
 return errors;
}

export function validateArtDirectionReview({episode,episodeFolder,revision,imagesDir,reviewFile,requiredImages}){
 if(!requiresStoryworld(episode))return [];
 if(!fs.existsSync(reviewFile))return ['Missing ART_DIRECTION_REVIEW.json. Review actual scene PNGs before approving.'];
 let review;
 try{review=JSON.parse(fs.readFileSync(reviewFile,'utf8'));}catch{return ['ART_DIRECTION_REVIEW.json is malformed.'];}
 const errors=[];
 if(review.episodeFolder!==episodeFolder||review.revision!==revision||review.artDirectionPolicy!=='storyworld-v1')errors.push('Art review belongs to a different episode, revision or style policy.');
 const records=Array.isArray(review.scenes)?review.scenes:[];
 if(records.length!==requiredImages.length)errors.push('Art review must contain exactly '+requiredImages.length+' scene image records.');
 const flags=['actuallyInspected','engagingCharacterExpression','groundedHumanScaleEnvironment','purposefulVisiblePlayDetail','cohesiveStoryWorld','clearCompositionAndPose','noGenericAICGIOrOddArchitecture'];
 const still=episode.stillImageQualityPolicy==='still-workout-v2';
 const types=new Map((episode.scenes||[]).map(s=>[s.image,s.type]));
 const expected=new Set(requiredImages);
 for(const file of requiredImages){
  const candidates=records.filter(x=>x.file===file);
  if(candidates.length!==1){errors.push(file+': expected exactly one art-review record.');continue;}
  const r=candidates[0];
  const role=types.get(file);
  const extra=still&&role==='exercise'?['poseMatchesWrittenInstruction','realImageComparedAgainstPoseDescription','safeFeetAndHandsClearlyVisible','unambiguousAtPhoneSize','exerciseTextLegibleOnPhone']:still&&role==='get-ready'?['compactUniformGetReadyPanel','nextMoveNameCorrect','readableOnPhone']:[];
  for(const flag of [...flags,...extra])if(r[flag]!==true)errors.push(file+': real PNG review criterion not passed: '+flag);
  if(String(r.notes||'').trim().length<(extra.length?35:20))errors.push(file+': add specific notes about real pose, hand/feet positions and text legibility in the inspected image.');
  const full=path.join(imagesDir,file);
  if(!fs.existsSync(full)){errors.push(file+': PNG missing, cannot inspect or bind review.');continue;}
  const sha=crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
  if(r.imageSha256!==sha)errors.push(file+': SHA256 does not match actual generated PNG; review that exact image.');
 }
 for(const r of records)if(!expected.has(r.file))errors.push('Art review has an unexpected file: '+String(r.file));
 return errors;
}

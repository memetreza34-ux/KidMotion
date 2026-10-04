import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const item = args.find((arg) => arg.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : fallback;
};
const topic = getArg('topic');
const requestedId = getArg('id');
const requestedDate = getArg('date', new Date().toISOString().slice(0, 10));
const character = getArg('character', 'boy').toLowerCase() === 'girl' ? 'girl' : 'boy';
if (!topic) {
  console.error('Missing --topic="..."');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
  console.error('Invalid --date. Use YYYY-MM-DD.');
  process.exit(1);
}

const root = process.cwd();
const pipeline = JSON.parse(fs.readFileSync(path.join(root, 'config', 'pipeline.json'), 'utf8'));
const visual = JSON.parse(fs.readFileSync(path.join(root, 'config', 'visual-policy.json'), 'utf8'));
if (visual.status !== 'READY' || !visual.styleId || visual.styleId === 'UNSET') {
  console.error('KidMotion V2 requires a READY visual policy.');
  process.exit(1);
}

const pad = (n) => String(n).padStart(2, '0');
const slugify = (value) => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
const episodesRoot = path.join(root, 'episodes');
fs.mkdirSync(episodesRoot, {recursive:true});
const ids = fs.readdirSync(episodesRoot, {withFileTypes:true}).filter((e) => e.isDirectory() && /^KM-\d{3}-/.test(e.name)).map((e) => Number(e.name.slice(3,6))).filter(Number.isFinite);
const autoNumber = String((ids.length ? Math.max(...ids) : 0) + 1).padStart(3, '0');
const episodeId = /^KM-\d{3}$/.test(requestedId) ? requestedId : `KM-${autoNumber}`;
const slug = slugify(topic) || `episode-${episodeId.slice(3)}`;
const episodeFolder = `${episodeId}-${slug}`;
const episodeRoot = path.join(episodesRoot, episodeFolder);
const revision = `${episodeId.replace('-', '')}-R1`;
if (fs.existsSync(episodeRoot)) throw new Error(`Episode already exists: ${episodeFolder}`);

const write = (relativePath, content) => {
  const target = path.join(episodeRoot, relativePath);
  fs.mkdirSync(path.dirname(target), {recursive:true});
  fs.writeFileSync(target, content, 'utf8');
};
for (const dir of ['00-bildprompts/images','01-voice-script','02-audio','03-export','99-technik']) fs.mkdirSync(path.join(episodeRoot, dir), {recursive:true});

const scenes = [
  {scene:'00',type:'cover',image:'Bild 00.png',duration:0,character,inVideo:false},
  {scene:'01',type:'intro',image:'Bild 01.png',voice:'Voice 01.mp3',duration:8,character},
  {scene:'02',type:'safety',image:'Bild 02.png',duration:4,character},
  {scene:'03',type:'lets-begin',image:'Bild 03.png',duration:2,character},
];
for (let i = 0; i < 12; i += 1) {
  const n = pad(4 + i);
  scenes.push({scene:n,type:'exercise',title:'TBD',instruction:'TBD',image:`Bild ${n}.png`,duration:20,restAfter:i === 11 ? 0 : 5,character,ballCount:null});
}
scenes.push({scene:'16',type:'outro',image:'Bild 16.png',duration:4,character,generatedTextAllowed:true});

const data = {
  schemaVersion:2,
  structureVersion:2,
  id:episodeId,
  date:requestedDate,
  slug,
  theme:slug,
  topic,
  status:'planned',
  visualPolicyFile:'config/visual-policy.json',
  visualStyleId:visual.styleId,
  imagePlanFile:'99-technik/IMAGE_PLAN.json',
  flowPromptFile:'00-bildprompts/google-flow-prompt.txt',
  publicAssetRoot:`public/episodes/${requestedDate}/${episodeFolder}`,
  format:'youtube-longform',aspectRatio:pipeline.aspectRatio,fps:pipeline.fps,width:pipeline.resolution.width,height:pipeline.resolution.height,
  mainCharacter:character,singleCharacterWholeEpisode:true,allowCharacterSwitch:false,allowSecondVisibleCharacter:false,allVideoSectionsUseCharacterImage:true,
  staticPoseOnly:true,singleFrameClarityRequired:true,silhouetteTestRequired:true,maxGoogleFlowAttemptsBeforePoseReplacement:2,
  characterReference:`approved ${episodeId} Bild 01 reference`,exerciseUiReference:`approved ${episodeId} Bild 04 reference for title/instruction style only`,outfitLockedForEpisode:true,worldLockedForEpisode:true,
  imageGenerationRevisionRequired:revision,
  introDuration:8,introTitle:'TBD',introSubtitle:'12 POSES • 20 SEC EACH',introBadge:'KIDMOTION',introExtraInfo:['FOLLOW ALONG'],
  introVoiceText:'TBD — one continuous opening paragraph designed to cover approximately 13.65–14.00 seconds and end before Exercise 1.',voiceScriptFormat:'one continuous copy-ready paragraph',
  safetyDuration:4,letsBeginDuration:2,outroDuration:4,exerciseDuration:20,defaultRestAfter:5,openingDuration:14,
  voicePolicy:{openingSequenceVoiceOnly:true,voiceStartsAtIntro:true,voiceMayContinueAcrossSafety:true,voiceMayContinueAcrossLetsBegin:true,voiceMustEndBeforeFirstExercise:true,exerciseVoice:false,restVoice:false,outroVoice:false,subtitles:false,voiceCaptions:false,openingVoiceTargetSeconds:'13.65-14.00',voiceFile:'Voice 01.mp3'},
  audioPolicy:{backgroundMusicRequiredForFinal:true,backgroundMusicFile:'bg-music.mp3',backgroundMusicLoop:true,backgroundMusicLowDuringOpening:true,backgroundMusicContinuesThroughWorkout:true,noSpokenVoiceAfterOpening:true},
  transitionPolicy:{blankFramesForbidden:true,blackFlashesForbidden:true,whiteFlashesForbidden:true,fullSceneFadeFromZeroForbidden:true,hardCutWithVisibleImageFromFirstFrame:true},
  visibleTextPolicy:{googleFlowOwnsAllNonTimerVisibleText:true,remotionTimerOnly:true,progressBarForbidden:true,restLabelForbidden:true},
  exerciseVisualPolicy:{exerciseNameSource:'GoogleFlowImage',exerciseInstructionSource:'GoogleFlowImage',instructionBubbleSource:'GoogleFlowImage',exerciseNamePosition:'bottom-left',instructionPosition:'top-right',exerciseUiStyleReference:'Bild 04.png',sameUiStyleRequiredAcrossAllExercises:true,thoughtBubbleDotsForbidden:true,timerSafeZoneTopLeftPixels:220,remotionExerciseNameForbidden:true,remotionExerciseInstructionForbidden:true,googleFlowTimerForbidden:true,remotionProgressBarForbidden:true,remotionKenBurnsOnExerciseForbidden:true},
  restVisualPolicy:{blankScreenForbidden:true,reuseNextExerciseImage:true,characterMustRemainVisible:true,remotionTimerOnly:true,remotionRestTextForbidden:true,remotionNextPoseNameForbidden:true,remotionKenBurnsOnRestForbidden:true},
  nonExerciseImagePolicy:{introGeneratedTextAllowed:true,safetyGeneratedTextAllowed:true,letsBeginGeneratedTextAllowed:true,outroGeneratedTextAllowed:true,googleFlowOwnsAllVisibleText:true,remotionTextOverlaysForbidden:true},
  scenes,
  runtimeSeconds:313
};

const generatedTextFor = (scene) => {
  if (scene.type === 'cover') return 'TBD thumbnail title';
  if (scene.type === 'intro') return 'TBD complete intro title/subtitle/badge/follow-along text';
  if (scene.type === 'safety') return 'SAFETY FIRST / Clear some space. / Stop if anything hurts.';
  if (scene.type === 'lets-begin') return "LET'S BEGIN!";
  if (scene.type === 'exercise') return {title:scene.title,instruction:scene.instruction};
  return 'GREAT JOB! / WORKOUT COMPLETE';
};
const imagePlan = {
  schemaVersion:2,episodeFolder,revision,visualStyleId:visual.styleId,
  generationRules:{coverCandidateCount:3,nonCoverAutomaticAlternates:false,regenerationOnlyAfterExplicitRejection:true,maxConcurrentGenerations:5,primaryReference:'Bild 01.png',exerciseUiReference:'Bild 04.png',finalDirectory:'00-bildprompts/images',allNonTimerVisibleTextOwner:'google-flow'},
  images:scenes.map((scene) => ({
    imageNumber:Number(scene.scene),imageFile:scene.image,sceneRole:scene.type,
    visualPurpose:scene.type === 'cover' ? 'Create the strongest mobile-readable YouTube thumbnail.' : 'TBD',
    topicAnchor:topic,
    visualForm:scene.type === 'exercise' ? 'single clear static full-body pose with baked title and instruction' : 'single complete premium 3D frame with all required text baked in',
    characterReference:['00','01'].includes(scene.scene) ? 'KidMotion master identity' : 'approved Bild 01.png',
    uiReference:scene.type === 'exercise' && Number(scene.scene) > 4 ? 'approved Bild 04.png' : null,
    propCount:scene.type === 'exercise' ? scene.ballCount : null,
    generatedText:generatedTextFor(scene),
    safeZones:scene.type === 'exercise' ? ['top-left 220x220 countdown timer zone clear'] : [],
    acceptanceCriteria:['same recurring character where applicable','correct anatomy','no extra people','correct prop count','all required non-timer text already visible and readable','16:9 composition'],
    prompt:'TBD'
  }))
};

const blocks = imagePlan.images.map((item) => `Bild ${pad(item.imageNumber)}\nVisual Purpose: ${item.visualPurpose}\nTopic Anchor: ${item.topicAnchor}\nVisual Form: ${item.visualForm}\nGenerated Text: ${typeof item.generatedText === 'string' ? item.generatedText : JSON.stringify(item.generatedText)}\nSafe Zones: ${item.safeZones.join('; ') || 'none'}\nPrompt: ${item.prompt}\nFinal file: Bild ${pad(item.imageNumber)}.png`);
const flowPrompt = `VISUAL_POLICY_FILE: config/visual-policy.json\nACTIVE_STYLE_ID: ${visual.styleId}\n\nKIDMOTION GOOGLE FLOW MASTER PROMPT — ${episodeId} — ${topic}\n\nALL NON-TIMER VISIBLE TEXT IS GENERATED BY GOOGLE FLOW. Remotion adds ONLY the changing countdown timer number/ring. No Remotion titles, instructions, Intro text, Safety text, LET'S BEGIN text, REST label, Outro text or progress bar.\n\nGenerate exactly THREE temporary Bild 00 candidates and keep one winner as Bild 00.png.\nGenerate and approve Bild 01 first; it becomes the character/world reference.\nGenerate and approve Bild 04 before Bild 05 through Bild 15; it becomes the exercise UI reference.\nEvery accepted image is renamed immediately and stored flat in 00-bildprompts/images/.\n\n${blocks.join('\n\n---\n\n')}\n`;

write('99-technik/episode.json', `${JSON.stringify(data,null,2)}\n`);
write('99-technik/IMAGE_PLAN.json', `${JSON.stringify(imagePlan,null,2)}\n`);
write('99-technik/RENDER_PLAN.json', `${JSON.stringify({schemaVersion:2,staticExerciseImages:true,staticRestImages:true,backgroundMusic:true,remotionOverlay:'countdown-timer-only',progressBar:false,allNonTimerVisibleTextOwner:'google-flow',restUsesNextExerciseImage:true},null,2)}\n`);
write('99-technik/VISUAL_REVIEW.json', `${JSON.stringify({episodeFolder,revision,sameCharacterEveryScene:false,allExercisePosesClearFromOneStill:false,allExerciseTextReadableAndConsistent:false,allExerciseSafeZonesClear:false,propBallCountsCorrect:false,allNonTimerTextGeneratedAndReadable:false,noExtraPeople:false,noAnatomyErrors:false,noCroppingOfImportantLimbs:false,notes:'Set true only after inspecting final images.'},null,2)}\n`);
write('99-technik/status.json', `${JSON.stringify({schemaVersion:2,phase1Ready:false,imagesReady:false,audioReady:false,assetsApproved:false,renderReady:false},null,2)}\n`);
write('99-technik/GENERATION-REVISION.txt', `${revision}\n`);
write('00-bildprompts/google-flow-prompt.txt', flowPrompt);
write('01-voice-script/voice-script.txt', `${data.introVoiceText}\n`);
write('02-audio/README.md', `Required: Voice 01.mp3 (13.65–14.00s opening) and bg-music.mp3. No spoken Voice after the opening.\n`);
write('03-export/UPLOAD_METADATA.md', `# Upload Metadata\n\n## YouTube Title\nTBD\n\n## Description / Caption\nTBD\n`);
write('README.md', `# ${episodeId} — ${topic}\n\nDate: ${requestedDate}\nTheme: ${slug}\nPublic runtime: public/episodes/${requestedDate}/${episodeFolder}/\n\nKidMotion V2. Google Flow owns every visible text element except the countdown timer. Remotion renders the static images, audio and countdown timer only.\n`);
write('ANTIGRAVITY.md', `Read GEHIRN.md first. Fill episode.json, IMAGE_PLAN.json and google-flow-prompt.txt before asset generation. Google Flow creates all non-timer visible text. Remotion adds countdown timer only. Never mark VISUAL_REVIEW true without inspecting final images.\n`);
console.log(`Created KidMotion V2 episode: ${episodeFolder}`);
console.log(`Date: ${requestedDate}`);
console.log(`Theme: ${slug}`);

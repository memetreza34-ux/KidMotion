import fs from 'node:fs';
import path from 'node:path';
import {loadContract, expectedSceneSpecs, sceneFile, padScene} from './contract.mjs';
import {requireReviewsBeforeNewEpisode,createImprovementBrief,policyKey} from './continuous-improvement-lib.mjs';

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const item = args.find((arg) => arg.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : fallback;
};

const topic = getArg('topic');
const requestedId = getArg('id');
const requestedDate = getArg('date', new Date().toISOString().slice(0, 10));
const character = getArg('character', 'boy').toLowerCase() === 'girl' ? 'girl' : 'boy';
const contentFormat = getArg('content-format', 'workout').toLowerCase();
if (!['workout','learn-and-move'].includes(contentFormat)) {
  console.error('Workout generator accepts content-format workout or learn-and-move only.');
  process.exit(1);
}
if (!topic) {
  console.error('Missing --topic="..."');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
  console.error('Invalid --date. Use YYYY-MM-DD.');
  process.exit(1);
}

const root = process.cwd();
requireReviewsBeforeNewEpisode(root);
const contract = loadContract(root);
const pipeline = JSON.parse(fs.readFileSync(path.join(root,'config','pipeline.json'),'utf8'));
const visual = JSON.parse(fs.readFileSync(path.join(root,'config','visual-policy.json'),'utf8'));
if (visual.status !== 'READY' || !visual.styleId) throw new Error('KidMotion requires a READY visual policy.');

const slugify = (value) => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,64);
const episodesRoot = path.join(root,'episodes');
fs.mkdirSync(episodesRoot,{recursive:true});
const ids = fs.readdirSync(episodesRoot,{withFileTypes:true})
  .filter((e)=>e.isDirectory() && /^KM-\d{3}-/.test(e.name))
  .map((e)=>Number(e.name.slice(3,6))).filter(Number.isFinite);
const autoNumber = String((ids.length ? Math.max(...ids) : 0) + 1).padStart(3,'0');
const episodeId = /^KM-\d{3}$/.test(requestedId) ? requestedId : `KM-${autoNumber}`;
const slug = slugify(topic) || `episode-${episodeId.slice(3)}`;
const episodeFolder = `${episodeId}-${slug}`;
const episodeRoot = path.join(episodesRoot,episodeFolder);
if (fs.existsSync(episodeRoot)) throw new Error(`Episode already exists: ${episodeFolder}`);
const revision = `${episodeId.replace('-','')}-R1`;
const placeholder = (label) => `__PLAN_REQUIRED__ ${label}`;

const write = (rel, content) => {
  const target = path.join(episodeRoot,rel);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,content,'utf8');
};
for (const dir of ['00-bildprompts/images','01-voice-script','02-audio','03-export','99-technik']) fs.mkdirSync(path.join(episodeRoot,dir),{recursive:true});

const specs = expectedSceneSpecs(contract);
const exerciseTitleByScene = new Map();
const scenes = [];
for (const spec of specs) {
  const scene = padScene(spec.scene);
  if (spec.type === 'cover') {
    scenes.push({scene,type:'cover',image:sceneFile(spec.scene),duration:0,character,inVideo:false});
  } else if (spec.type === 'intro') {
    scenes.push({scene,type:'intro',image:sceneFile(spec.scene),voice:contract.voiceContract.voiceFile,duration:spec.duration,character});
  } else if (spec.type === 'exercise') {
    const title = placeholder(`EXERCISE ${spec.exerciseIndex} TITLE`);
    exerciseTitleByScene.set(spec.scene,title);
    scenes.push({scene,type:'exercise',title,instruction:placeholder(`EXERCISE ${spec.exerciseIndex} INSTRUCTION`),poseDescription:placeholder(`EXERCISE ${spec.exerciseIndex} POSE`),worldZone:placeholder(`EXERCISE ${spec.exerciseIndex} WORLD ZONE`),image:sceneFile(spec.scene),duration:spec.duration,character,ballCount:0});
  } else if (spec.type === 'get-ready') {
    scenes.push({scene,type:'get-ready',image:sceneFile(spec.scene),duration:spec.duration,character,afterExerciseScene:padScene(spec.afterExerciseScene),nextExerciseTitle:placeholder(`NEXT EXERCISE AFTER SZENE ${padScene(spec.afterExerciseScene)}`),generatedText:placeholder(`GET READY TEXT SZENE ${scene}`),worldZone:placeholder(`GET READY WORLD ZONE SZENE ${scene}`)});
  } else {
    scenes.push({scene,type:spec.type,image:sceneFile(spec.scene),duration:spec.duration,character});
  }
}

const data = {
  schemaVersion:3,
  structureVersion:contract.structureVersion,
  productionContractVersion:contract.contractVersion,
  contractFile:'config/v3-contract.json',
  contentFormat,
  qualityLearningPolicy:policyKey,
  compactPromptPolicy:'v2-short',
  sceneNumberingPolicy:'explicit-v1',
  visualComplexityPolicy:'grounded-simple-workout',
  kidFriendlyVisualPolicy:'warm-playful-v1',
  artDirectionPolicy:'storyworld-v1',
  formatContractFile:contentFormat === 'learn-and-move' ? 'config/formats/learn-and-move.json' : 'config/formats/workout.json',
  learningObjective:contentFormat === 'learn-and-move' ? placeholder('LEARNING OBJECTIVE') : undefined,
  id:episodeId,
  date:requestedDate,
  day:new Date(`${requestedDate}T12:00:00Z`).toLocaleDateString('en-US',{weekday:'long',timeZone:'UTC'}),
  slug,theme:slug,topic,status:'planning-required',promptSpecVersion:contract.promptContract.currentPromptSpecVersion,
  visualPolicyFile:'config/visual-policy.json',visualStyleId:visual.styleId,
  imagePlanFile:'99-technik/IMAGE_PLAN.json',flowPromptFile:'00-bildprompts/google-flow-prompt.txt',
  voiceScriptFile:'01-voice-script/voice-script.txt',voicePlanFile:'99-technik/VOICE_PLAN.json',
  coverSelectionFile:'99-technik/COVER_SELECTION.json',
  publicAssetRoot:`public/episodes/${requestedDate}/${episodeFolder}`,
  format:'youtube-longform',aspectRatio:pipeline.aspectRatio,fps:pipeline.fps,width:pipeline.resolution.width,height:pipeline.resolution.height,
  characterPolicy:{species:'human',style:'stylized animated human '+character,fullyClothed:true,oneHumanOnly:true,noRobotCharacters:true,noAnimalCharacters:true,coverHumanReviewRequired:true,coverHumanReviewFile:'99-technik/COVER_HUMAN_REVIEW.json'},
  mainCharacter:character,singleCharacterWholeEpisode:true,allowCharacterSwitch:false,allowSecondVisibleCharacter:false,allVideoSectionsUseCharacterImage:true,
  staticPoseOnly:true,singleFrameClarityRequired:true,silhouetteTestRequired:true,poseDiversityRequired:true,
  characterReference:`selected ${episodeId} Szene 01 cover reference ONLY`,soleImageReference:'Szene 01.png',secondaryImageReferencesForbidden:true,
  eachNonCoverSceneGeneratedExactlyOnce:true,maximumGenerationAttemptsPerNonCoverScene:1,regenerationForbidden:true,
  imageGenerationRevisionRequired:revision,
  coverPolicy:{humanCoverReviewRequired:true,humanReviewFile:'99-technik/COVER_HUMAN_REVIEW.json',generateCandidatesFirst:3,candidateFiles:contract.coverContract.candidateFiles,waitForExplicitUserSelection:true,winnerFinalFile:'Szene 01.png',selectedCoverIsSoleReference:true,noLaterSceneGenerationBeforeSelection:true,deleteRejectedCandidatesAfterSelection:true},
  imageBatchPolicy:{enabled:true,batchSize:5,showBatchToUser:false,waitForExplicitUserContinue:false,autoContinueToNextBatch:true,deliverCompletedFolderAtEnd:true,batches:pipeline.batchGenerationPolicy.batches,soleReferenceEveryBatch:'Szene 01.png',secondaryImageReferencesForbidden:true,generateEachSceneExactlyOnce:true},
  introVisualPolicy:'greeting-only-v1',coverInVideo:false,introDuration:8,introTitle:placeholder('INTRO TITLE'),introSubtitle:placeholder('INTRO SUBTITLE'),introBadge:'KIDMOTION',introExtraInfo:['FOLLOW ALONG'],
  introVoiceText:placeholder('EXACT CONTINUOUS TTS COPY'),voiceScriptFormat:'plain continuous text only',
  safetyDuration:4,letsBeginDuration:2,outroDuration:4,exerciseDuration:20,getReadyDuration:5,openingDuration:14,
  voicePolicy:{openingSequenceVoiceOnly:true,voiceStartsAtIntro:true,voiceMayContinueAcrossSafety:true,voiceMayContinueAcrossLetsBegin:true,voiceMustEndBeforeFirstExercise:true,exerciseVoice:false,restVoice:false,outroVoice:false,subtitles:false,voiceCaptions:false,openingVoiceTargetSeconds:'13.65-14.00',voiceFile:'Voice 01.mp3'},
  audioPolicy:{backgroundMusicRequiredForFinal:true,backgroundMusicFile:'bg-music.mp3',backgroundMusicLoop:true,backgroundMusicLowDuringOpening:true,backgroundMusicContinuesThroughWorkout:true,noSpokenVoiceAfterOpening:true,musicBriefFile:'02-audio/MUSIC_BRIEF.md'},
  transitionPolicy:{blankFramesForbidden:true,blackFlashesForbidden:true,whiteFlashesForbidden:true,fullSceneFadeFromZeroForbidden:true,hardCutWithVisibleImageFromFirstFrame:true},
  visibleTextPolicy:{googleFlowOwnsAllNonTimerVisibleText:true,remotionTimerOnly:true,progressBarForbidden:true,restLabelForbidden:true},
  exerciseVisualPolicy:{exerciseNameSource:'GoogleFlowImage',exerciseInstructionSource:'GoogleFlowImage',instructionBubbleSource:'GoogleFlowImage',exerciseNamePosition:'bottom-left',instructionPosition:'top-right',exerciseUiStyleSource:'prompt-defined layout only',sameUiStyleRequiredAcrossAllExercises:true,timerSafeZoneTopLeftPixels:230,remotionExerciseNameForbidden:true,remotionExerciseInstructionForbidden:true,googleFlowTimerForbidden:true,remotionProgressBarForbidden:true,remotionKenBurnsOnExerciseForbidden:true},
  restVisualPolicy:{blankScreenForbidden:true,dedicatedGetReadyImageRequired:true,reuseNextExerciseImage:false,characterMustRemainVisible:true,remotionTimerOnly:true,googleFlowOwnsGetReadyText:true,remotionRestTextForbidden:true,remotionNextPoseNameForbidden:true,remotionKenBurnsOnRestForbidden:true},
  nonExerciseImagePolicy:{introGeneratedTextAllowed:true,safetyGeneratedTextAllowed:true,letsBeginGeneratedTextAllowed:true,outroGeneratedTextAllowed:true,googleFlowOwnsAllVisibleText:true,remotionTextOverlaysForbidden:true},
  scenes,runtimeSeconds:contract.sceneContract.runtimeSeconds
};

const imagePlan = {
  schemaVersion:3,productionContractVersion:contract.contractVersion,promptSpecVersion:contract.promptContract.currentPromptSpecVersion,episodeFolder,revision,visualStyleId:visual.styleId,
  generationRules:{artDirectionPolicy:'storyworld-v1',kidFriendlyVisualPolicy:'warm-playful-v1',visualWarmthReviewRequired:true,sceneNumberingPolicy:'explicit-v1',sceneIdsMustMatchFileNames:true,sceneNumbersAreNotVisibleText:true,useDownloadSaveCommand:true,saveCommandTemplate:`npm run flow:save -- --episode=${episodeFolder} --scene=<NN> --source=<real-downloaded-png>`,characterSpecies:'human',nonHumanMascotsForbidden:true,coverHumanReviewRequiredBeforeSelection:true,coverHumanReviewFile:'99-technik/COVER_HUMAN_REVIEW.json',coverCandidateCount:3,coverCandidateFiles:contract.coverContract.candidateFiles,coverSelectionFile:'99-technik/COVER_SELECTION.json',stopAfterCoverCandidatesUntilExplicitUserSelection:true,selectedCoverFinalFile:'Szene 01.png',selectedCoverBecomesSoleReference:true,batchSizeAfterCover:5,autoContinueToNextBatch:true,generationBatches:pipeline.batchGenerationPolicy.batches,generateEachNonCoverSceneExactlyOnce:true,maximumGenerationAttemptsPerNonCoverScene:1,regenerationForbidden:true,automaticAlternatesForbidden:true,soleReference:'Szene 01.png',secondaryImageReferencesForbidden:true,finalDirectory:'00-bildprompts/images',allFinalScenesInOneFolder:true,sceneFilePattern:'Szene NN.png',firstFinalScene:1,lastFinalScene:28,dedicatedGetReadyScenes:true,getReadySceneCount:11,allNonTimerVisibleTextOwner:'google-flow'},
  images:scenes.map((scene,index)=>({sceneNumber:index+1,imageFile:scene.image,flowSceneId:index===0?null:padScene(index+1),downloadedFileMustBeSavedAs:scene.image,sceneRole:scene.type,visualPurpose:placeholder(`SZENE ${scene.scene} VISUAL PURPOSE`),topicAnchor:topic,visualForm:placeholder(`SZENE ${scene.scene} VISUAL FORM`),characterReference:scene.type==='cover'?'three-cover candidate stage':'selected Szene 01.png ONLY',uiReference:null,generationAttemptsAllowed:scene.type==='cover'?3:1,propCount:0,generatedText:placeholder(`SZENE ${scene.scene} GENERATED TEXT`),safeZones:['exercise','get-ready'].includes(scene.type)?['top-left 230x230 countdown timer zone clear']:[],acceptanceCriteria:['one clearly HUMAN animated boy or girl, not a robot or animal','same selected character identity and outfit','correct scene role','natural anatomy','no extra people','16:9 composition','no generated countdown timer or progress bar','storyworld-v1: grounded child-size place, action-linked play detail, natural expression, no generic towers'],prompt:placeholder(`SZENE ${scene.scene} FINAL GOOGLE FLOW PROMPT`)}))
};

// Short scene-specific sentences only. Global style lives in config/visual-policy.json.
const coverPromptScaffold=(n)=>`COVER_ID: 0${n} | OUTPUT_FILE: Cover-Kandidat-0${n}.png | ID is file metadata ONLY.\nCLICK IDEA:
${placeholder(`COVER 0${n} CLICK IDEA`)}

SHOT / COMPOSITION:
${placeholder(`COVER 0${n} SHOT COMPOSITION`)}

CHARACTER:
One original fictional fully clothed stylized 3D HUMAN ${character} athlete with natural human face, hair, hands and legs. ${placeholder(`COVER 0${n} HUMAN OUTFIT`)}

WORLD:
${placeholder(`COVER 0${n} GROUNDED WORLD / SAFE PHYSICAL LOCATION`)}

PLAY DETAIL / STORY BEAT:
${placeholder(`COVER 0${n} CONCRETE UNIQUE STORY ELEMENT`)}

WARMTH / MOOD:
Warm genuine smile, happy sunny colors and one small meaningful playful detail. ${placeholder(`COVER 0${n} UNIQUE FRIENDLY FEEL`)}

TEXT:
${placeholder(`COVER 0${n} TEXT`)}

LIGHT / MATERIALS:
${placeholder(`COVER 0${n} LIGHT MATERIALS`)}

NEGATIVE / STABILITY:
No robot, fox, animal or anthropomorphic mascot as character. ${placeholder(`COVER 0${n} OTHER NEGATIVES`)}

QUALITY CHECK:
${placeholder(`COVER 0${n} QUALITY CHECK`)}

OUTPUT:
16:9 landscape, Cover-Kandidat-0${n}.png`;

const scenePromptScaffold=(n)=>`SCENE_ID: ${padScene(n)} | OUTPUT_FILE: ${sceneFile(n)} | ID is file metadata ONLY; do not draw scene numbers.\nVIEWER TAKEAWAY:
${placeholder(`SZENE ${padScene(n)} VIEWER TAKEAWAY`)}

REFERENCE USE:
Use selected Szene 01.png as the ONLY image reference for mascot/outfit/style; do not copy the cover pose, camera or composition.

SHOT / COMPOSITION:
${placeholder(`SZENE ${padScene(n)} SHOT COMPOSITION`)}

CHARACTER / POSE:
One fully clothed stylized animated HUMAN ${character} athlete. ${placeholder(`SZENE ${padScene(n)} HUMAN POSE`)}

WORLD / ENVIRONMENT:
${placeholder(`SZENE ${padScene(n)} GROUNDED HUMAN SCALE WORLD ENVIRONMENT`)}

PLAY DETAIL / STORY BEAT:
${placeholder(`SZENE ${padScene(n)} UNIQUE PURPOSEFUL PHYSICAL PLAY DETAIL`)}

WARMTH / MOOD:
Friendly natural expression, warm sunlight, one playful relevant accent; never sterile or abstract. ${placeholder(`SZENE ${padScene(n)} UNIQUE KID-FRIENDLY FEEL`)}

TEXT / UI:
${n===2?'Only a small friendly HELLO! greeting; NO cover-style title screen, episode name or large promotional text.':placeholder(`SZENE ${padScene(n)} TEXT UI`)}

LIGHT / MATERIALS:
${placeholder(`SZENE ${padScene(n)} LIGHT MATERIALS`)}

NEGATIVE / STABILITY:
No robot, fox, animal or anthropomorphic mascot as character. ${placeholder(`SZENE ${padScene(n)} OTHER NEGATIVES`)}

QUALITY CHECK:
${placeholder(`SZENE ${padScene(n)} QUALITY CHECK`)}

OUTPUT:
16:9 landscape, ${sceneFile(n)}`;

let prompt = `KIDMOTION GOOGLE FLOW MASTER — ${episodeId} — ${topic}\n\nPROMPT SPEC: v${contract.promptContract.currentPromptSpecVersion}\nSHORT PROMPTS: max 1500 chars per scene. New storyworld-v1 rules in ART_DIRECTION.md: child-scale real activity location, one unique physical play/story detail and action-specific natural human emotion; no sterile pastel empty plazas, bizarre towers, recurring identical CGI courts or huge signs. Scene IDs are metadata only.\nSTATUS: PLANNING REQUIRED. DO NOT OPEN GOOGLE FLOW UNTIL npm run prompt:qa -- --episode=${episodeFolder} PASSES.\nSAVE EACH DOWNLOADED IMAGE: npm run flow:save -- --episode=${episodeFolder} --scene=<NN> --source=<real-download.png> (for cover use --cover=<1|2|3>). AFTER COVER SELECTION: run npm run flow:batch -- --episode=${episodeFolder} before every 5-scene production step.\n\n`;
for (let n=1;n<=3;n+=1) prompt += `COVER CANDIDATE 0${n} — Cover-Kandidat-0${n}.png\nFINAL GOOGLE FLOW PROMPT:\n${coverPromptScaffold(n)}\n\n`;
for (let n=2;n<=28;n+=1) prompt += `SZENE ${padScene(n)} — ${sceneFile(n)}\nFINAL GOOGLE FLOW PROMPT:\n${scenePromptScaffold(n)}\n\n`;

const voicePlan={schemaVersion:1,productionContractVersion:contract.contractVersion,episodeFolder,voiceFile:'Voice 01.mp3',targetDurationSeconds:{min:13.65,target:13.9,max:14.05},startsAtSeconds:0,mustEndBeforeSeconds:14.05,noSpokenVoiceAfterSeconds:14,sections:contract.voiceContract.sections.map((s)=>({...s,text:placeholder(`${s.label} VOICE`)})),exactTtsCopy:placeholder('EXACT CONTINUOUS TTS COPY'),note:'Timecodes are production targets, not subtitles.'};
const voiceScript=`${placeholder('EXACT CONTINUOUS TTS COPY')}\n`;

write('99-technik/episode.json',JSON.stringify(data,null,2)+'\n');
write('99-technik/IMAGE_PLAN.json',JSON.stringify(imagePlan,null,2)+'\n');
write('99-technik/RENDER_PLAN.json',JSON.stringify({schemaVersion:3,productionContractVersion:contract.contractVersion,episodeFolder,runtimeSeconds:313,coverOutsideVideo:true,coverSelectionRequiredBeforeLaterScenes:true,soleVisualReference:'Szene 01.png',secondaryImageReferencesForbidden:true,generateEachNonCoverSceneExactlyOnce:true,maximumGenerationAttemptsPerNonCoverScene:1,regenerationForbidden:true,sceneCount:28,exerciseCount:12,getReadyCount:11,exerciseSeconds:20,getReadySeconds:5,imageGenerationBatchSize:5,waitForUserBetweenImageBatches:false,autoContinueImageBatches:true,deliverCompletedImageFolderAtEnd:true,staticExerciseImages:true,staticGetReadyImages:true,backgroundMusic:true,remotionOverlay:'countdown-timer-only',progressBar:false,allNonTimerVisibleTextOwner:'google-flow',restUsesDedicatedGetReadyImage:true,restReusesNextExerciseImage:false},null,2)+'\n');
write('99-technik/COVER_HUMAN_REVIEW.json',JSON.stringify({schemaVersion:1,episodeFolder,status:'PENDING_REAL_IMAGE_REVIEW',reviewedAt:null,note:'After generating actual PNGs, visually verify each human candidate and compute real SHA256. Never approve from prompt alone.',candidates:[1,2,3].map(n=>({candidate:n,file:'Cover-Kandidat-0'+n+'.png',humanVisible:false,fullyClothed:false,noRobotOrAnimalMascot:false,warmChildFriendly:false,clearConcreteEnvironment:false,notDisturbing:false,notSterile:false,actualImageInspected:false,sha256:null,status:'PENDING'}))},null,2)+'\n');
write('99-technik/COVER_SELECTION.json',JSON.stringify({schemaVersion:1,productionContractVersion:contract.contractVersion,episodeFolder,status:'AWAITING_USER_SELECTION',selectedCandidate:null,selectedCandidateOriginalFile:null,finalFile:null,userSelectionRequired:true,soleReferenceForLaterScenes:'Szene 01.png',secondaryImageReferencesForbidden:true},null,2)+'\n');
write('99-technik/VISUAL_REVIEW.json',JSON.stringify({episodeFolder,revision,sameCharacterEveryScene:false,allWorkoutImagesWarmAndInviting:false,allWorkoutImagesConcreteAndChildReadable:false,noSterileOrDisturbingWorkoutVisuals:false,humanCharacterConfirmedEveryScene:false,noNonHumanMascotInWorkoutScenes:false,allExercisePosesClearFromOneStill:false,poseVarietyStrong:false,allGetReadyImagesClearAndNotConfusableWithExercise:false,allExerciseTextReadableAndConsistent:false,allExerciseSafeZonesClear:false,propBallCountsCorrect:false,allNonTimerTextGeneratedAndReadable:false,noExtraPeople:false,noAnatomyErrors:false,noCroppingOfImportantLimbs:false,sceneOrderMatchesPlan:false,noMissingOrDuplicateSceneContent:false,eachSceneMatchesItsPromptRole:false,openingVisualTimingMatchesVoice:false,notes:'Set true only after inspecting real final images and rendered MP4.'},null,2)+'\n');
write('99-technik/ART_DIRECTION_REVIEW.json',JSON.stringify({schemaVersion:1,artDirectionPolicy:'storyworld-v1',episodeFolder,revision,status:'PENDING_REAL_IMAGE_REVIEW',instructions:'Review each real final PNG, record actual SHA256 and specific observable notes. Never approve from a prompt.',scenes:scenes.map(s=>({scene:s.scene,file:s.image,imageSha256:null,actuallyInspected:false,engagingCharacterExpression:false,groundedHumanScaleEnvironment:false,purposefulVisiblePlayDetail:false,cohesiveStoryWorld:false,clearCompositionAndPose:false,noGenericAICGIOrOddArchitecture:false,notes:''}))},null,2)+'\n');
write('99-technik/PHASE2_FLOW_RUNBOOK.md',[
  '# PHASE 2 — '+episodeFolder,
  '',
  'Use Google Flow to generate real files. Cover (Szene 01) is THUMBNAIL ONLY; Szene 02 is a small HELLO greeting and not a duplicate cover.',
  'Create and inspect 3 real covers first. Wait for explicit user selection, then run:',
  'npm run kidmotion:select-cover -- --episode='+episodeFolder+' --candidate=<1|2|3>',
  'Example for candidate 2: npm run kidmotion:select-cover -- --episode='+episodeFolder+' --candidate=2',
  '',
  'Run npm run flow:batch -- --episode='+episodeFolder+' for each strict 5-scene block.',
  'After EACH real Flow image, immediately rename/move with npm run flow:save -- --episode='+episodeFolder+' --scene=N --source=<real-downloaded-png>.',
  'Then run npm run flow:verify -- --episode='+episodeFolder+' to check each actual file. The active missing queue is 99-technik/FLOW_RETRY_MISSING.json.',
  'If Flow returned NO real image, retry only that missing scene with the original prompt. For an earlier missing scene use flow:save --repair=1. NEVER overwrite an existing scene, invent an image or shift numbers.',
  'After the last batch run npm run phase2:finalize -- --episode='+episodeFolder+'. Repair only genuinely missing images in 99-technik/PHASE2_MISSING_SCENES.json and audit again.',
  'Only 28 actual valid PNG images, PHASE2_HANDOFF.json and honest visual QA enable approval and Phase 3.',
  'If Flow fails 3 times on one scene, stop with an exact blocker and keep the missing queue. Do not claim finished pictures.',
].join('\n')+'\n');
write('99-technik/VOICE_PLAN.json',JSON.stringify(voicePlan,null,2)+'\n');
write('99-technik/GENERATION-REVISION.txt',revision+'\n');
write('99-technik/status.json',JSON.stringify({schemaVersion:3,productionContractVersion:contract.contractVersion,status:'planning-required',promptPlanReady:false,coverSelectionPending:true,coverSelected:false,imagesReady:false,audioReady:false,assetsApproved:false,renderReady:false},null,2)+'\n');
write('00-bildprompts/google-flow-prompt.txt',prompt);
write('01-voice-script/voice-script.txt',voiceScript);
write('02-audio/README.md','Final runtime needs Voice 01.mp3 + bg-music.mp3. A Phase 2 handoff may also provide voice/music in MP4/M4A/WAV/AAC; phase3:prepare must normalize unambiguous audio automatically. No spoken voice after 14s.\n');
write('02-audio/MUSIC_BRIEF.md','# Music brief\n\nUpbeat playful kids-fitness electro-pop instrumental, 120–130 BPM, no vocals, no dark/aggressive mood, no nursery-song feel. Commercial YouTube license required. Lower under opening voice, more energetic after 14s.\n');
write('03-export/UPLOAD_METADATA.md','# Upload Metadata\n\n## YouTube Title\n__PLAN_REQUIRED__ TITLE\n\n## Description / Caption\n__PLAN_REQUIRED__ DESCRIPTION\n');
write('99-technik/README.md',`# ${episodeId} — ${topic}\n\nStatus: planning-required. Complete episode.json, IMAGE_PLAN.json, VOICE_PLAN.json, voice-script.txt, google-flow-prompt.txt and upload metadata. Each final Flow prompt must be brief, specific and use the compact v2-short length limits. Then run prompt:qa. After cover selection use flow:batch before every hard 5-scene production step.\n`);
write('99-technik/ANTIGRAVITY.md',`# ANTIGRAVITY — PHASE 3 ONLY

ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true

This file applies only to Phase 3 for ${episodeFolder}.

Phase 2 must already have delivered and approved all final images in 00-bildprompts/images/.

When the user hands over Phase 2 files, first run:
npm run phase3:prepare -- --episode=${episodeFolder}

phase3:prepare is the raw-handoff entry point. It must automatically:
- discover/extract provided ZIP assets
- place deterministic numbered PNG scenes without changing pixels
- reconstruct final cover metadata when Szene 01.png is already supplied
- extract/transcode provided audio/video containers such as MP4/M4A/WAV/AAC into the required MP3 files when the role is unambiguous
- run scene integrity QA

Do NOT run phase3:gate first on a raw handoff.

After phase3:prepare succeeds, Antigravity must inspect the actual images itself and update VISUAL_REVIEW.json truthfully. Then run assets:approve, activate the episode, phase3:gate, and render:safe.

Antigravity MUST NOT:
- call Google Flow or any image generator in Phase 3
- generate/regenerate cover or scene images
- alter image pixels or visual content
- invent fallback/replacement images
- guess an ambiguous scene order

The user must not be sent back to manually unzip, rename deterministic files, or convert a technically readable audio container when Antigravity can do it safely.

Allowed Phase 3 work: technical ingest, real visual review, approval, assembly, approved audio, permitted Remotion timer, render and postrender QA.
`);

createImprovementBrief({root,episodeFolder,format:contentFormat});
console.log(`Created KidMotion contract-v${contract.contractVersion} draft: ${episodeFolder}`);
console.log('Status: planning-required. Flow is blocked until prompt:qa passes.');

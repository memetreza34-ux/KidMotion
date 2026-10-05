import fs from 'node:fs';
import path from 'node:path';
import {resolveEpisodePaths, readEpisodeData} from './episode-paths.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const episodeArg = args.find((arg) => arg.startsWith('--episode='));
let episodeFolder = episodeArg ? episodeArg.slice('--episode='.length) : '';

if (!episodeFolder) {
  const pointerPath = path.join(root, 'episodes', 'ACTIVE_EPISODE.json');
  if (fs.existsSync(pointerPath)) {
    episodeFolder = JSON.parse(fs.readFileSync(pointerPath, 'utf8')).episodeFolder || '';
  }
}

if (!episodeFolder) {
  console.error('PROMPT PLAN QA FAILED: pass --episode=<episode-folder> before Flow generation.');
  process.exit(1);
}

const paths = resolveEpisodePaths(root, episodeFolder);
if (!paths.isV2) {
  console.error(`PROMPT PLAN QA FAILED: ${episodeFolder} is not a modern KidMotion episode.`);
  process.exit(1);
}

const failures = [];
const fail = (message) => failures.push(message);
const data = readEpisodeData(paths);

if (!fs.existsSync(paths.imagePlanPath)) fail('Missing 99-technik/IMAGE_PLAN.json.');
if (!fs.existsSync(paths.promptPath)) fail('Missing 00-bildprompts/google-flow-prompt.txt.');

let plan = null;
let prompt = '';
if (fs.existsSync(paths.imagePlanPath)) plan = JSON.parse(fs.readFileSync(paths.imagePlanPath, 'utf8'));
if (fs.existsSync(paths.promptPath)) prompt = fs.readFileSync(paths.promptPath, 'utf8');

const hasPlaceholder = (value) => /\bTBD\b|__PLAN_REQUIRED__|PLACEHOLDER/i.test(String(value ?? ''));
if (hasPlaceholder(JSON.stringify(data))) fail('episode.json still contains unresolved planning placeholders.');
if (plan && hasPlaceholder(JSON.stringify(plan))) fail('IMAGE_PLAN.json still contains unresolved planning placeholders.');
if (hasPlaceholder(prompt)) fail('google-flow-prompt.txt still contains unresolved planning placeholders.');

const scenes = Array.isArray(data.scenes) ? data.scenes : [];
if (scenes.length !== 28) fail(`Expected exactly 28 scene records, found ${scenes.length}.`);

for (let i = 0; i < scenes.length; i += 1) {
  const scene = scenes[i];
  const number = String(i + 1).padStart(2, '0');
  const expectedImage = `Szene ${number}.png`;
  if (scene.image !== expectedImage) fail(`Scene ${number} must map to ${expectedImage}.`);
  if (scene.type === 'exercise') {
    if (!String(scene.title || '').trim() || hasPlaceholder(scene.title)) fail(`Scene ${number} exercise title is unresolved.`);
    if (!String(scene.instruction || '').trim() || hasPlaceholder(scene.instruction)) fail(`Scene ${number} exercise instruction is unresolved.`);
  }
  if (scene.type === 'get-ready') {
    if (!String(scene.nextExerciseTitle || '').trim() || hasPlaceholder(scene.nextExerciseTitle)) fail(`Scene ${number} NEXT target is unresolved.`);
  }
}

if (plan) {
  const images = Array.isArray(plan.images) ? plan.images : [];
  if (images.length !== 28) fail(`IMAGE_PLAN must contain 28 images, found ${images.length}.`);
  if (plan.generationRules?.soleReference !== 'Szene 01.png') fail('IMAGE_PLAN must define Szene 01.png as soleReference.');
  if (plan.generationRules?.secondaryImageReferencesForbidden !== true) fail('IMAGE_PLAN must forbid secondary image references.');
  if (plan.generationRules?.generateEachNonCoverSceneExactlyOnce !== true) fail('IMAGE_PLAN must require exactly one generation for every later scene.');
  if (plan.generationRules?.maximumGenerationAttemptsPerNonCoverScene !== 1) fail('IMAGE_PLAN must allow only one generation attempt per later scene.');

  for (let i = 0; i < images.length; i += 1) {
    const item = images[i];
    const number = String(i + 1).padStart(2, '0');
    const expectedImage = `Szene ${number}.png`;
    if (item.imageFile !== expectedImage) fail(`IMAGE_PLAN item ${number} must be ${expectedImage}.`);
    for (const field of ['visualPurpose', 'topicAnchor', 'visualForm', 'prompt']) {
      if (!String(item[field] ?? '').trim() || hasPlaceholder(item[field])) fail(`${expectedImage} has unresolved ${field}.`);
    }
    if (i > 0) {
      if (item.characterReference !== 'selected Szene 01.png ONLY') fail(`${expectedImage} must use selected Szene 01.png ONLY.`);
      if (item.uiReference !== null) fail(`${expectedImage} must not use a second image/UI reference.`);
      if (item.generationAttemptsAllowed !== 1) fail(`${expectedImage} must allow exactly one generation.`);
    }
  }
}

if (prompt) {
  for (const n of [1, 2, 3]) {
    if (!prompt.includes(`COVER CANDIDATE 0${n}`)) fail(`Missing full Cover Candidate 0${n} prompt block.`);
  }
  for (let i = 2; i <= 28; i += 1) {
    const number = String(i).padStart(2, '0');
    if (!prompt.includes(`SZENE ${number}`)) fail(`Missing Szene ${number} prompt block.`);
  }
  const finalPromptCount = (prompt.match(/FINAL GOOGLE FLOW PROMPT:/g) || []).length;
  if (finalPromptCount !== 30) fail(`Expected exactly 30 FINAL GOOGLE FLOW PROMPT blocks, found ${finalPromptCount}.`);

  if (!prompt.includes('Szene 01.png') || !prompt.includes('ONLY image reference')) {
    fail('Flow prompt must state that Szene 01.png is the only later-scene image reference.');
  }

  for (const scene of scenes) {
    if (scene.type === 'exercise') {
      if (!prompt.includes(scene.title)) fail(`Flow prompt is missing exercise title: ${scene.title}.`);
      if (!prompt.includes(scene.instruction)) fail(`Flow prompt is missing exercise instruction: ${scene.instruction}.`);
    }
    if (scene.type === 'get-ready' && !prompt.includes(`NEXT: ${scene.nextExerciseTitle}`)) {
      fail(`Flow prompt is missing GET READY target: ${scene.nextExerciseTitle}.`);
    }
  }
}

if (failures.length) {
  console.error(`PROMPT PLAN QA FAILED — ${episodeFolder}`);
  failures.forEach((message, index) => console.error(`${index + 1}. ${message}`));
  process.exit(1);
}

console.log(`PROMPT PLAN QA PASSED — ${episodeFolder}`);
console.log('Validated: 3 cover prompts, Szene 02–28 prompts, no placeholders, scene order, exercise text, GET READY targets, sole reference and one-generation policy.');

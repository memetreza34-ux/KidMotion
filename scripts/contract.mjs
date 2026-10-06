import fs from 'node:fs';
import path from 'node:path';

export const CONTRACT_PATH = 'config/v3-contract.json';

export function loadContract(root = process.cwd()) {
  const file = path.join(root, CONTRACT_PATH);
  if (!fs.existsSync(file)) throw new Error(`Missing production contract: ${CONTRACT_PATH}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export const padScene = (n) => String(n).padStart(2, '0');
export const sceneFile = (n) => `Szene ${padScene(n)}.png`;

export function hasPlanningPlaceholder(value) {
  return /\bTBD\b|__PLAN_REQUIRED__|PLACEHOLDER/i.test(String(value ?? ''));
}

export function expectedSceneSpecs(contract) {
  const c = contract.sceneContract;
  const specs = [
    {...c.cover},
    {...c.intro},
    {...c.safety},
    {...c.letsBegin},
  ];
  for (let i = 0; i < c.exerciseSceneNumbers.length; i += 1) {
    specs.push({scene:c.exerciseSceneNumbers[i],type:'exercise',duration:c.exerciseDuration,exerciseIndex:i + 1});
    if (i < c.getReadySceneNumbers.length) {
      specs.push({scene:c.getReadySceneNumbers[i],type:'get-ready',duration:c.getReadyDuration,afterExerciseScene:c.exerciseSceneNumbers[i],nextExerciseScene:c.exerciseSceneNumbers[i + 1]});
    }
  }
  specs.push({...c.outro});
  return specs.sort((a,b) => Number(a.scene) - Number(b.scene));
}

export function currentContractErrors(data, contract) {
  const errors = [];
  if (Number(data?.structureVersion) !== Number(contract.structureVersion)) {
    errors.push(`structureVersion must be ${contract.structureVersion}.`);
  }
  if (Number(data?.productionContractVersion) !== Number(contract.contractVersion)) {
    errors.push(`productionContractVersion must be ${contract.contractVersion}. Pre-contract episodes are read-only until migrated.`);
  }
  if (data?.contractFile !== CONTRACT_PATH) {
    errors.push(`contractFile must be ${CONTRACT_PATH}.`);
  }
  return errors;
}

export function validateVoicePlanObject(plan, contract) {
  const errors = [];
  if (!plan || typeof plan !== 'object') return ['VOICE_PLAN.json is missing or invalid.'];
  const expected = contract.voiceContract.sections;
  const actual = Array.isArray(plan.sections) ? plan.sections : [];
  if (actual.length !== expected.length) errors.push(`VOICE_PLAN must contain exactly ${expected.length} sections.`);
  for (let i = 0; i < Math.min(actual.length, expected.length); i += 1) {
    const a = actual[i], e = expected[i];
    if (String(a.scene) !== String(e.scene) || Number(a.startSeconds) !== Number(e.startSeconds) || Number(a.endSeconds) !== Number(e.endSeconds)) {
      errors.push(`VOICE_PLAN section ${i + 1} must map Szene ${e.scene} to ${e.startSeconds}-${e.endSeconds}s.`);
    }
    if (!String(a.text || '').trim() || hasPlanningPlaceholder(a.text)) errors.push(`VOICE_PLAN section ${i + 1} text is unresolved.`);
  }
  if (!String(plan.exactTtsCopy || '').trim() || hasPlanningPlaceholder(plan.exactTtsCopy)) errors.push('VOICE_PLAN exactTtsCopy is unresolved.');
  if (Number(plan.noSpokenVoiceAfterSeconds) !== Number(contract.voiceContract.spokenVoiceAfterSeconds)) errors.push('VOICE_PLAN must forbid spoken voice after 14s.');
  return errors;
}

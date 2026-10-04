import fs from 'node:fs';
import path from 'node:path';

export function resolveEpisodePaths(root, episodeFolder) {
  const episodeRoot = path.join(root, 'episodes', episodeFolder);
  const modernData = path.join(episodeRoot, '99-technik', 'episode.json');
  const legacyData = path.join(episodeRoot, '04-data', 'data.json');

  const structure = fs.existsSync(modernData) ? 'v2' : fs.existsSync(legacyData) ? 'legacy' : 'missing';
  const isV2 = structure === 'v2';

  return {
    structure,
    isV2,
    episodeRoot,
    dataPath: isV2 ? modernData : legacyData,
    promptPath: isV2
      ? path.join(episodeRoot, '00-bildprompts', 'google-flow-prompt.txt')
      : path.join(episodeRoot, '03-bilder', 'bild-prompts.md'),
    imagesDir: isV2
      ? path.join(episodeRoot, '00-bildprompts', 'images')
      : path.join(episodeRoot, '03-bilder'),
    voiceScriptPath: isV2
      ? path.join(episodeRoot, '01-voice-script', 'voice-script.txt')
      : path.join(episodeRoot, '01-skript', 'voice-text.md'),
    audioDir: path.join(episodeRoot, '02-audio'),
    exportDir: path.join(episodeRoot, '03-export'),
    techDir: isV2
      ? path.join(episodeRoot, '99-technik')
      : path.join(episodeRoot, '04-data'),
    imagePlanPath: isV2
      ? path.join(episodeRoot, '99-technik', 'IMAGE_PLAN.json')
      : null,
    renderPlanPath: isV2
      ? path.join(episodeRoot, '99-technik', 'RENDER_PLAN.json')
      : null,
    statusPath: isV2
      ? path.join(episodeRoot, '99-technik', 'status.json')
      : null,
    coverSelectionPath: isV2
      ? path.join(episodeRoot, '99-technik', 'COVER_SELECTION.json')
      : null,
    reviewPath: isV2
      ? path.join(episodeRoot, '99-technik', 'VISUAL_REVIEW.json')
      : path.join(episodeRoot, '04-data', 'VISUAL_REVIEW.json'),
    approvalPath: isV2
      ? path.join(episodeRoot, '99-technik', 'ASSET_APPROVAL.json')
      : path.join(episodeRoot, '04-data', 'ASSET_APPROVAL.json'),
    revisionPath: isV2
      ? path.join(episodeRoot, '99-technik', 'GENERATION-REVISION.txt')
      : path.join(episodeRoot, 'GENERATION-REVISION.txt'),
    imageRelativePrefix: isV2 ? '00-bildprompts/images' : '03-bilder',
    audioRelativePrefix: '02-audio',
  };
}

export function readEpisodeData(paths) {
  if (paths.structure === 'missing' || !fs.existsSync(paths.dataPath)) {
    throw new Error(`Episode data missing: ${paths.dataPath}`);
  }
  return JSON.parse(fs.readFileSync(paths.dataPath, 'utf8'));
}

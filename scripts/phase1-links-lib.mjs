import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Stable mobile-accessible GitHub file links. A finished Phase-1 QA is required
// before calling publishPhase1Handoff; this function does not approve a draft.
export const GITHUB_REPO = 'memetreza34-ux/KidMotion';
export const GITHUB_BRANCH = 'main';
const folderPattern = /^KM-\d{3}-[a-z0-9-]+$/;
const placeholders = /__PLAN_REQUIRED__|\bTBD\b|\bPLACEHOLDER\b/i;

export function phase1Links(episodeFolder) {
  if(!folderPattern.test(episodeFolder))throw new Error('Invalid episode folder.');
  const base = 'https://github.com/' + GITHUB_REPO + '/blob/' + GITHUB_BRANCH + '/episodes/' + encodeURIComponent(episodeFolder);
  return {
    prompt: base + '/00-bildprompts/google-flow-prompt.txt',
    script: base + '/01-voice-script/voice-script.txt',
    flow: 'https://flow.google.com/'
  };
}

// This is the exact two-link answer the assistant must place visibly in CHAT when Phase 1 is done.
// The CLI writes/prepares it; it cannot autonomously send a ChatGPT message.
export function phase1ChatReply(episodeFolder) {
  const urls=phase1Links(episodeFolder);
  return [
    '## Phase 1 abgeschlossen — '+episodeFolder,
    '',
    'Alle Google-Flow-Bildprompts (inklusive Cover und jeder Szene):',
    '[Google-Flow-Prompts öffnen]('+urls.prompt+')',
    '',
    'Vollständiger Sprechertext:',
    '[Voice-over-Skript öffnen]('+urls.script+')',
    '',
    'Du kannst beide Dateien direkt auf deinem Tablet öffnen und den Text kopieren.'
  ].join('\\n').replaceAll('\\n','\n');
}

const sha256 = (content) => crypto.createHash('sha256').update(content).digest('hex');

export function publishPhase1Handoff({root=process.cwd(),episodeFolder,format}) {
  const urls=phase1Links(episodeFolder);
  if(!['workout','learn-and-move','learning'].includes(format))throw new Error('Unknown video format.');
  const folder=path.join(root,'episodes',episodeFolder);
  const promptFile=path.join(folder,'00-bildprompts','google-flow-prompt.txt');
  const scriptFile=path.join(folder,'01-voice-script','voice-script.txt');
  if(!fs.existsSync(promptFile)||!fs.existsSync(scriptFile))throw new Error('Both Phase-1 source files must exist before handoff.');
  const prompt=fs.readFileSync(promptFile,'utf8');
  const script=fs.readFileSync(scriptFile,'utf8');
  if(!prompt.trim()||!script.trim()||placeholders.test(prompt)||placeholders.test(script))throw new Error('Phase 1 still contains placeholders or empty source files.');
  const summary={
    schemaVersion:1,
    phase:'PHASE1',
    status:'QA_PASSED',
    episodeFolder,
    format,
    gitRepository:GITHUB_REPO,
    branch:GITHUB_BRANCH,
    links:{googleFlowPrompt:urls.prompt,voiceOverScript:urls.script,openGoogleFlow:urls.flow},
    chatReplyMarkdown:phase1ChatReply(episodeFolder),
    files:{
      googleFlowPrompt:{path:'00-bildprompts/google-flow-prompt.txt',sha256:sha256(prompt)},
      voiceOverScript:{path:'01-voice-script/voice-script.txt',sha256:sha256(script)}
    },
    important:'GitHub links become available on another device only after these files are committed and pushed. Links open the source files; they do not import prompts into Google Flow.'
  };
  const tech=path.join(folder,'99-technik');
  fs.mkdirSync(tech,{recursive:true});
  fs.writeFileSync(path.join(tech,'PHASE1_HANDOFF.json'),JSON.stringify(summary,null,2)+'\n','utf8');
  const markdown=[
    '# Phase 1 fertig — '+episodeFolder,'',
    '**Phase-1-Prompt-QA bestanden.** Diese Links sind für Handy und Tablet gedacht:','',
    '### Google-Flow-Prompt',
    '[Google-Flow-Prompt öffnen]('+urls.prompt+')','',
    '### Voice-over-Skript',
    '[Voice-over-Skript öffnen]('+urls.script+')','',
    '[Google Flow starten]('+urls.flow+')','',
    'Prompt und Skript sind vollständig in den verlinkten Dateien. Öffnen und kopieren; kein automatischer Import in Flow.',
    '**Wichtig:** Auf anderen Geräten sind die Links erst nach dem Commit und Push der Episodendateien erreichbar.',
    'Sind die Dateien später geändert worden, Phase-1-QA nochmals ausführen und die aktualisierte Übergabe committen.',''
  ].join('\n');
  fs.writeFileSync(path.join(folder,'99-technik','PHASE1_START_HIER.md'),markdown,'utf8');
  fs.writeFileSync(path.join(tech,'PHASE1_CHAT_ANTWORT.md'),phase1ChatReply(episodeFolder)+'\n','utf8');
  return summary;
}

export function printPhase1Links(summary,log=console.log) {
  log('');
  log('=== PHASE 1 FERTIG — Direktlinks für Tablet / Handy ===');
  log('[Google-Flow-Prompt öffnen]('+summary.links.googleFlowPrompt+')');
  log('[Voice-over-Skript öffnen]('+summary.links.voiceOverScript+')');
  log('Datei: episodes/'+summary.episodeFolder+'/99-technik/PHASE1_START_HIER.md');
  log('=== EXAKTER TEXT FÜR DIE CHAT-ANTWORT (beide separaten Links) ===');
  log(summary.chatReplyMarkdown || phase1ChatReply(summary.episodeFolder));
  log('CHAT-PFLICHT: Sende BEIDE Links direkt in der Chat-Antwort, nicht nur im Repository.');
  log('HINWEIS: Erst nach Git Commit + Push funktionieren die Links auch unterwegs.');
  log('Google Flow importiert die Prompts nicht automatisch; den Text dort einfügen.');
}

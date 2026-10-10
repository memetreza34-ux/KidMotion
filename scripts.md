# KidMotion Scripts

## Format-Router

```bash
npm run kidmotion:new -- --format=workout --topic="..."
npm run kidmotion:new -- --format=learning --topic="..."
npm run kidmotion:new -- --format=learn-and-move --topic="..."
```

## Workout

- `npm run prompt:qa -- --episode=...`
- `npm run flow:batch -- --episode=...`
- `npm run phase2:finalize -- --episode=...` (ein Ordner, 28/28, fehlende Flow-Prompts)
- `npm run scene:qa -- --episode=...`
- `npm run assets:approve -- --episode=...`
- `npm run kidmotion:activate -- --episode=...`
- `npm run phase3:gate -- --episode=...`
- `npm run render:safe`

## Pure Learning

- `npm run learning:prompt:qa -- --episode=...`
- `npm run learning:activate -- --episode=...`
- `npm run learning:preflight`
- `npm run learning:assets:approve -- --episode=...`
- `npm run learning:asset:gate`
- `npm run learning:render`

Pure Learning hat keinen Countdown-Timer, keine GET-READY-Pflicht und keinen Character-Zwang.

## Phase 1 — Direktlinks fürs Handy / Tablet

- Nach erfolgreicher `prompt:qa` oder `learning:prompt:qa` automatisch `PHASE1_START_HIER.md` + `99-technik/PHASE1_HANDOFF.json` pro Episode erzeugen.
- `npm run phase1:links -- --episode=KM-XXX-slug` — QA zuerst ausführen und erst bei PASS die zwei Links ausgeben.
- `npm run phase1:links:test` — Tests für sichere Links und fertige Skripte.
- Im Chat immer direkt **[Google-Flow-Prompt öffnen]** und **[Voice-over-Skript öffnen]** als anklickbare Links zeigen, nicht nur Repo-Pfade nennen. Vor Nutzung auf anderen Geräten Dateien pushen.

## Global

- `npm run scripts:check`
- `npm run project:doctor`
- `npm run repo:qa`

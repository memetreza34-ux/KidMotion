# KidMotion Scripts

## Globale Architektur
- `npm run project:doctor` — prüft Code/Configs/CI und verbietet hartcodierte Einzel-Episoden in Produktionsskripten.
- `npm run repo:qa` — prüft den zentralen Contract und alle aktuellen Contract-Episoden.

## Episode
- `npm run kidmotion:new -- --topic="..."` — erzeugt einen **planning-required** Contract-Entwurf.
- `npm run prompt:qa -- --episode=KM-XXX-slug` — Pflicht vor Flow. Prüft Szenen, 30 direkte Flow-Prompts, Cover-Safety-Wording, UI-Vertrag und Voice-Plan.
- `npm run kidmotion:select-cover -- --episode=KM-XXX-slug --candidate=1` — übernimmt die einmalige Coverwahl, benennt den Gewinner `Szene 01.png` und löscht die beiden anderen Kandidaten.
- `npm run scene:qa -- --episode=KM-XXX-slug` — prüft Szene 01–28, fehlende/zusätzliche/duplizierte Bilder und Referenzregeln.
- `npm run assets:approve -- --episode=KM-XXX-slug` — nur nach realer visueller Prüfung; erzeugt SHA-256-Lock.
- `npm run kidmotion:activate -- --episode=KM-XXX-slug` — baut Runtime-Pfade und `active-workout.ts`.
- `npm run render:safe` — führt alle globalen und aktiven Episoden-Gates aus, rendert und prüft die fertige MP4.

## Phase 3
- `npm run phase3:gate` — Pflicht vor Antigravity Phase 3. Prüft, dass ausschließlich die in Phase 2 freigegebenen SHA-256-Assets vorhanden und unverändert sind.
- Antigravity darf bei Gate-Fehler **keine Bilder erzeugen oder reparieren**. Es muss stoppen.

## Render-Gates
Typecheck → Project Doctor → Repo QA → Prompt/Voice Plan QA → Preflight → Scene QA → Asset Gate → Remotion → Postrender QA.

## Verantwortlichkeiten
Phase 2 / Google Flow: komplette statische Szenenbilder + alle sichtbaren Nicht-Timer-Texte.
Phase 3 / Antigravity: ausschließlich vorhandene Phase-2-Assets zusammensetzen; **keine Bildgenerierung**.
Remotion: Szenen-Timing, Voice/Musik und ausschließlich Countdown-Timer.

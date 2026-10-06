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

## Render-Gates
Typecheck → Project Doctor → Repo QA → Prompt/Voice Plan QA → Preflight → Scene QA → Asset Gate → Remotion → Postrender QA.

## Verantwortlichkeiten
Google Flow: alle sichtbaren Texte und komplette statische Szenenbilder.
Remotion: Szenen-Timing, Voice/Musik und ausschließlich Countdown-Timer.

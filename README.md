# KidMotion

**Neue kinderfreundliche Bildregie:** [ART_DIRECTION.md](ART_DIRECTION.md). Storyworld-v1 verlangt konkrete liebevoll gestaltete Spielwelten und echte SHA256-gebundene visuelle Freigabe aller neuen Workout-Bilder statt bloßer Prompt-Wörter wie „warm“.

KidMotion ist ein **allgemeiner Kinderkanal**, kein reiner Sportkanal.

## Videoformate

### 1. WORKOUT
Bewegung ist das Hauptziel.

Beispiele:
- 5 Minute Jungle Workout
- Animal Freeze Challenge

Vertrag: `config/v3-contract.json`

### 2. LEARNING
Wissen/Lernen ist das Hauptziel.

Beispiele:
- Learn Numbers 1–10
- Alphabet / ABC
- Colors and Shapes
- Animals and Habitats
- Planets for Kids
- Why Do Volcanoes Erupt?
- How Trains Work

Vertrag: `config/formats/learning.json`

Für reine Lernvideos gilt ausdrücklich:
- kein Workout-Zwang
- kein Timer-Zwang
- kein GET READY
- kein Bewegungszwang
- kein Kind/Mascot-Zwang
- Voice darf durch das ganze Video laufen
- Szenenzahl und Laufzeit sind flexibel
- Bilder dürfen Objekte, Tiere, Karten, Diagramme, Maschinen, Buchstaben, Zahlen, Umgebungen oder Figuren zeigen — je nachdem, was am besten erklärt

### 3. LEARN_AND_MOVE
Optionale Mischform. Nur verwenden, wenn Bewegung das Lernen wirklich unterstützt.

## Neue Episode

```bash
npm run kidmotion:new -- --format=workout --topic="..."
npm run kidmotion:new -- --format=learning --topic="..." --age-band=5-8 --learning-mode=QUESTION_EXPLAINER
npm run kidmotion:new -- --format=learn-and-move --topic="..."
```

Ohne `--format` wird abgebrochen. Dadurch wird ein Lernvideo nie versehentlich zum Workout.

Siehe: `FORMAT_ROUTER.md`.

## Phase 1 fertig — Direktlinks fürs Tablet

Nach erfolgreicher `prompt:qa` (Workout / Learn-and-Move) oder `learning:prompt:qa` (Learning) erstellt KidMotion **automatisch** `episodes/KM-XXX-name/PHASE1_START_HIER.md` und `99-technik/PHASE1_HANDOFF.json` und gibt die zwei anklickbaren GitHub-Dateilinks in der Konsole aus:

- **Google-Flow-Prompt öffnen** — vollständiger `00-bildprompts/google-flow-prompt.txt`
- **Voice-over-Skript öffnen** — reiner Sprechertext `01-voice-script/voice-script.txt`

Bei jedem erfolgreichen Phase-1-Abschluss müssen Assistenten beide Links **zusätzlich direkt in der Chat-Antwort** anzeigen. Für einen erneuten geprüften Handoff: `npm run phase1:links -- --episode=KM-XXX-name`. Es gibt **keine Freigabe bei fehlgeschlagener QA**; es wird niemals ein Scaffold als fertig verkauft. Die Quellen müssen **committet und auf GitHub gepusht** sein, damit die Links auf einem Tablet funktionieren (bei privaten Repositories mit GitHub-Login). Die Links öffnen die Texte zur manuellen Übernahme, keine automatische Google-Flow-Generierung.

## Fertiger Workout-Export

Nach erfolgreicher Phase-1-Planprüfung erstellt `prompt:qa` automatisch kopierfertige YouTube-Dateien in `03-export`: `YOUTUBE_KOPIEREN.txt`, `YOUTUBE_TITLE.txt`, `YOUTUBE_DESCRIPTION.txt` (genau fünf Hashtags), `VOICE_TIMESTAMPS.txt`, `SUBTITLES.srt` und `VIDEO_TIMELINE.txt`. Zeitstempel der SRT basieren auf den geplanten Sprach-Szenenfenstern, müssen vor Upload mit der **echten** TTS-Audioaufnahme abgeglichen werden. Für einen erneuten Text-Export `npm run export:content -- --episode=KM-XXX-slug`.

Erst nach erfolgreichem Render, echtem Visual Review und Asset Approval erzeugt `npm run export:pack` zusätzlich `FINAL_VIDEO.mp4` und ein **separates** `COVER.png`. Szene 01 (Cover) ist niemals Videoframe. Szene 02 ist bei neuen Workouts eine kleine Begrüßung HELLO!, Szene 03 Safety First, Szene 04 kurzes Startsignal, dann beginnen die Übungen. Interne Episodenhinweise (`README.md`, `ANTIGRAVITY.md`, `PHASE1_START_HIER.md`, `PHASE2_FLOW_RUNBOOK.md`) werden unter `99-technik` gehalten. Bestehende lokale MP4s werden nicht rückwirkend verändert.

## Reines Learning rendern

```bash
npm run learning:prompt:qa -- --episode=KM-XXX-slug
npm run learning:activate -- --episode=KM-XXX-slug
npm run learning:preflight
npm run learning:assets:approve -- --episode=KM-XXX-slug
npm run learning:asset:gate
npm run learning:render
```

Remotion Composition: `KidMotionLearning`.


## Learning Engine

Pure learning uses `config/learning-engine.json`.

Planning order:
`age band → one primary objective → learning mode → facts → scenes → practice/reveal → application → recap → script → visuals`.

Core learning sequence:
`HOOK → TEACH → EXAMPLE → PRACTICE → REVEAL → APPLY → RECAP`

The exact sequence changes by learning mode. See `LEARNING_ENGINE.md`.

## Verbindliche Phase-2-Abgabe für Workout

1. Nach Coverwahl: `npm run kidmotion:select-cover -- --episode=KM-XXX-slug --candidate=1`. Die zwei übrigen Cover werden direkt gelöscht.
2. Nach Produktion: `npm run phase2:finalize -- --episode=KM-XXX-slug`. Fehlende Bilder stehen in `99-technik/PHASE2_MISSING_SCENES.json`; Google Flow muss sie in Phase 2 fertigstellen, dann dieselbe Prüfung wiederholen.
3. Erst bei 28/28 gilt `00-bildprompts/images/` als ein vollständiger Übergabeordner. Danach visuelle QC und `scene:qa`; Phase 3 generiert niemals fehlende Bilder.

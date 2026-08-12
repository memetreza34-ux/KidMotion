# KidMotion — Image Prompt Template

## Scene identity
- Episode:
- Scene number:
- Final file name:
- Main character: boy / girl
- Pose:
- Background / world:

# HARTE REGEL — NORMALE VIDEO-SZENEN OHNE EINGEBRANNTEN TEXT
Google Flow / Antigravity erzeugt für normale KidMotion-Videos saubere Szenenbilder.

Das erzeugte Bild enthält:
- exakt denselben Hauptcharakter wie im restlichen Video
- richtige statische Pose
- passendes Episode-Outfit
- passende Themenwelt
- 16:9 YouTube landscape

Das erzeugte Bild enthält NICHT:
- Übungsname
- Ausführungsanweisung
- Cloud / Speech Bubble
- Untertitel
- Voice-Captions
- Timer
- Progress Bar
- Countdown
- sonstige Video-UI

Remotion setzt diese Elemente später direkt AUF das Bild.

## Ausnahme Cover
`Bild 00.png` ist das separate YouTube-Thumbnail und darf den geplanten Thumbnail-Text direkt enthalten.
Das Cover ist nicht Teil der Video-Timeline.

# HARTE REGEL — STATISCHE HOLD-POSE
Die Startphase verwendet klare statische Übungen, die mit einem einzigen Bild verstanden werden und 20 Sekunden gehalten werden können.

Bevorzugt stehende Übungen wie:
- squat hold
- lunge hold
- knee-up balance
- single-leg balance
- side stretch hold
- calf raise hold
- wide stance hold
- reach-up hold

Keine repetitive Bewegungsaktion im Bild.

# CHARAKTER-KONSISTENZ
Ein Video verwendet genau einen Hauptcharakter.
Jeder Prompt derselben Episode muss denselben Referenzcharakter verwenden.

Nicht verändern:
- Gesicht
- Haarfarbe / Frisur
- Alterswirkung
- Hautfarbe
- Körperproportionen
- Outfit innerhalb der Episode
- 3D-Stil

# DATEINUMMERIERUNG
Jeder Prompt nennt direkt:
- `IMAGE NUMBER`
- `SCENE`
- `FINAL FILE NAME`

Die Bildnummer entspricht immer der chronologischen Szenennummer.
Remotion-only Szenen reservieren ihre Nummer und erzeugen kein Bild.

Beispiel:
- Cover → `Bild 00.png`
- Scene 01 → `Bild 01.png`
- Scene 02 Remotion-only → kein `Bild 02.png`
- Scene 03 → `Bild 03.png`

# GOOGLE FLOW AGENT WORKFLOW
Immer einzeln:

`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Nie mehrere Episode-Bilder gleichzeitig erzeugen.

Erst nachdem ALLE Bilder korrekt benannt und geprüft wurden, gemeinsam verschieben nach:
`00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Nicht vorher.
Nicht auf einzelne Szenenordner verteilen.

# SHORT PROMPT STYLE
Prompts bleiben kurz und direkt.

Standard für eine Übung:

```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — [POSE NAME]
FINAL FILE NAME: Bild XX.png

Use the approved KidMotion [boy/girl] episode reference exactly.
Create a clean 16:9 YouTube landscape scene in the same episode world and outfit.

POSE: [POSE NAME]
[short exact body-position description]
Full body clearly visible. Static standing hold pose.

IMPORTANT:
Generate ONLY the character, pose and background.
NO exercise title.
NO instruction text.
NO cloud or speech bubble.
NO subtitles.
NO timer.
NO progress bar.
NO UI.

Keep the exact same character identity, outfit, proportions and world as all other scenes in this episode.

After generation, immediately rename this image to: Bild XX.png
```

# REMOTION OVERLAY RULE
Remotion fügt später auf das saubere Bild:
- Übungsname unten links
- kurze Anleitung oben rechts in der KidMotion-Cloud
- 20-Sekunden-Timer
- Progress Bar

Keine Untertitel.
Keine Voice-Captions.

## Required QA
- richtige Bild-/Szenennummer
- genau ein Hauptcharakter
- gleicher Referenzcharakter wie in der ganzen Episode
- korrekte statische Pose
- 16:9
- vollständige Pose klar sichtbar
- genug freie Fläche für Remotion-Overlay
- kein eingebrannter Übungsname
- keine eingebrannte Anleitung
- keine Cloud
- keine Untertitel
- kein Timer
- keine Progress Bar
- keine Markenlogos / fremden Charaktere

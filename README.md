# KidMotion V3

Datengetriebene Pipeline für englische YouTube-Kinderworkouts mit Google-Flow-Bildern und Remotion.

## Kernregel
**Google Flow erzeugt ALLE sichtbaren Texte. Remotion erzeugt visuell NUR den Countdown-Timer.**

Intro, Safety, LET'S BEGIN, Übungsname, Anleitung, Outro und Thumbnail-Text sind direkt Bestandteil der generierten Bilder. Es gibt keine Remotion-Progress-Bar und keinen Remotion-REST/NEXT-Text.

## Szenenstruktur
```text
episodes/KM-XXX-name/
├── 00-bildprompts/
│   ├── google-flow-prompt.txt
│   └── images/
│       ├── Szene 01.png   # Cover / Thumbnail, nicht im MP4
│       ├── Szene 02.png   # Intro
│       ├── Szene 03.png   # Safety
│       ├── Szene 04.png   # LET'S BEGIN
│       ├── Szene 05.png   # Exercise 1
│       ├── ...
│       └── Szene 17.png   # Outro
├── 01-voice-script/voice-script.txt
├── 02-audio/Voice 01.mp3 + bg-music.mp3
├── 03-export/FINAL_VIDEO.mp4 + UPLOAD_METADATA.md
└── 99-technik/
    ├── episode.json
    ├── IMAGE_PLAN.json
    ├── COVER_SELECTION.json
    ├── RENDER_PLAN.json
    ├── VISUAL_REVIEW.json
    ├── GENERATION-REVISION.txt
    └── ASSET_APPROVAL.json
```

## Cover-Auswahl — Pflicht
1. Zuerst genau drei Cover erzeugen: `Cover-Kandidat-01.png`, `Cover-Kandidat-02.png`, `Cover-Kandidat-03.png`.
2. Alle drei dem Nutzer zeigen.
3. **STOP und auf die ausdrückliche Auswahl warten.**
4. Gewählten Kandidaten auswählen mit:
   `npm run kidmotion:select-cover -- --episode=KM-XXX-slug --candidate=<1|2|3>`
5. Gewinner wird `Szene 01.png`; die beiden anderen Kandidaten werden gelöscht.
6. `Szene 01.png` ist danach die Hauptreferenz für Charakter, Outfit, Farben, Licht und Welt.
7. Erst dann `Szene 02.png` bis `Szene 17.png` erzeugen.

Alle finalen Szenen liegen gemeinsam in einem flachen Bilderordner.

## Referenzen
- `Szene 01.png`: PRIMARY reference für alle späteren Szenen.
- `Szene 05.png`: SECONDARY Exercise-UI reference für Szene 06–16.

## Timing
Intro 8s → Safety 4s → LET'S BEGIN 2s → [Exercise 20s → Rest 5s] × 11 → Exercise 12 20s → Outro 4s = 313s.

Während Exercise und Rest legt Remotion nur den Countdown-Timer über das statische Flow-Bild. Rest verwendet das nächste Exercise-Bild und hat keinen zusätzlichen REST/NEXT-Text.

## Produktion
Neue Episode:
`npm run kidmotion:new -- --topic="THEME" --character=girl`

Nach Cover-Auswahl und echter visueller Prüfung:
`npm run assets:approve -- --episode=KM-XXX-slug`

Final:
`npm run render:safe`

KM-001 bleibt Legacy. KM-002 ist V2. KM-003 ist die erste Szene-01–17-V3-Episode.

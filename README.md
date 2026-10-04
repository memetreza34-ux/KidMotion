# KidMotion V2

Datengetriebene Pipeline für englische YouTube-Kinderworkouts mit Google-Flow-Bildern und Remotion.

## Kernregel
**Google Flow erzeugt ALLE sichtbaren Texte. Remotion erzeugt visuell NUR den Countdown-Timer.**

Also: Intro, Safety, LET'S BEGIN, Übungsname, Anleitung, Outro und Thumbnail-Text sind direkt Bestandteil der generierten Bilder. Es gibt keine Remotion-Progress-Bar und keinen Remotion-REST/NEXT-Text.

## Struktur
```text
episodes/KM-XXX-name/
├── 00-bildprompts/google-flow-prompt.txt
├── 00-bildprompts/images/Bild 00.png ... Bild 16.png
├── 01-voice-script/voice-script.txt
├── 02-audio/Voice 01.mp3 + bg-music.mp3
├── 03-export/FINAL_VIDEO.mp4 + UPLOAD_METADATA.md
└── 99-technik/episode.json + IMAGE_PLAN.json + RENDER_PLAN.json + VISUAL_REVIEW.json + GENERATION-REVISION.txt
```

KM-001 bleibt Legacy. KM-002 ist die erste V2-Episode.

## Bildworkflow
Bild 00: drei Cover-Kandidaten → ein Gewinner.
Bild 01: zuerst freigeben → Character/World Reference.
Bild 04: danach freigeben → Exercise UI Reference.
Bild 05–15: Bild 01 für Identität/Welt + Bild 04 nur für UI-Stil.

## Timing
Intro 8s → Safety 4s → LET'S BEGIN 2s → [Exercise 20s → Rest 5s] × 11 → Exercise 12 20s → Outro 4s = 313s.

Während Exercise und Rest legt Remotion nur den Countdown-Timer über das statische Flow-Bild. Rest verwendet das nächste Exercise-Bild und hat keinen zusätzlichen REST/NEXT-Text.

## Produktion
Neue Episode: `npm run kidmotion:new -- --topic="THEME" --character=girl`

Nach echter visueller Prüfung: `npm run assets:approve -- --episode=KM-XXX-slug`

Final: `npm run render:safe`

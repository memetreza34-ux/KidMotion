# KidMotion V2

KidMotion ist eine datengetriebene Produktionspipeline für englische YouTube-Kinderworkouts mit statischen Hold-Posen, Google-Flow-Bildern und Remotion-Rendering.

## Source of truth
1. `GEHIRN.md`
2. `config/pipeline.json`
3. `config/visual-policy.json`
4. `config/export-policy.json`
5. `characters/CHARACTER_BIBLE.md`
6. jeweilige Episode unter `episodes/KM-XXX-name/`

## V2-Episodenstruktur

```text
episodes/KM-XXX-name/
├── 00-bildprompts/
│   ├── google-flow-prompt.txt
│   └── images/Bild 00.png ... Bild 16.png
├── 01-voice-script/voice-script.txt
├── 02-audio/Voice 01.mp3 + bg-music.mp3
├── 03-export/
│   ├── FINAL_VIDEO.mp4
│   └── UPLOAD_METADATA.md
└── 99-technik/
    ├── episode.json
    ├── IMAGE_PLAN.json
    ├── RENDER_PLAN.json
    ├── VISUAL_REVIEW.json
    ├── GENERATION-REVISION.txt
    ├── status.json
    └── ASSET_APPROVAL.json (erst nach Freigabe)
```

KM-001 bleibt Legacy-Archiv. KM-002 ist die erste V2-Episode.

## Google-Flow-Workflow

Jedes Bild wird vor der Generierung geplant mit:
- Visual Purpose
- Topic Anchor
- Visual Form
- Character/UI Reference
- Prop Count
- Generated Text
- Safe Zones
- Acceptance Criteria
- finalem Prompt

`Bild 00`: drei temporäre Cover-Kandidaten → ein Gewinner `Bild 00.png`.

`Bild 01`: zuerst erzeugen und freigeben → PRIMARY character/world reference.

`Bild 04`: danach erzeugen und freigeben → SECONDARY exercise UI reference für Bild 05–15.

Alle akzeptierten Finalbilder liegen flach in `00-bildprompts/images/`.

## Standardvideo
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s
- 12 × Exercise 20s
- 11 × Rest 5s
- Outro 4s
- Gesamt 313s / 5:13

## Audio
- genau `Voice 01.mp3` für das 14s Opening
- Ziel ca. 13.65–14.00s, maximal 14.05s
- danach keine Voice
- `bg-music.mp3` Pflicht und geloopt

## Export / Veröffentlichung
`03-export/` ist das fertige Veröffentlichungs-Paket.

Pflicht am Ende:
- `FINAL_VIDEO.mp4`
- `UPLOAD_METADATA.md`

`UPLOAD_METADATA.md` enthält mindestens:
- finalen YouTube-Titel
- finale Videobeschreibung / Caption

Während der Produktion darf die Datei `DRAFT` sein. Vor `PRODUCTION COMPLETE` muss sie vollständig copy-ready und frei von Platzhaltern sein.

## Produktion

Neue Episode:
```bash
npm run kidmotion:new -- --topic="THEME" --character=girl
```

Aktivieren:
```bash
npm run kidmotion:activate -- --episode=KM-XXX-slug
```

Nach echter visueller Prüfung:
```bash
npm run assets:approve -- --episode=KM-XXX-slug
```

Final rendern:
```bash
npm run render:safe
```

Der Render bleibt blockiert, solange Bildplan, Flow-Prompt, Assets, Visual Review oder SHA-256-Approval nicht vollständig gültig sind.

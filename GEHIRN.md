# KidMotion — Projekt-Gehirn

> Höchste verbindliche Regelquelle. Bei Widersprüchen gilt diese Datei.

## 1. Format
KidMotion produziert englische 16:9 YouTube-Longform-Kinderworkouts mit einem wiederkehrenden 3D-Charakter und statischen Hold-Posen.

Standard: 1920×1080, 30 fps, 12 Übungen, 20s je Übung, 5s Rest zwischen Übungen, 313s / 5:13.

## 2. V2-Episodenstruktur
```text
episodes/KM-XXX-name/
├── 00-bildprompts/
│   ├── google-flow-prompt.txt
│   └── images/Bild 00.png ... Bild 16.png
├── 01-voice-script/voice-script.txt
├── 02-audio/Voice 01.mp3 + bg-music.mp3
├── 03-export/FINAL_VIDEO.mp4 + UPLOAD_METADATA.md
└── 99-technik/
    ├── episode.json
    ├── IMAGE_PLAN.json
    ├── RENDER_PLAN.json
    ├── VISUAL_REVIEW.json
    ├── GENERATION-REVISION.txt
    └── ASSET_APPROVAL.json
```

`Bild 00` ist nur Thumbnail und niemals Teil des MP4.

## 3. Google Flow besitzt die komplette sichtbare Gestaltung
**HARTE REGEL:** Google Flow erzeugt jeden sichtbaren Text direkt im finalen Bild. Die einzige Ausnahme ist der dynamische Countdown-Timer, den Remotion über das Bild legt.

Damit gehören Google Flow:
- Bild 00: kompletter Thumbnail-Text
- Bild 01: kompletter Intro-Text
- Bild 02: kompletter Safety-Text
- Bild 03: `LET'S BEGIN!`
- Bild 04–15: Übungsname + kurze Instruction
- Bild 16: `GREAT JOB!` + `WORKOUT COMPLETE`

Remotion darf diese Texte niemals erneut erzeugen.

## 4. Remotion — TIMER ONLY
Remotion darf visuell ausschließlich den Countdown-Timer erzeugen.

Erlaubt:
- statisches Flow-Bild 1:1 anzeigen
- numerischer/runder Countdown-Timer top-left bei Übungen
- derselbe Countdown-Timer während Rest
- Voice + Hintergrundmusik abspielen
- Szenen zeitlich zusammensetzen

Verboten:
- Progress Bar
- Intro-Titel oder Badge
- Safety-Text
- LET'S BEGIN
- Übungsname
- Instruction
- REST-Text
- NEXT-Text
- Outro-Text
- Untertitel/Captions
- zusätzliche Karten, Chips, Labels oder Grafiken
- Zoom, Pan oder Ken Burns auf Exercise/Rest
- Full-scene Fade von leer/schwarz/weiß

### Rest
Rest verwendet weiterhin das **nächste Exercise-Bild** full-screen. Remotion legt nur den 5s Countdown-Timer darüber. Es gibt keinen zusätzlich gerenderten `REST`- oder `NEXT`-Text.

## 5. Google-Flow-Bildworkflow
Jedes Bild wird zuerst in `IMAGE_PLAN.json` geplant mit:
- Visual Purpose
- Topic Anchor
- Visual Form
- Referenzbild
- Prop Count
- exakt gewünschtem sichtbaren Text
- Timer-Safe-Zone, falls benötigt
- Acceptance Criteria
- finalem Prompt

Dann:
`Prompt lesen → Bild generieren → tatsächlich ansehen → akzeptieren/ablehnen → akzeptiertes Bild exakt umbenennen → nächstes Bild`.

Bild 00: genau drei Kandidaten, ein Gewinner.
Bild 01: zuerst freigeben; PRIMARY character/world reference.
Bild 04: danach freigeben; SECONDARY Exercise-UI reference für Bild 05–15.

Keine automatischen Alternativen. Bei einem abgelehnten Bild gezielt neu generieren. Nach zwei ernsthaften Fehlversuchen einer unklaren Pose wird die Pose ersetzt.

## 6. Bildregeln
- genau ein Hauptcharakter pro Episode
- gleicher Charakter, Haare, Proportionen, Outfit und Welt
- keine zweite Person
- Ganzkörper und wichtige Gelenke sichtbar
- statische Pose aus einem Bild verständlich
- natürliche Anatomie
- bei NO BALL = ZERO Bälle
- bei ONE BALL = EXACTLY ONE Ball
- keine realen Logos/Teams/Sponsoren
- English visible text

Exercise-Bilder lassen top-left ca. 220×220 px für den Remotion-Timer frei. Eine untere Progress-Bar-Safe-Zone gibt es nicht mehr.

## 7. Audio
Genau eine gesprochene Datei: `Voice 01.mp3`.
Sie startet Frame 0, trägt Intro + Safety + LET'S BEGIN nahezu lückenlos und endet vor Exercise 1. Ziel 13.65–14.00s, absolut max. 14.05s.

Danach keine Voice. Keine Untertitel.
`bg-music.mp3` ist Pflicht, instrumental und durchgehend geloopt.

## 8. Visuelle Freigabe
`VISUAL_REVIEW.json` bleibt false, bis die echten finalen Bilder angesehen wurden.
Pflicht:
- gleicher Charakter
- klare Posen
- alle Flow-Texte korrekt, lesbar und konsistent
- Timer-Safe-Zone frei
- korrekte Prop-Anzahl
- keine zusätzlichen Personen
- keine Anatomiefehler
- nichts Wichtiges abgeschnitten
- **alle Nicht-Timer-Texte bereits im Bild vorhanden**

Danach `npm run assets:approve -- --episode=...`.
Das Approval sperrt Assets per SHA-256. Jede spätere Asset-Änderung macht die Freigabe ungültig.

## 9. Render
Final nur über `npm run render:safe`.
Ablauf: TypeScript → Project Doctor → Preflight → Asset Gate → Render → Postrender QA.

## 10. Export
`03-export/` ist der fertige Veröffentlichungsordner und enthält mindestens:
- `FINAL_VIDEO.mp4`
- `UPLOAD_METADATA.md` mit copy-ready YouTube-Titel und Videobeschreibung/Caption

PRODUCTION COMPLETE erst nach visueller MP4-Prüfung und vollständig fertigen Upload-Texten.

# KidMotion — Projekt-Gehirn

> Höchste verbindliche Regelquelle. Bei Widersprüchen gilt diese Datei.

## 1. Format
KidMotion produziert englische 16:9 YouTube-Longform-Kinderworkouts mit einem wiederkehrenden 3D-Charakter und statischen Hold-Posen.

Standard: 1920×1080, 30 fps, 12 Übungen, 20s je Übung, 5s Rest zwischen Übungen, 313s / 5:13.

## 2. Szenenstruktur V3
Jede neue Episode liegt unter `episodes/KM-XXX-name/`.

Finale Bilder:
```text
00-bildprompts/images/
├── Szene 01.png   # Cover / Thumbnail, NICHT im MP4
├── Szene 02.png   # Intro
├── Szene 03.png   # Safety
├── Szene 04.png   # LET'S BEGIN
├── Szene 05.png   # Exercise 1
├── ...
├── Szene 16.png   # Exercise 12
└── Szene 17.png   # Outro
```

Alle finalen Bilder liegen in genau EINEM flachen Bilderordner. Keine Cover-Unterordner, keine Szenen-Unterordner.

Weitere Dateien:
```text
01-voice-script/voice-script.txt
02-audio/Voice 01.mp3 + bg-music.mp3
03-export/FINAL_VIDEO.mp4 + UPLOAD_METADATA.md
99-technik/
├── episode.json
├── IMAGE_PLAN.json
├── COVER_SELECTION.json
├── RENDER_PLAN.json
├── VISUAL_REVIEW.json
├── GENERATION-REVISION.txt
└── ASSET_APPROVAL.json
```

## 3. Cover zuerst — HARTE STOPP-REGEL
Vor allen anderen Bildern werden ausschließlich drei Cover erzeugt:

- `Cover-Kandidat-01.png`
- `Cover-Kandidat-02.png`
- `Cover-Kandidat-03.png`

Alle drei liegen vorübergehend im selben `00-bildprompts/images/`-Ordner.

Danach:
1. Alle drei Covers dem Nutzer zeigen.
2. **STOP.**
3. Keine Szene 02 oder später erzeugen.
4. Auf die ausdrückliche Auswahl des Nutzers warten.
5. Gewinner über `kidmotion:select-cover` auswählen.
6. Gewinner wird exakt `Szene 01.png`.
7. Beide abgelehnten Cover-Kandidaten werden gelöscht.
8. `COVER_SELECTION.json` wird auf `SELECTED` gesetzt.
9. Erst jetzt darf Szene 02–17 erzeugt werden.

Ohne ausdrückliche Nutzerauswahl ist die Bildproduktion gesperrt.

## 4. Referenzworkflow
`Szene 01.png` ist nach der Nutzerauswahl die wichtigste Referenz für ALLE späteren Szenen:
- Gesicht
- Haare
- Alter
- Körperproportionen
- Outfit
- Farben
- Beleuchtung
- Welt/Hintergrundstil

`Szene 05.png` wird zusätzlich als Exercise-UI-Referenz für Szene 06–16 benutzt.

Wichtig: Szene 05 darf nur Titel-/Instruction-Stil liefern. Charakter und Welt kommen weiterhin aus Szene 01.

## 5. Google Flow besitzt die sichtbare Gestaltung
Google Flow erzeugt jeden sichtbaren Text direkt im finalen Bild. Einzige Ausnahme: der dynamische Countdown-Timer von Remotion.

Flow erzeugt:
- Szene 01: Thumbnail-Text
- Szene 02: kompletter Intro-Text
- Szene 03: Safety-Text
- Szene 04: `LET'S BEGIN!`
- Szene 05–16: Übungsname + Instruction
- Szene 17: `GREAT JOB!` + `WORKOUT COMPLETE`

Remotion darf diese Texte niemals erneut erzeugen.

## 6. Remotion — TIMER ONLY
Erlaubt:
- statisches Flow-Bild 1:1 anzeigen
- Countdown-Timer bei Exercise/Rest
- Voice + Hintergrundmusik
- Szenen zeitlich zusammensetzen

Verboten:
- Progress Bar
- Intro-/Safety-/LET'S-BEGIN-/Exercise-/REST-/NEXT-/Outro-Text
- Untertitel
- zusätzliche Karten/Labels/Grafiken
- Zoom/Pan/Ken Burns auf Exercise/Rest
- Full-scene Fade von leer/schwarz/weiß

Rest zeigt das nächste Exercise-Bild full-screen und Remotion legt nur den 5s Timer darüber.

## 7. Bildproduktion
Jede Szene wird in `IMAGE_PLAN.json` geplant mit:
- Visual Purpose
- Topic Anchor
- Visual Form
- Referenzbild
- Prop Count
- gewünschtem Text
- Timer-Safe-Zone
- Acceptance Criteria
- finalem Google-Flow-Prompt

Ablauf nach Cover-Auswahl:
`Prompt lesen → Szene erzeugen → ansehen → akzeptieren/ablehnen → sofort in Szene NN.png umbenennen → nächste Szene`.

Keine automatischen Alternativen. Bei Fehler gezielt neu generieren.

## 8. Bildregeln
- genau ein Hauptcharakter
- gleicher Charakter/Outfit/Welt wie Szene 01
- keine zweite Person
- Ganzkörper und wichtige Gelenke sichtbar
- statische Pose sofort verständlich
- natürliche Anatomie
- korrekte Prop-Anzahl
- keine realen Logos
- sichtbarer Text Englisch
- Exercise-Szenen halten top-left ca. 220×220 px für den Timer frei

## 9. Audio
Genau eine gesprochene Datei: `Voice 01.mp3`.
Sie startet bei Frame 0, trägt Intro + Safety + LET'S BEGIN nahezu lückenlos und endet vor Exercise 1.
Ziel 13.65–14.00s, absolut max. 14.05s.

Danach keine Voice. `bg-music.mp3` ist Pflicht und wird durchgehend geloopt.

## 10. Freigabe
`VISUAL_REVIEW.json` bleibt false, bis die echten finalen Szenen angesehen wurden.

`assets:approve` darf nur bestehen, wenn:
- Cover ausdrücklich gewählt wurde
- `COVER_SELECTION.json = SELECTED`
- nur `Szene 01.png` bis `Szene 17.png` als finale Szenen vorhanden sind
- keine temporären Cover-Kandidaten mehr übrig sind
- visuelle Prüfung vollständig wahrheitsgemäß ist
- Voice/Musik vorhanden und gültig sind

Danach SHA-256-Lock. Jede spätere Asset-Änderung macht die Freigabe ungültig.

## 11. Render und Export
Final nur über `npm run render:safe`.

Ablauf:
TypeScript → Project Doctor → Preflight → Asset Gate → Render → Postrender QA.

`03-export/` enthält mindestens:
- `FINAL_VIDEO.mp4`
- `UPLOAD_METADATA.md` mit fertigem YouTube-Titel und Beschreibung/Caption

PRODUCTION COMPLETE erst nach visueller MP4-Prüfung.

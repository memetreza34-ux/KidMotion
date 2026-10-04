# KidMotion — Projekt-Gehirn

> Höchste verbindliche Regelquelle. Bei Widersprüchen gilt diese Datei.

## 1. Format
KidMotion produziert englische 16:9 YouTube-Longform-Kinderworkouts mit einem wiederkehrenden 3D-Charakter und statischen Hold-/Freeze-Posen.

Standard: 1920×1080, 30 fps, 12 Übungen, 20s je Übung, 11 Übergänge à 5s, 313s / 5:13.

## 2. V3-Episodenstruktur
```text
episodes/KM-XXX-name/
├── 00-bildprompts/
│   ├── google-flow-prompt.txt
│   └── images/
│       ├── Szene 01.png
│       ├── Szene 02.png
│       └── ... Szene 28.png
├── 01-voice-script/voice-script.txt
├── 02-audio/
│   ├── Voice 01.mp3
│   ├── bg-music.mp3
│   └── MUSIC_BRIEF.md
├── 03-export/
│   ├── FINAL_VIDEO.mp4
│   └── UPLOAD_METADATA.md
└── 99-technik/
    ├── episode.json
    ├── IMAGE_PLAN.json
    ├── RENDER_PLAN.json
    ├── COVER_SELECTION.json
    ├── VISUAL_REVIEW.json
    ├── GENERATION-REVISION.txt
    └── ASSET_APPROVAL.json
```

Alle finalen Bilder liegen flach in genau einem Bilderordner.

## 3. Cover-Workflow — HARTE SPERRE
1. Zuerst exakt drei Cover-Kandidaten erzeugen:
   - `Cover-Kandidat-01.png`
   - `Cover-Kandidat-02.png`
   - `Cover-Kandidat-03.png`
2. Dem Nutzer alle drei zeigen.
3. **STOP.**
4. Keine Szene 02 oder später erzeugen, bevor der Nutzer Kandidat 1/2/3 ausdrücklich gewählt hat.
5. Gewinner → `Szene 01.png`.
6. Die zwei Verlierer löschen.
7. `Szene 01.png` ist ab dann die PRIMARY-Referenz für Gesicht, Haare, Alter, Proportionen, Outfit, Farben, Licht und Bildwelt.

## 4. Szenenplan
- Szene 01: Cover, nicht im MP4
- Szene 02: Intro, 8s
- Szene 03: Safety, 4s
- Szene 04: LET'S BEGIN, 2s
- Szene 05: Übung 1, 20s
- Szene 06: GET READY für Übung 2, 5s
- Szene 07: Übung 2, 20s
- Szene 08: GET READY für Übung 3, 5s
- ...
- Szene 25: Übung 11, 20s
- Szene 26: GET READY für Übung 12, 5s
- Szene 27: Übung 12, 20s
- Szene 28: Outro, 4s

Die 5-Sekunden-Übergänge benutzen **nie** das nächste 20-Sekunden-Übungsbild.

## 5. Google Flow besitzt alle sichtbaren Texte
**HARTE REGEL:** Google Flow erzeugt jeden sichtbaren Text direkt im finalen Bild. Die einzige Ausnahme ist der dynamische Countdown-Timer, den Remotion darüberlegt.

Google Flow erzeugt:
- Cover-Text
- Intro-Text
- Safety-Text
- LET'S BEGIN
- Übungsname + Instruction
- GET READY + NEXT: Übungsname
- Outro-Text

Remotion darf keinen dieser Texte erneut erzeugen.

## 6. Übungsqualität — klare Kinder-Challenges
Die 12 Übungsbilder dürfen nicht wie zwölf Varianten von Squat/Lunge/Balance aussehen.

Pflicht:
- deutlich unterschiedliche Silhouetten
- unterschiedliche Körperhöhen und Richtungen
- Mischung aus upright, wide, diagonal, one-leg, side-bend und floor-level
- jede Pose aus einem Standbild sofort verständlich
- benachbarte Übungen dürfen nicht nahezu identisch wirken
- nach zwei schlechten Flow-Versuchen Pose austauschen statt endlos regenerieren

## 7. Bildwelt
- exakt ein Hauptcharakter pro Episode
- gleicher Charakter, Haare, Proportionen und Outfit
- dieselbe KidMotion-Gym-Welt
- innerhalb dieser Welt dürfen verschiedene Zonen/Perspektiven genutzt werden, damit nicht jedes Bild gleich aussieht
- keine zweite Person
- keine realen Logos/Teams/Sponsoren
- natürliche Anatomie
- Ganzkörper und wichtige Gelenke sichtbar

Szene 05 ist die Exercise-UI-Referenz für alle späteren Übungsbilder.

## 8. GET READY
Jeder 5s-Übergang hat ein eigenes Flow-Bild.

Pflicht:
- gleicher Charakter
- neutraler Ready-Stand
- **nicht** bereits die nächste Übungspose
- sichtbarer Flow-Text: `GET READY` + `NEXT: <exercise>`
- top-left 230×230 px frei für den Timer

## 9. Remotion — TIMER ONLY
Remotion darf visuell ausschließlich den Countdown-Timer erzeugen.

Erlaubt:
- statisches Flow-Bild 1:1 anzeigen
- 20s Timer über Übung
- 5s Timer über GET READY
- Voice + Hintergrundmusik abspielen
- Szenen zeitlich zusammensetzen

Verboten:
- Progress Bar
- zusätzliche Titel/Instructions
- GET READY/NEXT als Remotion-Text
- Intro/Safety/Outro-Text
- Untertitel/Captions
- Zoom/Pan/Ken Burns auf Workout-Szenen
- Full-scene Fade von leer/schwarz/weiß

### Timer
- 192 px
- top-left, ca. 26 px Abstand
- Safe-Zone 230×230 px
- deutlich größere Zahl
- dunkler klarer Timer-Hintergrund + kräftiger Ring
- Übung: 20→1
- GET READY: 5→1
- kein sichtbarer 0-Frame

## 10. Audio
Genau eine gesprochene Datei: `Voice 01.mp3`.
Sie startet Frame 0, trägt Intro + Safety + LET'S BEGIN nahezu lückenlos und endet vor Übung 1. Ziel 13.65–14.00s, absolut max. 14.05s.

Danach keine Voice und keine Untertitel.

`bg-music.mp3` ist Pflicht.

Musikziel:
- 120–130 BPM
- upbeat playful kids-fitness electro-pop instrumental
- hell, sportlich, spielerisch
- keine Vocals
- kein dunkler Trap-/aggressiver EDM-Sound
- nicht kinderlied-/babyhaft
- möglichst sauber loopbar
- kommerzielle YouTube-Nutzung muss erlaubt sein
- während Opening-Voice leiser, danach spürbar energiereicher

## 11. Visuelle Freigabe
`VISUAL_REVIEW.json` bleibt false, bis die echten Bilder angesehen wurden.

Zusätzlich zu Anatomie/Text/Konsistenz muss geprüft werden:
- `poseVarietyStrong`
- `allGetReadyImagesClearAndNotConfusableWithExercise`

Danach `npm run assets:approve -- --episode=...`.
Approval sperrt Assets per SHA-256.

## 12. Render
Final nur über `npm run render:safe`.

Ablauf:
TypeScript → Project Doctor → Preflight → Asset Gate → Render → Postrender QA.

## 13. Export
`03-export/` enthält mindestens:
- `FINAL_VIDEO.mp4`
- `UPLOAD_METADATA.md` mit copy-ready YouTube-Titel und Beschreibung/Caption

PRODUCTION COMPLETE erst nach visueller MP4-Prüfung.

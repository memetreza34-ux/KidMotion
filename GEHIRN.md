# KidMotion — Projekt-Gehirn

> Diese Datei ist die einzige verbindliche Quelle für Strategie, Produktion und Regeln des KidMotion-Projekts. Bei Widersprüchen gilt immer diese Datei.

---

## 0. Was ist KidMotion?

KidMotion produziert YouTube-Longform-Workout-Videos für Kinder (ca. 5–10 Minuten). Jede Episode ist ein strukturiertes Trainings-Follow-along-Video mit Übungen, Pausen, Timer und Hintergrundmusik. Das Format ist 16:9, 1920×1080, 30 fps. Kein TikTok, keine Reels.

---

## 1. Repository-Struktur

```
KidMotion/
├── GEHIRN.md                        ← diese Datei — höchste Regelquelle
├── START-HIER.md                    ← Schnellstart-Anleitung
├── episodes/
│   └── KM-001-football/
│       ├── 01-skript/               ← voice-text.md mit Fließtext der Sprachaufnahme
│       ├── 02-audio/                ← master.mp3 (Nutzer-Aufnahme) + bg-music.mp3
│       ├── 03-bilder/               ← alle Bild-PNG hier rein + bild-prompts.md
│       ├── 04-data/                 ← data.json (Episodendaten)
│       └── README.md                ← Episodenbeschreibung
├── src/                             ← Remotion-Animationscode
│   ├── components/                  ← alle Screen-Komponenten
│   ├── data/active-workout.ts       ← aktive Episode
│   └── WorkoutVideo.tsx             ← Haupt-Komposition
├── public/
│   └── episodes/
│       ├── KM-001-bilder → ../../episodes/KM-001-football/03-bilder (symlink)
│       └── KM-001-audio  → ../../episodes/KM-001-football/02-audio  (symlink)
├── scripts.md                       ← alle Skripte als Fließtext-Doku
├── package.json
└── out/                             ← gerenderte MP4s (nicht in Git)
```

---

## 2. Episoden-Produktionsablauf

**Phase 1 – Vorbereitung:**
- KI schreibt den Voice-Fließtext → liegt in `01-skript/voice-text.md`
- KI erstellt alle Bildprompts → liegt in `03-bilder/bild-prompts.md`
- KI aktualisiert `04-data/data.json` und `src/data/active-workout.ts`

**Phase 2 – Materialerstellung (Nutzer):**
- Nutzer nimmt Voice als eine einzige Datei auf
- Nutzer speichert als `master.mp3` → in `02-audio/`
- Nutzer erstellt alle Bilder mit Google Flow
- Nutzer legt alle Bilder in `03-bilder/` ab (Benennung: `Bild 00.png`, `Bild 01.png` etc.)
- Phase 2 endet, wenn alle Bilder vorhanden + genau eine master.mp3 vorhanden

**Phase 3 – Produktion (Antigravity):**
- Audio automatisch in Teile zerschneiden (`node scripts/split-master-audio.mjs`)
- TypeScript prüfen
- Preflight prüfen
- Video rendern (`npm run render:safe`)
- MP4 liegt in `out/kidmotion.mp4`

---

## 3. Audio-Regeln

Voice ist nur am Anfang des Videos — Intro, Safety, Let's Begin. Danach ist das Video stumm (außer Hintergrundmusik).

Der Nutzer nimmt alles in einer einzigen Datei auf (`master.mp3`) mit kurzen Pausen zwischen den drei Teilen. Das Skript `split-master-audio.mjs` erkennt die Pausen automatisch und erstellt daraus:
- `Voice 01.mp3` → für das Intro (~8 Sek.)
- `Voice 02.mp3` → für den Safety-Screen (~4 Sek.)
- `Voice 03.mp3` → für Let's Begin (~2 Sek.)

Hintergrundmusik liegt als `bg-music.mp3` in `02-audio/` und läuft leise (15% Lautstärke) durch das gesamte Video.

Kein Voice nach dem Let's Begin-Screen. Kein Ansagen von Übungen. Keine Motivation während der Übungen.

---

## 4. Bild-Regeln

Alle Bilder werden vom Nutzer mit Google Flow erstellt. Antigravity erstellt keine finalen Bilder.

Nummerierung:
- `Bild 00.png` = Cover/Thumbnail (wird nicht im Video verwendet)
- `Bild 01.png` = Intro-Bild
- `Bild 02.png` = Safety-Screen
- `Bild 03.png` = Let's Begin
- `Bild 04.png` bis `Bild 15.png` = Übungen (12 Stück)
- `Bild 16.png` = Outro

Alle finalen Bilder kommen nach: `episodes/KM-001-football/03-bilder/`

---

## 5. Video-Regeln

- Format: 16:9, 1920×1080, 30 fps
- Kein Text auf Übungs-Screens (kommt vom Google-Flow-Bild)
- Timer: kreisförmig, oben links, groß (160px)
- Progress Bar: dünn, oben im Bild
- Keine Untertitel, keine Captions
- Ken Burns Effekt (langsamer Zoom) auf allen Screens
- 0.3 Sekunden Crossfade zwischen Szenen
- Let's Begin: kein Text im Video, nur Bild
- Rest-Screen: zeigt das Bild der nächsten Übung

---

## 6. Remotion-Szenenreihenfolge

```
Intro (8s) → Safety (4s) → Let's Begin (2s) →
[Übung 20s → Rest 5s] × 11 →
Übung 12 (20s, kein Rest) →
Outro (4s)
```

Gesamtlänge: ca. 5 Minuten 34 Sekunden

---

## 7. Mediengrenze

Pflichtbilder und Audio kommen ausschließlich aus der aktiven Episode. Verboten als Ersatz:
- Bilder aus anderen Episoden
- Desktop/Downloads
- generierte Platzhalter (außer für Testrendering)
- old exports

---

## 8. Wann gestoppt wird

Nur bei echten Blockern:
- Pflichtbild fehlt oder ist nicht lesbar
- `master.mp3` fehlt oder ist nicht eindeutig
- Technischer Fehler der nicht automatisch behebbar ist

Dann: **BLOCKED** + exakter Pfad + genau eine erforderliche Nutzeraktion.

---

## 9. Fertig-Definition

**PRODUCTION COMPLETE** erst wenn:
- alle Bilder vorhanden und korrekt nummeriert
- Audio aufgeteilt und in 02-audio/ vorhanden
- TypeScript fehlerfrei
- Preflight fehlerfrei
- MP4 vollständig gerendert und mit Ton geprüft
- Dateigröße unter 100 MB (durch CRF 28 Kompression)

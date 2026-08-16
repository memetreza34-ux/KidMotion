# KidMotion — Projekt-Gehirn

> Diese Datei ist die einzige verbindliche Quelle für Strategie, Produktion und Regeln des KidMotion-Projekts. Bei Widersprüchen gilt immer diese Datei.

---

## 0. Was ist KidMotion?

KidMotion produziert YouTube-Longform-Workout-Videos für Kinder (ca. 5–10 Minuten). Jede Episode ist ein strukturiertes Follow-along-Video mit statischen, klar erkennbaren Hold-Posen, Pausen, Timer und Hintergrundmusik. Das Format ist 16:9, 1920×1080, 30 fps. Kein TikTok, keine Reels.

---

## 1. Repository-Struktur

```text
KidMotion/
├── GEHIRN.md                        ← höchste Regelquelle
├── START-HIER.md                    ← Schnellstart-Anleitung
├── episodes/
│   └── KM-001-football/
│       ├── 01-skript/               ← Intro-Voice-Text
│       ├── 02-audio/                ← Voice 01.mp3 + bg-music.mp3
│       ├── 03-bilder/               ← Bild 00–16 + bild-prompts.md
│       ├── 04-data/                 ← data.json
│       └── README.md
├── src/
│   ├── components/
│   ├── data/active-workout.ts
│   └── WorkoutVideo.tsx
├── public/
│   └── episodes/
│       ├── KM-001-bilder → ../../episodes/KM-001-football/03-bilder
│       └── KM-001-audio  → ../../episodes/KM-001-football/02-audio
├── scripts.md
├── package.json
└── out/
```

---

## 2. Episoden-Produktionsablauf

### Phase 1 — Vorbereitung
- KI plant ausschließlich statische Posen, die aus genau EINEM Bild sofort verständlich sind.
- KI schreibt den kurzen Intro-Voice-Text.
- KI erstellt alle Google-Flow-Bildprompts.
- KI aktualisiert Episodendaten und `src/data/active-workout.ts`.

### Phase 2 — Materialerstellung
- Nutzer erstellt `Voice 01.mp3` oder nimmt eine kurze `master.mp3` nur für das Intro auf.
- Nutzer erstellt alle Bilder mit Google Flow.
- Alle Bilder werden direkt korrekt benannt: `Bild 00.png`, `Bild 01.png` usw.
- Für jede Übung wird vor Freigabe der EIN-BILD-KLARHEITSTEST durchgeführt.

### Phase 3 — Produktion
- Intro-Audio vorbereiten, falls eine `master.mp3` verwendet wurde.
- TypeScript prüfen.
- Preflight prüfen.
- Video rendern.
- Finale MP4 visuell und akustisch prüfen.

---

## 3. Audio-Regeln — HARTE REGEL

**Gesprochene Voice gibt es nur im Intro.**

Aktueller Standard:
- Intro: `Voice 01.mp3`, ca. 6–8 Sekunden
- Safety: KEINE Voice
- Let's Begin: KEINE Voice
- Übungen: KEINE Voice
- Rest: KEINE Voice
- Outro: KEINE Voice

Nach Ende des Intros bleibt das gesamte restliche Video sprachlich still.

Hintergrundmusik darf leise durch das gesamte Video laufen. Sie ist instrumental, freundlich, sportlich-verspielt und enthält keinen Gesang oder gesprochenen Text.

Voice darf niemals als Untertitel, Caption oder Transkript eingeblendet werden.

---

## 4. Bild-Regeln

Alle finalen Szenenbilder werden mit Google Flow erstellt. Antigravity/Remotion erstellt keine Ersatzbilder für fehlende finale Assets.

Nummerierung KM-001:
- `Bild 00.png` = Cover/Thumbnail, nicht im MP4
- `Bild 01.png` = Intro
- `Bild 02.png` = Safety
- `Bild 03.png` = Let's Begin
- `Bild 04.png` bis `Bild 15.png` = 12 Übungen
- `Bild 16.png` = Outro

### EIN-BILD-KLARHEITSTEST — HÖCHSTE ÜBUNGSREGEL

Eine Übung ist nur erlaubt, wenn ein Kind die Pose aus **einem einzigen Standbild** sofort erkennen und nachmachen kann.

Die Pose muss auch ohne Animation und möglichst sogar ohne Text verständlich sein.

Eine Pose ist geeignet, wenn:
- die komplette entscheidende Körperhaltung in genau einem Frame sichtbar ist
- Ganzkörper und wichtige Gelenke sichtbar sind
- Arme und Beine klar voneinander getrennt erkennbar sind
- die Silhouette eindeutig ist
- die Pose einen klaren statischen Endzustand hat
- keine Bewegungsrichtung, Geschwindigkeit oder vorherige/nachfolgende Phase benötigt wird
- keine kleine, schwer erkennbare Detailänderung die Hauptübung ausmacht
- Google Flow sie anatomisch sauber und konsistent darstellen kann

Nicht verwenden:
- Übungen, die erst durch Bewegung verständlich werden
- Kick-, Lauf-, Sprung- oder Ballbewegungen, bei denen Richtung/Timing entscheidend ist
- Vorher/Nachher-Bewegungen
- repetitive Übungen
- Posen, deren Hauptmerkmal nur eine sehr kleine Fuß-/Hand-/Gelenkänderung ist
- Posen mit verdeckten Gliedmaßen oder unklarer Perspektive
- komplexe Verschlingungen von Armen/Beinen
- Posen, die nur durch langen Erklärungstext verständlich werden

**Silhouetten-Test:** Wenn die Pose als schwarze Silhouette immer noch deutlich erkennbar wäre, ist sie in der Regel geeignet.

**Google-Flow-Test:** Wenn eine Pose nach maximal zwei sauberen Generierungsversuchen immer noch anatomisch oder visuell unklar ist, wird die Pose ersetzt — nicht mit mehr Text erklärt.

**Priorität:** Bildklarheit ist wichtiger als perfekte Sport-Spezifik. Lieber eine sehr klare allgemeine Hold-Pose in einer Fußballwelt als eine football-spezifische Bewegung, die in einem Standbild unklar ist.

### Übungsbild-Text
Für `Bild 04`–`Bild 15` erzeugt Google Flow direkt im Bild:
- Exercise Name unten links
- kurze Instruction oben rechts in der KidMotion-Cloud

Diese Texte unterstützen die Pose, dürfen aber niemals eine visuell unklare Pose retten müssen.

Google Flow erzeugt bei Übungen NICHT:
- Timer
- Progress Bar
- Untertitel
- Transcript-Balken

---

## 5. Video-Regeln

- Format: 16:9, 1920×1080, 30 fps
- genau ein Hauptcharakter pro Video
- derselbe Charakter bleibt in jeder sichtbaren Szene erhalten
- keine Untertitel oder Captions
- Ken-Burns-Effekt nur dezent
- kurze saubere Übergänge
- Rest zeigt das Bild der nächsten Übung

Bei Übungen fügt Remotion ausschließlich hinzu:
- 20-Sekunden-Timer oben links
- Progress Bar
- exakte Szenendauer

Remotion erzeugt KEINEN zweiten Übungsnamen und KEINE zweite Beschreibung.

---

## 6. Remotion-Szenenreihenfolge KM-001

```text
Intro 8s → Safety 4s → Let's Begin 2s →
[Übung 20s → Rest 5s] × 11 →
Übung 12 20s → Outro 4s
```

Gesamtlänge KM-001: **313 Sekunden / 5:13**.

---

## 7. Mediengrenze

Pflichtbilder und Audio kommen ausschließlich aus der aktiven Episode. Verboten als Ersatz:
- Bilder aus anderen Episoden
- Desktop/Downloads-Fremdmaterial
- alte Exporte
- Platzhalter im finalen Render

---

## 8. Wann gestoppt wird

Stoppen bei echten Blockern, insbesondere wenn:
- ein Pflichtbild fehlt
- eine Pose den EIN-BILD-KLARHEITSTEST nicht besteht
- der Charakter sichtbar driftet
- Intro-Audio fehlt, obwohl es für den finalen Render vorgesehen ist
- ein technischer Fehler nicht automatisch behebbar ist

Dann: `BLOCKED` + exakter Grund + genau eine notwendige Aktion.

---

## 9. Fertig-Definition

**PRODUCTION COMPLETE** erst wenn:
- alle Bilder vorhanden und korrekt nummeriert sind
- jede Übung den EIN-BILD-KLARHEITSTEST besteht
- derselbe Charakter durchgehend konsistent ist
- nur Intro-Voice verwendet wird
- Hintergrundmusik korrekt gemischt ist
- TypeScript fehlerfrei ist
- Preflight fehlerfrei ist
- MP4 vollständig gerendert und geprüft wurde

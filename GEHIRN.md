# KidMotion — Projekt-Gehirn

> Diese Datei ist die höchste verbindliche Regelquelle für KidMotion. Bei Widersprüchen gilt immer diese Datei.

---

## 0. Format
KidMotion produziert englische YouTube-Longform-Workout-Videos für Kinder mit statischen, klar erkennbaren Hold-Posen.

Standard:
- 16:9
- 1920×1080
- 30 fps
- ca. 5–10 Minuten
- kein TikTok/Reel-Format
- genau EIN Hauptcharakter pro Video

---

## 1. Episodenstruktur
Jede Episode liegt unter:
`episodes/KM-XXX-.../`

Standard-Unterordner:
- `01-skript/` — ein copy-ready Opening-Voice-Fließtext
- `02-audio/` — `Voice 01.mp3` + `bg-music.mp3`
- `03-bilder/` — `Bild 00.png` bis `Bild 16.png` + Google-Flow-Prompts
- `04-data/` — `data.json`

`Bild 00.png` ist nur Cover/Thumbnail und kommt niemals in das MP4.

---

## 2. Produktionsablauf
### Phase A — Planung
- nur statische Posen auswählen, die aus EINEM Standbild verständlich sind
- Opening-Voice als EINEN Fließtext schreiben
- Bildprompts erstellen
- Episodendaten aktualisieren

### Phase B — Assets
- genau eine Opening-Voice-Datei `Voice 01.mp3`
- eine lizenzierte `bg-music.mp3`
- Google Flow erzeugt `Bild 00`–`Bild 16`
- jedes Bild sofort prüfen und umbenennen

### Phase C — Produktion
- aktive Episode sauber mappen
- TypeScript
- Preflight
- Render
- Postrender-QA
- visuelle Prüfung aller Szenengrenzen

---

## 3. Audio — HARTE REGEL
### Eine einzige gesprochene Datei
Es gibt genau EINE gesprochene Datei:
`Voice 01.mp3`

Sie startet im Intro und darf natürlich über die komplette kurze Opening-Sequenz laufen:
- Intro ca. 8s
- Safety ca. 4s
- LET'S BEGIN ca. 2s

Ziel: ungefähr 11–14 Sekunden.
Sie MUSS vor der ersten Übung komplett beendet sein.

Danach:
- Übungen: keine Voice
- Rest: keine Voice
- Outro: keine Voice

Keine separaten Voice-Dateien für Safety/LET'S BEGIN.
Keine Übungsansagen.
Keine Countdown-Stimme.
Keine Motivations-Füllsätze.
Keine Untertitel, Captions oder Transkripte.

### Script-Format
Der gesprochene Text wird für den Nutzer immer als genau EIN kopierfertiger Fließtext geschrieben.
Keine Teil-1/Teil-2-Aufteilung, keine Regiehinweise im Copy-Text.

### Hintergrundmusik — FINAL REQUIRED
Für einen finalen Render ist `bg-music.mp3` Pflicht.

Musik:
- instrumental
- kinderfreundlich
- sportlich/spielerisch
- keine Lyrics
- keine gesprochenen Samples
- während Opening-Voice leiser
- danach etwas lauter
- durch das komplette Video geloopt

Ein finaler Render darf nach dem Opening nicht digital still werden.

---

## 4. EIN-BILD-KLARHEIT — HÖCHSTE ÜBUNGSREGEL
Eine Übung ist nur erlaubt, wenn ein Kind die Pose aus genau EINEM Standbild sofort erkennen und nachmachen kann.

Pflicht:
- Ganzkörper sichtbar
- wichtige Gelenke sichtbar
- Arme/Beine klar getrennt
- eindeutige Silhouette
- klarer statischer Endzustand
- keine Bewegungsrichtung nötig
- keine Geschwindigkeit nötig
- kein Vorher/Nachher nötig
- keine kleinen Mikrodetails als Hauptmerkmal
- natürliche Anatomie

Nicht verwenden:
- Kick-/Lauf-/Sprungbewegungen, wenn Bewegung entscheidend ist
- Dribbling/Pass/Shooting als Bewegungsablauf
- repetitive Übungen
- komplex verschränkte Gliedmaßen
- verdeckte Füße/Hände bei relevanten Posen

Silhouetten-Test: Wenn die Pose als schwarze Silhouette nicht klar wäre, ist sie ungeeignet.

Google-Flow-Test: Nach maximal zwei ernsthaften Fehlversuchen wird die Pose ersetzt, nicht mit mehr Text gerettet.

Bildklarheit ist wichtiger als perfekte Sportspezifik.

---

## 5. Google Flow — Bildverantwortung
### Charakterkontinuität
- pro Video genau ein Charakter
- `Bild 01.png` wird nach Freigabe PRIMARY character/world reference für alle späteren Bilder
- gleiche Identität, Haare, Proportionen, Outfit und Welt
- keine zweite Person

### Exercise UI direkt im Bild
Für `Bild 04`–`Bild 15` erzeugt Google Flow direkt:
- ONE exercise title bottom-left
- ONE short instruction cloud top-right

`Bild 04` wird nach Freigabe zusätzlich als SECONDARY UI/LAYOUT reference für `Bild 05`–`Bild 15` benutzt.

Damit müssen über alle Übungen gleich bleiben:
- Titelstil
- Titelgröße
- Titelposition
- Cloudform
- Cloud-Rand
- Textstil
- Abstände

Verboten:
- Thought-bubble dots
- zufällige Bubble-Formen
- wechselnde Fonts/Farben
- Text am Rand abgeschnitten
- doppelte Titel/Instructions

### Safe Zones
Bei Exercise-Bildern:
- TOP-LEFT ca. 220×220 px frei für Remotion-Timer
- unterste ca. 90 px frei für Progress Bar
- Titel oberhalb dieses unteren Safe-Bereichs
- Cloud oben rechts mit sicherem Rand

### Ball-/Prop-Regel
Wenn eine Pose keinen Ball braucht: ZERO Bälle im gesamten Bild.
Wenn eine Pose einen Ball braucht: EXACTLY ONE Ball.
Keine losen/background duplicate Bälle.

### Textfreie Nicht-Übungsbilder
`Bild 01`, `Bild 02`, `Bild 03` und `Bild 16` enthalten ZERO Google-Flow-Text.
Remotion besitzt Intro-, Safety-, LET'S-BEGIN- und Outro-Grafiken.

`Bild 16` darf insbesondere KEIN `GREAT JOB` enthalten.

---

## 6. Remotion — HARTE VIDEOREGELN
### Kein Blank-Flash
Jedes Szenenbild muss im allerersten Frame vollständig sichtbar sein.

Verboten:
- Full-scene fade von opacity 0
- schwarze 0.3s-Blitze
- weiße/pastellige 0.3s-Blitze
- blanke Übergangsframes

### Kein Ken Burns auf Exercise/Rest
Exercise- und Rest-Bilder enthalten eingebrannten Google-Flow-Text.
Darum:
- kein Zoom
- kein Scale 1.00→1.06
- kein Pan
- keine Bewegung, die Titel/Cloud croppt

Exercise- und Rest-Source-Images bleiben statisch bei 1:1 framing.

### Übungen
Remotion fügt bei Übungen NUR hinzu:
- 20s circular timer top-left
- progress bar
- exakte 20s Szenendauer

Kein zweiter Übungsname.
Keine zweite Beschreibung.

### Rest
Rest zeigt das NÄCHSTE Exercise-Bild full-screen.
Remotion fügt nur einen kompakten `REST + countdown` Block TOP-LEFT hinzu.

TOP-RIGHT Rest-Countdown ist verboten, weil dort die Google-Flow-Instruction-Cloud liegt.
Kein `NEXT: pose`.

### Intro
Sauber und kurz.
Nur:
- KIDMOTION + Theme
- 5 MIN ... WORKOUT
- 12 POSES • 20 SEC EACH
- FOLLOW ALONG

Kein `WELCOME TO`.
Keine doppelten Chips.
Kein `COPY • HOLD • HAVE FUN`.
Keine unnötigen Slogans.

### Safety
`Bild 02` bleibt ab Frame 1 sichtbar.
Nur kurze Safety-Grafik.

### LET'S BEGIN
`Bild 03` bleibt ab Frame 1 sichtbar.
Remotion zeigt EIN klares `LET'S BEGIN!`.

### Outro
`Bild 16` ist komplett textfrei.
Remotion zeigt genau EINMAL:
- GREAT JOB!
- WORKOUT COMPLETE

Keine doppelte Completion-Grafik.

---

## 7. Standard-Timing
```text
Intro 8s → Safety 4s → LET'S BEGIN 2s →
[Exercise 20s → Rest 5s] × 11 →
Exercise 12 20s → Outro 4s
```

Standard: 313s / 5:13.

---

## 8. Final-QA
PRODUCTION COMPLETE erst wenn:
- alle Pflichtbilder vorhanden
- jede Pose besteht EIN-BILD-KLARHEIT
- Charakter konsistent
- kein zweiter Mensch
- UI-Stil der Exercise-Bilder konsistent
- Ballanzahl korrekt
- keine schwarzen/weißen Boundary-Flashes
- keine Exercise/Rest-Zoom-Crops
- Rest-UI kollidiert nicht mit Instruction-Cloud
- LET'S BEGIN sichtbar
- Outro nicht doppelt beschriftet
- Voice 01 läuft nur im Opening und endet vor Übung 1
- Hintergrundmusik läuft durch das gesamte Video
- keine Untertitel
- TypeScript passt
- Preflight passt
- Postrender-QA passt
- MP4 visuell geprüft

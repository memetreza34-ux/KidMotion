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
Jede Episode liegt ausschließlich unter:
`episodes/KM-XXX-.../`

Standard-Unterordner:
- `01-skript/` — ein copy-ready Opening-Voice-Fließtext
- `02-audio/` — `Voice 01.mp3` + `bg-music.mp3`
- `03-bilder/` — `Bild 00.png` bis `Bild 16.png` + Google-Flow-Prompts
- `04-data/` — `data.json`, `VISUAL_REVIEW.json`, später `ASSET_APPROVAL.json`
- `GENERATION-REVISION.txt` — aktuelle Asset-Revision

`Bild 00.png` ist nur Cover/Thumbnail und kommt niemals in das MP4.

Legacy-Ordner `content/episodes` dürfen nicht mehr als aktive Produktionsquelle benutzt werden.

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

### Phase C — Visuelle Freigabe — PFLICHT
Bevor gerendert werden darf, müssen die tatsächlichen finalen Assets visuell geprüft werden.

`04-data/VISUAL_REVIEW.json` bleibt standardmäßig auf `false`.
Ein Flag darf erst auf `true` gesetzt werden, wenn die finalen Bilddateien wirklich angesehen und geprüft wurden.

Pflichtprüfung:
- gleicher Charakter in jeder Szene
- jede Pose aus einem Standbild klar
- Titel/Cloud über alle Übungen konsistent und lesbar
- Timer-/Progress-Safe-Zones frei
- Ball-/Prop-Anzahl korrekt
- Bild 01/02/03/16 ohne Google-Flow-Text
- keine zweite Person
- keine Anatomiefehler
- keine wichtigen Gliedmaßen abgeschnitten

Erst danach:
```bash
npm run assets:approve -- --episode=KM-XXX-slug
```

`assets:approve` erstellt `ASSET_APPROVAL.json` und sperrt alle freigegebenen Bild-/Audiodateien per SHA-256.

**Nach der Freigabe gilt:** Wird auch nur eine Bild- oder Audiodatei verändert/ersetzt, ist die Freigabe automatisch ungültig und der Render wird blockiert.

### Phase D — Produktion
- aktive Episode sauber mappen
- TypeScript
- Project Doctor
- Preflight
- Asset Gate
- Render
- Postrender-QA
- finale MP4 visuell prüfen

---

## 3. Audio — HARTE REGEL
### Eine einzige gesprochene Datei
Es gibt genau EINE gesprochene Datei:
`Voice 01.mp3`

Sie startet direkt bei Frame 0 und MUSS die komplette kurze Opening-Sequenz sprachlich tragen:
- Intro ca. 8s
- Safety ca. 4s
- LET'S BEGIN ca. 2s
- danach beginnt Exercise 1

Standard-Opening: 14 Sekunden.

### CONTINUOUS OPENING VOICE — HARTE REGEL
Vom ersten Frame bis unmittelbar vor Exercise 1 soll der Sprecher praktisch durchgehend zu hören sein.

Das bedeutet:
- Voice beginnt sofort bei 0s; kein Musik-only-Intro vor dem ersten gesprochenen Wort
- Intro, Safety und LET'S BEGIN sind Teil EINES zusammenhängenden Sprechertexts
- Safety darf nicht nur Musik + Textkarte sein
- LET'S BEGIN darf nicht nur Musik + Textkarte sein
- natürliche kurze Atem-/Satzpausen sind erlaubt
- längere leere Voice-Abschnitte im Opening sind verboten
- Hintergrundmusik zählt NICHT als Ersatz für Voiceover
- der Text muss lang genug für das tatsächliche TTS-Sprechtempo sein
- niemals den Text künstlich kürzen, nur um eine Ziel-Wortzahl einzuhalten

Für ein 14s-Opening soll die tatsächlich erzeugte Voice ungefähr 13,65–14,00s lang sein und vollständig vor Exercise 1 enden. Wenn die Voice deutlich früher endet und mehrere Sekunden nur Musik übrig bleiben, ist das Opening NICHT freigegeben: Script verlängern oder Voice neu erzeugen.

Danach:
- Übungen: keine Voice
- Rest: keine Voice
- Outro: keine Voice

Keine separaten Voice-Dateien für Safety/LET'S BEGIN.
Keine Übungsansagen.
Keine Countdown-Stimme.
Keine Motivations-Füllsätze nach dem Opening.
Keine Untertitel, Captions oder Transkripte.

### Script-Format
Der gesprochene Text wird für den Nutzer immer als genau EIN kopierfertiger Fließtext geschrieben.
Keine Teil-1/Teil-2-Aufteilung, keine Regiehinweise im Copy-Text.

Bei der Script-Erstellung zuerst die tatsächliche Opening-Dauer und das geplante TTS-Sprechtempo berücksichtigen. Das Ziel ist keine feste Wortzahl, sondern eine natürlich klingende, nahezu lückenlose Voice-Abdeckung bis Exercise 1.

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
Opening-Voice läuft hier weiter; Safety ist kein Voice-Loch.

### LET'S BEGIN
`Bild 03` bleibt ab Frame 1 sichtbar.
Remotion zeigt EIN klares `LET'S BEGIN!`.
Opening-Voice läuft hier weiter und endet erst unmittelbar vor Exercise 1.

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

Opening-Voice-Coverage: nahezu die vollen ersten 14s, danach keine Voice.

---

## 8. Automatische Regression-Sperren
Ein finaler Render darf ausschließlich mit `npm run render:safe` erzeugt werden.

`render:safe` führt aus:
```text
TypeScript
→ project:doctor
→ preflight
→ asset:gate
→ render
→ postrender:qa
```

### project:doctor blockiert u. a.
- Rückkehr eines Short-Formats
- Exercise-/Rest-Zoom oder Full-image-Fade
- überladenes Intro
- fehlendes LET'S BEGIN
- nicht geloopte Musik
- spätere separate Voice-Wiedergabe
- falsche/alte Episodenstruktur

### preflight blockiert u. a.
- fehlende Opening-Voice
- Voice, die über Exercise 1 hinausläuft
- eine Opening-Voice, die die 14s-Opening-Sequenz deutlich zu früh verlässt und Voice-Dead-Air erzeugt

### asset:gate blockiert
- fehlende visuelle Freigabe
- fehlendes ASSET_APPROVAL
- falsche Revision
- nicht freigegebene Assets
- jede nachträgliche Änderung an Bild/Voice/Musik nach Freigabe

### postrender:qa prüft die echte MP4
- exakte Laufzeit
- laufende Musik im Workout
- schwarze Segmente
- blank/helle Szenengrenzen

**Wichtig:** Automatische Checks ersetzen nicht die visuelle Bildprüfung. Semantische Fehler wie falsche Pose, falscher Charakter, falsche Ballanzahl oder schlechte Textplatzierung müssen vor `assets:approve` direkt am Bild geprüft werden.

---

## 9. Final-QA
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
- Voice 01 startet sofort bei Frame 0
- Voice 01 trägt Intro + Safety + LET'S BEGIN nahezu lückenlos
- kein längerer Musik-only-Abschnitt vor Exercise 1
- Voice 01 endet unmittelbar vor Exercise 1 und läuft niemals in die Übung hinein
- Hintergrundmusik läuft durch das gesamte Video
- keine Untertitel
- VISUAL_REVIEW vollständig wahrheitsgemäß abgeschlossen
- ASSET_APPROVAL erzeugt und unverändert gültig
- TypeScript passt
- Project Doctor passt
- Preflight passt
- Asset Gate passt
- Postrender-QA passt
- MP4 visuell geprüft

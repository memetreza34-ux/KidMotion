# KidMotion — Antigravity Instructions

Diese Datei ist der direkte Arbeitsvertrag für Antigravity.

## Reihenfolge der Regeln
Vor jeder KidMotion-Arbeit lesen:
1. `GEHIRN.md` — höchste verbindliche Regelquelle
2. `START-HIER.md` — aktueller Produktions-Schnellstart
3. `PROJECT_BRAIN.md` — kompakter Spiegel der Produktionsregeln
4. diese Datei — Antigravity-spezifische Ausführung

Bei Widerspruch gilt immer `GEHIRN.md`.

**Legacy-Hinweis:** Falls eine ältere Episode oder ein älterer Generator noch `11–14s` als Voice-Ziel nennt, ist dieser Wert veraltet. Für das Standard-Opening gilt ab jetzt die Continuous-Voice-Regel unten mit ungefähr `13.65–14.00s`. Antigravity darf den alten Wert nicht als Freigabe für mehrere Sekunden Music-only-Opening verwenden.

---

## 1. CONTINUOUS OPENING VOICE — NICHT VERHANDELBAR
KidMotion hat genau EINE gesprochene Datei: `Voice 01.mp3`.

Standard-Opening:
- Intro: 8s
- Safety: 4s
- LET'S BEGIN: 2s
- Exercise 1 startet bei 14s

Antigravity MUSS sicherstellen:
- Voice startet direkt bei Frame 0
- derselbe zusammenhängende Sprechertext läuft über Intro + Safety + LET'S BEGIN
- der Sprecher ist praktisch bis unmittelbar vor Exercise 1 zu hören
- Hintergrundmusik ersetzt niemals Voiceover
- Safety darf nicht zu einer Music-only-Szene werden
- LET'S BEGIN darf nicht zu einer Music-only-Szene werden
- natürliche kurze Atem-/Satzpausen sind okay
- längere Voice-Leerstellen im Opening sind nicht okay
- Voice endet vor Exercise 1 und läuft niemals in die erste Übung hinein

Für ein 14s-Opening gilt als technisches Ziel für die fertig erzeugte Datei:
`Voice 01.mp3 ≈ 13.65–14.00s`

Der Text wird nach dem tatsächlichen TTS-Sprechtempo dimensioniert, NICHT nach einer starren Wortzahl.

Wenn die erzeugte Voice zu früh endet:
1. NICHT mit Musik auffüllen.
2. NICHT die Opening-Szenen leer lassen.
3. Script sinnvoll verlängern.
4. Voice neu erzeugen.
5. `npm run preflight` bzw. den guarded Render erneut ausführen.

Der vorhandene Preflight blockiert eine Voice, die die Opening-Sequenz deutlich zu früh verlässt.

### Script-Regel
Opening-Script immer als genau EINEN kopierfertigen englischen Fließtext liefern.

Der Text soll inhaltlich über die drei Opening-Szenen fließen:
- sofortige Begrüßung/Thema
- kurzer Workout-Kontext
- Safety-Hinweis
- motivierender Übergang
- Abschluss mit natürlichem „Let's begin“ unmittelbar vor Exercise 1

Keine Teilung in Voice 01/02/03.
Keine Regiehinweise im Copy-Text.
Keine Untertitel/Voice-Captions.

---

## 2. NACH DEM OPENING KEINE SPRACHE
Nach Sekunde 14:
- Exercise: keine Voice
- Rest: keine Voice
- Outro: keine Voice
- keine gesprochenen Countdowns
- keine Motivations-Füllsätze

Ab dort trägt die Hintergrundmusik das Video.

---

## 3. MUSIK
`bg-music.mp3` ist für finalen Render Pflicht:
- instrumental
- kinderfreundlich
- sportlich/spielerisch
- keine Lyrics
- keine gesprochenen Samples
- während Voice leiser
- nach dem Opening etwas lauter
- durch das komplette Video loopen

Musik ist Atmosphäre, nicht Ersatz für fehlende Opening-Narration.

---

## 4. ASSET-SICHERHEIT
Antigravity darf nach `assets:approve` keine freigegebenen Bilder oder Audios unbemerkt ersetzen.

Ändert sich ein Asset:
- VISUAL/AUDIO-QA erneut durchführen
- Asset Approval neu erzeugen
- erst danach rendern

Nie einen Gate umgehen, nur um einen Render fertigzubekommen.

---

## 5. FINALER OPENING-QA
Vor `PRODUCTION COMPLETE` explizit prüfen:

- [ ] Voice startet beim ersten Frame
- [ ] Intro hat durchgehende Narration
- [ ] Safety hat weiterhin Narration
- [ ] LET'S BEGIN hat weiterhin Narration
- [ ] keine mehrsekündige Music-only-Lücke vor Exercise 1
- [ ] Voice endet unmittelbar vor Exercise 1
- [ ] Voice läuft nicht in Exercise 1 hinein
- [ ] Musik läuft darunter und anschließend weiter
- [ ] `preflight` besteht
- [ ] finale MP4 wurde auch akustisch kontrolliert

Wenn einer dieser Punkte nicht stimmt, ist das Video NICHT fertig.

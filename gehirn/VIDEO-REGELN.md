# KidMotion — Video-Regeln

## Grundprinzip
Eine Szene = eine klare Aufgabe, Pose, Frage oder Story-Etappe.

## FESTE VIDEO-REIHENFOLGE
Jedes KidMotion-Video folgt standardmäßig dieser Reihenfolge:

1. `00-cover` — Cover / Thumbnail mit sichtbarem englischem Text
2. `01-intro` — gesprochenes Intro mit synchronisierten Textblöcken
3. `02-start-cue` — kurze Startkarte wie `LET'S BEGIN!`
4. erste Übung / Aktivität
5. weitere Übungen mit Rest-/Übergangsscreens
6. Outro / `GREAT JOB!`

Diese Reihenfolge darf nur geändert werden, wenn der Nutzer es ausdrücklich verlangt.

## HARTE REGEL — Szene 1 ist immer das gesprochene Intro
JEDES KidMotion-Video beginnt nach dem Cover mit einer festen Intro-Szene im Stil eines freundlichen Kids-Fitness-Hosts.

Die Intro-Szene besteht aus:
- einer KidMotion-Hauptfigur als statisches Ganz- oder Halbkörperbild auf einer Seite
- großem englischem Intro-Text auf der freien Seite
- einer englischen Sprecherstimme
- Textzeilen, die zeitlich passend zur Stimme eingeblendet / hervorgehoben werden
- ruhigem, wiedererkennbarem KidMotion-Hintergrund
- KEINEM Übungstimer in dieser Intro-Szene

### Zweck der Intro-Szene
Die ersten Sekunden sollen dem Kind sofort erklären:
1. Begrüßung / positive Ansprache
2. was heute gemacht wird
3. kurze motivierende Regel wie copy the moves / have fun / get ready
4. direkter Übergang in die erste Übung

### Beispielstruktur
Gesprochener Text:
`Hi, KidMotion friends! Today we have five easy fitness moves. Follow along, do your best, and have fun. Get ready — let's move!`

Auf dem Bildschirm darf derselbe Inhalt in kurzen lesbaren Blöcken erscheinen, z. B.:
- `HI, KIDMOTION FRIENDS!`
- `5 EASY FITNESS MOVES TODAY`
- `FOLLOW ALONG & HAVE FUN`
- `GET READY — LET'S MOVE!`

Nicht den kompletten Absatz dauerhaft gleichzeitig anzeigen. Die Textblöcke erscheinen nacheinander passend zum Voice-Timing.

### Remotion-Synchronisation
Die Intro-Texte werden als einzelne Cues mit Start-/Endzeit bzw. Frames gespeichert. Remotion soll:
- die aktuelle Textzeile sichtbar hervorheben
- vorherige Zeilen optional sichtbar lassen, aber visuell schwächer darstellen
- neue Zeilen synchron zur gesprochenen Stimme einblenden
- einfache Fade-/Slide-Transitions nutzen
- keinen Karaoke-Wort-für-Wort-Effekt erzwingen; bevorzugt Satz-/Phrase-Synchronisation

### Intro-Layout
Standard:
- Textbereich ungefähr 55–65 % der Breite
- Figur ungefähr 35–45 % der Breite
- Figur kann je nach Episode links oder rechts stehen, um Abwechslung zu schaffen
- große, fette, kontrastreiche Schrift
- maximal ca. 3–5 kurze Textblöcke
- Figur zeigt eine freundliche Begrüßungs-/Ready-Pose passend zum Thema
- visuelles Grunddesign bleibt kanalweit wiedererkennbar, darf aber thematisch leicht variieren

## HARTE REGEL — nach dem Intro kommt eine kurze Startkarte
Direkt nach `01-intro` kommt immer eine eigene kurze `02-start-cue`-Szene, bevor die erste Übung beginnt.

Zweck:
- klarer Übergang von Erklärung zu Aktivität
- Kind erkennt sofort: jetzt beginnt das Mitmachen
- wiederkehrendes Markenritual für KidMotion

Standardinhalt:
- großer englischer Starttext wie `LET'S BEGIN!`, `LET'S MOVE!` oder `READY? LET'S GO!`
- bevorzugt `LET'S BEGIN!` als Standardformulierung
- dieselbe KidMotion-Hauptfigur wie im Video
- klare energetische Start-/Ready-Pose
- einfacher, kontrastreicher Hintergrund im KidMotion-Stil
- kein langer Voice-Text nötig; optional kurzer Voice-Cue wie `Let's begin!`
- kein Übungstimer in dieser Karte

Timing:
- typischerweise ca. 2–4 Sekunden
- anschließend optional `3...2...1...GO` direkt vor der ersten Übung

Remotion soll diese Startkarte als wiederverwendbare Komponente bauen, nicht als jedes Mal neu manuell gestaltete Szene.

## Textebenen pro Übungsszene
1. Exercise / Pose Name — groß, z. B. `TREE POSE`
2. Keyword — sehr kurz, z. B. `BALANCE`
3. Mini instruction — stichwortartig, z. B. `Lift one foot`
4. Voice captions — gesprochener englischer Text
5. Timer / countdown
6. Progress indicator

Diese Ebenen dürfen nicht unnötig denselben Satz wiederholen.

## Standard-Timing
Je nach Format anpassen. Für Follow-along:
- Intro: typischerweise 8–18 s, abhängig vom Voice-Text
- Startkarte: typischerweise 2–4 s
- Start cue: optional 3…2…1…GO
- Übung/Pose: typischerweise 15–30 s
- Rest/transition: typischerweise 5–10 s
- Outro/reward: 3–8 s

## Remotion liefert
- synchronisierte Intro-Text-Cues
- wiederverwendbare `LET'S BEGIN!`-Startkarte
- Timer
- Countdown
- Progress bar / exercise progress
- Exercise title
- keyword
- mini instruction
- captions
- transitions
- image zoom/pan
- rest screen
- completion/reward screen
- optional SFX/music

## Statische Bilder
Keine Szene darf davon abhängen, dass sich die Figur real animiert. Bei Bewegungen mit zwei wichtigen Zuständen können zwei statische Keyframes abwechselnd verwendet werden.

Die Intro- und Startkarten-Figur bleibt ebenfalls ein Standbild. Bewegung entsteht durch dezente Remotion-Effekte wie langsamer Zoom, leichte Positionsverschiebung, Text-Einblendungen und Übergänge.

## Lesbarkeit
- große, klare Schrift
- wenig Text pro eingeblendetem Block
- wichtige UI nicht über Gesicht/Hände/Füße legen
- kindersicheres, ruhiges Layout
- Timer jederzeit sofort erkennbar

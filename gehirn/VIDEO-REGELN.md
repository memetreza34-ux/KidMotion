# KidMotion — Video-Regeln

## 1. Ein Video = ein Hauptcharakter
Pro Episode wird genau EIN KidMotion-Hauptcharakter gewählt. Derselbe Charakter bleibt von Intro bis Outro sichtbar. Kein Wechsel zwischen Boy und Girl. Gesicht, Haare, Alter, Proportionen, Outfit und Themenwelt bleiben innerhalb der Episode konsistent.

## 2. HARTE REGEL — jede sichtbare Videosektion nutzt ein Charakterbild
Keine leeren/plain Remotion-Flächen als eigentliche Szene.

Standard:
- Intro → eigenes Bild mit dem Episoden-Charakter
- Safety → eigenes Bild mit dem Episoden-Charakter
- LET'S BEGIN → eigenes Bild mit dem Episoden-Charakter
- Übungen → eigenes Bild mit dem Episoden-Charakter
- Rest → Bild der nächsten Übung als Fullscreen-Hintergrund wiederverwenden
- Outro → eigenes Bild mit dem Episoden-Charakter

Cover `Bild 00.png` bleibt nur Thumbnail und wird nicht im Video abgespielt.

## 3. Keine Untertitel
Im gesamten Video gibt es KEIN Untertitel-System.

Verboten:
- automatische Captions
- Wort-für-Wort-Text der Voice
- graue/schwarze Transcript-Balken
- Karaoke-Text
- mittige oder untere Subtitle-Boxen

Erlaubt sind nur bewusst gestaltete Remotion-Grafiken wie Intro-Text, Safety, LET'S BEGIN, Übungsname, kurze Übungsanweisung, Timer, Progress, Rest/Next und Outro.

## 4. Google Flow erzeugt saubere Bilder
Außer Cover enthalten die generierten Bilder keine Video-UI.

Nicht ins Bild generieren:
- Übungsname
- Anweisung
- Cloud
- Untertitel
- Timer
- Progress Bar
- sonstige UI

Remotion legt diese Elemente später direkt auf das Bild.

## 5. Übungs-Layout
- Bild fullscreen
- Übungsname unten links
- kurze Anweisung oben rechts in KidMotion-Cloud
- 20-Sekunden-Timer oben links
- Progress Bar unten
- Figur bleibt vollständig und gut erkennbar

## 6. Timing
Aktuelles Standardformat:
- ca. 10–12 statische Hold-Übungen
- jede Übung exakt 20 Sekunden
- Rest typischerweise 5 Sekunden
- Video mindestens ca. 5 Minuten

Timer startet bei 20 und erreicht 0. Progress Bar erreicht 100%.

## 7. Voice
Voice nur wenn sinnvoll.
Ein kurzer Voice-Cue am Anfang einer 20-Sekunden-Übung verkürzt die Szene nicht. Danach bleibt die restliche Hold-Zeit still.

Ein 5-Minuten-Video kann deutlich weniger als 5 Minuten gesprochene Voice enthalten.

## 8. Rest-Screens
Rest ist keine leere Karte.
Remotion verwendet das Bild der NÄCHSTEN Übung als Fullscreen-Hintergrund, dimmt es leicht und zeigt nur:
- REST
- Rest-Timer
- NEXT: [Übung]

Der gleiche Episoden-Charakter bleibt dadurch sichtbar.

## 9. Standard-Reihenfolge
1. Cover — Thumbnail only
2. Intro — Bild + Remotion-Grafik
3. Safety — Bild + Remotion-Grafik
4. LET'S BEGIN — Bild + Remotion-Grafik
5. Übungen — jeweils Bild + Remotion-UI
6. Rest — nächstes Übungsbild + Rest-UI
7. Outro — Bild + GREAT JOB

## 10. QA
Ein Render ist nicht akzeptabel, wenn:
- Untertitel/Transcript-Balken auftauchen
- eine blanke Szene den Charakter ersetzt
- der Charakter wechselt
- alte Bilder mit eingebranntem Übungstext verwendet werden
- eine Übung nicht exakt 20 Sekunden dauert
- Timer/Progress falsch enden
- Cover im MP4 abgespielt wird

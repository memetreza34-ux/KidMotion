# KidMotion — Video-Regeln

## 1. Ein Video = ein Hauptcharakter
Pro Episode wird genau EIN KidMotion-Hauptcharakter gewählt. Derselbe Charakter bleibt von Intro bis Outro sichtbar. Kein Wechsel zwischen Boy und Girl. Gesicht, Haare, Alter, Proportionen, Outfit und Themenwelt bleiben innerhalb der Episode konsistent.

## 2. Jede sichtbare Videosektion nutzt ein Charakterbild
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

Intro-Grafiken sind feste Markeninformationen und kein Voice-Transkript.

## 4. Anfang muss vollständig wirken
Intro bleibt auf `Bild 01` mit demselben Charakter und enthält feste, gebrandete Informationen.

Für KM-001:
- WELCOME TO
- KIDMOTION FOOTBALL
- 5 MIN FOOTBALL TRAINING
- BALANCE • CONTROL • STRONG POSITIONS
- 12 POSES
- 20 SEC EACH
- FOLLOW ALONG
- COPY • HOLD • HAVE FUN

Danach folgen eine eigene Safety-Szene und eine eigene LET'S-BEGIN-Szene.

## 5. Google Flow macht Übungsname + Beschreibung direkt ins Bild
HARTE REGEL für Übungsbilder:
- Übungsname unten links wird von Google Flow direkt in `Bild XX.png` erzeugt
- kurze Ausführungsanweisung oben rechts in weißer KidMotion-Cloud wird ebenfalls von Google Flow direkt erzeugt
- genau ein Titel und genau eine kurze Anleitung

Google Flow erzeugt bei Übungen NICHT:
- Untertitel
- Transcript-Balken
- Timer
- Progress Bar

## 6. Remotion macht KEINEN Übungsnamen und KEINE Übungsbeschreibung
Bei Übungsszenen ist Remotion nur zuständig für:
- 20-Sekunden-Timer oben links
- Progress Bar unten
- exakte 20-Sekunden-Szenendauer
- Voice-Platzierung, wenn Audio vorhanden ist

Remotion darf den bereits im Bild vorhandenen Übungsnamen oder die Anleitung NICHT duplizieren.

## 7. Rest-Screens
Rest ist keine leere Karte.
Remotion zeigt das Bild der NÄCHSTEN Übung fullscreen. Dieses Bild enthält bereits den Google-Flow-Übungsnamen und die Anleitung.

Remotion legt deshalb beim Rest nur darüber:
- REST
- Rest-Timer

Kein `NEXT: [POSE NAME]` aus Remotion und keine zusätzliche Beschreibung.

## 8. Timing
Aktuelles Standardformat:
- ca. 10–12 statische Hold-Übungen
- jede Übung exakt 20 Sekunden
- Rest typischerweise 5 Sekunden
- Video mindestens ca. 5 Minuten

Timer startet bei 20 und erreicht 0. Progress Bar erreicht 100%.

## 9. Voice
Voice nur wenn sinnvoll.
Ein kurzer Voice-Cue am Anfang einer 20-Sekunden-Übung verkürzt die Szene nicht. Danach bleibt die restliche Hold-Zeit still.
Audio ist für die aktuelle visuelle Korrektur zweitrangig.

## 10. Standard-Reihenfolge
1. Cover — Thumbnail only
2. Intro — Bild + vollständige Opening-Grafik
3. Safety — Bild + Safety-Grafik
4. LET'S BEGIN — Bild + Start-Grafik
5. Übungen — Google-Flow-Bild mit Titel + Anleitung, Remotion nur Timer + Progress
6. Rest — nächstes Übungsbild + REST + Countdown
7. Outro — Bild + GREAT JOB

## 11. QA
Ein Render ist nicht akzeptabel, wenn:
- Untertitel/Transcript-Balken auftauchen
- eine blanke Szene den Charakter ersetzt
- der Charakter wechselt
- Remotion Übungsname oder Übungsbeschreibung zusätzlich einblendet
- Google Flow bei einer Übung Titel oder Anleitung vergessen hat
- Titel/Anleitung doppelt erscheinen
- eine Übung nicht exakt 20 Sekunden dauert
- Timer/Progress falsch enden
- Cover im MP4 abgespielt wird

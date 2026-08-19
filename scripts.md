# KidMotion — Scripts Dokumentation

`GEHIRN.md` bleibt die höchste Regelquelle.

## npm run start
Startet Remotion Studio für Preview und visuelle QA.

## npm run kidmotion:activate -- --episode=KM-XXX-name
Aktiviert die gewünschte Episode.

Aktueller kanonischer Pfad:
`episodes/<episode>/04-data/data.json`

Das Script:
- liest die Episodendaten
- erstellt/aktualisiert öffentliche Episode-Aliase für Bilder und Audio
- erzeugt `src/data/active-workout.ts`
- mappt `Voice 01.mp3`, falls vorhanden
- mappt `bg-music.mp3`, falls vorhanden
- schreibt den ACTIVE_EPISODE Pointer

Die eine Voice darf über Intro + Safety + LET'S BEGIN laufen und muss vor Exercise 1 enden.

## npm run preflight
Prüft vor dem Render unter anderem:
- aktive Episode korrekt gemappt
- 12 Übungen
- jede Übung exakt 20s
- Gesamtzeit 313s beim Standardformat
- Bild 00–16 vorhanden
- Cover nicht im MP4
- nur eine Opening-Voice
- keine Voice in Übungen/Rest/Outro
- KM-002 Voice nicht wieder nur ~8s kurz
- Hintergrundmusik vorhanden, wenn Episode sie als Pflicht markiert
- Exercise title/instruction kommen von Google Flow
- kein Full-scene Fade/Zoom in Exercise/Rest-Code
- Rest-UI-Regeln

Die inhaltliche EIN-BILD-KLARHEIT und korrekte Google-Flow-Schrift müssen zusätzlich visuell geprüft werden.

## npm run render
Rendert nur die Longform-Komposition `KidMotionVideo` nach:
`out/kidmotion.mp4`

## npm run postrender:qa
Prüft das bereits gerenderte MP4 automatisch auf:
- exakte Laufzeit
- hörbares Audio/Musik nach dem Opening, wenn Musik Pflicht ist
- schwarze Flash-Segmente
- near-black/near-white blank-looking Frames an Szenengrenzen

Das ersetzt nicht die manuelle visuelle QA, fängt aber genau die Fehlerklasse ab, die im abgelehnten KM-002-Test aufgetreten ist.

## npm run render:safe
Finaler Standardbefehl:

```bash
npm run typecheck && npm run preflight && npm run render && npm run postrender:qa
```

Nur wenn alle Schritte bestehen und das MP4 danach visuell geprüft wurde, darf `PRODUCTION COMPLETE` gesagt werden.

## node scripts/split-master-audio.mjs
Historischer Hilfsname. Aktuell gibt es nur eine Opening-Voice. Eine vorhandene `master.mp3` darf zu `Voice 01.mp3` vorbereitet werden; es werden keine Exercise-Voice-Dateien erstellt.

## node scripts/new-episode.mjs
Erstellt neue Episoden-Grundlagen. Jede geplante Übung muss den EIN-BILD-KLARHEITSTEST bestehen und die aktuellen Google-Flow/Remotion-Grenzen aus `GEHIRN.md` übernehmen.

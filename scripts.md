# KidMotion — Scripts Dokumentation

`GEHIRN.md` bleibt die höchste Regelquelle.

## npm run start
Startet Remotion Studio für Preview und visuelle QA.

## npm run kidmotion:activate -- --episode=KM-XXX-name
Aktiviert die gewünschte kanonische Episode unter:
`episodes/<episode>/04-data/data.json`

Das Script:
- liest die Episodendaten
- erstellt/aktualisiert öffentliche Episode-Aliase für Bilder und Audio
- erzeugt `src/data/active-workout.ts`
- mappt die eine Opening-Voice
- mappt `bg-music.mp3`
- schreibt `episodes/ACTIVE_EPISODE.json`

## VISUAL_REVIEW.json — Pflicht vor Asset-Freigabe
Jede neue Episode besitzt `04-data/VISUAL_REVIEW.json`.

Alle Flags beginnen mit `false` und dürfen nur nach tatsächlicher visueller Prüfung der finalen Bilddateien auf `true` gesetzt werden.

Geprüft werden u. a.:
- gleicher Charakter
- Ein-Bild-Klarheit jeder Pose
- konsistenter Exercise-Titel/Cloud-Stil
- freie Timer-/Progress-Safe-Zones
- korrekte Ball-/Prop-Anzahl
- textfreie Bild 01/02/03/Outro
- keine zweite Person
- keine Anatomie-/Cropping-Fehler

## npm run assets:approve -- --episode=KM-XXX-name
Wird erst nach bestandener visueller Prüfung ausgeführt.

Das Script:
- verlangt alle Visual-Review-Flags = true
- prüft Bilddateien technisch
- prüft 16:9 und Mindestauflösung
- erkennt identische doppelte Source-Bilder
- prüft Voice-Dauer
- verlangt Hintergrundmusik, wenn final Pflicht
- verbietet alte Voice 02–16
- erzeugt `04-data/ASSET_APPROVAL.json`
- sperrt jedes freigegebene Bild/Audio per SHA-256

Wird danach eine Datei verändert, ist die Freigabe ungültig.

## npm run project:doctor
Schützt den Repo-/Code-Aufbau vor Rückfällen, z. B.:
- Raw-/Short-Render wieder aktiviert
- Exercise-/Rest-Zoom oder Full-image-Fade wieder eingebaut
- überladenes Intro kommt zurück
- LET'S BEGIN verschwindet
- Musik loopt nicht mehr
- spätere Voice-Dateien werden wieder abgespielt
- alte Episodenpfade werden wieder benutzt
- neue Episode erzeugt keine Visual-Review-Sperre

## npm run preflight
Prüft Episodendaten und Timeline-Regeln vor dem Render, u. a.:
- aktive Episode korrekt gemappt
- 12 Übungen
- jede Übung exakt 20s
- Standard-Gesamtzeit 313s
- Bild 00–16 vorhanden
- Cover nicht im MP4
- nur eine Opening-Voice
- keine Voice in Exercises/Rest/Outro
- Voice endet vor Exercise 1
- Hintergrundmusik vorhanden, wenn Pflicht
- Google Flow/Remotion-Verantwortung stimmt
- keine Full-scene Fades/Zooms in Exercise/Rest
- Rest-UI-Regeln stimmen

## npm run asset:gate
Prüft unmittelbar vor dem Render:
- ASSET_APPROVAL existiert
- Revision stimmt
- jedes aktuell verwendete Bild/Audio war freigegeben
- SHA-256 jedes Assets stimmt noch exakt

Schon eine nachträgliche Änderung an einem Bild oder Audio blockiert den Render.

## npm run render / npm run render:safe
Beide Befehle laufen über denselben geschützten Renderer:
`scripts/render-guarded.mjs`

Reihenfolge:
```text
TypeScript
→ project:doctor
→ preflight
→ asset:gate
→ Remotion KidMotionVideo render
→ postrender:qa
```

Es gibt absichtlich keinen normalen npm-Raw-Render mehr.

## npm run postrender:qa
Prüft die tatsächlich gerenderte MP4 automatisch auf:
- exakte Laufzeit
- korrekte Auflösung
- korrekte FPS
- hörbare Musik nach dem Opening
- schwarze Flash-Segmente
- near-black/near-white/pastellige Blank-Frames an Szenengrenzen
- verdächtig identische Exercise-Szenen

Das ersetzt die visuelle Endkontrolle nicht, fängt aber technische Fehler bereits automatisch ab.

## node scripts/split-master-audio.mjs
Historischer Hilfsname. Es gibt nur eine Opening-Voice. Eine vorhandene `master.mp3` darf zu `Voice 01.mp3` vorbereitet werden; es werden keine Exercise-Voice-Dateien erstellt.

## npm run kidmotion:new
Erstellt neue Episoden direkt mit:
- kanonischer `episodes/`-Struktur
- Generation-Revision
- VISUAL_REVIEW.json mit allen Flags `false`
- aktueller Audio-/Bild-/Remotion-Regel
- RENDER_QA und Antigravity-Anweisung

Damit ist die Sicherheitskette bei jeder neuen Episode automatisch vorhanden.

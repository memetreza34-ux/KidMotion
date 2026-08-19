# KidMotion — Schnellstart

## Neue Episode produzieren
1. Nur Übungen auswählen, die aus EINEM Standbild sofort verständlich sind.
2. `Bild 01` als Charakterreferenz festlegen.
3. `Bild 04` als Exercise-UI-Referenz festlegen.
4. Bilder mit Google Flow einzeln erzeugen und sofort prüfen/umbenennen.
5. Eine einzige Opening-Voice `Voice 01.mp3` aufnehmen.
6. `bg-music.mp3` in den Audio-Ordner legen.
7. Episode aktivieren.
8. `npm run render:safe` ausführen.
9. MP4 zusätzlich visuell prüfen.

## Aktuelle Voice-Regel
Es gibt genau EINE gesprochene Datei:
`Voice 01.mp3`

Sie startet im Intro und darf über Safety + LET'S BEGIN weiterlaufen.
Standard-Opening: 8s + 4s + 2s = 14s.
Voice-Ziel: ungefähr 11–14s und vollständig beendet vor Exercise 1.

Danach keine gesprochene Voice mehr.

## Hintergrundmusik
Finale Videos benötigen `bg-music.mp3`:
- instrumental
- kinderfreundlich
- keine Lyrics/Sprache
- leiser unter Voice
- danach etwas lauter
- durch komplettes Video loopen

## Bildregeln
### Übungen
Google Flow erzeugt direkt:
- Pose
- Exercise Name bottom-left
- Instruction Cloud top-right

Remotion erzeugt nur Timer + Progress.

Exercise-Bilder bleiben statisch. Kein Ken Burns, kein Fade-in von schwarzem Frame.

### Rest
Nächstes Exercise-Bild bleibt sichtbar.
`REST + Countdown` nur top-left, damit die Instruction Cloud top-right frei bleibt.

### Nicht-Übungsbilder
Bild 01, 02, 03 und 16: ZERO Google-Flow-Text.
Remotion besitzt Intro/Safety/LET'S BEGIN/Outro-Grafiken.

## EIN-BILD-KLARHEITSTEST
Wenn die Pose als Standbild/Silhouette nicht sofort klar ist, wird sie ersetzt.

## Aktuelle KM-002 Opening-Voice
Hi, KidMotion friends! It’s basketball time! Today we have twelve easy poses, twenty seconds each. Find some space, make sure you can move safely, and stop if anything hurts. Get ready, stay strong, and let’s begin!

## Befehle
```bash
npm run kidmotion:activate -- --episode=KM-002-basketball
npm run render:safe
```

## Alle Regeln
Siehe `GEHIRN.md` — bei Widersprüchen gilt diese Datei.

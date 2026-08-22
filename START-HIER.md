# KidMotion — Schnellstart

## Neue Episode produzieren
1. Nur Übungen auswählen, die aus EINEM Standbild sofort verständlich sind.
2. `Bild 01` als Charakterreferenz festlegen.
3. `Bild 04` als Exercise-UI-Referenz festlegen.
4. Bilder mit Google Flow einzeln erzeugen und sofort prüfen/umbenennen.
5. Eine einzige Opening-Voice `Voice 01.mp3` aufnehmen.
6. `bg-music.mp3` in den Audio-Ordner legen.
7. FINALEN Bildsatz wirklich Bild für Bild prüfen.
8. `04-data/VISUAL_REVIEW.json` nur nach echter Sichtprüfung vollständig auf `true` setzen.
9. Assets technisch freigeben und per SHA-256 sperren:
```bash
npm run assets:approve -- --episode=KM-XXX-name
```
10. Episode aktivieren.
11. `npm run render` oder `npm run render:safe` ausführen. Beide sind geschützt.
12. Neue MP4 zusätzlich visuell prüfen.

## Aktuelle Voice-Regel — HARD RULE
Es gibt genau EINE gesprochene Datei:
`Voice 01.mp3`

Sie beginnt direkt bei Frame 0 und MUSS die komplette Opening-Sequenz sprachlich tragen:
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s
- danach startet Exercise 1

Standard-Opening: 14s.

**Wichtig:** Musik allein zählt NICHT als Opening-Abdeckung. Vom ersten Frame bis unmittelbar vor Exercise 1 soll der Sprecher praktisch durchgehend zu hören sein. Natürliche kurze Atem-/Satzpausen sind okay, aber keine längeren leeren Abschnitte und insbesondere kein Safety- oder LET'S-BEGIN-Teil nur mit Musik.

Die Voice-Datei muss deshalb für ein 14s-Opening nahezu die komplette Länge ausfüllen. Technisches Ziel: ungefähr 13,65–14,00s und vollständig beendet vor Exercise 1.

Der Scripttext wird NICHT nach einer festen Wortzahl gekürzt. Er muss lang genug für das tatsächliche TTS-Sprechtempo sein. Wenn die erzeugte Voice deutlich früher endet und am Ende des Openings nur Musik übrig bleibt, wird der Text verlängert bzw. die Voice neu erzeugt.

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
Exercise-Bilder bleiben statisch. Kein Ken Burns, kein Full-image-Fade-in.

### Rest
Nächstes Exercise-Bild bleibt sichtbar.
`REST + Countdown` nur top-left, damit die Instruction Cloud top-right frei bleibt.

### Nicht-Übungsbilder
Bild 01, 02, 03 und 16: ZERO Google-Flow-Text.
Remotion besitzt Intro/Safety/LET'S BEGIN/Outro-Grafiken.

## EIN-BILD-KLARHEITSTEST
Wenn die Pose als Standbild/Silhouette nicht sofort klar ist, wird sie ersetzt.

## Warum der Asset-Lock wichtig ist
Nach `assets:approve` werden SHA-256-Hashes aller freigegebenen Bilder und Audios gespeichert.

Wenn Antigravity danach auch nur eine Datei ersetzt oder verändert, blockiert `asset:gate` den finalen Render automatisch. So kann nicht versehentlich ein ungeprüfter neuer Google-Flow-Output im MP4 landen.

## Guarded Render
`npm run render` und `npm run render:safe` laufen beide durch:
```text
TypeScript → Project Doctor → Preflight → Asset Gate → Render → Postrender QA
```

## Aktuelle KM-002 Opening-Voice
Hi, KidMotion friends! It’s basketball time! Today we have twelve easy poses, twenty seconds each. Find some space, make sure you can move safely, and stop if anything hurts. Get ready, stay strong, and let’s begin!

## KM-002 Befehle
```bash
npm run assets:approve -- --episode=KM-002-basketball
npm run kidmotion:activate -- --episode=KM-002-basketball
npm run render:safe
```

## Alle Regeln
Siehe `GEHIRN.md` — bei Widersprüchen gilt `GEHIRN.md` als höchste Regelquelle.

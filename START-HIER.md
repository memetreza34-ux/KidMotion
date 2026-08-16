# KidMotion — Schnellstart

## Neue Episode produzieren

1. Bilder mit Google Flow erstellen → alle in `episodes/KM-001-football/03-bilder/` ablegen
2. Voice aufnehmen (eine Datei, drei Teile mit Pausen) → als `master.mp3` in `episodes/KM-001-football/02-audio/` ablegen
3. Audio automatisch aufteilen: `node scripts/split-master-audio.mjs`
4. Video rendern: `npm run render:safe`
5. Fertiges Video liegt in: `out/kidmotion.mp4`

## Audio-Fließtext für Aufnahme (KM-001)

**Teil 1 — Intro** (ca. 8 Sek.):
> "Welcome to KidMotion Football! Get ready to train your balance and control. We've got 12 poses, 20 seconds each."

*... kurze Pause (ca. 1 Sek.) ...*

**Teil 2 — Safety** (ca. 4 Sek.):
> "Safety first! Make sure you have enough space to move, and stop if anything hurts."

*... kurze Pause (ca. 1 Sek.) ...*

**Teil 3 — Let's Begin** (ca. 2 Sek.):
> "Are you ready? Let's begin!"

## Studio starten (Preview)
```
npm run start
```

## Alle Regeln
Siehe `GEHIRN.md`

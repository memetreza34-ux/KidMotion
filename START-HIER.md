# START HIER

## 1. Zuerst Format bestimmen

Frage nicht automatisch: "Welche Übung?"

Zuerst entscheiden:

- `workout` — Bewegung ist das Hauptziel
- `learning` — Wissen/Lernen ist das Hauptziel
- `learn-and-move` — Lernen + Bewegung ist bewusst kombiniert

## 2. Episode anlegen

Workout:
```bash
npm run kidmotion:new -- --format=workout --topic="..."
```

Pure Learning:
```bash
npm run kidmotion:new -- --format=learning --topic="..."
```

Learn + Move:
```bash
npm run kidmotion:new -- --format=learn-and-move --topic="..."
```

## 3. Pure Learning

Bei `learning`:
- keine Workout-Regeln übernehmen
- kein Kind/Mascot erzwingen
- keinen Timer erzwingen
- keine GET-READY-Szenen
- durchgehende Narration erlaubt
- Visuals nach Lernnutzen auswählen
- Fakten/Lernziel in `LEARNING_PLAN.json` festhalten
- `learning:prompt:qa` verwenden
- Rendering über `KidMotionLearning`

## 4. Workout

Workout bleibt beim bestehenden V3-Prozess mit Cover, 5er-Bildblöcken, 12 Übungen, GET READY und Timer.

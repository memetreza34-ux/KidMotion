# KidMotion

KidMotion ist ein **allgemeiner Kinderkanal**, kein reiner Sportkanal.

## Videoformate

### 1. WORKOUT
Bewegung ist das Hauptziel.

Beispiele:
- 5 Minute Jungle Workout
- Animal Freeze Challenge

Vertrag: `config/v3-contract.json`

### 2. LEARNING
Wissen/Lernen ist das Hauptziel.

Beispiele:
- Learn Numbers 1–10
- Alphabet / ABC
- Colors and Shapes
- Animals and Habitats
- Planets for Kids
- Why Do Volcanoes Erupt?
- How Trains Work

Vertrag: `config/formats/learning.json`

Für reine Lernvideos gilt ausdrücklich:
- kein Workout-Zwang
- kein Timer-Zwang
- kein GET READY
- kein Bewegungszwang
- kein Kind/Mascot-Zwang
- Voice darf durch das ganze Video laufen
- Szenenzahl und Laufzeit sind flexibel
- Bilder dürfen Objekte, Tiere, Karten, Diagramme, Maschinen, Buchstaben, Zahlen, Umgebungen oder Figuren zeigen — je nachdem, was am besten erklärt

### 3. LEARN_AND_MOVE
Optionale Mischform. Nur verwenden, wenn Bewegung das Lernen wirklich unterstützt.

## Neue Episode

```bash
npm run kidmotion:new -- --format=workout --topic="..."
npm run kidmotion:new -- --format=learning --topic="..."
npm run kidmotion:new -- --format=learn-and-move --topic="..."
```

Ohne `--format` wird abgebrochen. Dadurch wird ein Lernvideo nie versehentlich zum Workout.

Siehe: `FORMAT_ROUTER.md`.

## Reines Learning rendern

```bash
npm run learning:prompt:qa -- --episode=KM-XXX-slug
npm run learning:activate -- --episode=KM-XXX-slug
npm run learning:preflight
npm run learning:assets:approve -- --episode=KM-XXX-slug
npm run learning:asset:gate
npm run learning:render
```

Remotion Composition: `KidMotionLearning`.

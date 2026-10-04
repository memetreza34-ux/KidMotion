# KidMotion V3

Datengetriebene Pipeline für englische YouTube-Kinderworkouts mit Google-Flow-Bildern und Remotion.

## Kernregeln
- Google Flow erzeugt **alle sichtbaren Texte**.
- Remotion erzeugt visuell **nur den Countdown-Timer**.
- Erst 3 Cover → Nutzer wählt 1 → Gewinner wird `Szene 01.png`.
- Danach entstehen `Szene 02.png` bis `Szene 28.png`.
- Alle finalen Bilder liegen in einem einzigen Bilderordner.
- 12 Übungen müssen klar unterschiedliche Kinder-Challenge-Posen haben.
- 11 Pausen benutzen eigene `GET READY`-Bilder und **nicht** das nächste Übungsbild.

## Szenen
```text
01 Cover
02 Intro
03 Safety
04 LET'S BEGIN
05 Exercise 1
06 GET READY
07 Exercise 2
08 GET READY
...
25 Exercise 11
26 GET READY
27 Exercise 12
28 Outro
```

## Timer
192px, top-left, große Zahl, Übung 20→1, GET READY 5→1. Kein sichtbarer 0-Frame.

## Musik
120–130 BPM, upbeat playful kids-fitness electro-pop instrumental, keine Vocals, kommerzielle YouTube-Lizenz.

## Produktion
Neue Episode:
`npm run kidmotion:new -- --topic="THEME" --character=boy`

Cover-Auswahl:
`npm run kidmotion:select-cover -- --episode=KM-XXX-slug --candidate=2`

Nach echter visueller Prüfung:
`npm run assets:approve -- --episode=KM-XXX-slug`

Final:
`npm run render:safe`

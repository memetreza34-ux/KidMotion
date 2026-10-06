# KidMotion

KidMotion ist eine datengetriebene Pipeline für englische 16:9-Kinderworkouts.

## Eine Regelquelle
Die maschinenlesbare Produktionsregel ist `config/v3-contract.json`. `GEHIRN.md` erklärt dieselben Regeln für Menschen/Agenten. Einzelne Episoden dürfen keine eigenen abweichenden Pipeline-Regeln erfinden.

## Standardvideo
- 5:13 Minuten
- 12 Übungen × 20 Sekunden
- 11 GET-READY-Übergänge × 5 Sekunden
- 3 Cover-Kandidaten, genau eine Nutzerwahl
- Gewinner = `Szene 01.png` und einzige Bildreferenz für alle späteren Szenen
- `Szene 02.png` bis `Szene 28.png` jeweils genau einmal und streng nacheinander generieren
- Google Flow erzeugt alle sichtbaren Texte
- Remotion erzeugt visuell nur den Countdown-Timer

## Produktionsweg
`kidmotion:new` → Planung vollständig ausarbeiten → `prompt:qa` → 3 Cover → Nutzerwahl → Szenen seriell → `scene:qa` → echte visuelle Prüfung → `assets:approve` → `kidmotion:activate` → `render:safe`.

## Repo-Schutz
`npm run project:doctor` prüft die globale Architektur. `npm run repo:qa` prüft den zentralen Vertrag und alle aktuellen Contract-Episoden. GitHub Actions führt beide Checks bei jedem Push/PR aus.

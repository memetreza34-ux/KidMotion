# KidMotion — Scripts Dokumentation

Alle ausführbaren Skripte liegen in `scripts/`. `GEHIRN.md` bleibt die höchste Regelquelle.

---

## npm run render:safe

Hauptbefehl für die Videoproduktion. TypeScript prüfen → Preflight → Render. Ausgabe: `out/kidmotion.mp4`.

---

## npm run start

Startet Remotion Studio für Preview und visuelle QA.

---

## node scripts/split-master-audio.mjs

Der Name ist historisch. Im aktuellen KidMotion-Standard gibt es nur noch EINE Voice-Datei.

Der Nutzer nimmt ausschließlich die kurze Intro-Voice auf und speichert sie als:
`episodes/<aktive-episode>/02-audio/master.mp3`

Das Skript kopiert diese Datei zu:
`Voice 01.mp3`

Zusätzlich entfernt es alte `Voice 02.mp3` bis `Voice 16.mp3`, falls sie aus einer früheren Version noch existieren.

Es wird NICHT mehr in Intro/Safety/Let's Begin aufgeteilt.
Safety, Let's Begin, Übungen, Rest und Outro bleiben ohne Sprache.

Beispiel:
```bash
node scripts/split-master-audio.mjs --episode=KM-001-football
```

---

## node scripts/preflight.mjs

Prüft vor dem Rendering Pflichtdaten und Produktionsregeln. Der aktuelle Standard verlangt unter anderem Intro-only Voice, keine späteren Voice-Mappings und exakt 20 Sekunden pro Übung.

Zusätzliche visuelle Pflichtregel aus `GEHIRN.md`: Jede Übung muss aus einem einzelnen Standbild klar verständlich sein. Diese inhaltliche Bildprüfung muss vor dem finalen Render visuell durchgeführt werden; ein Dateicheck allein kann das nicht zuverlässig bewerten.

---

## node scripts/new-episode.mjs

Erstellt eine neue Episode. Jede neue Übung muss bereits bei der Planung den EIN-BILD-KLARHEITSTEST bestehen: klare statische Endpose, eindeutige Silhouette, kein Bewegungsablauf nötig.

---

## node scripts/activate-episode.mjs

Wechselt die aktive Episode und aktualisiert die Remotion-Datenpfade.

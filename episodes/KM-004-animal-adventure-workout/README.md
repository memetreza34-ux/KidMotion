# KM-004 — Animal Adventure Workout — Szenen-Pipeline V3

Datum: 2026-10-04
Thema: animal-adventure-workout
Status: Planung fertig, Cover-Auswahl ist der nächste Schritt.

## Pflichtreihenfolge
1. `Cover-Kandidat-01.png`, `Cover-Kandidat-02.png`, `Cover-Kandidat-03.png` erzeugen.
2. Alle drei dem Nutzer zeigen.
3. **STOP und auf die ausdrückliche Auswahl warten.**
4. Gewinner mit `npm run kidmotion:select-cover -- --episode=KM-004-animal-adventure-workout --candidate=<1|2|3>` auswählen.
5. Gewinner wird `Szene 01.png`; die anderen zwei Kandidaten werden gelöscht.
6. `Szene 01.png` bleibt Hauptreferenz für Charakter, Gesicht, Outfit, Farben, Licht und Welt.
7. Danach niemals alle restlichen Bilder auf einmal erzeugen.
8. Die Bilder werden ausschließlich in folgenden Blöcken erzeugt:
   - Batch 1: `Szene 02–06`
   - Batch 2: `Szene 07–11`
   - Batch 3: `Szene 12–16`
   - Batch 4: `Szene 17–21`
   - Batch 5: `Szene 22–26`
   - Final Batch 6: `Szene 27–28`
9. Nach jedem Batch alle neuen Bilder dem Nutzer zeigen und **STOP**. Erst nach ausdrücklichem `weiter` mit dem nächsten Batch beginnen.
10. `Szene 05.png` ist nach Freigabe von Batch 1 zusätzlich die Exercise-UI-Referenz für alle späteren Übungsbilder.
11. Alle finalen Bilder bleiben gemeinsam in `00-bildprompts/images/`.

## Inhalt von Batch 1
- Szene 02: Intro
- Szene 03: Safety First
- Szene 04: LET'S BEGIN
- Szene 05: Übung 1
- Szene 06: GET READY für Übung 2

Damit sieht der Nutzer bereits nach dem ersten 5er-Block, ob Charakter, Safety, Startbild, erste Pose und Übergangsbild korrekt aussehen.

## Übungen
1. GORILLA POWER HOLD
2. FLAMINGO BALANCE
3. TIGER CROUCH
4. EAGLE WINGS HOLD
5. FROG POWER HOLD
6. PENGUIN FREEZE
7. CRAB TABLE HOLD
8. GIRAFFE REACH
9. KANGAROO READY
10. BEAR TABLE HOLD
11. SHARK SIDE LEAN
12. LION CHAMPION

## Timing
8s Intro + 4s Safety + 2s LET'S BEGIN + 12×20s Übungen + 11×5s GET READY + 4s Outro = 313s / 5:13.

Remotion zeichnet nur den Countdown-Timer. Alle anderen sichtbaren Texte werden von Google Flow direkt in die Bilder erzeugt.

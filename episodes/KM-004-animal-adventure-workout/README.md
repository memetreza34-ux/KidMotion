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
6. `Szene 01.png` bleibt Hauptreferenz für Charakter, Outfit, Farben und Welt.
7. Erst dann `Szene 02.png` bis `Szene 28.png` erzeugen.
8. `Szene 05.png` ist zusätzlich nur die Exercise-UI-Referenz.
9. Alle finalen Bilder bleiben gemeinsam in `00-bildprompts/images/`.

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

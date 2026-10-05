# KM-004 — Animal Adventure Workout — Szenen-Pipeline V3

Datum: 2026-10-04
Thema: animal-adventure-workout
Status: Planung fertig, Cover-Auswahl ist der nächste Schritt.

## Pflichtreihenfolge
1. `Cover-Kandidat-01.png`, `Cover-Kandidat-02.png`, `Cover-Kandidat-03.png` erzeugen.
2. Alle drei dem Nutzer einmal zeigen.
3. Auf die einmalige Cover-Auswahl warten.
4. Gewinner mit `npm run kidmotion:select-cover -- --episode=KM-004-animal-adventure-workout --candidate=<1|2|3>` auswählen.
5. Gewinner wird `Szene 01.png`; die anderen zwei Cover werden sofort gelöscht.
6. `Szene 01.png` ist danach die **einzige Bildreferenz** für alle weiteren Szenen.
7. `Szene 02.png` bis `Szene 28.png` wird jeweils **genau einmal** erzeugt.
8. Keine zweite Bildreferenz, keine Varianten und keine Regenerationen.
9. Danach automatisch bis `Szene 28.png` weiterarbeiten, ohne weitere Rückfragen.
10. Intern in folgenden Blöcken arbeiten:
   - Batch 1: `Szene 02–06`
   - Batch 2: `Szene 07–11`
   - Batch 3: `Szene 12–16`
   - Batch 4: `Szene 17–21`
   - Batch 5: `Szene 22–26`
   - Final Batch 6: `Szene 27–28`
11. Zwischen den Batches nicht stoppen und nicht nach `weiter` fragen.
12. Alle finalen Bilder bleiben gemeinsam in `00-bildprompts/images/`.
13. Erst wenn `Szene 01.png` bis `Szene 28.png` vollständig vorhanden sind, den fertigen Bilderordner präsentieren.

## Referenzregel
Für jede Szene 02–28 gilt:

`Referenzbild = Szene 01.png ONLY`

`Szene 05.png` oder irgendeine andere erzeugte Szene darf niemals als zweite Referenz verwendet werden. Gleichbleibende Titel-/Instruction-Gestaltung wird ausschließlich über die geschriebenen Flow-Prompts beschrieben.

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

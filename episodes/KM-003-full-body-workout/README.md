# KM-003 — 5 Minute Kids Challenge — R3

Datum: 2026-10-04  
Runtime: 5:13  
Charakter: KidMotion boy  
Status: Planung fertig, Cover-Auswahl ist der nächste Schritt.

## Neue Richtung
Die alte Übungsauswahl war visuell zu ähnlich. R3 benutzt 12 deutlich unterschiedlichere Freeze-Challenges:
1. SUPERHERO FREEZE
2. ROCKET REACH
3. FLAMINGO BALANCE
4. NINJA SIDE HOLD
5. FROG POWER HOLD
6. SKATER FREEZE
7. TREE BALANCE
8. SURFER HOLD
9. POWER PUNCH FREEZE
10. STAR SIDE LEAN
11. BEAR FREEZE
12. CHAMPION FINISH

## Pflichtreihenfolge
1. Drei Cover-Kandidaten erzeugen.
2. Alle drei dem Nutzer zeigen.
3. STOP und auf ausdrückliche Auswahl warten.
4. Gewinner wird `Szene 01.png` und PRIMARY-Referenz.
5. Erst danach `Szene 02.png` bis `Szene 28.png` erzeugen.
6. `Szene 05.png` wird zusätzlich Exercise-UI-Referenz.
7. Alle finalen Szenen bleiben gemeinsam in `00-bildprompts/images/`.

## Szenenlogik
- Szene 01: Cover / Thumbnail, nicht im MP4
- Szene 02: Intro
- Szene 03: Safety
- Szene 04: LET'S BEGIN
- Szene 05,07,09,11,13,15,17,19,21,23,25,27: 12 Übungen à 20s
- Szene 06,08,10,12,14,16,18,20,22,24,26: 11 eigene GET READY-Bilder à 5s
- Szene 28: Outro

Die GET READY-Bilder zeigen eine neutrale Ready-Pose und niemals schon die nächste Übung. Dadurch erscheint die nächste echte Übung wieder sauber mit 20 Sekunden.

## Timer
Remotion erzeugt nur den Timer: 192px, top-left, 20→1 bei Übungen und 5→1 bei GET READY. Kein sichtbarer 0-Frame.

## Musik
Siehe `02-audio/MUSIC_BRIEF.md`: 120–130 BPM, upbeat playful kids-fitness electro-pop instrumental, keine Vocals.

Kein Asset ist automatisch freigegeben. `VISUAL_REVIEW.json` bleibt false, bis die echten R3-Bilder angesehen wurden.

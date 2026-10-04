# KM-003 — Full Body Workout — Szenen-Pipeline V3

Datum: 2026-10-04  
Thema: full-body-workout  
Status: Planung fertig, Cover-Auswahl steht als nächster Schritt an.

## Pflichtreihenfolge
1. `Cover-Kandidat-01.png`, `Cover-Kandidat-02.png`, `Cover-Kandidat-03.png` erzeugen.
2. Alle drei Cover dem Nutzer zeigen.
3. **STOP und auf die ausdrückliche Auswahl warten.**
4. Gewählten Kandidaten mit `npm run kidmotion:select-cover -- --episode=KM-003-full-body-workout --candidate=<1|2|3>` auswählen.
5. Gewinner wird `Szene 01.png`; die zwei anderen Cover-Kandidaten werden gelöscht.
6. `Szene 01.png` ist danach die Hauptreferenz für Charakter, Outfit, Farben, Licht und Welt.
7. Erst dann `Szene 02.png` bis `Szene 17.png` nacheinander erzeugen.
8. `Szene 05.png` zusätzlich nur als Exercise-UI-Referenz für Szene 06–16 verwenden.
9. Alle finalen Szenen liegen gemeinsam in `00-bildprompts/images/`.

## Szenen
- Szene 01: Cover / Thumbnail, nicht im MP4
- Szene 02: Intro
- Szene 03: Safety
- Szene 04: LET'S BEGIN
- Szene 05–16: 12 Übungen
- Szene 17: Outro

## Video
- 16:9 / 1920×1080 / 30 fps
- 313 Sekunden / 5:13
- 12 statische Ganzkörperübungen
- 20 Sekunden pro Übung
- 5 Sekunden Rest zwischen den ersten 11 Übungen

## Remotion
Remotion setzt nur Bilder, Voice und Musik zeitlich zusammen und zeichnet den Countdown-Timer. Alle anderen sichtbaren Texte werden direkt in Google Flow erzeugt.

Kein Asset ist automatisch freigegeben. `VISUAL_REVIEW.json` bleibt false, bis die echten finalen Szenen angesehen wurden.

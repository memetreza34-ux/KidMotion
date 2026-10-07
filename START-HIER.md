# START HIER

## Phase 1 — Planung
1. Episode vollständig planen.
2. prompt:qa muss bestehen.

## Phase 2 — Asset-Produktion
3. Bilder und Audio erstellen. Der Handoff darf als fertiger Ordner, ZIP und/oder Audio-/Videocontainer erfolgen.

## Phase 3 — Antigravity

Wenn der Nutzer „alles ist im Ordner“ sagt:

4. npm run phase3:prepare -- --episode=KM-XXX-slug
5. Antigravity prüft die importierten Bilder selbst visuell und aktualisiert VISUAL_REVIEW.json wahrheitsgemäß.
6. npm run assets:approve -- --episode=KM-XXX-slug
7. npm run kidmotion:activate -- --episode=KM-XXX-slug
8. npm run phase3:gate -- --episode=KM-XXX-slug
9. npm run render:safe

phase3:prepare darf ZIP entpacken, deterministische PNG-Dateinamen normalisieren und vorhandene Audio-Container nach MP3 konvertieren. Es darf keine Bilder erzeugen oder deren Pixel verändern.

phase3:gate kommt erst nach Import + Review + Approval.

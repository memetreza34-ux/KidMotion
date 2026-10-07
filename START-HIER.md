# START HIER

## Phase 1 — Planung
1. `GEHIRN.md` und `config/v3-contract.json` lesen.
2. Neue Episode anlegen und Planung vollständig ausarbeiten.
3. `prompt:qa` muss bestehen.

## Phase 2 — Bilder erstellen und übergeben
4. Bildworkflow/Google Flow erzeugt die 3 Cover.
5. Nutzer wählt 1 Cover; Gewinner = `Szene 01.png`, die zwei anderen löschen.
6. Der Bildworkflow erzeugt die restlichen finalen Szenen nach dem Plan.
7. `scene:qa` ausführen und Bilder real visuell prüfen.
8. `assets:approve` ausführen. Dadurch werden die Phase-2-Assets per SHA-256 gesperrt.

## Phase 3 — Antigravity
9. Antigravity darf **keine Bilder erzeugen**. Es nimmt ausschließlich die fertigen Phase-2-Bilder.
10. Vor jeder Phase-3-Arbeit muss `npm run phase3:gate` bestehen.
11. Fehlt/ändert sich ein Bild: **STOP**, niemals Ersatz erzeugen.
12. Antigravity darf vorhandene Assets aktivieren, mit Remotion zusammensetzen, den erlaubten Timer hinzufügen, rendern und Postrender-QA ausführen.

Antigravity Phase 3 = Assembly only.

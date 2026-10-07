# KidMotion

KidMotion ist eine datengetriebene Pipeline für englische 16:9-Kindervideos. Der aktuelle Workout-Formatvertrag liegt in `config/v3-contract.json`.

## Drei Phasen
**Phase 1 — Planung:** Episode vollständig planen.

**Phase 2 — Asset-Produktion:** Bilder werden im vorgesehenen Bildworkflow erstellt, ausgewählt und geprüft. Nach `assets:approve` sind sie SHA-256-gesperrt.

**Phase 3 — Antigravity Assembly/Render:** Antigravity erstellt **keine Bilder**. Es verwendet nur die aus Phase 2 übergebenen und freigegebenen Dateien.

Vor Phase 3: `npm run phase3:gate`

Wenn ein Bild fehlt oder verändert wurde, wird Phase 3 blockiert. Antigravity darf kein Ersatzbild, keine Variante und keine Regeneration erzeugen.

## Repo-Schutz
`project:doctor` + `repo:qa` prüfen die globale Architektur und die Phase-3-Zuständigkeitsgrenze.

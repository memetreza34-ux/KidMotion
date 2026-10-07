# KidMotion Scripts

## Globale Qualität
- npm run scripts:check — Syntaxcheck aller .mjs-Skripte.
- npm run project:doctor — prüft Contract, Pipeline und Prozessreihenfolge.
- npm run repo:qa — prüft aktuelle Contract-Episoden.

## Phase 3 Roh-Handoff
- npm run phase3:prepare -- --episode=KM-XXX-slug — **erster Schritt**, wenn ZIP/MP4/Dateien übergeben wurden. Führt ingest + scene:qa aus.
- npm run phase3:ingest -- --episode=KM-XXX-slug — technischer Unterbau: ZIP, Dateizuordnung, Audio-Normalisierung.
- npm run assets:approve -- --episode=KM-XXX-slug — erst nach echter visueller Prüfung.
- npm run kidmotion:activate -- --episode=KM-XXX-slug
- npm run phase3:gate -- --episode=KM-XXX-slug — erst nach Approval; SHA-256-Sperre.
- npm run render:safe

## Verantwortlichkeiten
Phase 2 liefert kreative Assets.
Phase 3 darf diese Assets technisch importieren/normalisieren und anschließend zusammenbauen.
Phase 3 darf niemals neue Bilder erzeugen oder Bildpixel verändern.

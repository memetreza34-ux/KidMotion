# Playvilo / KidMotion — Projektanleitungen

Hier sind die bisherigen zentralen Anleitungsdateien gesammelt. Für tägliche Videoproduktion nutze zuerst [START-HIER.md](START-HIER.md) und [GEHIRN.md](GEHIRN.md).

- [START-HIER.md](START-HIER.md) — Einstieg und Formate
- [GEHIRN.md](GEHIRN.md) — Produktionsregeln und Szenenaufbau
- [FORMAT_ROUTER.md](FORMAT_ROUTER.md) — Workout, Learning, Learn-and-Move
- [ART_DIRECTION.md](ART_DIRECTION.md) — Bildwelt und visuelle Qualität
- [PHASE2_FLOW_AGENT.md](PHASE2_FLOW_AGENT.md) — Google Flow und Bildkontrolle
- [PHASE2_LEARNING_AGENT.md](PHASE2_LEARNING_AGENT.md) — Lernen und Erklärgrafiken
- [LEARNING_ENGINE.md](LEARNING_ENGINE.md) — Lernvideo-System
- [ANTIGRAVITY.md](ANTIGRAVITY.md) — Phase 3 und Render-Grenzen
- [PROJECT_BRAIN.md](PROJECT_BRAIN.md) — Projektüberblick
- [scripts.md](scripts.md) — Befehle

Die technischen Dateien in `scripts/`, `src/`, `config/` usw. bleiben unverändert im Hauptverzeichnis, damit npm-Befehle und Remotion weiter funktionieren.

Wichtig: Die lokale Steuerdatei `episodes/ACTIVE_EPISODE.json` wird nicht gelöscht. `npm run project:tidy` setzt auf macOS das Finder-Flag „hidden“, ohne die Referenzen zu verändern.

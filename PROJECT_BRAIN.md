# PROJECT BRAIN

KidMotion arbeitet nach dem zentralen Produktionsvertrag `config/v3-contract.json`.

## Phasen
- **Phase 1: Planung** — Szenen, Prompts, Voice, Timing, Metadaten.
- **Phase 2: Bildproduktion/Handoff** — finale Bilder werden erstellt, ausgewählt, geprüft und per SHA-256 freigegeben.
- **Phase 3: Antigravity Assembly/Render** — Antigravity verwendet ausschließlich die freigegebenen Phase-2-Bilder und erstellt selbst **keine Bilder**.

### Phase-3-Hard-Rule
`ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true`

Antigravity darf kein Bild generieren, regenerieren, bearbeiten, ersetzen oder als Fallback erzeugen. Fehlendes/geändertes Phase-2-Bild = Block. Vor Phase 3 muss `phase3:gate` bestehen.

Workout-Kernregeln bleiben:
- 28 finale Szenen, `Szene 01` Cover außerhalb des MP4
- nur gewähltes `Szene 01.png` als Referenz während Phase 2
- 11 eigene GET-READY-Bilder
- Flow besitzt alle Nicht-Timer-Texte
- Remotion besitzt nur den Countdown-Timer
- Postrender-QA prüft Quellen und Timing

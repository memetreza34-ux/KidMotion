# PROJECT BRAIN

KidMotion arbeitet nach dem zentralen Produktionsvertrag `config/v3-contract.json`.

Die Episode ist nur Inhaltsdaten. Pipeline-Regeln gehören **nicht** in einzelne Episoden. Neue Episoden werden immer vom globalen Generator erstellt und durch globale QA geprüft.

Kernregeln:
- 28 finale Szenen, `Szene 01` ist Cover außerhalb des MP4.
- Erst 3 Cover, danach genau eine Nutzerwahl.
- Nur das gewählte `Szene 01.png` darf später als Bildreferenz verwendet werden.
- Szene 02–28: genau eine Generierung pro Szene, streng seriell, keine Parallelgenerierung, kein Kopieren bei Fehlern.
- 11 eigene GET-READY-Bilder; nie vorzeitig die nächste Übung zeigen.
- Flow erzeugt jeden sichtbaren Nicht-Timer-Text.
- Remotion erzeugt nur 20→1 bzw. 5→1 Countdown.
- Voice: ein 14-Sekunden-Opening mit festem Intro-/Safety-/LET'S-BEGIN-Zeitplan.
- Vor Flow: `prompt:qa`. Nach Bildern: `scene:qa`. Vor Render: SHA-256 Asset Approval. Nach Render: Source-/Timing-QA.

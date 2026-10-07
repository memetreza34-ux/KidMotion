# PROJECT BRAIN

KidMotion hat drei Stufen:

- **Phase 1:** Planung
- **Phase 2:** Bilder/Audio erstellen und als Handoff bereitstellen
- **Phase 3:** Antigravity importiert den Handoff technisch und baut daraus das Video

## Phase 3
Antigravity darf vorhandene Phase-2-Dateien:
- aus ZIP entpacken
- ohne Pixeländerung einsortieren/umbenennen
- Audio aus MP4/M4A/WAV/AAC nach MP3 extrahieren/transcodieren

Antigravity darf **keine Bilder erzeugen oder visuell verändern**.

Reihenfolge:
`phase3:ingest → scene:qa → visual review → assets:approve → activate → phase3:gate → render`.

Wenn der Import uneindeutig ist, wird nicht geraten.

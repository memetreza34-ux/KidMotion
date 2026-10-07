# KidMotion

## Produktionsfluss

**Phase 1:** Planung.

**Phase 2:** Bilder und Audio werden erstellt. Der Handoff darf als fertiger Ordner, ZIP oder Audio-Container erfolgen.

**Phase 3:** Antigravity führt zuerst den technischen Import aus:

`npm run phase3:ingest -- --episode=KM-XXX-slug`

Erlaubt:
- ZIP entpacken
- eindeutig nummerierte PNG-Szenen einsortieren
- vorhandene Audio-/Videocontainer per ffmpeg in die benötigten MP3-Dateien konvertieren

Verboten:
- Bilder generieren
- Bildinhalt verändern
- fehlende Szenen erfinden
- uneindeutige Bildreihenfolge raten

Danach: Scene QA → Visual Review → Asset Approval → Activate → Phase 3 Gate → Render.

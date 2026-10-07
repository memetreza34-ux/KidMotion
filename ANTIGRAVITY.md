# ANTIGRAVITY — PHASE 3 ONLY

`ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true`

Antigravity erstellt in Phase 3 **keine neuen Bilder**. Es darf aber die vom Nutzer aus Phase 2 übergebenen Dateien technisch importieren.

## Wenn der Nutzer sagt „alles ist im Ordner“
**Nicht zuerst `phase3:gate` ausführen.**

Zuerst:

`npm run phase3:ingest -- --episode=KM-XXX-slug`

Dieser Schritt darf:
- eine vorhandene Phase-2-ZIP entpacken
- vorhandene PNG-Szenen anhand eindeutiger Szenennummern in `00-bildprompts/images/` einsortieren
- Dateien technisch verschieben/kopieren/umbenennen, ohne Bildpixel zu verändern
- aus einer vorhandenen Audio-/Videodatei wie `.mp4`, `.m4a`, `.wav` oder `.aac` die Audiospur mit ffmpeg in das benötigte MP3-Format umwandeln
- z. B. eine eindeutige `Kids.mp4` als `Voice 01.mp3` extrahieren
- `PHASE3_INGEST.json` als Importprotokoll erstellen

Dieser Schritt darf **nicht**:
- Google Flow oder einen Bildgenerator aufrufen
- neue Cover/Szenen erzeugen
- Bildinhalt verändern
- ein fehlendes Bild erfinden
- ein falsches Bild als Ersatz einsetzen
- bei uneindeutigen Dateinamen die Szenenreihenfolge raten

## Danach
1. `scene:qa`
2. echte Bilder visuell prüfen
3. `assets:approve`
4. Episode aktivieren
5. `phase3:gate`
6. Render

`phase3:gate` ist also die Sperre **nach Import und Approval**, nicht der erste Schritt beim Roh-Handoff.

Wenn nach `phase3:ingest` Dateien fehlen, muss Antigravity konkret melden, welche Phase-2-Dateien fehlen. Es darf niemals selbst neue Bilder dafür erstellen.

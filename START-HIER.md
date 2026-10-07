# START HIER

## Phase 1 — Planung
1. Planung vollständig ausarbeiten.
2. `prompt:qa` muss bestehen.

## Phase 2 — Asset-Erstellung
3. Bilder/Audio werden erstellt und dem Projekt übergeben. Das kann auch als ZIP bzw. Audio in einem Container wie MP4 erfolgen.

## Phase 3 — Antigravity Ingest + Assembly
Wenn der Nutzer sagt „alles ist im Ordner“:

4. **Zuerst** `npm run phase3:ingest -- --episode=KM-XXX-slug`.
   - ZIP entpacken
   - vorhandene, eindeutig nummerierte PNGs einsortieren
   - vorhandene MP4/M4A/WAV/AAC-Audios mit ffmpeg in benötigte MP3-Dateien konvertieren
   - keine Bilder neu erzeugen
5. `scene:qa`
6. Bilder real visuell prüfen
7. `assets:approve`
8. Episode aktivieren
9. `phase3:gate`
10. `render:safe`

Wichtig: `phase3:gate` darf nicht vor dem Roh-Import erwartet werden. Es prüft die bereits vorbereiteten und freigegebenen Assets.

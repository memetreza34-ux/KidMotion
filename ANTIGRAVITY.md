# ANTIGRAVITY — PHASE 3 ONLY

`ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true`

Antigravity ist in dieser Pipeline **ausschließlich Phase 3: Assembly/Render**.

Lies zuerst `GEHIRN.md` und `config/v3-contract.json`.

## Harte Zuständigkeitsgrenze

### Phase 1 — Planung
Prompts, Szenen, Voice, Timing und Metadaten werden fertig geplant.

### Phase 2 — Bilder
Die finalen Bilder werden **außerhalb von Antigravity Phase 3** erstellt/ausgewählt, geprüft und freigegeben.
Ergebnis von Phase 2 sind die fertigen Dateien in `00-bildprompts/images/`.

### Phase 3 — Antigravity
Antigravity nimmt **nur exakt die Bilder, die aus Phase 2 übergeben wurden**.

Antigravity darf in Phase 3 niemals:
- Google Flow oder irgendeinen Bildgenerator aufrufen
- Cover oder Szenenbilder erzeugen
- Bilder nachgenerieren
- Bilder bearbeiten
- Bilder ersetzen
- Varianten/Alternativen erstellen
- ein fehlendes Bild mit einem anderen Bild auffüllen
- ein Ersatz-/Fallback-Bild erzeugen

Vor der ersten Phase-3-Aktion muss `npm run phase3:gate` erfolgreich sein.

Wenn ein Phase-2-Bild fehlt, geändert wurde oder nicht freigegeben ist:
**STOP / PHASE 3 BLOCKIEREN.**
Nicht reparieren. Nicht generieren. Nicht ersetzen.

Erlaubt in Phase 3:
- vorhandene freigegebene Phase-2-Bilder lesen/verwenden
- Runtime-Zuordnung aktivieren
- freigegebene Voice/Musik verwenden
- Remotion-Timer hinzufügen
- Video aus vorhandenen Assets zusammensetzen
- rendern
- Postrender-QA ausführen

Die Phase-2-Bilder sind in Phase 3 unveränderliche Inputs.

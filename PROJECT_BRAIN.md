# PROJECT BRAIN

KidMotion arbeitet mit einem Roh-Handoff-fähigen Phase-3-Prozess.

## Phase 3 Reihenfolge

phase3:prepare → echte visuelle Prüfung → assets:approve → activate → phase3:gate → render:safe

### phase3:prepare
Darf:
- ZIP technisch entpacken
- deterministisch nummerierte PNGs einsortieren
- finale Szene 01 als Cover-Handoff übernehmen
- MP4/M4A/WAV/AAC/MP3-Audio technisch normalisieren
- Scene QA ausführen

Darf nicht:
- Bilder erzeugen oder verändern
- Szenenreihenfolge raten
- fehlende Bilder ersetzen

Antigravity übernimmt technisch lösbare Handoff-Arbeit selbst. Der Nutzer soll nicht wegen ZIP/MP4/Dateiverschiebung zurückgeschickt werden.

### Gate
phase3:gate ist nur für bereits visuell geprüfte und SHA-256-approved Assets. Ein fehlendes ASSET_APPROVAL vor Review ist kein Roh-Handoff-Fehler.

# START HIER

1. `GEHIRN.md` und `config/v3-contract.json` lesen.
2. Neue Episode mit `npm run kidmotion:new -- --topic="..."` anlegen.
3. Alle `__PLAN_REQUIRED__`-Felder vollständig ausarbeiten: Übungen, Posen, Flow-Prompts, Voice-Plan, TTS-Text, Upload-Metadaten.
4. `npm run prompt:qa -- --episode=KM-XXX-slug` muss bestehen, **bevor Google Flow geöffnet wird**.
5. Exakt 3 Cover erzeugen und dem Nutzer einmal zeigen.
6. Nutzer wählt 1 Cover. Gewinner = `Szene 01.png`; die anderen beiden löschen.
7. Danach `Szene 02.png` bis `Szene 28.png` automatisch, streng seriell und jeweils genau einmal erzeugen. Einzige Bildreferenz ist immer `Szene 01.png`.
8. `npm run scene:qa -- --episode=KM-XXX-slug`.
9. Echte Bilder visuell prüfen; erst dann `assets:approve`.
10. Voice 01 + Musik ablegen, Episode aktivieren und `npm run render:safe` ausführen.

Remotion = Countdown-Timer only. Kein zusätzlicher Text, keine Progress-Bar, kein REST/NEXT-Overlay.

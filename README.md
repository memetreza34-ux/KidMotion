# KidMotion

## Robuster Handoff

Ein Phase-2-Handoff darf als ZIP, bereits fertiger Bilderordner und/oder Audio in MP4/M4A/WAV/AAC/MP3 vorliegen.

Antigravity startet bei einem Roh-Handoff immer mit:

npm run phase3:prepare -- --episode=KM-XXX-slug

Der Prepare-Schritt übernimmt technisch sichere Arbeiten automatisch und führt Scene QA aus. Danach prüft Antigravity die echten Bilder visuell, approved sie, aktiviert die Episode und führt erst dann phase3:gate aus.

**Kein Nutzer muss ZIP-Dateien manuell entpacken oder eine eindeutige MP4-Voice manuell zu MP3 konvertieren.**

Unverändert verboten: Bildgenerierung, Bildpixel-Änderung, Ersatzbilder, geratenes Szenen-Mapping und gefälschte Visual Reviews.

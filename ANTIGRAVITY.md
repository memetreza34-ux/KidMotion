# ANTIGRAVITY — PHASE 3 HANDOFF + ASSEMBLY

ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true

## Wenn der Nutzer sagt „alles ist im Ordner“

Antigravity startet **nicht** mit phase3:gate und schickt den Nutzer nicht zum manuellen Entpacken/Konvertieren zurück.

Erster Befehl:

npm run phase3:prepare -- --episode=KM-XXX-slug

phase3:prepare übernimmt den technischen Handoff:
- ZIPs im Episodenordner finden und nur relevante Assets sicher entpacken
- eindeutig nummerierte PNG-Szenen in den finalen Bilderordner einsortieren
- Szene 01 als bereits gewähltes finales Cover erkennen und COVER_SELECTION.json rekonstruieren/normalisieren
- vorhandene Audio-/Videocontainer wie MP4, M4A, WAV, AAC oder MP3 erkennen
- eine eindeutige kurze Voice-Quelle (z. B. Kids.mp4) per ffmpeg zu Voice 01.mp3 extrahieren
- eine eindeutige Musikquelle zu bg-music.mp3 normalisieren
- Scene Integrity QA ausführen
- niemals eine uneindeutige Szenenreihenfolge raten

Danach führt Antigravity **selbst** die reale visuelle Prüfung der importierten Szene-01-bis-28-Bilder durch und setzt VISUAL_REVIEW.json nur anhand dieser echten Prüfung.

Dann:
1. npm run assets:approve -- --episode=KM-XXX-slug
2. npm run kidmotion:activate -- --episode=KM-XXX-slug
3. npm run phase3:gate -- --episode=KM-XXX-slug
4. npm run render:safe

## Verboten

Antigravity darf in Phase 3 niemals:
- Google Flow oder einen Bildgenerator aufrufen
- Bilder generieren/regenerieren
- Bildpixel oder Bildinhalt verändern
- fehlende Bilder erfinden
- bei mehrdeutigen Dateinamen die Reihenfolge raten
- eine fehlende Datei durch irgendeine andere Szene ersetzen
- VISUAL_REVIEW ohne echte Sichtprüfung fälschen

## Wichtig

phase3:gate ist **nicht** der Roh-Handoff-Einstieg. Es prüft erst die bereits importierten, visuell geprüften und SHA-256-approved Assets.

Fehlt nach phase3:prepare wirklich ein Phase-2-Asset oder ist die Zuordnung mehrdeutig, meldet Antigravity exakt diese Datei. Es fordert aber nicht pauschal manuelles Entpacken, Umbenennen oder MP4→MP3-Konvertieren vom Nutzer an, wenn der technische Import das selbst sicher erledigen kann.

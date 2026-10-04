# KM-002 — Basketball — Pipeline V2

Status: Bildplanung fertig, finale Assets fehlen noch.

## Struktur
- `00-bildprompts/google-flow-prompt.txt` — verbindlicher Google-Flow-Arbeitsauftrag
- `00-bildprompts/images/` — nur finale Bild 00–16 Dateien
- `01-voice-script/voice-script.txt` — eine Opening-Voice
- `02-audio/` — Voice 01.mp3 + bg-music.mp3
- `03-export/FINAL_VIDEO.mp4` — finales Video
- `03-export/UPLOAD_METADATA.md` — finaler YouTube-Titel + Videobeschreibung/Caption
- `99-technik/episode.json` — Episodenregeln
- `99-technik/IMAGE_PLAN.json` — Bildplanung
- `99-technik/VISUAL_REVIEW.json` — echte Sichtprüfung
- `99-technik/GENERATION-REVISION.txt` — Revision

## Produktionsreihenfolge
1. Bild 00: drei Cover-Kandidaten, einen Gewinner behalten.
2. Bild 01 erzeugen und als Charakter/Welt-Referenz freigeben.
3. Bild 02 und 03 erzeugen.
4. Bild 04 erzeugen und als Exercise-UI-Referenz freigeben.
5. Bild 05–15 mit Bild 01 + Bild 04 als getrennten Referenzen erzeugen.
6. Bild 16 textfrei erzeugen.
7. Alle Bilder tatsächlich ansehen und erst dann VISUAL_REVIEW auf true setzen.
8. Voice/Musik ablegen und `assets:approve` ausführen.
9. Episode aktivieren und guarded render ausführen.
10. `03-export/UPLOAD_METADATA.md` mit finalem Titel + finaler Beschreibung/Caption auf den fertigen Videoinhalt prüfen und auf FINAL setzen.

Kein Asset ist aktuell automatisch freigegeben.

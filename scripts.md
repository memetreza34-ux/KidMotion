# KidMotion — Scripts Dokumentation

Alle ausführbaren Skripte liegen in `scripts/`. Diese Datei erklärt in Fließtext, was jedes Skript macht und wann es verwendet wird. Die Skripte selbst sind die ausführbare Wahrheit; diese Datei ist die lesbare Erklärung dazu.

---

## npm run render:safe

Das ist der Hauptbefehl für die Videoproduktion. Er läuft in drei Schritten: zuerst TypeScript-Prüfung (`tsc --noEmit`), dann Preflight-Validierung, dann das eigentliche Rendering. Das Video wird als `out/kidmotion.mp4` gespeichert. Die Kompressionseinstellungen (`--crf 28 --preset faster`) sorgen dafür, dass das fertige Video unter 60 MB bleibt, ohne sichtbaren Qualitätsverlust.

Wann verwenden: Immer wenn ein finales Video erstellt werden soll.

---

## npm run start

Startet den Remotion Studio Server lokal im Browser. So kann man das Video frame-für-frame in Echtzeit prüfen, ohne immer vollständig rendern zu müssen. Hilfreich beim Entwickeln und Feintuning.

Wann verwenden: Zum Prüfen von Änderungen an Components, Timing oder Layout.

---

## node scripts/split-master-audio.mjs

**Das wichtigste Skript für den Audio-Workflow.**

Der Nutzer nimmt alle drei Sprachteile (Intro, Safety, Let's Begin) in einer einzigen Datei auf und speichert sie als `master.mp3` in `episodes/KM-001-football/02-audio/`. Dieses Skript erkennt automatisch die Sprechpausen (Stille länger als 0.8 Sekunden, unter -30 dB) und zerschneidet die Datei in drei separate MP3-Dateien: `Voice 01.mp3` für das Intro, `Voice 02.mp3` für den Safety-Screen und `Voice 03.mp3` für Let's Begin. Die fertig geschnittenen Dateien landen direkt im richtigen Audio-Ordner, sodass das nächste Rendering sie sofort nutzen kann.

Wann verwenden: Nachdem der Nutzer die `master.mp3` in den Audio-Ordner gelegt hat.

Befehl: `node scripts/split-master-audio.mjs`

---

## node scripts/preflight.mjs

Prüft vor dem Rendering, ob alle Pflichtdateien vorhanden und korrekt sind. Kontrolliert: alle Bilder (Bild 00 bis Bild 16) vorhanden, Audio-Dateien vorhanden, Übungsdauern genau 20 Sekunden. Wenn etwas fehlt, stoppt der Preflight mit einer klaren Fehlermeldung und dem genauen Pfad der fehlenden Datei. Wird automatisch als Teil von `npm run render:safe` ausgeführt.

Wann verwenden: Zur Prüfung ob alles bereit ist. Läuft automatisch vor dem Render.

---

## node scripts/new-episode.mjs

Erstellt eine neue leere Episode-Ordnerstruktur nach dem KidMotion-Standard. Legt alle Unterordner (`01-skript`, `02-audio`, `03-bilder`, `04-data`) an und erstellt die grundlegenden Dateien (README.md, data.json-Vorlage, voice-text.md). Die neue Episode bekommt automatisch die nächste freie Episodennummer.

Wann verwenden: Wenn eine neue Episode gestartet wird.

Befehl: `node scripts/new-episode.mjs --id KM-002 --title "TITLE" --theme "theme"`

---

## node scripts/activate-episode.mjs

Wechselt die aktive Episode. Aktualisiert `src/data/active-workout.ts` so, dass die Pfade auf die neue Ziel-Episode zeigen. So können mehrere Episoden im selben Repository liegen, aber immer nur eine ist aktiv und wird gerendert.

Wann verwenden: Wenn zwischen mehreren Episoden gewechselt werden soll.

Befehl: `node scripts/activate-episode.mjs --episode KM-002-name`

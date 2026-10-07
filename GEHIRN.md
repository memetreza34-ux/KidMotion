# KidMotion — Projekt-Gehirn

> Menschenlesbare verbindliche Regelquelle. Der maschinenlesbare Produktionsvertrag liegt in `config/v3-contract.json`. Beide müssen identisch bleiben; `project:doctor` und `repo:qa` blockieren Abweichungen.

## 0. Maschinenlesbarer Vertrag
Neue produktive Episoden müssen `productionContractVersion` und `contractFile: config/v3-contract.json` tragen. Episoden ohne aktuelle Contract-Version sind read-only/pre-contract und dürfen nicht ausgewählt, approved, aktiviert oder gerendert werden.

## 0a. Phasenmodell — HARTE ZUSTÄNDIGKEITSGRENZE
**Phase 1 — Planung:** Szenenplan, Prompts, Voice-Plan, Timing und Metadaten.

**Phase 2 — Bildproduktion und Übergabe:** Google Flow bzw. der vorgesehene Bildworkflow erzeugt die finalen Bilder. Nutzerwahl/Review findet hier statt. Danach werden die fertigen Bilder per SHA-256 freigegeben.

**Phase 3 — Antigravity Ingest + Assembly/Render:** Antigravity erzeugt **keine Bilder**. Es darf aber die vom Nutzer aus Phase 2 übergebenen Dateien entpacken, technisch einsortieren und vorhandene Audio-Container konvertieren. Danach verwendet es ausschließlich diese übergebenen Assets.

Für Phase 3 gilt:
- kein Bildgenerator / kein Google Flow
- keine Bildgenerierung oder Regeneration
- keine Bildbearbeitung
- kein Ersetzen/Improvisieren
- keine Fallback-Bilder
- fehlendes/geändertes Bild = Phase 3 blockieren
- bei einem Roh-Handoff zuerst `npm run phase3:ingest -- --episode=<episode-folder>`
- ZIP entpacken und technische Datei-Normalisierung sind erlaubt
- Audio aus vorhandenen MP4/M4A/WAV/AAC-Dateien nach MP3 konvertieren ist erlaubt
- Bildpixel/Bildinhalt dürfen nicht verändert werden
- danach Scene-QA + visuelle Prüfung + Asset Approval
- erst **nach Approval** muss `npm run phase3:gate` bestehen
- die importierten Phase-2-Bilder sind danach unveränderliche Inputs

## 1. Format
KidMotion produziert englische 16:9 YouTube-Longform-Kinderworkouts mit einem wiederkehrenden 3D-Charakter und statischen Hold-/Freeze-Posen.

Standard: 1920×1080, 30 fps, 12 Übungen, 20s je Übung, 11 Übergänge à 5s, 313s / 5:13.

## 2. V3-Episodenstruktur
```text
episodes/KM-XXX-name/
├── 00-bildprompts/
│   ├── google-flow-prompt.txt
│   └── images/
│       ├── Szene 01.png
│       ├── Szene 02.png
│       └── ... Szene 28.png
├── 01-voice-script/voice-script.txt
├── 02-audio/
│   ├── Voice 01.mp3
│   ├── bg-music.mp3
│   └── MUSIC_BRIEF.md
├── 03-export/
│   ├── FINAL_VIDEO.mp4
│   └── UPLOAD_METADATA.md
└── 99-technik/
    ├── episode.json
    ├── IMAGE_PLAN.json
    ├── RENDER_PLAN.json
    ├── COVER_SELECTION.json
    ├── VISUAL_REVIEW.json
    ├── GENERATION-REVISION.txt
    └── ASSET_APPROVAL.json
```

Alle finalen Bilder liegen flach in genau einem Bilderordner.

## 3. PHASE 2 — Cover-Workflow — HARTE SPERRE
1. Zuerst exakt drei Cover-Kandidaten erzeugen:
   - `Cover-Kandidat-01.png`
   - `Cover-Kandidat-02.png`
   - `Cover-Kandidat-03.png`
2. Dem Nutzer alle drei zeigen.
3. **STOP.**
4. Keine Szene 02 oder später erzeugen, bevor der Nutzer Kandidat 1/2/3 ausdrücklich gewählt hat.
5. Gewinner → `Szene 01.png`.
6. Die zwei Verlierer sofort löschen.
7. `Szene 01.png` ist ab dann die **einzige erlaubte Bildreferenz** für alle Szenen 02–28.
8. Kein später erzeugtes Bild darf jemals als zweite Referenz verwendet werden.

## 4. PHASE 2 — Bildgenerierung — HARTE EINMAL-REGEL
Nach der Cover-Auswahl läuft die Bildproduktion automatisch bis zum fertigen Ordner durch.

Pflicht:
- Szene 02–28 jeweils exakt **einmal** generieren
- maximal ein Generierungsversuch pro Szene
- keine Alternativversionen
- keine Regeneration, sobald ein Bild erzeugt wurde
- pro Szene als Bildreferenz ausschließlich `Szene 01.png`
- keine `Szene 05`-Referenz und keine Referenz auf irgendeine vorherige Szene
- Text-/UI-Konsistenz ausschließlich über die geschriebenen Google-Flow-Prompts beschreiben
- Generierungen strikt **seriell** abarbeiten: Szene N vollständig abschließen und speichern, bevor Szene N+1 gestartet wird
- eine fehlgeschlagene/fehlende Szene niemals durch Kopieren, Umbenennen oder Wiederverwenden eines anderen Bildes auffüllen

Interne Produktionsblöcke:
- Szene 02–06
- Szene 07–11
- Szene 12–16
- Szene 17–21
- Szene 22–26
- Szene 27–28

Zwischen diesen Blöcken wird nicht gestoppt und der Nutzer wird nicht erneut gefragt.

### 4a. PRE-FLOW PROMPT QA — HARTE SPERRE
Bevor **irgendein** Cover oder Szenenbild in Google Flow erzeugt wird, muss die komplette Planung fertig sein.

Pflichtbefehl:
`npm run prompt:qa -- --episode=<episode-folder>`

Flow darf nur gestartet werden, wenn dieser Check erfolgreich ist.

Der Check muss verhindern:
- `TBD`/Placeholder in `episode.json`, `IMAGE_PLAN.json` oder `google-flow-prompt.txt`
- fehlende Cover-Prompts
- fehlende Szenen-Prompts
- falsche Szenenreihenfolge
- fehlende Übungsnamen/Instructions
- falsche `GET READY / NEXT:`-Zuordnung
- zweite Bildreferenz neben `Szene 01.png`
- mehr als einen erlaubten Generierungsversuch pro späterer Szene

`google-flow-prompt.txt` ist die direkte Promptquelle. Für KM-V3 enthält sie genau drei Cover-Promptblöcke und je einen vollständigen `FINAL GOOGLE FLOW PROMPT` für Szene 02–28.

## 5. Szenenplan
- Szene 01: Cover, nicht im MP4
- Szene 02: Intro, 8s
- Szene 03: Safety, 4s
- Szene 04: LET'S BEGIN, 2s
- Szene 05: Übung 1, 20s
- Szene 06: GET READY für Übung 2, 5s
- Szene 07: Übung 2, 20s
- Szene 08: GET READY für Übung 3, 5s
- ...
- Szene 25: Übung 11, 20s
- Szene 26: GET READY für Übung 12, 5s
- Szene 27: Übung 12, 20s
- Szene 28: Outro, 4s

Die 5-Sekunden-Übergänge benutzen **nie** das nächste 20-Sekunden-Übungsbild.

## 6. Google Flow besitzt alle sichtbaren Texte
**HARTE REGEL:** Google Flow erzeugt jeden sichtbaren Text direkt im finalen Bild. Die einzige Ausnahme ist der dynamische Countdown-Timer, den Remotion darüberlegt.

Google Flow erzeugt:
- Cover-Text
- Intro-Text
- Safety-Text
- LET'S BEGIN
- Übungsname + Instruction
- GET READY + NEXT: Übungsname
- Outro-Text

Remotion darf keinen dieser Texte erneut erzeugen.

### Einheitlicher Prompt-UI-Vertrag
Da ausschließlich `Szene 01.png` als Bildreferenz benutzt wird, muss das UI in **jedem** entsprechenden Szenenprompt textlich vollständig beschrieben werden.

Übungsbilder:
- Titel immer unten links
- weiß, fett, uppercase
- gleiche Größen-/Abstandslogik
- dunkle halbtransparente Navy-Fläche hinter dem Titel
- keine Gold-Plakette, kein graues Badge, keine zufällige alternative Titelbox
- Instruction immer oben rechts
- helle abgerundete Box, dunkler Text, konsistente Abstände

GET READY:
- gleiche Position und Hierarchie über alle 11 Übergänge
- `GET READY` + `NEXT: <exercise>`
- keine spontane alternative UI-Gestaltung

## 7. Übungsqualität — klare Kinder-Challenges
Die 12 Übungsbilder dürfen nicht wie zwölf Varianten von Squat/Lunge/Balance aussehen.

Pflicht:
- deutlich unterschiedliche Silhouetten
- unterschiedliche Körperhöhen und Richtungen
- Mischung aus upright, wide, diagonal, one-leg, side-bend und floor-level
- jede Pose aus einem Standbild sofort verständlich
- benachbarte Übungen dürfen nicht nahezu identisch wirken

Da jede Szene nur einmal erzeugt wird, muss der Prompt **vor der Generierung** vollständig und eindeutig sein. Es gibt keine automatische zweite Variante als Korrekturversuch.

## 8. Bildwelt
- exakt ein Hauptcharakter pro Episode
- gleicher Charakter, Haare, Proportionen und Outfit
- dieselbe KidMotion-Gym-/Adventure-Welt
- innerhalb dieser Welt dürfen verschiedene Zonen/Perspektiven genutzt werden, damit nicht jedes Bild gleich aussieht
- keine zweite Person
- keine realen Logos/Teams/Sponsoren
- natürliche Anatomie
- Ganzkörper und wichtige Gelenke sichtbar

**Referenzregel:** Für Szene 02–28 wird ausschließlich das vom Nutzer gewählte `Szene 01.png` als Bildreferenz benutzt. Kein zweites Bild.

## 9. GET READY
Jeder 5s-Übergang hat ein eigenes Flow-Bild.

Pflicht:
- gleicher Charakter
- neutraler Ready-Stand
- **nicht** bereits die nächste Übungspose
- sichtbarer Flow-Text: `GET READY` + `NEXT: <exercise>`
- top-left 230×230 px frei für den Timer

## 10. Remotion — TIMER ONLY
Remotion darf visuell ausschließlich den Countdown-Timer erzeugen.

Erlaubt:
- statisches Flow-Bild 1:1 anzeigen
- 20s Timer über Übung
- 5s Timer über GET READY
- Voice + Hintergrundmusik abspielen
- Szenen zeitlich zusammensetzen

Verboten:
- Progress Bar
- zusätzliche Titel/Instructions
- GET READY/NEXT als Remotion-Text
- Intro/Safety/Outro-Text
- Untertitel/Captions
- Zoom/Pan/Ken Burns auf Workout-Szenen
- Full-scene Fade von leer/schwarz/weiß

### Timer
- 192 px
- top-left, ca. 26 px Abstand
- Safe-Zone 230×230 px
- deutlich größere Zahl
- dunkler klarer Timer-Hintergrund + kräftiger Ring
- Übung: 20→1
- GET READY: 5→1
- kein sichtbarer 0-Frame

## 11. Audio
### Voice-Skript-Standard
`01-voice-script/voice-script.txt` enthält **nur den reinen gesprochenen Fließtext**.

Pflicht:
- keine Zeitangaben
- keine Überschriften
- keine Markdown-Struktur
- keine Erklärungen oder Regeln
- keine Labels wie INTRO / SAFETY / LET'S BEGIN
- nur exakt der Text, der gesprochen wird
- der komplette Dateiinhalt muss dem `exactTtsCopy` aus `99-technik/VOICE_PLAN.json` entsprechen

Alle technischen Zeitinformationen bleiben ausschließlich in `99-technik/VOICE_PLAN.json`. Sie gehören niemals in `voice-script.txt`.

Genau eine gesprochene Datei: `Voice 01.mp3`.
Sie startet Frame 0, trägt Intro + Safety + LET'S BEGIN nahezu lückenlos und endet vor Übung 1. Ziel 13.65–14.00s, absolut max. 14.05s.

Danach keine Voice und keine Untertitel.

`bg-music.mp3` ist Pflicht.

Musikziel:
- 120–130 BPM
- upbeat playful kids-fitness electro-pop instrumental
- hell, sportlich, spielerisch
- keine Vocals
- kein dunkler Trap-/aggressiver EDM-Sound
- nicht kinderlied-/babyhaft
- möglichst sauber loopbar
- kommerzielle YouTube-Nutzung muss erlaubt sein
- während Opening-Voice leiser, danach spürbar energiereicher

## 12. Visuelle Freigabe
`VISUAL_REVIEW.json` bleibt false, bis die echten Bilder angesehen wurden.

Zusätzlich zu Anatomie/Text/Konsistenz muss geprüft werden:
- `poseVarietyStrong`
- `allGetReadyImagesClearAndNotConfusableWithExercise`
- jede Szene entspricht wirklich ihrer geplanten Rolle/Übung
- jeder Übungstitel passt zum dargestellten Bild
- jeder `GET READY`-Text zeigt auf die richtige nächste Übung
- keine fehlenden, verschobenen oder inhaltlich doppelt verwendeten Szenen

Nach allen 28 Bildern läuft:
`npm run scene:qa -- --episode=<episode-folder>`

Erst danach `npm run assets:approve -- --episode=...`.
Approval sperrt Assets per SHA-256.

## 13. PHASE 3 — Antigravity Assembly/Render
Roh-Handoff zuerst über `npm run phase3:ingest -- --episode=<episode-folder>`.

Finaler Render danach nur über `npm run render:safe`.

Ablauf:
TypeScript → Project Doctor → Preflight → Asset Gate → Render → Postrender QA.

Postrender QA vergleicht bei V3 die gerenderten Szenen mit den erwarteten Quelldateien und prüft Frames direkt vor/nach den Szenengrenzen. Falscher Slot, verschobener Bildwechsel oder falsches Quellenbild blockiert den Abschluss.

## 14. Export
`03-export/` enthält mindestens:
- `FINAL_VIDEO.mp4`
- `UPLOAD_METADATA.md` mit copy-ready YouTube-Titel und Beschreibung/Caption

PRODUCTION COMPLETE erst nach visueller MP4-Prüfung.

# KidMotion — Projekt-Gehirn V2

> Höchste verbindliche Regelquelle. Bei Widersprüchen gilt diese Datei.

## 0. Format
KidMotion produziert englische YouTube-Longform-Workout-Videos für Kinder mit statischen, sofort verständlichen Hold-Posen.

Standard:
- 16:9, 1920×1080, 30 fps
- genau ein Hauptcharakter pro Episode
- 12 Übungen × 20s
- 11 Rest-Phasen × 5s
- Intro 8s, Safety 4s, LET'S BEGIN 2s, Outro 4s
- Standardlaufzeit 313s / 5:13
- Bild 00 = Cover, niemals im MP4

## 1. Zentrale Pipeline-Regeln
Globale Regeln stehen in:
- `config/pipeline.json`
- `config/visual-policy.json`
- `characters/CHARACTER_BIBLE.md`

`config/visual-policy.json` definiert die gemeinsame KidMotion-Bildwelt. Eine Episode darf diese Bildwelt konkretisieren, aber nicht heimlich widersprechen.

## 2. Episodenstruktur V2
Alle neuen Episoden und KM-002+ verwenden ausschließlich:

```text
episodes/KM-XXX-name/
├── 00-bildprompts/
│   ├── google-flow-prompt.txt
│   └── images/
│       ├── Bild 00.png
│       ├── Bild 01.png
│       └── ... Bild 16.png
├── 01-voice-script/
│   └── voice-script.txt
├── 02-audio/
│   ├── Voice 01.mp3
│   └── bg-music.mp3
├── 03-export/
│   └── FINAL_VIDEO.mp4
└── 99-technik/
    ├── episode.json
    ├── IMAGE_PLAN.json
    ├── RENDER_PLAN.json
    ├── VISUAL_REVIEW.json
    ├── ASSET_APPROVAL.json
    ├── GENERATION-REVISION.txt
    └── status.json
```

KM-001 darf als Legacy-Archiv bestehen bleiben. Eine V2-Episode darf nicht parallel alte Produktionsquellen wie `03-bilder/bild-prompts.md`, `04-data/data.json`, `01-skript/voice-text.md` oder eine Root-`GENERATION-REVISION.txt` verwenden.

## 3. Produktionsablauf

### Phase 1 — Planung
1. Thema/Workout festlegen.
2. `episode.json` vollständig ausarbeiten.
3. `IMAGE_PLAN.json` vollständig ausarbeiten.
4. `google-flow-prompt.txt` vollständig ausarbeiten.
5. Keine `TBD`-Werte dürfen vor finaler Asset-Erzeugung übrig bleiben.

Jedes Bild im `IMAGE_PLAN.json` braucht mindestens:
- `Visual Purpose`
- `Topic Anchor`
- `Visual Form`
- Character Reference
- UI Reference, falls relevant
- Prop Count
- Generated Text
- Safe Zones
- Acceptance Criteria
- vollständigen finalen Prompt

Ein Bild existiert nur, wenn es eine klare visuelle Funktion hat.

### Phase 2 — Google Flow Assets
Die Pipeline ruft Google Flow nicht selbst per API auf. `google-flow-prompt.txt` ist der verbindliche Arbeitsauftrag für den Agenten/Nutzer, der Google Flow bedient.

Harter Ablauf:
`BLOCK LESEN → REFERENZEN LADEN → GENERIEREN → PRÜFEN → AKZEPTIEREN/ABLEHNEN → SOFORT UMBENENNEN → ERST DANN WEITER`

Finale Bilder liegen ausschließlich flach in:
`00-bildprompts/images/`

### Cover
- `Bild 00` ist separates Thumbnail und nicht Teil des Videos.
- genau drei temporäre Cover-Kandidaten erzeugen
- genau einen Gewinner auswählen
- nur der Gewinner bleibt als `Bild 00.png`

### Nicht-Cover
- `Bild 01`–`Bild 16` haben je genau eine akzeptierte Finalversion
- keine automatischen Alternativversionen
- Regeneration nur nach expliziter Ablehnung
- maximal fünf parallele Generationen, Referenzabhängigkeiten haben Vorrang

### Referenz-Workflow
1. `Bild 01` zuerst generieren und freigeben.
2. `Bild 01` wird PRIMARY character/world reference für `Bild 02`–`Bild 16`.
3. `Bild 04` generieren und freigeben, bevor `Bild 05`–`Bild 15` entstehen.
4. `Bild 04` wird SECONDARY exercise UI/layout reference.
5. Spätere Bilder übernehmen aus Bild 04 nur UI-Stil, niemals Pose oder Wortlaut.

## 4. Ein-Bild-Klarheit — höchste Übungsregel
Eine Übung ist nur erlaubt, wenn ein Kind sie aus genau einem Standbild sofort versteht.

Pflicht:
- Ganzkörper sichtbar
- wichtige Gelenke sichtbar
- Arme/Beine klar getrennt
- eindeutige Silhouette
- klarer statischer Endzustand
- natürliche Anatomie
- keine Bewegung nötig, um die Übung zu verstehen

Wenn eine Pose nach zwei ernsthaften Flow-Versuchen unklar bleibt, wird die Pose ersetzt statt mit mehr Text gerettet.

## 5. Google Flow Text/UI
Für `Bild 04`–`Bild 15` erzeugt Google Flow direkt:
- genau einen Exercise Title bottom-left
- genau eine kurze Instruction Cloud top-right

`Bild 01`, `Bild 02`, `Bild 03`, `Bild 16` enthalten ZERO generierten Text.

Safe Zones bei Exercises:
- top-left ca. 220×220 px frei für Remotion-Timer
- unterste ca. 90 px frei für Progress Bar
- Titel oberhalb der Progress-Zone
- Cloud oben rechts mit sicherem Rand

Verboten:
- Thought-bubble dots
- zweiter Titel
- zweite Instruction
- Timer im Bild
- Progress im Bild
- REST UI im Bild
- Untertitel/Transcript-Bar

## 6. Prop-Regel
Wenn eine Pose keinen Ball braucht: ZERO Basketballs im gesamten Bild.
Wenn eine Pose einen Ball braucht: EXACTLY ONE Basketball.
Keine losen oder doppelten Background-Bälle.

## 7. Audio
Genau eine gesprochene Datei:
`02-audio/Voice 01.mp3`

Sie startet bei Frame 0 und trägt Intro + Safety + LET'S BEGIN nahezu lückenlos.
Zielbereich: ca. 13,65–14,00s; technisches Maximum 14,05s.
Sie endet vor Exercise 1.

Danach:
- keine Exercise Voice
- keine Rest Voice
- keine Outro Voice
- keine Countdown-Stimme
- keine Untertitel/Captions

`02-audio/bg-music.mp3` ist für finalen Render Pflicht, instrumental, kinderfreundlich, ohne Lyrics/Spoken Samples und über das komplette Video geloopt.

## 8. Remotion
Remotion trifft keine Bildgenerierungsentscheidung. Es setzt nur den bereits freigegebenen Produktionsplan um.

Exercises:
- Source-Image statisch 1:1
- nur 20s Circular Timer top-left
- nur Progress Bar
- kein zweiter Exercise Name/Instruction

Rest:
- nächstes Exercise-Bild wiederverwenden
- nur REST + Countdown top-left
- kein NEXT-Name

Verboten auf Exercise/Rest:
- Ken Burns
- Zoom
- Pan
- Full-image Fade von 0
- blanke schwarze/weiße Übergangsframes

## 9. Visuelle Freigabe + SHA-256 Lock
`99-technik/VISUAL_REVIEW.json` bleibt zunächst vollständig `false`.
Flags dürfen nur nach tatsächlicher Sichtprüfung der finalen Bilder gesetzt werden.

Prüfen:
- gleicher Charakter
- jede Pose klar aus einem Standbild
- Exercise UI konsistent und lesbar
- Safe Zones frei
- Prop Count korrekt
- Non-Exercise-Bilder ohne generierten Text
- keine Extra-Personen
- keine Anatomiefehler
- keine wichtigen abgeschnittenen Gliedmaßen

Dann:
`npm run assets:approve -- --episode=KM-XXX-slug`

Approval sperrt alle freigegebenen Bild-/Audiodateien per SHA-256. Jede spätere Asset-Änderung macht die Freigabe ungültig.

## 10. Render-Gates
Finaler Render nur über guarded pipeline:

`TypeScript → project:doctor → preflight → asset:gate → Remotion render → postrender:qa`

`project:doctor` schützt V2-Struktur, Flow-Workflow und zentrale Policies.
`preflight` blockiert unvollständige IMAGE_PLAN/Flow-Prompts, fehlende Assets, falsches Timing und falsche Voice/Music.
`asset:gate` blockiert alles, was nicht exakt der visuell freigegebenen SHA-256-Version entspricht.

Automatische Checks ersetzen niemals die visuelle Bildprüfung.

## 11. Definition of Done
Eine Episode ist erst fertig, wenn:
- IMAGE_PLAN vollständig
- Google-Flow-Prompt vollständig
- Bild 00–16 vorhanden
- Bild 01/04 Referenzworkflow eingehalten
- Visual Review wahrheitsgemäß vollständig
- Asset Approval gültig
- Voice/Music gültig
- TypeScript, Project Doctor, Preflight, Asset Gate bestanden
- Render und Postrender-QA bestanden
- finale MP4 visuell geprüft

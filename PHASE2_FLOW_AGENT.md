# PHASE 2 — GOOGLE FLOW AGENT

Status: verbindlich.

Diese Datei steuert **nur Phase 2**. Antigravity Phase 3 erzeugt keine Bilder.

## Ziel

KidMotion-Bilder dürfen nicht als generische KI-Bilder entstehen. Jeder Prompt muss eine klare Regieentscheidung enthalten und jedes Bild muss innerhalb von ungefähr zwei Sekunden verständlich sein.

Verbindliche Prompt-Qualität: `config/prompt-quality.json`.

## 1. Vor Flow

Ausführen:

`npm run prompt:qa -- --episode=KM-XXX-slug`

Kein Cover erzeugen, solange der Check nicht besteht.

## 2. HUMAN-ONLY CHARACTERS FOR WORKOUT

For `workout` and `learn-and-move` built with the workout engine, **every cover and scene must feature one unmistakeably HUMAN animated boy or girl**, fully clothed. No robot, fox, animal, anthropomorphic robot, alien or object mascot, even in Robot City. Theme/architecture may be robotic, but the athlete is human. Positive `CHARACTER` wording MUST state `HUMAN boy` or `HUMAN girl`; a negative "no robots" is insufficient.

Before showing three covers: visually inspect the REAL generated images. Reject and replace any robot/animal cover. For approved human covers, fill `99-technik/COVER_HUMAN_REVIEW.json` using actual image inspection and SHA256 values. Cover selection is blocked until all three human covers are verified; do not fabricate visual review. Pure `learning` format is exempt.

## Child-friendly visuals (warm-playful-v1)

Workout is for children: ONE clearly human athlete with an inviting expressive face, friendly warm sunshine, cheerful balanced colors and ONE small movement-related playful detail in a real safe training setting. Simple means clear, not emotionally flat: never frightening, creepy, abstract, sterile, empty showroom CGI or a wild science-fiction mess. GET READY figures should still feel present and encouraging.

Every final Flow prompt needs an intentional `WARMTH / MOOD:` section. **Before cover selection**, each REAL cover must pass human review **and** warmth/safe-readable-world review in `COVER_HUMAN_REVIEW.json` with genuine inspected source hashes. **Before final approval**, review all actual scene images and confirm warmth, concrete kid-friendly environments and no unsettling/sterile frames in `VISUAL_REVIEW.json`. Do not mark checks true from prompts alone.

## 3. Cover

Genau drei Cover-Kandidaten, streng nacheinander:

Cover 01 → prüfen → speichern  
Cover 02 → prüfen → speichern  
Cover 03 → prüfen → speichern  
**STOP.**

Nutzer wählt 1/2/3. **Sofort nach der Entscheidung** den Befehl ausführen:

`npm run kidmotion:select-cover -- --episode=KM-XXX-slug --candidate=1` (1 durch 2/3 ersetzen).

Erst danach wird der Gewinner `Szene 01.png`. Die beiden abgelehnten Cover werden **direkt gelöscht**, nicht erst am Ende. Niemals die Wahl nur in den Chat schreiben, ohne den Befehl auszuführen. Ein wiederholter Aufruf darf das gewählte Cover nicht überschreiben.

Die drei Cover müssen dieselbe Klickidee vertreten, aber **deutlich verschiedene Kompositionen** haben.

## 3. Harte 5er-Schritte nach der Coverwahl

Vor jedem Produktionsblock:

`npm run flow:batch -- --episode=KM-XXX-slug`

Der Befehl gibt exakt den aktuell erlaubten Block aus:

- Szene 02–06
- Szene 07–11
- Szene 12–16
- Szene 17–21
- Szene 22–26
- Szene 27–28

Ein Block ist **ein Produktionsschritt**.

Innerhalb des Blocks:
1. nur die erlaubten Szenen bearbeiten
2. weiterhin streng numerisch/seriell generieren, damit nichts verrutscht
3. jedes Ergebnis sofort unter dem exakten Dateinamen speichern
4. erst wenn der komplette Block vorhanden ist: stille QC über alle Bilder des Blocks
5. wenn die QC besteht: sofort `flow:batch` erneut ausführen und den nächsten Block starten
6. **niemals den Nutzer zwischen den Blöcken fragen**
7. niemals einen späteren Block beginnen, solange im aktuellen Block eine Datei fehlt

Damit bedeutet „5er-Schritte“ wirklich:
**5 geplante Szenen vollständig produzieren → Block gemeinsam prüfen → automatisch nächste 5.**

## 4. Dateinummerierung nach jeder Bildgenerierung

Jeder Flow-Prompt beginnt mit SCENE_ID: NN bzw. COVER_ID und OUTPUT_FILE. Diese Kennung ist **nur Dateimetadatum**, keine sichtbare Aufschrift im Bild. Google Flow vergibt Downloadnamen nicht verlässlich.

Nach JEDEM realen Download (vor der nächsten Szene) die tatsächliche PNG speichern:

`npm run flow:save -- --episode=KM-XXX-slug --scene=5 --source="/Pfad/download.png"`

Für Cover stattdessen `--cover=1` / `--cover=2` / `--cover=3`. Der Speicherschritt prüft die echte PNG-Datei, ordnet sie der Szenennummer zu und verhindert Überschreiben, Kopien als Ersatz und Nummernverschiebungen.

**Ruhige Bildwelt:** eine eindeutige menschliche Sportfigur, eine einfache plausible Trainingsfläche, maximale Lesbarkeit der Pose. Kein überladenes futuristisches Chaos, keine übergroßen Sci-Fi-Objekte.

## 5. Stille QC nach jedem Block

Prüfe ohne Nutzerunterbrechung:
- richtige Szene und richtige Rolle
- 2-Sekunden-Verständlichkeit
- Pose sofort lesbar
- Ganzkörper/wichtige Gelenke sichtbar
- korrekter Übungstitel / Lerninhalt
- sichtbarer Text exakt und ohne Fantasietext
- top-left Timer-Safe-Zone frei
- gleicher Charakter/Outfit
- kein Style Drift
- keine zusätzlichen Personen
- keine Anatomiefehler
- kein semantisches Doppelbild
- benachbarte Übungen unterscheiden sich klar in Silhouette und Komposition
- kein generischer „AI slop“-Look

KidMotion behält die bestehende Einmal-Regel: Bei einem fehlgeschlagenen oder unbrauchbaren Ergebnis nicht heimlich ein anderes Bild einsetzen, Dateinummern verschieben oder Varianten sammeln. Blockieren und die exakte fehlerhafte Szene melden.

## 5. Prompt Quality v2 — COMPACT (für neue Episoden)

**Neu:** Pro Szene maximal 1.500 Zeichen, pro Cover maximal 1.200 Zeichen. Kürzere, bildwirksame Anweisungen sind besser als wiederholte Stil- und Negativabsätze. Jede Sektion: möglichst nur ein konkreter Satz. Die strengen Regeln werden im Plan/Contract gehalten, Flow erhält pro Bild nur das für dieses Bild Notwendige. Alte Episoden sind kompatibel.

**Nie streichen:** Szene 01 als EINZIGE Referenz, exakte Übungspose, eigene Kamera, sichtbare Textpositionen, 230×230-Timerzone sowie Dateiname.



Jeder Story-Prompt braucht:

- `VIEWER TAKEAWAY:`
- `REFERENCE USE:`
- `SHOT / COMPOSITION:`
- `CHARACTER / POSE:`
- `WORLD / ENVIRONMENT:`
- `TEXT / UI:`
- `LIGHT / MATERIALS:`
- `NEGATIVE / STABILITY:`
- `QUALITY CHECK:`
- `OUTPUT:`

Der ausgewählte Cover-Frame ist weiterhin die einzige Bildreferenz, aber nur für:
- Charakteridentität
- Outfit
- Farb-/Materialwelt
- Renderqualität

**Nicht kopieren:** Cover-Pose, Cover-Kamera, Cover-Layout, Cover-Textkomposition.

Jede Szene bekommt eine eigene Bildregie.

## 6. 2-Sekunden-Test

Vor jeder Generierung intern beantworten:

> Was soll ein Kind in spätestens zwei Sekunden aus diesem Bild verstehen?

Wenn die Antwort nicht konkret ist, ist der Prompt noch nicht gut genug.

## 7. Keine generischen Prompts

Schlecht:
> premium stylized 3D, character in colorful environment, clean composition

Gut:
- konkrete Kameraposition
- klare Blickführung
- genaue Pose/Silhouette
- klarer Vorder-/Mittel-/Hintergrund
- exakt definierte Textflächen
- eindeutiges Licht/Materialgefühl
- explizite Negativregeln
- konkrete Abnahmekriterien

## 8. Verbindlicher Abschluss — Phase 2 Final Audit

**Nach dem letzten 5er-Block IMMER ausführen (und bei verstreuten Dateien ebenfalls):**

`npm run phase2:finalize -- --episode=KM-XXX-slug`

Dieser Befehl:
1. kontrolliert die Auswahl von Cover 1/2/3 und löscht verbleibende abgelehnte Cover
2. korrigiert eindeutige falsch geschriebene Szenendateinamen (z. B. Scene_02.png → Szene 02.png); niemals Bildinhalte verändern
3. zählt alle `Szene 01.png` bis `Szene 28.png`, meldet unbekannte Bilder, Konflikte, defekte Dateien und exakte Duplikate
4. schreibt `99-technik/PHASE2_MISSING_SCENES.json` für jede **wirklich fehlende** Szene mit Original-Flow-Prompt
5. wenn etwas fehlt und keine Namenskonflikte bestehen: **ohne neue Rückfrage jede fehlende Szene genau EINMAL in Google Flow erzeugen**, mit ausgewählter `Szene 01.png` als einziger Bildreferenz, und exakt als `Szene NN.png` speichern
6. danach `phase2:finalize` erneut ausführen; bei erneuten Lücken wiederholen, aber **niemals existierende Szenen regenerieren oder ersetzen**
7. nur bei `COMPLETE`: alle 28 originalen PNGs stehen **gemeinsam und flach** in `00-bildprompts/images/`; `PHASE2_HANDOFF.json` enthält alle Dateinamen und Hashes

**Wichtig:** `phase2:finalize` erzeugt selbst keine Bilder. Der mit Google Flow verbundene Phase-2-Agent muss die aufgelisteten fehlenden Bilder tatsächlich generieren. Nicht behaupten, dass etwas erzeugt wurde, wenn nur die Prompt-Liste vorliegt.

Unbekannte/mehrdeutige Dateien dürfen nicht geraten oder mit falschen Szenennummern versehen werden. Dann BLOCK bis geklärt.

Erst danach:
`npm run scene:qa -- --episode=KM-XXX-slug`

Anschließend alle **realen Bilder visuell prüfen** (Pose, Beschriftung, Motiv) und freigeben. Antigravity Phase 3 darf weiter **niemals** neue Bilder erzeugen.


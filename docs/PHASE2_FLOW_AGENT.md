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

## Neue Bildregie — storyworld-v1

Für neue Workout-/Learn-and-Move-Episoden gilt `ART_DIRECTION.md`, sofern die Episode `artDirectionPolicy: storyworld-v1` trägt. „Warm, friendly, playful“ als Prompt-Wörter reichen nicht mehr. Jede Szene braucht ein konkretes menschlich dimensioniertes kinderfreundliches Setting, eine greifbare bildrelevante Spiel-/Story-Aktion und eine andere passende Mimik. Keine wiederkehrenden leeren Pastellplätze, unsinnigen Zylindertürme, hochgebauten Sci-Fi-Städte oder riesigen dunklen Schilder. Neuer Pflichtabschnitt für die Prompt-QA: `PLAY DETAIL / STORY BEAT:`. Nach tatsächlicher Bildproduktion muss jede einzelne PNG in `99-technik/ART_DIRECTION_REVIEW.json` mit echter Bildprüfung und SHA256 freigegeben werden. Ohne diese Prüfung ist Asset-Approval gesperrt. Bestehende Episoden und Bilder nicht automatisch verändern oder regenerieren.

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

Nach JEDEM realen Download (vor der nächsten Szene) die tatsächliche PNG **sofort verschieben und umbenennen** (kein spätes Batch-Umbenennen, keine zusätzliche namenlose Kopie):

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



## Antigravity als Bildproduzent: nur auf ausdrücklichen Auftrag

Bildgenerierung durch Antigravity ist standardmäßig verboten, selbst wenn `phase3:prepare` fehlende Bilder meldet. Nur wenn der Nutzer ausdrücklich bestimmte fehlende Szenen zur Generierung freigibt, darf Antigravity ausnahmsweise die Google-Flow-Produktion als **Phase 2 Reparatur vor dem erneuten Phase-3-Handoff** übernehmen. Zuvor `images:permission --grant` mit dem tatsächlichen Nutzerwortlaut, vor jeder Szene `--check`, nach jeder Generierung sofort `flow:save --antigravity=1` (verbraucht die Freigabe). Siehe `ANTIGRAVITY.md`. Keine automatische Generierung aus der Fehlstellenliste ohne Freigabe.


## ZWINGEND — Google Flow überprüft JEDE Ausgabe; fehlende Bilder sofort nachholen

Das Problem aus KM-009: Flow produziert manchmal zu einem eingereichten Prompt keine echte herunterladbare Bilddatei. **Ein ausgefüllter Prompt, eine Textmeldung oder ein begonnenes Flow-Rendering zählen niemals als fertiges Bild.** Nach JEDEM Versuch:

1. Nur das Bild für die **aktuelle, aus IMAGE_PLAN bestimmte SCENE_ID** in Google Flow erzeugen. Das ausgewählte Cover (`Szene 01.png`) ist die einzige Bildreferenz.
2. **Prüfen, dass das echte fertige Bild sichtbar ist und eine herunterladbare PNG-Datei existiert.** Wenn Flow nur lädt, abbricht oder keinen Download liefert: Das aktuelle Ziel bleibt MISSING. Mit dem exakt gleichen Originalprompt nur diese *fehlende* Szene erneut versuchen. Nicht aus einem generierten Text den Erfolg ableiten.
3. Echten Download **direkt vor der nächsten Bildgenerierung** ausführen und **sofort umbenennen/verschieben** über `npm run flow:save -- --episode=<episode-folder> --scene=N --source="<real-downloaded-image.png>"` (bei nachträglicher Korrektur einer älteren Lücke `--repair=1`). Nie alle anonymen Downloads am Ende sortieren. Cover: `--cover=1/2/3`.
4. **Nach dem Speichern** `npm run flow:verify -- --episode=<episode-folder>` ausführen. Die exakten fehlenden Aufgaben, Originalprompts und Umbenennungsbefehle stehen in `99-technik/FLOW_RETRY_MISSING.json`. Auch `flow:save` schreibt ein direktes Bestätigungsprotokoll `FLOW_SAVE_LOG.jsonl`.
5. **Vor JEDEM 5er-Block** `npm run flow:batch -- --episode=<episode-folder>` ausführen. Sind ältere Bilder noch nicht vorhanden, erhält der Agent `RECOVER_MISSING_FIRST`; erst die alten Lücken reparieren, vorhandene spätere Dateien **nicht** verschieben/löschen, dann neu prüfen und weiter.
6. **Am Ende** `npm run phase2:finalize -- --episode=<episode-folder>`. Falls MISSING, die fehlenden Originalprompts in Flow erzeugen, exakt ablegen, erneut zählen. Nur `COMPLETE` + tatsächlicher realer 28-Bilder-Handoff erlaubt Übergang zur visuellen Prüfung und Phase 3.

**Wiederholungen:** Eine fehlgeschlagene Flow-Anfrage ohne gespeichertes Bild darf erneut versucht werden, bis ein echter Download korrekt gespeichert ist. Bei drei aufeinanderfolgenden technischen Fehlschlägen für dieselbe Szene (Flow-Limit/Netzwerk/Blocker) STOP mit genauer Fehlermeldung und unverändertem `FLOW_RETRY_MISSING.json`; keine unbegrenzten bezahlten Versuche oder fingierte Dateien. Nutzer muss nur bei Coverwahl oder echten anhaltenden Blockern entscheiden. Eine vorhandene/approved Szene niemals erneut erzeugen oder überschreiben. Bereits gespeicherte Ergebnisse bleiben unverändert. Bei beschädigten, doppelt belegten oder unzuordenbaren Dateien STOP: nicht raten, sondern Konflikt berichten.

**Wichtig:** Die Node-Skripte selbst können Google Flow nicht bedienen. Die beschriebenen Schritte muss der tatsächliche mit Google Flow verbundene Phase-2-Agent durchführen. Nur so ist die Prüfung + Nachgenerierung möglich.

## Immediate readable hello in the first video frame (new workouts)

New episode policy `greeting-overlay-frame-zero-v1` means the first **rendered** scene is `Szene 02.png`; `Szene 01.png` is COVER ONLY. For scene 02 instruct Google Flow **NO BAKED TEXT**, and reserve calm open space on the LEFT. The Remotion `IntroScreen` owns the only large readable `HELLO!` badge from **frame 0 / 00:00**, without delay, fade or extra cover slide. Do not generate a second HELLO! inside Flow. All other scene text stays Google Flow-owned, including the 12 exercise labels and GET READY panels. After rendering `postrender:qa` compares the actual first video frame to the text-free source in the badge area and fails if the expected overlay is absent. Never claim the existing MP4 was changed by this rule; the updated behavior applies when a newly created episode is activated and rendered.

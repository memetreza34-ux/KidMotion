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

## 2. Cover

Genau drei Cover-Kandidaten, streng nacheinander:

Cover 01 → prüfen → speichern  
Cover 02 → prüfen → speichern  
Cover 03 → prüfen → speichern  
**STOP.**

Nutzer wählt 1/2/3. Erst danach wird der Gewinner `Szene 01.png`.

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

## 4. Stille QC nach jedem Block

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

## 5. Prompt Quality v2

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

## 8. Abschluss

Nach Szene 28:

`npm run scene:qa -- --episode=KM-XXX-slug`

Danach reale visuelle Endprüfung und Übergabe an Phase 3.

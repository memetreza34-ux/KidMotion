# KM-008 — VERBINDLICHER FLOW-ABLAUF (PHASE 2)

**Video:** Robot City Freeze Workout — 12 Übungen, 28 endgültige PNGs. `Szene 01.png` = ausgewähltes Cover (nicht im Video); `Szene 02.png` bis `Szene 28.png` = Szenen. **Diese Anleitung ist für KM-008 bindend**, zusätzlich zu `../../PHASE2_FLOW_AGENT.md`.

## 1. Genau drei Cover generieren

Erzeuge `Cover-Kandidat-01.png`, `Cover-Kandidat-02.png` und `Cover-Kandidat-03.png` mit den bereits im Flow-Prompt enthaltenen drei Varianten. Zeige alle drei und **halte nur für die Auswahl 1/2/3 an**.

## 2. Auswahl unmittelbar technisch ausführen

Nach der expliziten Auswahl (ersetze die Kandidatennummer entsprechend):

```bash
npm run kidmotion:select-cover -- --episode=KM-008-robot-city-freeze-workout --candidate=2
```

Das ausgewählte Cover wird zu `Szene 01.png`, die anderen **zwei Cover werden sofort gelöscht**. Prüfe, dass nur das ausgewählte Cover verblieben ist und `99-technik/COVER_SELECTION.json` den Status `SELECTED` hat. Niemals nur mit Text bestätigen oder eine bestehende Cover-Auswahl überschreiben.

## 3. Alle Szenen im 5er-System

```bash
npm run flow:batch -- --episode=KM-008-robot-city-freeze-workout
```

Produziere **seriell** in Blöcken: **02–06, 07–11, 12–16, 17–21, 22–26, 27–28**. Nach jedem Block stille visuelle Qualitätsprüfung und sofort zum nächsten. Keine Rückfrage zwischen den Blöcken. Jede Szene direkt unter **ihrem eigenen Dateinamen** sichern. Nur `Szene 01.png` als Bildreferenz.

## 4. Pflichtkontrolle nach dem letzten Block

```bash
npm run phase2:finalize -- --episode=KM-008-robot-city-freeze-workout
```

Die Prüfung zählt die 28 PNGs, normalisiert eindeutige Dateinamen, entfernt liegen gebliebene nicht ausgewählte Cover, erkennt exakte Duplikate, Fehler und Dateikonflikte.

**NEEDS_FLOW_GENERATION:** `99-technik/PHASE2_MISSING_SCENES.json` lesen. Für jede dort **wirklich fehlende** Szene den originalen zugeordneten Prompt aus dem JSON verwenden und das fehlende Bild **in Google Flow/Phase 2 einmal erzeugen**. Das Bild unter dem gemeldeten Namen speichern. Danach den Abschlussbefehl erneut ausführen, bis er **COMPLETE** meldet. Die Abschlussprüfung allein erzeugt keine Bilder.

**BLOCKED:** Unbekannte Bilder, zweifelhafte Zuordnung, ungültige PNGs oder Duplikate erst klären. Niemals nach Vermutung umnummerieren, ein vorhandenes Bild überschreiben, eine vorhandene Szene neu generieren oder die Auswahl umgehen.

## 5. Gemeinsamer fertiger Bildordner

Nur bei `COMPLETE` und tatsächlich vorhandener `99-technik/PHASE2_HANDOFF.json` gilt die Abgabe als vollständig:

```text
00-bildprompts/images/
  Szene 01.png
  Szene 02.png
  ...
  Szene 28.png
```

Danach `npm run scene:qa -- --episode=KM-008-robot-city-freeze-workout` ausführen und die wirklichen Bilder visuell prüfen (Pose, Beschriftung, Motiv), bevor sie freigegeben werden. Fehlende Bilder **niemals an Phase 3 delegieren**. `ANTIGRAVITY.md` bleibt Assembly/Render-only.

**Aktueller Zustand im GitHub-Repo:** Hier liegen derzeit die Pläne und Prompts, keine generierten Bilder. Die Auswahl und Abschlusskontrolle können erst auf wirklichen Bilddateien ausgeführt werden.

## WORKOUT: HUMAN-ONLY CHARACTERS

The KM-008 mascot MUST be one fully clothed stylized 3D **HUMAN girl athlete**, with recognizable human face, hair and hands. No robot, fox, animal or anthropomorphic character — even in Robot City. Background architecture may be robotic; the demonstrator may not.

All three previously generated Google Flow covers shown in the screenshot are INVALID. Generate three new covers with the corrected prompts, inspect all actual PNGs, then set the three human-review records in `99-technik/COVER_HUMAN_REVIEW.json` with REAL SHA256 values. `kidmotion:select-cover` will block until human review passes. This is a real visual check, not something that can be assumed from the prompt.

After choosing a human cover, it stays the sole human identity reference for scenes 02–28. Pure learning format is NOT affected.


## Exakte Dateinamen für KM-008

Die Bildprompts enthalten `COVER_ID` beziehungsweise `SCENE_ID` plus `OUTPUT_FILE`. Die Nummer gehört **nur in den Dateinamen**, nicht sichtbar ins Bild. Google Flow benennt Dateien nicht automatisch nach den Promptvorgaben. Nach jedem echten PNG-Download:

```bash
npm run flow:save -- --episode=KM-008-robot-city-freeze-workout --cover=1 --source="/Pfad/Download.png"
npm run flow:save -- --episode=KM-008-robot-city-freeze-workout --scene=5 --source="/Pfad/Download.png"
```

Jede Szene sofort korrekt speichern, nicht erst am Ende. Ruhige, glaubwürdige Trainingsumgebung statt ungewöhnlicher überladener Robot-City-Kulissen. Abschlussprüfung `phase2:finalize` bleibt Pflicht.

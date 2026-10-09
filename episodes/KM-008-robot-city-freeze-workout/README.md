# KM-008 Robot City Freeze Workout
Format WORKOUT only, NOT learning. English. 5:13 / 313s in 16:9 1920×1080. Twelve 20-second safe static poses, eleven 5-second GET READY images, 14s opening and 4s outro.
The planned original mascot is fully clothed and alone in the frame; twelve visually distinct Robot City zones.
Status: cover-selection-pending, planning complete. No image/audio assets or final video actually exist yet.
Run npm run prompt:qa -- --episode=KM-008-robot-city-freeze-workout before generating in Google Flow. Make three covers then STOP for user choice; after that ONLY selected Szene 01.png reference. Use flow:batch in hard 5-scene serial blocks and silent QC, no further user questions.
Exercises: 1. ANTENNA REACH — Stretch both arms up and stand tall.; 2. T-BAR HOLD — Open your arms wide and hold still.; 3. GEAR SQUAT HOLD — Bend your knees a little and freeze.; 4. SIDE SIGNAL REACH — Lean gently sideways and reach long.; 5. RUNNER FREEZE — Step one foot back and hold your pose.; 6. COMPASS TURN — Turn your shoulders and point ahead.; 7. TABLE BRIDGE — Hands and feet down, lift your hips.; 8. POWER PLANK — Hold a straight line on the floor.; 9. SKY BALANCE — Lift one foot and spread your arms.; 10. SHIELD PRESS — Push both palms forward and stay firm.; 11. STAR FREEZE — Stretch wide like a giant star.; 12. POWER-UP VICTORY — Raise your hands and finish strong..
The voice script is continuous spoken text; only VOICE_PLAN.json has section timing.


## KM-008: Coverauswahl und Endkontrolle sind Pflicht

**Maßgebliche genaue Anweisung:** [PHASE2_FLOW_RUNBOOK.md](PHASE2_FLOW_RUNBOOK.md)

- Nach deiner Auswahl wird unverzüglich `npm run kidmotion:select-cover -- --episode=KM-008-robot-city-freeze-workout --candidate=<1|2|3>` ausgeführt und die zwei abgelehnten Cover gelöscht. Die ausgewählte `Szene 01.png` ist die einzige Bildreferenz.
- Nach dem letzten 5er-Block `npm run phase2:finalize -- --episode=KM-008-robot-city-freeze-workout` ausführen. Fehlende Bilder anhand `99-technik/PHASE2_MISSING_SCENES.json` **noch in Google Flow (Phase 2)** generieren und Endkontrolle wiederholen.
- Erst wenn `PHASE2_HANDOFF.json` existiert und **alle 28 realen Bilder** richtig benannt im gemeinsamen Ordner `00-bildprompts/images/` liegen: `npm run scene:qa -- --episode=KM-008-robot-city-freeze-workout` und echte visuelle Freigabe. Phase 3 darf keine Bilder generieren.

## WORKOUT: HUMAN-ONLY CHARACTERS

The KM-008 mascot MUST be one fully clothed stylized 3D **HUMAN girl athlete**, with recognizable human face, hair and hands. No robot, fox, animal or anthropomorphic character — even in Robot City. Background architecture may be robotic; the demonstrator may not.

All three previously generated Google Flow covers shown in the screenshot are INVALID. Generate three new covers with the corrected prompts, inspect all actual PNGs, then set the three human-review records in `99-technik/COVER_HUMAN_REVIEW.json` with REAL SHA256 values. `kidmotion:select-cover` will block until human review passes. This is a real visual check, not something that can be assumed from the prompt.

After choosing a human cover, it stays the sole human identity reference for scenes 02–28. Pure learning format is NOT affected.


## Szenennummern und einfachere Bilder

Jeder Bildprompt enthält `SCENE_ID: NN` und `OUTPUT_FILE: Szene NN.png` als Dateimetadaten. Nach tatsächlichem Download wird das Bild mit `npm run flow:save -- --episode=KM-008-robot-city-freeze-workout --scene=NN --source="/Pfad/Flow-Download.png"` unter genau diesem Namen im Bildordner gespeichert. Die Szenennummer wird **nicht ins Bild gedruckt**. Vorhandene Dateien dürfen nicht überschrieben oder als Ersatz für andere Szenen kopiert werden.

Bildgestaltung bewusst einfach: **menschliches Mädchen, klare Sporthaltung, ruhige Trainingsfläche**; Robot City ist nur ein dezenter Stil, keine riesigen Zahnräder, Sci-Fi-Tore oder chaotische Figuren.


## Warme, kindgerechte Bildwelt

Alle KM-008-Cover und -Szenen enthalten **WARMTH / MOOD**. Eindeutig menschliches Mädchen, natürliche freundliche Mimik, warme Sonne, schöne lebendige Farben und ein kleines passendes Spiel-Detail, aber keine abstrakten, sterilen oder beängstigenden Szenen. Echte Cover- und Szenenbilder müssen **visuell** geprüft werden, bevor die Auswahl beziehungsweise das Rendering freigegeben wird.


## Feedback zur sichtbaren Google-Flow-Bildwelt (2026-10-09)

Siehe [ART_DIRECTION_FEEDBACK.md](ART_DIRECTION_FEEDBACK.md). In Szene 25–27 sind der sich wiederholende leere Pastell-Sportplatz, unerklärliche Turm-Kulissen und eine zu große dunkle GET-READY-Tafel auffällig. Die im Google-Flow-Screenshot sichtbaren Medien sind nicht automatisch als Dateien im GitHub-Repository gesichert. Bestehende Bilder nicht ungefragt neu erzeugen.

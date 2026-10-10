# KM-009 — Phase 2 Google Flow Runbook

This is the actual **Storyworld V1** art-production plan for Star Trail Adventure. Use the exact source prompts in `00-bildprompts/google-flow-prompt.txt` and follow all current project's safety and generation contracts. Never claim image assets exist based on this plan.

## 1. Covers — make 3, then STOP

Generate actual Cover-Kandidat-01.png, Cover-Kandidat-02.png and Cover-Kandidat-03.png, strictly in order. Inspect each real image for one fully clothed stylized HUMAN girl, attractive grounded park art direction, readable text, safe anatomy and real warmth. Fill COVER_HUMAN_REVIEW.json with truthful approved flags and real SHA256 only after inspection. Show the three images to the user and STOP for explicit 1/2/3 selection.

After the user picks, immediately run the **exact** command with the actual candidate number:

`npm run kidmotion:select-cover -- --episode=KM-009-star-trail-adventure-workout --candidate=<1|2|3>`

Example if the user's choice is 2:

`npm run kidmotion:select-cover -- --episode=KM-009-star-trail-adventure-workout --candidate=2`

The selected real cover becomes Szene 01.png; the two rejected candidates are immediately removed. The selected cover is the **only image reference** for scenes 02–28. Do not start scene 02 before selection.

## 2. Exact five-scene Flow batches

Call `npm run flow:batch -- --episode=KM-009-star-trail-adventure-workout` before each batch. The six authorized batches are 02–06, 07–11, 12–16, 17–21, 22–26, 27–28. Generate sequentially and save each real downloaded PNG immediately under the matching canonical filename using `npm run flow:save -- --episode=KM-009-star-trail-adventure-workout --scene=N --source="/real/path.png"`. No extra reference images. No silent retries or image substitution. Review actual images in each batch for scene role, coherent human identity/outfit, correct pose, safe limb placement, legible exact UI, top-left timer-safe area, varied art direction, concrete playful star-trail details and believable park architecture.

## 3. Mandatory final audit and repair queue

After the last real image:

`npm run phase2:finalize -- --episode=KM-009-star-trail-adventure-workout`

The tool will report missing assets using `99-technik/PHASE2_MISSING_SCENES.json`. If genuinely missing files are listed, produce only those missing scenes from original IMAGE_PLAN prompts in the authorized Google Flow Phase 2 procedure; never regenerate an already existing image or copy another scene. Run `npm run phase2:finalize -- --episode=KM-009-star-trail-adventure-workout` again after missing assets are genuinely saved.

Only when 28 actual PNG files exist, check `99-technik/PHASE2_HANDOFF.json` and run `npm run scene:qa -- --episode=KM-009-star-trail-adventure-workout`. Perform honest real-image VISUAL_REVIEW and ART_DIRECTION_REVIEW (including SHA256) before asset approval. No Phase 3 image generation.

## Visual direction

The entire episode follows a hand-painted star trail through recognizable child-safe park areas. Clear facial expressions and genuinely meaningful prop details, not generic pastel sci-fi buildings, identical plazas, uncanny AI poses or giant dark panels. GET READY panel stays compact and does not cover the girl. Keep safe readable poses.

## Intro update
Szene 01 stays thumbnail ONLY. Szene 02 must have only small friendly HELLO instead of a big episode title. Szene 03 shows Safety First and 04 a brief start cue before the first exercise. The existing local MP4 is not changed by editing these plans. Replace the already generated scene 02 only after an authorized Phase-2 revision and review.


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

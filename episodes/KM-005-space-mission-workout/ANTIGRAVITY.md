Read GEHIRN.md first.

PRE-FLOW
Run `npm run prompt:qa -- --episode=episodes/KM-005-space-mission-workout`. If it fails, do not open Google Flow.

PROMPT SOURCE
Use only the complete `FINAL GOOGLE FLOW PROMPT` block for the exact cover candidate or scene from `00-bildprompts/google-flow-prompt.txt`. Do not summarize or rewrite it.

COVER
Generate exactly Cover-Kandidat-01.png, Cover-Kandidat-02.png and Cover-Kandidat-03.png. Show all 3 once. Wait only for the user's cover choice. Run `npm run kidmotion:select-cover -- --episode=episodes/KM-005-space-mission-workout --candidate=<1|2|3>`. Winner becomes Szene 01.png and both rejected covers are deleted.

LATER SCENES
After cover selection, automatically generate Szene 02–28.
- ONLY image reference: selected Szene 01.png.
- Exactly one generation request per scene.
- Strictly serial: do not start scene N+1 until scene N has completed and its exact result is saved or explicitly marked failed.
- Never copy, reuse or rename another scene to fill a failed slot.
- Save each successful result immediately under its exact scene filename.
- Do not ask the user between internal 5-scene groups.

FINAL
Run `npm run scene:qa -- --episode=episodes/KM-005-space-mission-workout`.
Do not render if it reports missing, extra, duplicate, near-duplicate, prompt, reference or ordering problems.
Never set VISUAL_REVIEW flags true without inspecting the actual images.

VOICE PRODUCTION
- Read `01-voice-script/voice-script.txt` and `99-technik/VOICE_PLAN.json`.
- Generate exactly one `Voice 01.mp3` from the section labeled `Exact TTS copy`.
- Target 13.65–14.00s total, hard maximum 14.05s.
- Align meaning with Intro 00:00–00:08, Safety 00:08–00:12, LET'S BEGIN 00:12–00:14.
- No spoken voice after 14s.

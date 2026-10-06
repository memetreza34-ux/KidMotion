# KM-005 — Space Mission Workout

Date: 2026-10-06
Theme: space-mission-workout
Runtime: 5:13
Format: 12 exercises × 20s + 11 dedicated GET READY scenes × 5s.

Production order:
1. Run `npm run prompt:qa -- --episode=episodes/KM-005-space-mission-workout`.
2. Generate exactly 3 cover candidates.
3. User selects one cover. Winner becomes `Szene 01.png`; delete the other two.
4. Generate Szene 02–28 strictly one-by-one in numerical order, exactly once each.
5. Use ONLY `Szene 01.png` as image reference.
6. Run `npm run scene:qa -- --episode=episodes/KM-005-space-mission-workout`.
7. Perform real visual review before approval.

## Voice Script

The opening voice is a real timed production script, not just a loose paragraph. See `01-voice-script/voice-script.txt` and `99-technik/VOICE_PLAN.json`. It maps Intro 00:00–00:08, Safety 00:08–00:12 and LET'S BEGIN 00:12–00:14, then no further voice.

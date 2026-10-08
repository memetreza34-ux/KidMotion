# KM-007 — Count & Move Numbers 1-12

Date: 2026-10-08
Content type: Learn + Move
Learning goal: recognize numerals 1-12 and connect each numeral to its English number word.
Contract: v1
Runtime: 5:13
Format: 12 number-learning movement scenes × 20s + 11 dedicated GET READY scenes × 5s.

Production order:
1. Run `npm run prompt:qa -- --episode=KM-007-count-and-move-numbers-1-12`.
2. Generate exactly 3 cover candidates.
3. User selects one cover. Winner becomes `Szene 01.png`; delete the other two.
4. Generate Szene 02–28 strictly one-by-one in numerical order, exactly once each.
5. Use ONLY `Szene 01.png` as image reference.
6. Run `scene:qa` and verify both scene integrity and number-learning accuracy.
7. Phase 3 raw handoff starts with `npm run phase3:prepare -- --episode=KM-007-count-and-move-numbers-1-12`, never with phase3:gate.

Voice script is plain spoken text only. Technical timing stays in VOICE_PLAN.json.

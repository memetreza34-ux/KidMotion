# KM-007 — Count & Move Numbers 1-12

Date: 2026-10-08
Content type: Learn + Move
Learning goal: recognize numerals 1-12 and connect each numeral to its English number word.
Prompt spec: v2
Runtime: 5:13

## Phase 2

1. `npm run prompt:qa -- --episode=KM-007-count-and-move-numbers-1-12`
2. Generate exactly 3 covers and stop for user choice.
3. Winner becomes `Szene 01.png`.
4. Before every production step run:
   `npm run flow:batch -- --episode=KM-007-count-and-move-numbers-1-12`
5. Produce only the returned hard block:
   02-06 → 07-11 → 12-16 → 17-21 → 22-26 → 27-28.
6. Inside a block scenes remain serial for safe numbering.
7. After all files in a block exist, silently review the full block, then automatically continue to the next block without asking the user.
8. Every scene uses Prompt Quality v2: viewer takeaway, reference use, unique composition, pose, world, exact UI, light/materials, negatives and quality check.
9. After Szene 28 run `scene:qa`.

## Phase 3

Raw handoff begins with `phase3:prepare`, never `phase3:gate`.

Voice script remains plain spoken text only; technical timing stays in VOICE_PLAN.json.

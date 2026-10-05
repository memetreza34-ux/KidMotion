Read GEHIRN.md first.

PHASE 1 — COVER FIRST
1. Generate exactly three cover candidates in `00-bildprompts/images/`:
   - `Cover-Kandidat-01.png`
   - `Cover-Kandidat-02.png`
   - `Cover-Kandidat-03.png`
2. For the covers, use ONLY the safe cover wording from `00-bildprompts/google-flow-prompt.txt`.
3. Do not expand the cover prompt with an exact age, skin tone, body type, measurements, detailed minor physical profile or photorealistic wording.
4. Show all three covers to the user once.
5. Wait only for the user's one-time cover choice.
6. Run `npm run kidmotion:select-cover -- --episode=KM-004-animal-adventure-workout --candidate=<1|2|3>`.
7. The winner becomes `Szene 01.png`; delete the two rejected cover candidates immediately.
8. Use selected `Szene 01.png` itself as the PRIMARY reference for character identity, outfit, colors, lighting and world in every later image.

PHASE 2 — AUTONOMOUS IMAGE PRODUCTION
After the cover is selected, do NOT ask the user for any more image approvals or `weiter` confirmations.
Do NOT stop after a 5-image batch.
Use 5-image batches only internally for reliable generation, then continue automatically to the next batch.

Internal order:
- Batch 1: `Szene 02.png`–`Szene 06.png`
- Batch 2: `Szene 07.png`–`Szene 11.png`
- Batch 3: `Szene 12.png`–`Szene 16.png`
- Batch 4: `Szene 17.png`–`Szene 21.png`
- Batch 5: `Szene 22.png`–`Szene 26.png`
- Final Batch 6: `Szene 27.png`–`Szene 28.png`

Use `99-technik/IMAGE_PLAN.json` as the scene-prompt source of truth for Szene 02–28.
Use `Szene 01.png` as PRIMARY reference in every batch.
From Szene 07 onward use `Szene 05.png` only as SECONDARY exercise title/instruction UI reference.
Exercise and GET READY scenes alternate after Szene 05.
Every GET READY image is a neutral ready stance and must NOT reveal the next exercise pose.
Keep top-left 230x230 clear on Exercise and GET READY scenes.
Google Flow creates every visible text element except the changing countdown timer.
Remotion adds only the timer.
Rename accepted images immediately to their exact scene filename.
Keep all final scenes together in `00-bildprompts/images/`.

FINAL DELIVERY
Do not return to the user between batches.
Continue until `Szene 01.png` through `Szene 28.png` are all present.
Verify the two rejected cover candidates are deleted.
Then present the completed image folder to the user.
Never mark VISUAL_REVIEW true without inspecting the real final images.

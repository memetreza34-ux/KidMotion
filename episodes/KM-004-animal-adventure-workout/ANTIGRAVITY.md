Read GEHIRN.md first.

PHASE 1 — COVER FIRST
1. Generate exactly three cover candidates in `00-bildprompts/images/`:
   - `Cover-Kandidat-01.png`
   - `Cover-Kandidat-02.png`
   - `Cover-Kandidat-03.png`
2. For the covers, use ONLY the safe cover wording from `00-bildprompts/google-flow-prompt.txt`.
3. Do not expand the cover prompt with an exact age, skin tone, body type, measurements, detailed minor physical profile or photorealistic wording.
4. Show all three covers to the user.
5. STOP. Do not generate any later scene.
6. Wait for the user's explicit choice.
7. Run `npm run kidmotion:select-cover -- --episode=KM-004-animal-adventure-workout --candidate=<1|2|3>`.
8. The winner becomes `Szene 01.png`; rejected covers are deleted.
9. Use selected `Szene 01.png` itself as the PRIMARY reference for character identity, outfit, colors, lighting and world in every later image. Do not reconstruct the identity with demographic/body descriptions.

PHASE 2 — FIVE-IMAGE BATCHES
Never generate all remaining scenes in one run.
Generate only one batch at a time. After each batch, show every new image to the user and STOP until the user explicitly says to continue.

- Batch 1: `Szene 02.png`–`Szene 06.png`
  - Intro
  - Safety First
  - LET'S BEGIN
  - Exercise 1
  - GET READY
  - After approval, `Szene 05.png` becomes the SECONDARY exercise-UI reference.
- Batch 2: `Szene 07.png`–`Szene 11.png`
- Batch 3: `Szene 12.png`–`Szene 16.png`
- Batch 4: `Szene 17.png`–`Szene 21.png`
- Batch 5: `Szene 22.png`–`Szene 26.png`
- Final Batch 6: `Szene 27.png`–`Szene 28.png`

HARD RULES
- Maximum five new final scene images per batch.
- Never start the next batch before the user says to continue.
- `Szene 01.png` stays the PRIMARY reference in every batch.
- From Batch 2 onward use approved `Szene 05.png` only as SECONDARY exercise title/instruction UI reference.
- Exercise and GET READY scenes alternate after Szene 05.
- Every GET READY image is a neutral ready stance and must NOT reveal the next exercise pose.
- Keep top-left 230x230 clear on Exercise and GET READY scenes.
- Google Flow creates every visible text element except the changing countdown timer.
- Remotion adds only the timer.
- Rename accepted images immediately to their exact scene filename.
- Keep all final scenes together in `00-bildprompts/images/`.
- Never mark VISUAL_REVIEW true without inspecting the real final images.

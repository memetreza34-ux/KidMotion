Read GEHIRN.md first.

PROMPT SOURCE OF TRUTH
- The actual Google Flow image prompts are in `00-bildprompts/google-flow-prompt.txt`.
- For every generation, use the complete block labeled `FINAL GOOGLE FLOW PROMPT` for that exact cover candidate or scene.
- Do NOT replace the prompt with a summary from this file.
- Do NOT invent a shorter prompt.
- `99-technik/IMAGE_PLAN.json` is technical metadata/validation; it is not the text that should be pasted into Google Flow when a complete prompt block exists.

PHASE 1 — COVER FIRST
1. Open `00-bildprompts/google-flow-prompt.txt`.
2. Generate exactly the three separate cover prompts:
   - `COVER CANDIDATE 01 — Cover-Kandidat-01.png`
   - `COVER CANDIDATE 02 — Cover-Kandidat-02.png`
   - `COVER CANDIDATE 03 — Cover-Kandidat-03.png`
3. For each cover, paste/use its full `FINAL GOOGLE FLOW PROMPT` exactly as the generation instruction.
4. Show the three covers once and wait for the user's explicit choice.
5. Run `npm run kidmotion:select-cover -- --episode=KM-004-animal-adventure-workout --candidate=<1|2|3>`.
6. The winner becomes `Szene 01.png`; delete both rejected covers.

PHASE 2 — AUTOMATIC IMAGE PRODUCTION
After cover selection, continue automatically until every final scene exists.

Internal batches:
- `Szene 02–06`
- `Szene 07–11`
- `Szene 12–16`
- `Szene 17–21`
- `Szene 22–26`
- `Szene 27–28`

For every scene from 02 through 28:
1. Find that exact scene section in `00-bildprompts/google-flow-prompt.txt`.
2. Attach ONLY selected `Szene 01.png` as the image reference.
3. Use the full `FINAL GOOGLE FLOW PROMPT` from that section.
4. Generate exactly once.
5. Save immediately using the exact filename from the section.
6. Continue to the next scene without asking the user.

HARD REFERENCE RULE
- `Szene 01.png` is the ONLY image reference allowed for every scene from `Szene 02.png` through `Szene 28.png`.
- Never attach or use `Szene 05.png`, a previous scene, a generated variant, or any other image as a second reference.
- Text/UI consistency comes from the written prompt itself, not another image reference.

HARD ONE-GENERATION RULE
- Generate each `Szene 02.png` through `Szene 28.png` exactly once.
- Do not create alternate versions.
- Do not regenerate a scene after an image has been produced.
- Rename/store the generated result immediately using its exact scene filename.

OTHER RULES
- Do not stop or ask the user between internal batches.
- Every GET READY image is a neutral ready stance and must not reveal the next exercise pose.
- Keep top-left 230x230 clear on Exercise and GET READY scenes.
- Google Flow creates every visible text element except the changing countdown timer.
- Remotion adds only the timer.
- Keep all final images together in `00-bildprompts/images/`.
- Never mark `VISUAL_REVIEW.json` true without inspecting the actual final images.

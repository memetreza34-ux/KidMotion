Read GEHIRN.md first.

PHASE 1 — COVER FIRST
1. Generate exactly three cover candidates in `00-bildprompts/images/`:
   - `Cover-Kandidat-01.png`
   - `Cover-Kandidat-02.png`
   - `Cover-Kandidat-03.png`
2. Use only the safe cover wording from `00-bildprompts/google-flow-prompt.txt`.
3. Show the three covers once and wait for the user's explicit choice.
4. Run `npm run kidmotion:select-cover -- --episode=KM-004-animal-adventure-workout --candidate=<1|2|3>`.
5. The winner becomes `Szene 01.png`; delete both rejected covers.

PHASE 2 — AUTOMATIC IMAGE PRODUCTION
After cover selection, continue automatically until every final scene exists.

Internal batches:
- `Szene 02–06`
- `Szene 07–11`
- `Szene 12–16`
- `Szene 17–21`
- `Szene 22–26`
- `Szene 27–28`

HARD REFERENCE RULE
- `Szene 01.png` is the ONLY image reference allowed for every scene from `Szene 02.png` through `Szene 28.png`.
- Never attach or use `Szene 05.png`, a previous scene, a generated variant, or any other image as a second reference.
- Text/UI consistency must come from the written scene prompt, not from another image reference.

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

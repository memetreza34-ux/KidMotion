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

IMPORTANT: Batches are only organizational groups. NEVER launch several scene generations in parallel.
Generate strictly one scene at a time in numerical order.

STRICT PER-SCENE PROCEDURE
For every scene from 02 through 28:
1. Confirm that the expected final file for this scene does NOT already exist.
2. Find that exact scene section in `00-bildprompts/google-flow-prompt.txt`.
3. Attach ONLY selected `Szene 01.png` as the image reference.
4. Use the full `FINAL GOOGLE FLOW PROMPT` from that section.
5. Send exactly ONE generation request for that scene.
6. WAIT until Flow returns the actual image result for that exact request. Do not start the next scene while this one is still pending.
7. If Flow returns no image or an error, mark this scene as missing/failed. NEVER reuse the previous scene, NEVER duplicate another file, and NEVER rename an older output to fill the slot.
8. If Flow returns an image, download/save that exact result immediately under the exact final filename for this scene.
9. Verify that the new file exists before moving to the next scene.
10. Continue to the next scene automatically without asking the user.

HARD REFERENCE RULE
- `Szene 01.png` is the ONLY image reference allowed for every scene from `Szene 02.png` through `Szene 28.png`.
- Never attach or use `Szene 05.png`, a previous scene, a generated variant, or any other image as a second reference.
- Text/UI consistency comes from the written prompt itself, not another image reference.

HARD ONE-GENERATION RULE
- Generate each `Szene 02.png` through `Szene 28.png` exactly once.
- Do not create alternate versions.
- Do not regenerate a scene after an image has been produced.
- A Flow error/no-output does NOT authorize copying or reusing another scene.

ORDER / DUPLICATE PROTECTION
- Never infer progress only from the number of files in the folder.
- Track the exact scene number currently being generated.
- Do not increment to the next scene until the current scene request has completed and its result has been handled.
- Never use the same downloaded Flow result for two scene filenames.
- Missing scene = hard error, not a reason to shift all later images one filename earlier.
- After Szene 28, run `npm run scene:qa`.
- If `scene:qa` reports a missing, extra, exact duplicate, near-duplicate, wrong reference rule or unresolved prompt, do NOT render the video.

OTHER RULES
- Do not stop or ask the user between internal batches.
- Every GET READY image is a neutral ready stance and must not reveal the next exercise pose.
- Keep top-left 230x230 clear on Exercise and GET READY scenes.
- Google Flow creates every visible text element except the changing countdown timer.
- Remotion adds only the timer.
- Keep all final images together in `00-bildprompts/images/`.
- Never mark `VISUAL_REVIEW.json` true without inspecting the actual final images.
- During visual review, explicitly verify: scene order, exercise/title match, GET READY target match, no missing scenes, no duplicated scene content and no shifted filenames.

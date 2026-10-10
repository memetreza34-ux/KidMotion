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

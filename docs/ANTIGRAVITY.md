# ANTIGRAVITY — ASSEMBLY, WITH EXPLICIT USER-APPROVED IMAGE REPAIR

ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN_BY_DEFAULT=true
ANTIGRAVITY_PHASE3_IMAGE_GENERATION_FORBIDDEN=true

**Default:** Antigravity may NOT generate images. The statement "you may create images only if I tell you" is a policy, **not permission to create any image now**. A missing image, a prompt in the repository, a failed check or an earlier general plan does NOT authorize generation.

**Exception only when the user specifically instructs Antigravity to generate named missing scene(s):**
1. Verify the real user message. Never invent consent. Identify exact missing scene IDs. Do not create images without that instruction.
2. Before entering or resuming Phase 3, act temporarily as the **Phase 2 Google Flow producer**. Confirm a selected cover and that the target images are genuinely absent, not ambiguous or already approved.
3. Record the exact real user instruction and ONLY authorized missing scene IDs, e.g.:
   `npm run images:permission -- --episode=KM-XXX-slug --grant=26,28 --user-instruction="(literal user's explicit authorization)"`
   This command records consent; it does **not** independently prove user consent, create PNGs or access Google Flow.
4. Before each permitted generation: `npm run images:permission -- --episode=KM-XXX-slug --check=26`.
5. Generate only that missing scene in Google Flow using its **original exact IMAGE_PLAN prompt** and the already selected `Szene 01.png` as sole image reference. Immediately download and **move/rename** the real PNG, BEFORE making another image:
   `npm run flow:save -- --episode=KM-XXX-slug --scene=26 --source="/path/to/actual-download.png" --antigravity=1`
   The save command checks that the scene is permitted and consumes that one-time permission. It must not overwrite or duplicate images.
6. Repeat strictly for other specifically authorized missing scene IDs, then `npm run phase2:finalize -- --episode=KM-XXX-slug`. Do not generate other scenes, covers or alternates. If tools needed for Google Flow are unavailable, report that limitation; NEVER claim generation occurred.
7. Return to the **unchanged Phase 3** technical and visual handoff:
   - `npm run phase3:prepare -- --episode=KM-XXX-slug`
   - inspect REAL images and honestly complete VISUAL_REVIEW.json
   - `npm run assets:approve -- --episode=KM-XXX-slug`
   - `npm run kidmotion:activate -- --episode=KM-XXX-slug`
   - `npm run phase3:gate -- --episode=KM-XXX-slug`
   - `npm run render:safe`

## Normal handoff when all images are provided

Start with `npm run phase3:prepare -- --episode=KM-XXX-slug`. It ingests real ZIP/assets and unambiguous audio, performs scene QA and detects missing files. Do not require the user to manually unzip or transcode supported files. Do not make up missing media.

## Hard prohibitions
- Never generate any images without a **new, explicit user request** for those images.
- Never generate/edit/replace image pixels during Phase 3 montage, ingest or after SHA-256 asset approval.
- Never auto-generate missing images simply because QA found them; report exact missing filenames unless authorized.
- Never change selected cover, guess scene identities, reuse another scene, bypass real visual review, fabricate music/voice or falsify file presence.
- After each actual generation, **save/move the download as the exact filename immediately** (`Szene NN.png`); do not defer renaming to the end.

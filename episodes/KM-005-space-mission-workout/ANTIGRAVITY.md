# ANTIGRAVITY — PHASE 3 ONLY

ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true

When Phase 2 files have been placed in this episode, start with:

`npm run phase3:ingest -- --episode=KM-005-space-mission-workout`

Antigravity may unpack the provided ZIP, place deterministically numbered PNG scene files into the images folder, and extract/transcode provided audio/video containers to the required MP3 files.

Antigravity must NOT generate images, alter image pixels, invent missing scenes, or guess ambiguous scene order.

After ingest:
1. run scene QA
2. inspect the real images and complete visual review
3. run assets:approve
4. activate the episode
5. run phase3:gate
6. render

Do not run phase3:gate as the first action on a raw ZIP/MP4 handoff.

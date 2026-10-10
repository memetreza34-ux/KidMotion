# ANTIGRAVITY — KM-009 Phase 3

ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true
This is a Phase 3 assembly task, not an authorization to produce images. Keep the selected human cover identity and approved real 28 PNGs unchanged. No generated fallback, recoloring, replacement, guessing missing images or image generation in Phase 3.

The approved raw asset handoff order is strict:

1. `npm run phase3:prepare -- --episode=KM-009-star-trail-adventure-workout` — ingest actual PNG/ZIP/audio, technical normalization, scene checks.
2. Review the **actual** images, correctly fill VISUAL_REVIEW.json and ART_DIRECTION_REVIEW.json; do not fake image hashes or reviews.
3. `npm run assets:approve -- --episode=KM-009-star-trail-adventure-workout` — hash-lock reviewed assets.
4. `npm run kidmotion:activate -- --episode=KM-009-star-trail-adventure-workout` — map approved scenes.
5. `npm run phase3:gate -- --episode=KM-009-star-trail-adventure-workout` — verify locked scene and audio sources.
6. `npm run render:safe` — assemble permitted timer, licensed audio and approved images; run postrender QA.

No cover or source image generation, edits or replacements inside this phase, even if an input is missing. Missing scene assets must block and return to explicitly authorized Phase 2.

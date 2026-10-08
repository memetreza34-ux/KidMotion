# ANTIGRAVITY — KM-008 Phase 3 ONLY
ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true
Antigravity must NEVER generate, replace, recolor, redraw or fake source images. Phase 3 assembles only real approved Phase-2 assets.
User may hand over ZIP/MP4 audio. Execute in this order:
1. npm run phase3:prepare -- --episode=KM-008-robot-city-freeze-workout — extract ZIP and normalize unambiguous audio without changing picture pixels.
2. Inspect real images and update VISUAL_REVIEW.json honestly; do not fake approval.
3. npm run assets:approve -- --episode=KM-008-robot-city-freeze-workout
4. npm run kidmotion:activate -- --episode=KM-008-robot-city-freeze-workout
5. npm run phase3:gate -- --episode=KM-008-robot-city-freeze-workout
6. npm run render:safe
No image generation, new image replacement, guessed scene ordering or claimed finished MP4.

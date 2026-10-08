# ANTIGRAVITY — PHASE 3 HANDOFF + ASSEMBLY

ANTIGRAVITY_IMAGE_GENERATION_FORBIDDEN=true

When the user says the files are ready/in the folder, start with:

npm run phase3:prepare -- --episode=KM-007-count-and-move-numbers-1-12

Do not start with phase3:gate.

phase3:prepare must unpack/normalize technically safe Phase 2 files and run scene QA. It may extract audio from a supplied MP4/M4A/WAV/AAC/MP3 when the role is unambiguous. It must never generate or alter images and must never guess ambiguous scene order.

After prepare succeeds:
1. inspect the real imported images yourself and update VISUAL_REVIEW.json truthfully; for KM-007 verify the number badges 1=ONE through 12=TWELVE
2. npm run assets:approve -- --episode=KM-007-count-and-move-numbers-1-12
3. npm run kidmotion:activate -- --episode=KM-007-count-and-move-numbers-1-12
4. npm run phase3:gate -- --episode=KM-007-count-and-move-numbers-1-12
5. npm run render:safe

Do not send the user back to manually unzip, deterministically rename, or convert a readable audio container when the technical ingest can do it safely.

# KM-001 — Render QA

## Must fail if present
- subtitles or automatic captions
- transcript bars or word-for-word voice text
- blank/plain screens instead of the episode image
- a different character
- old exercise images with text already inside them

## Correct scene visuals
- Intro: `Bild 01.png`
- Safety: `Bild 02.png`
- LET'S BEGIN: `Bild 03.png`
- Exercises: `Bild 04.png`–`Bild 15.png`
- Rest: reuse the NEXT exercise image as full-screen background
- Outro: `Bild 16.png`
- Cover `Bild 00.png`: thumbnail only, never inside the MP4

The same approved KM-001 boy must remain visible throughout the video. Same face, hair, proportions, football outfit and football world.

## Allowed Remotion text
Only intentional UI:
- Intro graphic blocks
- SAFETY FIRST
- LET'S BEGIN
- exercise title bottom-left
- short instruction cloud upper-right
- timer top-left
- progress bar bottom
- REST / NEXT
- GREAT JOB

This UI is not a subtitle system.

## Timing
- Intro 12s
- Safety 5s
- LET'S BEGIN 3s
- 12 exercises × 20s
- 11 rests × 5s
- Outro 5s
- total 320s / 5:20

## Voice
Voice is short and only where useful. Exercise continues after voice ends. Rests are silent. Never stretch audio to fill the video.

## Final checks
- timer reaches 0
- progress reaches 100%
- clean Google Flow exercise images have no baked-in video text/UI
- no second person appears
- `npm run typecheck` passes
- `npm run preflight` passes
- final render uses `npm run render:safe`

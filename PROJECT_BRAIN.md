# KidMotion — Project Brain

`GEHIRN.md` is the highest-priority source of truth. This file mirrors the current production rules.

## Current focus
English YouTube long-form SPORT / FITNESS workouts using static Google Flow images + Remotion.

## One video = one character
Exactly ONE KidMotion main character is used from Intro through Outro. No switching, no second visible person.

## ONE-STILL POSE CLARITY — HARD RULE
Every exercise must be understandable from exactly ONE still image before reading the text.

Required:
- full body visible
- important joints visible
- arms/legs clearly separated
- clear silhouette
- static end-position
- no motion direction, speed or before/after phase needed
- no subtle micro-position as the main exercise

If the silhouette is unclear or Google Flow cannot make the pose clean after two serious attempts, replace the pose.

## Image numbering
- Bild 00 = cover only, never in MP4
- Bild 01 = Intro / PRIMARY character reference
- Bild 02 = Safety
- Bild 03 = LET'S BEGIN
- Bild 04–15 = exercises
- Bild 16 = Outro

Every visible MP4 section uses the episode character image. No blank/text-only replacement screens.

## Opening Voice
Use exactly ONE spoken file: `Voice 01.mp3`.
It begins at 0s and may continue naturally across Intro 8s + Safety 4s + LET'S BEGIN 2s.
Target roughly 11–14s and it must end before exercise 1.

After the 14s opening: no spoken Voice, no spoken countdowns, no subtitles/captions/transcript.
Voice script is always one copy-ready continuous paragraph.

## Background music
Final render requires `bg-music.mp3`, instrumental, child-friendly, no lyrics/speech, low under opening Voice and looped through the complete video.

## Google Flow responsibility
### Character continuity
`Bild 01.png` = PRIMARY character/world reference for every later image.

### Exercise text
Google Flow directly creates on `Bild 04`–`Bild 15`:
- ONE exercise name bottom-left
- ONE short instruction cloud top-right

Approved `Bild 04` becomes SECONDARY UI/LAYOUT reference for `Bild 05`–`Bild 15`.
All exercise images keep the same title/cloud design. No thought-bubble dots, random fonts/clouds or clipped text.

### Safe zones
- top-left ~220×220 px clear for timer
- lowest ~90 px clear for progress
- title above bottom zone
- cloud safely inside top-right

### Prop count
No-ball scene = ZERO balls anywhere. Ball scene = EXACTLY ONE ball.

### Text-free non-exercise images
Bild 01, 02, 03 and 16 contain ZERO Google Flow text. Bild 16 must NOT contain GREAT JOB.

## Remotion responsibility
Every scene image is fully visible from its first frame. No whole-image opacity fade from zero, black/white/pastel flash or blank boundary frame.

Exercise and Rest images remain static at 1:1 framing. No Ken Burns/zoom/pan.

Exercises: Remotion adds ONLY 20s timer + progress + timing.
Rest: NEXT exercise image + compact `REST + countdown` TOP-LEFT only. No NEXT pose name.
Intro: only theme badge, title, `12 POSES • 20 SEC EACH`, `FOLLOW ALONG`.
LET'S BEGIN: exactly one visible `LET'S BEGIN!`.
Outro: Bild 16 text-free; Remotion adds exactly one GREAT JOB / WORKOUT COMPLETE graphic.

## Mandatory visual review + asset lock
Before final render, inspect the ACTUAL final images one by one.

`04-data/VISUAL_REVIEW.json` starts with all required flags false. Set a flag true only after direct inspection of the final files.

Required facts include:
- same character every scene
- all poses pass one-still clarity
- title/cloud consistent and readable
- safe zones clear
- prop counts correct
- non-exercise images text-free
- no extra people
- no anatomy/cropping errors

After visual review:
```bash
npm run assets:approve -- --episode=KM-XXX-name
```

This writes `ASSET_APPROVAL.json` with SHA-256 hashes. If any approved image/audio changes afterward, `asset:gate` blocks rendering until review/approval is repeated.

## Guarded render only
Both `npm run render` and `npm run render:safe` use the same guarded renderer:

```text
TypeScript
→ project:doctor
→ preflight
→ asset:gate
→ KidMotionVideo render
→ postrender:qa
```

`project:doctor` blocks code regressions; `asset:gate` blocks unreviewed/changed assets; `postrender:qa` checks the actual MP4 for runtime, resolution/FPS, ongoing music, boundary flashes and suspicious repeated exercise scenes.

## Timing
Standard total:
8 + 4 + 2 + (12×20) + (11×5) + 4 = 313s / 5:13.

## Final QA
Reject if any of these occur:
- visual review incomplete
- asset approval missing/stale
- black/white scene-boundary flashes
- cropped exercise title/cloud
- Rest countdown overlaps cloud
- inconsistent title/cloud style
- stray/duplicate basketballs
- duplicate GREAT JOB
- Voice continues into exercise 1
- background music missing after opening
- subtitles appear
- project doctor/preflight/asset gate/postrender QA fail

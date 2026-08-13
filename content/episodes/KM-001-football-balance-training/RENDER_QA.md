# KM-001 — Render QA

## Automatic fail
- subtitles or automatic captions
- transcript bars or word-for-word Voice text
- centered narration sentences
- Intro text appearing phrase-by-phrase with narration
- blank/plain screen replacing the character image
- character change or second person
- old exercise image with baked-in title/instruction
- Cover shown inside the MP4

## Required visuals
- Intro: `Bild 01.png`
- Safety: `Bild 02.png`
- LET'S BEGIN: `Bild 03.png`
- Exercises: `Bild 04.png`–`Bild 15.png`
- Rest: NEXT exercise image full-screen
- Outro: `Bild 16.png`
- Cover: `Bild 00.png`, thumbnail only

The same approved KM-001 boy must remain consistent in every actual video image.

## Allowed Remotion UI
- fixed Intro badge/title/descriptor
- SAFETY FIRST panel
- LET'S BEGIN graphic
- exercise title bottom-left
- short instruction upper-right
- timer top-left
- progress bar bottom
- REST / NEXT
- GREAT JOB / WORKOUT COMPLETE

The Intro graphic is independent from Voice and must not act like captions.

## Timing
- Intro 12s
- Safety 5s
- LET'S BEGIN 3s
- 12 exercises × 20s
- 11 rests × 5s
- Outro 5s
- total 320s / 5:20

## Voice
- short only where useful
- exercise continues after cue ends
- Rest is silent
- audio is not stretched to fill the video
- audio length never shortens a scene

## Final checks
- timer reaches 0
- progress reaches 100%
- normal Google Flow images contain no baked-in video UI
- every actual scene has a character image
- no second person appears
- `npm run typecheck` passes
- `npm run preflight` passes
- final render uses `npm run render:safe`

# KM-001 — Render QA

## Automatic fail
- subtitles or automatic captions
- transcript bars or word-for-word Voice text
- centered narration sentences
- blank/plain screen replacing the character image
- character change or second person
- Remotion-generated exercise name
- Remotion-generated exercise instruction
- duplicate exercise title
- duplicate instruction cloud
- missing Google Flow exercise title/instruction
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

## Beginning / Intro
The first 12 seconds must feel complete, not like an empty title card.
Use `Bild 01.png` plus fixed branded opening information:
- WELCOME TO
- KIDMOTION FOOTBALL
- 5 MIN FOOTBALL TRAINING
- BALANCE • CONTROL • STRONG POSITIONS
- 12 POSES
- 20 SEC EACH
- FOLLOW ALONG
- COPY • HOLD • HAVE FUN

The Intro graphic is independent from Voice and must not act like captions.

## Exercise source-image contract
Every Google Flow exercise image `Bild 04`–`Bild 15` must already contain:
- exactly ONE exercise title at bottom-left
- exactly ONE short instruction at top-right in the KidMotion white cloud/info bubble

The generated exercise image must NOT contain:
- subtitles
- transcript bars
- timer
- progress bar

## Remotion exercise contract
During exercise scenes Remotion adds ONLY:
- circular 20-second timer top-left
- progress bar bottom
- exact timing
- optional audio placement

Remotion must NOT add:
- exercise title
- exercise description
- instruction cloud

## Rest
Rest uses the NEXT exercise image full-screen. Because that image already contains the Google Flow exercise name/instruction, Remotion adds only:
- REST
- rest countdown

No `NEXT: [pose name]` overlay from Remotion.

## Timing
- Intro 12s
- Safety 5s
- LET'S BEGIN 3s
- 12 exercises × 20s
- 11 rests × 5s
- Outro 5s
- total 320s / 5:20

## Audio
Audio is currently not a blocking requirement for visual QA. Missing/silent voice can be corrected after the image/UI system is right.
Audio length must never shorten a 20-second exercise.

## Final checks
- timer reaches 0
- progress reaches 100%
- every actual scene has the correct character image
- no second person appears
- no exercise text duplication
- `npm run typecheck` passes
- `npm run preflight` passes
- final visual render uses `npm run render:safe`

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
- Google Flow title/instruction does not exactly match the current KM-001 plan
- old exercise image from a previous version is reused
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

## Exact Google Flow exercise text
The source images must contain exactly these final pairs:
- 04 `FOOTBALL READY HOLD` — `Bend your knees and stay ready.`
- 05 `GOALKEEPER SQUAT HOLD` — `Stay low and keep your chest up.`
- 06 `KNEE-UP BALANCE` — `Lift one knee and stand tall.`
- 07 `SINGLE-LEG BALANCE` — `Stand on one leg and stay steady.`
- 08 `SIDE LEG HOLD` — `Lift one leg gently to the side.`
- 09 `STANDING SIDE STRETCH` — `Reach up and lean gently to the side.`
- 10 `CALF RAISE HOLD` — `Lift your heels and stay tall.`
- 11 `WIDE SQUAT HOLD` — `Sit low and keep your chest up.`
- 12 `SIDE LUNGE HOLD` — `Bend one knee and keep the other leg long.`
- 13 `FORWARD LUNGE HOLD` — `Step forward and keep your body tall.`
- 14 `REACH-UP HOLD` — `Stretch both arms high and stand tall.`
- 15 `VICTORY BALANCE` — `Lift one knee and hold strong.`

If an old image says something different such as an older pose name/instruction, regenerate it. Do not compensate with a Remotion text overlay.

## Exercise source-image contract
Every Google Flow exercise image `Bild 04`–`Bild 15` must already contain:
- exactly ONE exercise title at bottom-left
- exactly ONE short instruction at top-right in the KidMotion white cloud/info bubble

The title/cloud must be compact and must not dominate the frame or cover the boy.

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
- source-image title/instruction exactly match the current plan
- `npm run typecheck` passes
- `npm run preflight` passes
- final visual render uses `npm run render:safe`

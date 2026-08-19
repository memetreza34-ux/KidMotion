# KM-002 — Antigravity Production Instructions

Read in this order BEFORE changing or rendering anything:
1. `GEHIRN.md`
2. `episodes/KM-002-basketball/README.md`
3. `episodes/KM-002-basketball/01-skript/voice-text.md`
4. `episodes/KM-002-basketball/03-bilder/bild-prompts.md`
5. `episodes/KM-002-basketball/04-data/data.json`

The previously rendered `KM-002-basketball.mp4` is REJECTED and must NOT be treated as the target visual reference.

## REQUIRED FINAL ASSETS
Do not produce a final render until these exist inside the KM-002 episode:
- `Bild 00.png` through `Bild 16.png`
- `Voice 01.mp3`
- `bg-music.mp3`

Background music is NOT optional for final production.

## OPENING — EXACT STRUCTURE
Opening total = 14 seconds:
- Intro `Bild 01` = 8s
- Safety `Bild 02` = 4s
- LET'S BEGIN `Bild 03` = 2s

One single `Voice 01.mp3` starts at 0s and may continue naturally across all three opening slides. It must finish BEFORE Scene 04 starts.

Final copy-ready Voice text:
`Hi, KidMotion friends! It’s basketball time! Today we have twelve easy poses, twenty seconds each. Find some space, make sure you can move safely, and stop if anything hurts. Get ready, stay strong, and let’s begin!`

Target Voice length: about 11–14 seconds.

After 14s:
- exercises: NO spoken Voice
- rests: NO spoken Voice
- Outro: NO spoken Voice

Never create subtitles, captions or transcript bars.

## BACKGROUND MUSIC — REQUIRED
Use `bg-music.mp3` as quiet instrumental child-friendly sports music.
- no lyrics
- no spoken samples
- low volume under opening Voice
- increase slightly after the opening
- LOOP through the complete 5:13 video
- verify music is still audible in the middle and near the end

Do not accept a render that becomes digitally silent after the opening.

## SAME CHARACTER
Use exactly the same approved KM-002 girl throughout.
- `Bild 01.png` = PRIMARY character/world reference
- same face, ponytail, body proportions, purple/aqua outfit, shoes and gym
- exactly one visible person
- jersey: simple number 12 only, no fake brand/team text

## GOOGLE FLOW EXERCISE UI LOCK
Every exercise image `Bild 04`–`Bild 15` already contains:
- pose
- exercise title bottom-left
- instruction cloud top-right

Workflow:
1. generate/approve `Bild 04`
2. use `Bild 04` as SECONDARY UI/LAYOUT reference for `Bild 05`–`Bild 15`
3. use `Bild 01` as PRIMARY character/world reference

All exercise images must use the SAME:
- title font feel
- title white/navy outline style
- title safe placement
- white/turquoise cloud style
- cloud font/size

Forbidden:
- thought-bubble dots
- random bubble shapes
- random title colors/fonts
- text touching frame edges
- title inside bottom progress safe zone
- timer/progress baked into image

## BALL COUNT
Respect `ballCount` in `data.json` exactly.
If scene says 0: ZERO basketballs anywhere, including floor/background.
If scene says 1: EXACTLY ONE basketball used by the girl.
No loose or duplicate balls.

## REMOTION — CRITICAL FIXES
### NEVER fade the entire scene image from opacity 0
The rejected render showed black/white flashes for ~0.3s at many boundaries.
This is forbidden.

At the FIRST FRAME of every scene, the character image must already be fully visible.

### NO Ken Burns on exercise/rest images
Google Flow text is baked into exercise images. Zooming those images cropped/moved the title and cloud in the rejected render.
Exercise and Rest source images must stay at static 1:1 framing.

### Exercises
Remotion adds ONLY:
- 20-second circular timer top-left
- progress bar
- exact 20s timing

Do not add pose title or instruction again.

### Rest
Use the NEXT exercise image full-screen.
Remotion adds one compact `REST + countdown` unit in TOP-LEFT only.
Do NOT place the Rest countdown top-right because the Google Flow instruction cloud is already there.
Do NOT add `NEXT: [pose]`.

### Intro
Keep clean. Show only:
- `KIDMOTION BASKETBALL`
- `5 MIN BASKETBALL WORKOUT`
- `12 POSES • 20 SEC EACH`
- `FOLLOW ALONG`

Do NOT add:
- `WELCOME TO`
- duplicate 12-pose/20-second chips
- `COPY • HOLD • HAVE FUN`
- extra slogans

### Safety
Use `Bild 02`, image visible from frame 1.
Remotion shows only the short Safety panel.

### LET'S BEGIN
Use `Bild 03`, image visible from frame 1.
Remotion MUST show one clear `LET'S BEGIN!` graphic.

### Outro
Use CLEAN `Bild 16` with ZERO generated text/graphics.
Remotion adds the ONE and ONLY:
- `GREAT JOB!`
- `WORKOUT COMPLETE`

If Bild 16 already contains GREAT JOB text, REJECT/REGENERATE Bild 16. Do not stack two completion graphics.

## EXACT TIMING
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s
- 12 exercises × 20s = 240s
- 11 rests × 5s = 55s
- Outro 4s
- total = 313s / 5:13

## EXERCISE ORDER
1. Court Ready Hold
2. Defense Wings Hold
3. Ball Overhead Hold
4. Side Lunge Ball Hold
5. Forward Lunge Ball Hold
6. Knee-Up Ball Balance
7. Power Star Hold
8. Low Squat Ball Hold
9. Side Leg Balance
10. Ball Side Stretch
11. Knee Hug Hold
12. Ball Front Hold

Every pose must pass the one-still clarity test.

## REJECTED RENDER — KNOWN FAILURES TO VERIFY ARE GONE
Before accepting the next render confirm ALL of these are fixed:
- no black exercise-start flash
- no pale/white Rest-start flash
- no Safety/Outro blank flash
- no title/cloud cropping caused by zoom
- no Rest countdown overlapping instruction cloud
- no cluttered Intro
- LET'S BEGIN visibly appears
- exercise title/cloud styling consistent
- no stray basketballs in no-ball scenes
- no duplicate GREAT JOB at Outro
- new longer opening Voice runs approximately 11–14s
- background music is audible after 20s, around the middle, and near the end
- no spoken Voice after first exercise begins

## FINAL BUILD
Activate KM-002 using the canonical episode activation script, then:
```bash
npm run typecheck
npm run preflight
npm run render
npm run postrender:qa
```

Do NOT call the video production-complete unless all four steps pass and the resulting MP4 has been visually checked at every scene boundary.

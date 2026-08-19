# KM-002 — Antigravity Production Instructions

Read in this exact order before changing, activating or rendering anything:
1. `GEHIRN.md`
2. `episodes/KM-002-basketball/README.md`
3. `episodes/KM-002-basketball/01-skript/voice-text.md`
4. `episodes/KM-002-basketball/03-bilder/bild-prompts.md`
5. `episodes/KM-002-basketball/04-data/data.json`
6. `episodes/KM-002-basketball/04-data/VISUAL_REVIEW.json`
7. `episodes/KM-002-basketball/RENDER_QA.md`

The previously rendered `KM-002-basketball.mp4` is REJECTED. Never use it as the visual target.

## 1. GENERATION REVISION
Current revision file:
`episodes/KM-002-basketball/GENERATION-REVISION.txt`

Current revision: `KM002-R2`.

If ANY final source asset is regenerated after approval, the previous approval is invalid. Re-run visual review and `assets:approve`. The SHA-256 asset gate will block a changed file automatically.

## 2. REQUIRED FINAL ASSETS
Final production requires:
- `Bild 00.png` through `Bild 16.png`
- `Voice 01.mp3`
- `bg-music.mp3`
- completed `04-data/VISUAL_REVIEW.json`
- generated `04-data/ASSET_APPROVAL.json`

No final render without all of them.

## 3. MANDATORY VISUAL REVIEW — DO NOT SKIP
Before asset approval, visually inspect the ACTUAL final images one by one. Do not infer approval from prompts, filenames or previous generations.

Only set a VISUAL_REVIEW flag to true after directly checking the corresponding final images.

Required review facts:
- exact same girl in every scene
- every exercise is understandable from one still
- title/cloud readable and consistent across all exercises
- top-left timer safe zone is clear
- bottom progress safe zone is clear
- ballCount is correct in every exercise
- Bild 01/02/03/16 contain no generated text
- no extra people
- no anatomy errors
- no important limbs cropped

If even one required flag remains false, STOP. Do not render.

After the actual visual review passes:
```bash
npm run assets:approve -- --episode=KM-002-basketball
```

That command performs technical checks and creates `ASSET_APPROVAL.json` with SHA-256 hashes of every approved source asset.

After approval, DO NOT modify or replace any image/audio file. `render:safe` will block if a single byte changes.

## 4. OPENING — EXACT STRUCTURE
Opening total = 14 seconds:
- Intro `Bild 01` = 8s
- Safety `Bild 02` = 4s
- LET'S BEGIN `Bild 03` = 2s

Exactly one spoken file: `Voice 01.mp3`.
It starts at 0s and may continue naturally across Intro + Safety + LET'S BEGIN. It must finish before Scene 04 starts.

Final opening Voice:
`Hi, KidMotion friends! It’s basketball time! Today we have twelve easy poses, twenty seconds each. Find some space, make sure you can move safely, and stop if anything hurts. Get ready, stay strong, and let’s begin!`

Target: about 11–14 seconds.

After 14s:
- Exercises: NO spoken Voice
- Rest: NO spoken Voice
- Outro: NO spoken Voice

Never create subtitles, captions or transcript bars.

## 5. BACKGROUND MUSIC — REQUIRED
Use `bg-music.mp3`:
- instrumental
- child-friendly
- sporty/playful
- no lyrics
- no spoken samples
- low under opening Voice
- slightly louder after opening
- LOOP through the complete 5:13 video

Final render must still have music around 20s, the middle of the video and near the end.

## 6. SAME CHARACTER
Use exactly the same approved KM-002 girl throughout.
- `Bild 01.png` = PRIMARY character/world reference
- same face
- same ponytail
- same age appearance
- same body proportions
- same purple/aqua outfit
- same shoes
- same basketball gym
- exactly one visible person
- no fake brand/team names

## 7. GOOGLE FLOW EXERCISE UI LOCK
For `Bild 04`–`Bild 15`, Google Flow creates:
- the pose
- one exercise title bottom-left
- one instruction cloud top-right

Reference system:
- `Bild 01` = PRIMARY character/world reference
- approved `Bild 04` = SECONDARY exercise UI/layout reference for `Bild 05`–`Bild 15`

All exercises must keep the same:
- title font feel
- white title + navy outline style
- title size
- title placement
- white/turquoise rounded cloud style
- cloud font/size
- margins

Forbidden:
- thought-bubble dots
- random bubble shapes
- random title styles
- text touching/crossing frame edges
- title entering bottom progress safe zone
- instruction entering top-left timer zone
- timer/progress baked into the image

## 8. BALL COUNT
Respect `ballCount` in `data.json` exactly.
- `0` = ZERO basketballs anywhere in the image
- `1` = EXACTLY ONE basketball used by the girl

No loose background balls. No duplicates.

## 9. REMOTION — PROTECTED RULES
### No full-image fade from blank
The first frame of every scene must already show the source image fully.

Forbidden:
- opacity 0 → 1 on the full scene image
- black flashes
- white/pastel flashes
- blank transition frames

### No Ken Burns on Exercise/Rest
Exercise and Rest source images stay completely static at 1:1 framing.
No zoom, scale or pan because Google Flow text is baked into these images.

### Exercises
Remotion adds ONLY:
- 20-second circular timer top-left
- progress bar
- exact 20-second timing

Never add a second title or instruction.

### Rest
Use the NEXT exercise image full-screen.
Add one compact `REST + countdown` unit TOP-LEFT only.
No top-right countdown. No `NEXT: pose`.

### Intro
Show only:
- `KIDMOTION BASKETBALL`
- `5 MIN BASKETBALL WORKOUT`
- `12 POSES • 20 SEC EACH`
- `FOLLOW ALONG`

No `WELCOME TO`, duplicate chips, `COPY • HOLD • HAVE FUN`, or extra slogans.

### Safety
Use `Bild 02`, visible from frame 1. Add only the short Safety panel.

### LET'S BEGIN
Use `Bild 03`, visible from frame 1. Remotion must visibly show exactly one `LET'S BEGIN!` graphic.

### Outro
`Bild 16` must contain ZERO generated text/graphics.
Remotion adds exactly one completion graphic:
- `GREAT JOB!`
- `WORKOUT COMPLETE`

## 10. EXACT TIMING
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s
- 12 exercises × 20s = 240s
- 11 rests × 5s = 55s
- Outro 4s
- total = 313s / 5:13

## 11. EXERCISE ORDER
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

Every exercise must pass the one-still clarity test.

## 12. AUTOMATED REGRESSION PROTECTION
`render:safe` now runs:

```text
TypeScript
→ project:doctor
→ preflight
→ asset:gate
→ render
→ postrender:qa
```

`project:doctor` blocks code regressions such as:
- Short composition returning
- Exercise/Rest zoom or full-image fade returning
- Intro clutter returning
- LET'S BEGIN disappearing
- background music no longer looping
- separate later Voice playback returning
- wrong canonical episode path

`asset:gate` blocks:
- missing approval
- wrong revision
- unapproved files
- any image/audio changed after approval

`postrender:qa` checks the actual MP4 for runtime, ongoing music and blank/black boundary problems.

## 13. FINAL BUILD
Only after VISUAL_REVIEW is complete and `assets:approve` passed:

```bash
npm run kidmotion:activate -- --episode=KM-002-basketball
npm run render:safe
```

Never bypass `render:safe` for a final delivery.
Never call the video PRODUCTION COMPLETE unless all automated gates pass AND the final MP4 has been visually checked.

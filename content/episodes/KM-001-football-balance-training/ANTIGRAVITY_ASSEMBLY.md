# KM-001 — Antigravity / Codex Assembly Rules

Read `PROJECT_BRAIN.md`, `episode.md`, `REFERENCE_GUIDE.md`, `data.json`, `ALL_IMAGE_PROMPTS.md` and `RENDER_QA.md` first.

## Required images
Use `Bild 00.png` through `Bild 16.png` with no gap.

`Bild 00.png` is thumbnail only and is NOT played in the video.
`Bild 01.png` is the visual continuity reference for the same KM-001 boy in every later image.

## SAME BOY VISIBLE THROUGHOUT
Every actual video section uses an image containing the same approved KM-001 boy:
- Intro → `Bild 01.png`
- Safety → `Bild 02.png`
- LET'S BEGIN → `Bild 03.png`
- exercises → `Bild 04.png`–`Bild 15.png`
- rests → reuse the NEXT exercise image full-screen
- Outro → `Bild 16.png`

Never replace these with blank, plain-color or text-only screens.
Never switch character.

## NO SUBTITLES
Do not create any subtitle/caption system.
Forbidden:
- automatic captions
- word-for-word Voice text
- transcript bars
- karaoke text
- centered narration sentences

## Beginning / Intro
Use `Bild 01.png` full-screen and keep the boy visible.
The opening must contain enough information to explain the workout, but it must be fixed branded UI, not captions.

Required opening information:
- `WELCOME TO`
- `KIDMOTION FOOTBALL`
- `5 MIN FOOTBALL TRAINING`
- `BALANCE • CONTROL • STRONG POSITIONS`
- `12 POSES`
- `20 SEC EACH`
- `FOLLOW ALONG`
- `COPY • HOLD • HAVE FUN`

Then show Safety on `Bild 02.png`, followed by LET'S BEGIN on `Bild 03.png`.

## HARD RULE — EXERCISE TEXT COMES FROM GOOGLE FLOW
For `Bild 04.png` through `Bild 15.png`, the image itself already contains:
- exercise title bottom-left
- short instruction top-right inside the KidMotion white cloud/info bubble

Do NOT add either of these again in Remotion.
Do NOT use `ExerciseHeader` or another equivalent title/instruction overlay.

During each exercise Remotion adds only:
- circular 20-second timer at top-left
- progress bar along bottom
- scene timing
- optional audio placement

If an exercise title or instruction appears twice, the render FAILS.

## Rest
No blank Rest screen.
For each 5-second Rest, reuse the NEXT exercise image full-screen and lightly dim it. Because the next image already contains its Google Flow title/instruction, Remotion overlays only:
- `REST`
- rest countdown

Do NOT add `NEXT: [exercise]` or another pose description from Remotion.

## Timing
- Intro 12s
- Safety 5s
- LET'S BEGIN 3s
- 12 exercises × 20s
- 11 rests × 5s
- Outro 5s
- total 320s / 5:20

Audio duration never controls scene duration.
Audio is not a blocking issue during the current visual correction phase.

## Exercise order
1. Football Ready Hold
2. Goalkeeper Squat Hold
3. Knee-Up Balance
4. Single-Leg Balance
5. Side Leg Hold
6. Standing Side Stretch
7. Calf Raise Hold
8. Wide Squat Hold
9. Side Lunge Hold
10. Forward Lunge Hold
11. Reach-Up Hold
12. Victory Balance

## Required build sequence
After all final images are staged, regenerate active Remotion data:
```bash
npm run kidmotion:activate -- --episode=KM-001-football-balance-training
```

Then run:
```bash
npm run render:safe
```

Use only `KidMotionVideo`, 1920x1080, 30fps, 16:9.

Reject the MP4 if subtitles appear, a blank screen replaces the boy, the character changes, Remotion duplicates an exercise title/instruction, an exercise image lacks its Google Flow title/instruction, an exercise is not 20s, or the Cover appears inside the video.

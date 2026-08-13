# KM-001 — Antigravity / Codex Assembly Rules

Read `PROJECT_BRAIN.md`, `episode.md`, `REFERENCE_GUIDE.md`, `data.json`, `ALL_VOICE_TEXTS.md` and `RENDER_QA.md` first.

## Required images
Use `Bild 00.png` through `Bild 16.png` with no gap.

`Bild 00.png` is thumbnail only and is NOT played in the video.
`Bild 01.png` is the clean visual continuity reference for the same KM-001 boy in every later image.

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
- phrase-by-phrase Intro text that follows the Voice

If any of these appear, the render FAILS.

Allowed intentional Remotion UI:
- fixed Intro badge/title/descriptor
- SAFETY FIRST panel
- LET'S BEGIN graphic
- exercise title bottom-left
- short instruction upper-right
- timer top-left
- progress bar bottom
- REST / NEXT
- GREAT JOB / WORKOUT COMPLETE

## Intro
Use `Bild 01.png` full-screen.
Keep the boy visible.
Show one fixed branded Intro graphic independent from narration:
- `KIDMOTION FOOTBALL`
- `5 MIN FOOTBALL TRAINING`
- `BALANCE • CONTROL • STRONG POSITIONS`

Do NOT reveal Intro text phrase-by-phrase in sync with speech.

## Exercise images
Use clean Google Flow images. Do not use old images with exercise title/instruction already baked in.
Remotion places the intentional exercise UI directly over the image.

## Rest
No blank Rest screen.
For each 5-second Rest, reuse the NEXT exercise image full-screen, lightly dim it, keep the boy clearly visible, and overlay only:
- `REST`
- rest countdown
- `NEXT: [exercise]`

Rest is silent.

## Timing
- Intro 12s
- Safety 5s
- LET'S BEGIN 3s
- 12 exercises × 20s
- 11 rests × 5s
- Outro 5s
- total 320s / 5:20

Audio duration never controls scene duration.

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

## Render
Use only `KidMotionVideo`, 1920x1080, 30fps, 16:9.
Run:
```bash
npm run render:safe
```

Reject the MP4 if subtitles appear, Intro behaves like captions, a blank screen replaces the boy, the character changes, old exercise image text returns, an exercise is not 20s, or the Cover appears inside the video.

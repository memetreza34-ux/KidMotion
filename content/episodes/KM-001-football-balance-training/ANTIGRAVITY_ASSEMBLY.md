# KM-001 — Antigravity / Codex Assembly Rules

Read `PROJECT_BRAIN.md`, `episode.md`, `REFERENCE_GUIDE.md`, `data.json`, `ALL_VOICE_TEXTS.md` and `RENDER_QA.md` first.

## Required images
Use `Bild 00.png` through `Bild 16.png` with no gap.

`Bild 00.png` is thumbnail only and is NOT played in the video.
`Bild 01.png` is the visual continuity reference for the same KM-001 boy.

## HARD RULE — SAME BOY VISIBLE THROUGHOUT
Every visible video section uses an image containing the same approved KM-001 boy:
- Intro → `Bild 01.png`
- Safety → `Bild 02.png`
- LET'S BEGIN → `Bild 03.png`
- exercises → matching `Bild 04.png`–`Bild 15.png`
- rests → reuse the NEXT exercise image as full-screen background
- Outro → `Bild 16.png`

Never replace these sections with plain blank/color screens.
Never switch to the girl or another person.

## HARD RULE — NO SUBTITLES
Do not create any subtitle system.
Forbidden:
- automatic captions
- word-for-word voice text
- gray/black transcript bars
- karaoke text
- centered subtitle boxes
- speech copied onto screen as captions

If any subtitle/transcript bar appears anywhere, the render FAILS.

Intentional Remotion UI is allowed:
- Intro headline blocks
- `SAFETY FIRST`
- `LET'S BEGIN!`
- exercise title bottom-left
- instruction cloud upper-right
- timer top-left
- progress bar bottom
- Rest / Next UI
- `GREAT JOB!`

These are scene graphics, not subtitles.

## Exercise images
Google Flow exercise images must be clean. Do not use old images that already contain the exercise title or instruction bubble.
Remotion places the title and instruction directly over the clean full-screen image.

## Rest screens
No blank Rest screen.
For each 5-second rest, reuse the NEXT exercise image full-screen, lightly dim it, keep the boy visible, then overlay only:
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

Audio duration never controls scene duration. A short voice cue ends, then the image/timer continues silently.

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

Reject the MP4 if subtitles appear, a blank screen replaces the boy, the character changes, old exercise images/text return, an exercise is not 20s, or the Cover appears in the video.

# KM-001 — Antigravity / Codex Assembly Rules

Read `PROJECT_BRAIN.md`, `episode.md`, `REFERENCE_GUIDE.md`, `data.json`, `ALL_VOICE_TEXTS.md` and `RENDER_QA.md` first.

# PRIMARY RULES
- exactly the same KM-001 boy throughout
- no subtitles or transcript system
- Google Flow owns exercise title + instruction
- Remotion owns timer + progress only during exercises
- spoken Voice exists ONLY in the Intro
- after Intro, the complete video is silent
- opening must be short, necessary and visually clean

## Required images
Use `Bild 00.png` through `Bild 16.png` with no gap.

`Bild 00.png` is thumbnail only and is NOT played in the video.
`Bild 01.png` is the main visual continuity reference for the same KM-001 boy in every later image.

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

## SHORT CLEAN OPENING
Do not make the beginning long.

Exact KM-001 opening timing:
- Intro: 8s
- Safety: 4s
- LET'S BEGIN: 2s

Intro uses `Bild 01.png` full-screen and only these fixed branded elements:
- `KIDMOTION FOOTBALL`
- `5 MIN FOOTBALL TRAINING`
- `12 POSES • 20 SEC EACH`
- `FOLLOW ALONG`

Do not add `WELCOME TO`, extra slogans, repeated descriptions or many separate text blocks.
Keep the boy clearly visible and keep the composition clean.

## AUDIO — HARD RULE
Only Scene 01 Intro may contain Audio.

Allowed file:
- `Voice 01.mp3`

Intro Voice:
`Hi, KidMotion friends! Twelve football poses, twenty seconds each. Find some space and follow along!`

All later sections MUST be silent:
- Safety: no Audio component
- LET'S BEGIN: no Audio component
- exercises: no Audio component
- rests: no Audio component
- Outro: no Audio component

Even if old `Voice 02.mp3`–`Voice 16.mp3` files exist somewhere, DO NOT use them.

## Exercise images
Google Flow images `Bild 04.png`–`Bild 15.png` already contain:
- exercise name bottom-left
- short instruction top-right in the KidMotion cloud

Remotion MUST NOT add another exercise title or another instruction.
Remotion adds only:
- 20-second timer top-left
- progress bar bottom

Every exercise lasts exactly 20s and is silent.

## Rest
No blank Rest screen.
For each 5-second Rest, reuse the NEXT exercise image full-screen.
Remotion adds only:
- `REST`
- rest countdown

Do not add `NEXT: [pose name]` because the next image already contains its Google Flow title/instruction.
Rest is silent.

## Outro
Use `Bild 16.png` for 4 seconds.
Show the visual completion graphic only.
NO VOICE.

## Exact timing
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s
- 12 exercises × 20s = 240s
- 11 rests × 5s = 55s
- Outro 4s
- total = 313s / 5:13

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
After all final images are staged:
```bash
npm run kidmotion:activate -- --episode=KM-001-football-balance-training
```

Then render with:
```bash
npm run render:safe
```

Use only `KidMotionVideo`, 1920x1080, 30fps, 16:9.

Reject the render if:
- any Voice is heard after the Intro
- opening is longer/cluttered beyond the defined structure
- subtitles appear
- a blank screen replaces the boy
- the character changes
- exercise title/instruction is duplicated by Remotion
- an exercise is not exactly 20s
- Cover appears inside the MP4

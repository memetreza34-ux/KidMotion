# KM-001 — Football Balance Training for Kids

## Final structure
- YouTube long-form 16:9 / 1920x1080
- total runtime: 320s / 5:20
- exactly ONE recurring character: approved KidMotion boy
- same face, hair, proportions, football outfit and football world throughout
- no subtitles, voice captions or transcript bars
- 12 static hold exercises, each exactly 20s

## Character image in every video section
- Cover: `Bild 00.png` — thumbnail only, not in MP4
- Intro: `Bild 01.png`
- Safety: `Bild 02.png`
- LET'S BEGIN: `Bild 03.png`
- Exercises: `Bild 04.png`–`Bild 15.png`
- Rest: reuse the NEXT exercise image full-screen
- Outro: `Bild 16.png`

No blank/plain/text-only scene may replace the character image.
`Bild 01.png` is the primary continuity reference for `Bild 02.png`–`Bild 16.png`.

## No subtitles
Never display spoken audio as text.
Forbidden:
- automatic captions
- word-for-word captions
- grey/black transcript bars
- karaoke text
- centered narration sentences

## Intro — 12s
Visual: `Bild 01.png`, same boy on the right.
The opening must feel complete and immediately explain the workout.

Fixed Remotion opening information:
- `WELCOME TO`
- `KIDMOTION FOOTBALL`
- `5 MIN FOOTBALL TRAINING`
- `BALANCE • CONTROL • STRONG POSITIONS`
- `12 POSES`
- `20 SEC EACH`
- `FOLLOW ALONG`
- `COPY • HOLD • HAVE FUN`

These are branded opening graphics, NOT subtitles and NOT word-for-word Voice text.

## Safety — 5s
Visual: `Bild 02.png`, same boy.
Remotion panel:
- `SAFETY FIRST`
- `Make sure you have enough space to move.`
- `Stop if anything hurts or feels uncomfortable.`

## LET'S BEGIN — 3s
Visual: `Bild 03.png`, same boy.
Remotion adds only the `LET'S BEGIN!` start graphic.

## Exercises
| Scene | Exercise | Image | Duration | Rest after |
|---|---|---|---:|---:|
| 04 | Football Ready Hold | Bild 04.png | 20s | 5s |
| 05 | Goalkeeper Squat Hold | Bild 05.png | 20s | 5s |
| 06 | Knee-Up Balance | Bild 06.png | 20s | 5s |
| 07 | Single-Leg Balance | Bild 07.png | 20s | 5s |
| 08 | Side Leg Hold | Bild 08.png | 20s | 5s |
| 09 | Standing Side Stretch | Bild 09.png | 20s | 5s |
| 10 | Calf Raise Hold | Bild 10.png | 20s | 5s |
| 11 | Wide Squat Hold | Bild 11.png | 20s | 5s |
| 12 | Side Lunge Hold | Bild 12.png | 20s | 5s |
| 13 | Forward Lunge Hold | Bild 13.png | 20s | 5s |
| 14 | Reach-Up Hold | Bild 14.png | 20s | 5s |
| 15 | Victory Balance | Bild 15.png | 20s | 0s |

## Exercise visual responsibility — HARD RULE
Each Google Flow exercise image `Bild 04.png`–`Bild 15.png` already contains:
- exercise title bottom-left
- short instruction top-right inside the KidMotion white cloud/info bubble

Remotion MUST NOT create those again.

During exercise scenes Remotion adds only:
- circular 20-second timer top-left
- progress bar along bottom
- exact 20-second timing
- optional audio placement later

If title or instruction appears twice, the render is wrong.

## Rest
Every 5s Rest uses the NEXT exercise image full-screen. The same boy stays visible.
Because that image already contains the next exercise title/instruction, Remotion adds only:
- `REST`
- Rest countdown

No `NEXT: [exercise]` text from Remotion.
Rest is silent.

## Outro — 5s
Visual: `Bild 16.png`, same boy in victory pose.
Remotion adds `GREAT JOB!` and `WORKOUT COMPLETE`.

## Audio
Audio is currently secondary. The visual system must be correct first.
Later, short Voice cues may be added without changing scene durations.

## Runtime
12 + 5 + 3 + 240 + 55 + 5 = 320 seconds = 5:20.

## Google Flow order
Generate exactly one at a time and rename immediately:
`Bild 00.png` → `Bild 01.png` → `Bild 02.png` → ... → `Bild 16.png`

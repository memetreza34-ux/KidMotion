# KM-001 — Football Balance Training for Kids

## Final structure
- YouTube long-form 16:9 / 1920x1080
- total runtime: 313s / 5:13
- exactly ONE recurring character: approved KidMotion boy
- same face, hair, proportions, football outfit and football world throughout
- no subtitles, voice captions or transcript bars
- 12 static hold exercises, each exactly 20s
- spoken Voice ONLY in the short Intro
- every exercise must pass the EIN-BILD-KLARHEITSTEST

## EIN-BILD-KLARHEITSTEST — HARD RULE
Every exercise must be understandable from exactly ONE still image.

A child should be able to copy the body position before reading the title/instruction.

Required:
- full decisive body position visible at once
- full body visible
- arms/legs clearly separated
- clear silhouette
- no motion direction required
- no before/after phase required
- no subtle micro-position as the main action
- no hidden important joints

If a pose needs animation or a long explanation to make sense, replace it.

For KM-001 the old `CALF RAISE HOLD` is retired because the key heel lift is too subtle in a full-body still. Scene 10 is now `POWER STAR HOLD` and `Bild 10.png` must be regenerated to match the new prompt before the next final render.

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

## Intro — 8s
Visual: `Bild 01.png`, same boy.

Keep the opening minimal and clean. Fixed Remotion information only:
- `KIDMOTION FOOTBALL`
- `5 MIN FOOTBALL TRAINING`
- `12 POSES • 20 SEC EACH`
- `FOLLOW ALONG`

This is the ONLY scene with Voice.

Final Voice:
`Hi, KidMotion friends! Get ready for twelve football poses. Hold each one for twenty seconds. Find some space and follow along!`

## Safety — 4s
Visual: `Bild 02.png`, same boy.
Short Safety panel only.
NO VOICE.

## LET'S BEGIN — 2s
Visual: `Bild 03.png`, same boy.
NO VOICE.

## Exercises — all silent
| Scene | Exercise | Image | Duration | Rest after |
|---|---|---|---:|---:|
| 04 | Football Ready Hold | Bild 04.png | 20s | 5s |
| 05 | Goalkeeper Squat Hold | Bild 05.png | 20s | 5s |
| 06 | Knee-Up Balance | Bild 06.png | 20s | 5s |
| 07 | Single-Leg Balance | Bild 07.png | 20s | 5s |
| 08 | Side Leg Hold | Bild 08.png | 20s | 5s |
| 09 | Standing Side Stretch | Bild 09.png | 20s | 5s |
| 10 | Power Star Hold | Bild 10.png | 20s | 5s |
| 11 | Wide Squat Hold | Bild 11.png | 20s | 5s |
| 12 | Side Lunge Hold | Bild 12.png | 20s | 5s |
| 13 | Forward Lunge Hold | Bild 13.png | 20s | 5s |
| 14 | Reach-Up Hold | Bild 14.png | 20s | 5s |
| 15 | Victory Balance | Bild 15.png | 20s | 0s |

Every exercise uses:
- full-screen Google Flow character image
- pose must be visually readable from the still itself
- exercise title generated into image at bottom-left
- short instruction generated into image at top-right
- Remotion circular timer top-left
- Remotion progress bar
- NO VOICE

The title/instruction may confirm the pose but must never compensate for an unclear pose.

## Rest — silent
Every 5s Rest uses the NEXT exercise image full-screen.
Remotion adds only `REST` + Rest timer.
NO VOICE.

## Outro — 4s
Visual: `Bild 16.png`, same boy in victory pose.
Completion graphic only.
NO VOICE.

## Runtime
8 + 4 + 2 + 240 + 55 + 4 = 313 seconds = 5:13.

## Google Flow order
Generate exactly one at a time and rename immediately:
`Bild 00.png` → `Bild 01.png` → `Bild 02.png` → ... → `Bild 16.png`

Before approving each exercise image, perform the silhouette / single-frame clarity check.

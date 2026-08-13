# KM-001 — Football Balance Training for Kids

## Final structure
- YouTube long-form 16:9 / 1920x1080
- total runtime: 320s / 5:20
- exactly ONE recurring character: approved KidMotion boy
- same face, hair, proportions, football outfit and football world throughout
- no subtitles or voice captions
- every exercise exactly 20s

## Important visual rule
Every visible video section uses an image containing the same boy.
No blank/plain Remotion-only screens.

- Cover: `Bild 00.png` — thumbnail only, not in MP4
- Intro: `Bild 01.png`
- Safety: `Bild 02.png`
- LET'S BEGIN: `Bild 03.png`
- Exercises: `Bild 04.png`–`Bild 15.png`
- Rest: reuse the NEXT exercise image as full-screen background
- Outro: `Bild 16.png`

`Bild 01.png` is the primary continuity reference for `Bild 02.png`–`Bild 16.png`.

## No subtitles
Never display spoken audio as text.
Forbidden: automatic captions, word-for-word captions, transcript bars, karaoke text, subtitle boxes.

Allowed intentional Remotion UI:
- Intro graphic blocks
- SAFETY FIRST
- LET'S BEGIN
- exercise title bottom-left
- short instruction cloud upper-right
- 20s timer top-left
- progress bar bottom
- REST / NEXT
- GREAT JOB

## Timeline
| Scene | Visual | Duration |
|---|---|---:|
| 01 Intro | Bild 01 | 12s |
| 02 Safety | Bild 02 | 5s |
| 03 LET'S BEGIN | Bild 03 | 3s |
| 04 Football Ready Hold | Bild 04 | 20s |
| 05 Goalkeeper Squat Hold | Bild 05 | 20s |
| 06 Knee-Up Balance | Bild 06 | 20s |
| 07 Single-Leg Balance | Bild 07 | 20s |
| 08 Side Leg Hold | Bild 08 | 20s |
| 09 Standing Side Stretch | Bild 09 | 20s |
| 10 Calf Raise Hold | Bild 10 | 20s |
| 11 Wide Squat Hold | Bild 11 | 20s |
| 12 Side Lunge Hold | Bild 12 | 20s |
| 13 Forward Lunge Hold | Bild 13 | 20s |
| 14 Reach-Up Hold | Bild 14 | 20s |
| 15 Victory Balance | Bild 15 | 20s |
| 16 Outro | Bild 16 | 5s |

There is a 5s Rest after Scenes 04–14. No Rest after Scene 15. During Rest, show the NEXT exercise image with the same boy and overlay only Rest UI.

## Exercise Remotion layout
Each clean exercise image fills the screen.
Remotion adds:
- title bottom-left
- short instruction cloud upper-right
- circular timer top-left
- progress bar along bottom

Google Flow must not bake exercise title, instruction, cloud, timer, progress or subtitles into normal scene images.

## Voice
Voice only when useful. Exercise cue plays near the start, then the rest of the 20s hold is silent. Rest screens are silent. Audio length never controls scene length.

## Final Google Flow order
`Bild 00.png, Bild 01.png, Bild 02.png, Bild 03.png, Bild 04.png, Bild 05.png, Bild 06.png, Bild 07.png, Bild 08.png, Bild 09.png, Bild 10.png, Bild 11.png, Bild 12.png, Bild 13.png, Bild 14.png, Bild 15.png, Bild 16.png`

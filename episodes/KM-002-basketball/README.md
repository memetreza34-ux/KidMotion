# KM-002 — Basketball Hold Workout for Kids

Date: 2026-08-18 — Tuesday

## Video title
**5 Minute Basketball Workout for Kids | 12 Easy Hold Poses**

## Core concept
A basketball-themed KidMotion follow-along workout built ONLY from static poses that are immediately understandable from one image.

## Character
Exactly ONE recurring KidMotion girl for the whole episode.

Locked identity/world:
- around 10 years old
- medium warm skin
- long dark-brown sporty high ponytail
- expressive brown eyes
- premium stylized 3D family-entertainment look
- purple/aqua basketball outfit
- simple number 12 only, no fake team/brand text
- bright indoor basketball gym
- no other people

`Bild 01.png` is the PRIMARY character/world reference for `Bild 02.png`–`Bild 16.png`.

## Structure
- Cover: `Bild 00.png` — thumbnail only, never in MP4
- Intro: `Bild 01.png` — 8s
- Safety: `Bild 02.png` — 4s
- Let's Begin: `Bild 03.png` — 2s
- Exercises: `Bild 04.png`–`Bild 15.png` — 12 × 20s
- Rest: 11 × 5s using the next exercise image
- Outro: `Bild 16.png` — 4s

Total: **313 seconds / 5:13**.

## Opening Voice
Exactly ONE spoken file: `Voice 01.mp3`.

It starts at Scene 01 and may continue naturally across Intro → Safety → LET'S BEGIN. It MUST finish before Scene 04 starts. Target: about 11–14 seconds.

Copy-ready script:

`Hi, KidMotion friends! It’s basketball time! Today we have twelve easy poses, twenty seconds each. Find some space, make sure you can move safely, and stop if anything hurts. Get ready, stay strong, and let’s begin!`

After the 14-second opening there is NO spoken Voice during exercises, rests or Outro.

## Background music
`bg-music.mp3` is REQUIRED for the final render.

Rules:
- instrumental only
- child-friendly, sporty/playful
- no lyrics or spoken samples
- low under the opening Voice
- louder after the opening
- loop through the entire workout
- no long silent section after the opening

## Exercise order
| Scene | Pose | Duration | Rest |
|---|---|---:|---:|
| 04 | Court Ready Hold | 20s | 5s |
| 05 | Defense Wings Hold | 20s | 5s |
| 06 | Ball Overhead Hold | 20s | 5s |
| 07 | Side Lunge Ball Hold | 20s | 5s |
| 08 | Forward Lunge Ball Hold | 20s | 5s |
| 09 | Knee-Up Ball Balance | 20s | 5s |
| 10 | Power Star Hold | 20s | 5s |
| 11 | Low Squat Ball Hold | 20s | 5s |
| 12 | Side Leg Balance | 20s | 5s |
| 13 | Ball Side Stretch | 20s | 5s |
| 14 | Knee Hug Hold | 20s | 5s |
| 15 | Ball Front Hold | 20s | 0s |

Every pose must pass the EIN-BILD-KLARHEITSTEST: one static end pose, full body visible, clear silhouette, no movement needed to understand it.

## Google Flow / Remotion split
### Google Flow owns exercise images
For `Bild 04`–`Bild 15`, Google Flow creates:
- girl + pose + basketball world
- ONE exercise title bottom-left
- ONE short instruction cloud top-right

`Bild 04.png` becomes the locked UI-style reference for title/cloud appearance on `Bild 05`–`Bild 15`.

### Remotion owns
During exercises:
- circular 20-second timer top-left
- progress bar
- timing only

During Rest:
- next exercise image remains visible
- compact `REST + countdown` only in TOP-LEFT

Other screens:
- Intro graphic from Remotion
- Safety graphic from Remotion
- LET'S BEGIN graphic from Remotion
- GREAT JOB graphic from Remotion

`Bild 01`, `Bild 02`, `Bild 03` and `Bild 16` must contain ZERO generated text.

## CRITICAL CORRECTIONS FROM THE REJECTED KM-002 RENDER
The uploaded test render was rejected for these reasons:

1. **Black flashes at the start of every exercise.** The old Remotion exercise image faded from opacity 0 over ~0.3s. This is forbidden. Exercise image must be visible from the very first frame.
2. **White/pale flashes at every Rest and at Safety/Outro boundaries.** Full-scene fades from zero are forbidden.
3. **Exercise text was cropped/moved.** Ken Burns zoom on images with baked Google Flow text is forbidden. Exercise and Rest images stay static at 1:1 scale.
4. **Rest countdown collided with the instruction cloud.** Rest UI now stays top-left; top-right is reserved for the Google Flow instruction cloud.
5. **Intro was too cluttered.** No `WELCOME TO`, repeated chips or `COPY • HOLD • HAVE FUN`. Keep only badge, title, `12 POSES • 20 SEC EACH`, and `FOLLOW ALONG`.
6. **LET'S BEGIN had no clear start graphic.** Remotion must show one clean `LET'S BEGIN!` graphic on `Bild 03`.
7. **Exercise title/cloud styling was inconsistent.** `Bild 04` is now the UI master reference for every later exercise image. No thought-bubble dots, no random font/style changes.
8. **Stray basketballs appeared in scenes that should have no ball.** Ball count is now explicit per scene: exactly zero or exactly one.
9. **Outro showed duplicate GREAT JOB graphics.** `Bild 16` must contain ZERO text/graphics; Remotion adds the only GREAT JOB graphic.
10. **The test MP4 had no background music after the opening.** Final render must contain looping `bg-music.mp3` through the full workout.
11. **The test MP4 Voice ended around 8 seconds.** The final opening Voice is the longer 11–14 second script above and may span all three opening slides.

## Publishing caption
Can you hold all 12 basketball poses? 🏀 Follow along for 20 seconds each and finish the full KidMotion challenge! #KidsWorkout #BasketballForKids #KidsFitness #BalanceChallenge #KidMotion

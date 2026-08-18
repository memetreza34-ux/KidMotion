# KidMotion — Project Brain

`GEHIRN.md` is the highest-priority source of truth. This file mirrors the current production rules.

## Current focus
English SPORT / FITNESS long-form videos using static Google Flow images and Remotion.

## One video = one character
Each episode uses exactly ONE KidMotion main character from Intro through Outro. No switching and no second visible person.

## ONE-STILL POSE CLARITY — HARD RULE
Only use exercises that are understandable from exactly ONE static image.

A child should be able to copy the body position from the picture before reading the title or instruction.

Required:
- full decisive pose visible in one frame
- full body visible
- important joints visible
- arms and legs clearly separated
- clear silhouette
- static end-position
- no motion direction, speed or before/after phase needed
- no subtle micro-position as the main exercise
- no complex limb overlap

If a pose as a black silhouette would still be obvious, it is usually suitable.

If Google Flow cannot make a pose clear after two serious attempts, replace the pose. Do not rescue an unclear pose with more text.

Visual clarity is more important than making every pose extremely sport-specific.

## Every visible video section uses the character image
- Cover `Bild 00` = thumbnail only, not in MP4
- Intro `Bild 01`
- Safety `Bild 02`
- LET'S BEGIN `Bild 03`
- Exercises = matching `Bild XX`
- Rest = reuse the NEXT exercise image full-screen
- Outro = final character image

No blank, text-only or gradient-only screens may replace the character.

## No subtitles
Never display spoken audio as text. No automatic captions, transcript bars, karaoke text or word-for-word Voice text.

## Opening — short and clean
Standard opening:
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s

## Voice — ONE continuous opening Voice
Use exactly one spoken file: `Voice 01.mp3`.

It starts in the Intro and may continue naturally while the Safety and LET'S BEGIN opening slides appear. Target length is roughly 11–14 seconds. It must finish before the first exercise begins.

There are no separate Safety or LET'S BEGIN Voice files.

After the opening:
- Exercises silent
- Rest silent
- Outro silent

Background music may continue quietly through the full video.

Every user-facing Voice script is written as one copy-ready continuous paragraph.

## Google Flow responsibility
Google Flow creates the scene images and preserves the same character, outfit, world and 3D identity.

Use approved `Bild 01.png` as primary continuity reference for all later images.

For exercise images Google Flow creates directly inside the image:
- exercise name bottom-left
- short instruction top-right in KidMotion cloud

The pose itself must already be understandable without relying on that text.

Google Flow must NOT generate timer, progress bar, subtitles or transcript bars.

## Remotion responsibility
During exercises Remotion adds only:
- 20-second timer top-left
- progress bar
- exact timing

Remotion must NOT duplicate the exercise name or instruction.

Rest uses the next exercise image and adds only `REST` + countdown.

## Timing
- 12 exercises × 20s
- 11 rests × 5s
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s
- Outro 4s
- standard total = 313s / 5:13

## Google Flow workflow
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → EIN-BILD-KLARHEIT PRÜFEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

# KidMotion — Project Brain

Canonical current rules for KidMotion.

## Current focus
English SPORT / FITNESS long-form videos using static Google Flow images and Remotion.

## One video = one character
KidMotion has a boy and girl overall, but each episode chooses exactly ONE main character. That exact character stays consistent through the complete episode. No switching and no second visible person.

## Every visible video section uses the character image
Current standard:
- Cover `Bild 00` = thumbnail only, not in MP4
- Intro `Bild 01`
- Safety `Bild 02`
- LET'S BEGIN `Bild 03`
- exercises = matching `Bild XX`
- Rest = reuse the NEXT exercise image full-screen
- Outro = matching final image

Do not use blank, plain, text-only or gradient-only screens for Intro, Safety, Rest, Start or Outro.

## No subtitles — hard rule
Never display spoken audio as text.
Forbidden:
- automatic captions
- word-for-word voice transcription
- subtitle bars
- transcript boxes
- karaoke text
- centered sentence copies of the voice

The Intro must NOT reveal phrase-by-phrase text synchronized to narration. Use a fixed branded title graphic instead.

Allowed intentional Remotion UI only:
- fixed Intro title / short descriptor
- SAFETY FIRST panel
- LET'S BEGIN graphic
- exercise title bottom-left
- short exercise instruction upper-right
- timer top-left
- progress bar bottom
- REST / NEXT
- GREAT JOB / completion graphic

## Google Flow
Except for Cover, source images are clean. Generate only the chosen character + pose + environment. Do not bake video text, subtitles, transcript bars, timer, progress or other UI into normal images.

Reference workflow:
1. create Cover `Bild 00` from the approved master character
2. create clean Intro `Bild 01` from the approved master character
3. approve `Bild 01`
4. use `Bild 01` as the primary visual continuity reference for `Bild 02` through the final image

Keep face, hair, age appearance, proportions, outfit, world and 3D style consistent.

Generate exactly one image at a time and rename it immediately before continuing.

## Exercise timing
Current format uses static hold poses. Every exercise lasts exactly 20 seconds. Typical Rest = 5 seconds. Timer reaches 0 and progress reaches 100%.

## Voice
Voice only when useful. A short voice cue does not shorten a 20-second scene. The remaining hold time can stay silent. Audio length never controls video length. Rest is normally silent.

## Remotion
Remotion controls the full timeline and adds only the intentional UI defined above over the character images.

## Publishing
Exactly one cross-platform English caption per episode with exactly 5 hashtags including `#KidMotion`.

## KM-001 reference
- same approved boy in every video image from `Bild 01` through `Bild 16`
- `Bild 02` is the Safety image
- Rest reuses the next exercise image
- no subtitles or transcript-style intro text
- 12 exercises × 20s
- 11 rests × 5s
- total 320s / 5:20

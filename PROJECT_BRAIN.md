# KidMotion — Project Brain

`GEHIRN.md` is the highest-priority source of truth. This file mirrors the current production rules.

## Current focus
English YouTube long-form SPORT / FITNESS workouts using static Google Flow images + Remotion.

## One video = one character
Exactly ONE KidMotion main character is used from Intro through Outro. No switching, no second visible person.

## ONE-STILL POSE CLARITY — HARD RULE
Every exercise must be understandable from exactly ONE still image before reading the text.

Required:
- full body visible
- important joints visible
- arms/legs clearly separated
- clear silhouette
- static end-position
- no motion direction, speed or before/after phase needed
- no subtle micro-position as the main exercise

If the silhouette is unclear or Google Flow cannot make the pose clean after two serious attempts, replace the pose.

## Image numbering
- Bild 00 = cover only, never in MP4
- Bild 01 = Intro / PRIMARY character reference
- Bild 02 = Safety
- Bild 03 = LET'S BEGIN
- Bild 04–15 = exercises
- Bild 16 = Outro

Every visible MP4 section uses the episode character image. No blank/text-only replacement screens.

## Opening Voice
Use exactly ONE spoken file: `Voice 01.mp3`.

It begins at 0s and may continue naturally across:
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s

Target roughly 11–14s. It must end before exercise 1 starts.

After the 14s opening:
- no exercise Voice
- no Rest Voice
- no Outro Voice
- no spoken countdowns
- no subtitles/captions/transcript

Voice script is always one copy-ready continuous paragraph.

## Background music
Final render requires `bg-music.mp3`.
- instrumental
- child-friendly / sporty-playful
- no lyrics/speech
- low under opening Voice
- slightly louder afterward
- loop through complete video

A final MP4 must not become digitally silent after the opening.

## Google Flow responsibility
### Character continuity
`Bild 01.png` = PRIMARY character/world reference for every later image.

### Exercise text
Google Flow directly creates on `Bild 04`–`Bild 15`:
- ONE exercise name bottom-left
- ONE short instruction cloud top-right

After `Bild 04` is approved, it becomes SECONDARY UI/LAYOUT reference for `Bild 05`–`Bild 15`.

All exercise images must keep the same title/cloud design. No thought-bubble dots, random fonts, random cloud styles or clipped text.

### Safe zones
- top-left ~220×220 px clear for Remotion timer
- lowest ~90 px clear for Remotion progress bar
- title safely above bottom zone
- cloud safely inside top-right

### Prop count
If a scene says no ball: ZERO balls anywhere.
If a scene uses a ball: EXACTLY ONE ball.

### Text-free non-exercise images
Bild 01, 02, 03 and 16 contain ZERO Google Flow text.
Remotion owns Intro/Safety/LET'S BEGIN/Outro graphics.
Bild 16 must NOT contain GREAT JOB.

## Remotion responsibility
### No scene flashes
Every scene image is fully visible from its first frame.
Forbidden:
- whole-image opacity fade from 0
- black transition flashes
- white/pastel transition flashes
- blank frames

### No Ken Burns on exercise/rest
Exercise and Rest images contain baked Google Flow text, so keep them static at 1:1 framing. No zoom/pan that crops title/cloud.

### Exercises
Remotion adds ONLY:
- 20-second timer top-left
- progress bar
- timing

### Rest
Show NEXT exercise image full-screen.
Add one compact `REST + countdown` block TOP-LEFT only.
Do not place Rest countdown top-right because the instruction cloud is there.
Do not add NEXT pose name.

### Intro
Keep only:
- KIDMOTION + theme
- 5 MIN ... WORKOUT
- 12 POSES • 20 SEC EACH
- FOLLOW ALONG

No WELCOME TO, duplicate chips or filler slogan.

### LET'S BEGIN
Remotion must visibly show one clear `LET'S BEGIN!` graphic on Bild 03.

### Outro
Bild 16 is text-free. Remotion adds the ONE completion graphic:
- GREAT JOB!
- WORKOUT COMPLETE

## Timing
Standard total:
8 + 4 + 2 + (12×20) + (11×5) + 4 = 313s / 5:13.

## Final QA
Reject if any of these occur:
- black/white scene-boundary flashes
- cropped exercise title/cloud
- Rest countdown overlaps cloud
- inconsistent title/cloud style
- stray/duplicate basketballs
- duplicate GREAT JOB
- Voice continues into exercise 1
- background music missing after opening
- subtitles appear

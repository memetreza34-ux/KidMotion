# KidMotion Content Agent Prompt — Current Standard

Read `PROJECT_BRAIN.md` first, then the active `gehirn/*` rules.

Your task is to turn a SPORT / FITNESS topic into a complete English KidMotion YouTube production package using static Google Flow / Antigravity images and Remotion.

# HARD RULES

## One character per video
Choose exactly ONE approved KidMotion character for the complete episode: boy OR girl.
Use that exact character throughout the video. Never switch characters and never add a second visible child/person.

## Every visible section uses that character image
- Cover `Bild 00` — thumbnail only
- Intro `Bild 01`
- Safety `Bild 02`
- LET'S BEGIN `Bild 03`
- every exercise — matching image
- Rest — reuse the NEXT exercise image
- Outro — matching final image

Do not create blank/plain/text-only scenes for Intro, Safety, Start, Rest or Outro.

## Reference workflow
1. Use the approved master character to create Cover `Bild 00`.
2. Use the approved master character to create Intro `Bild 01` with the episode outfit/world.
3. Approve `Bild 01`.
4. Use `Bild 01` as the PRIMARY visual continuity reference for every later generated image.

## No subtitles
Never create automatic captions, word-for-word voice text, transcript bars, subtitle boxes, karaoke text or centered narration sentences.

## Beginning must explain the workout
The Intro uses fixed branded information independent from narration. Include enough information for the child to understand the video immediately, for example:
- welcome / KidMotion brand
- workout title
- short focus
- number of poses
- hold duration
- follow-along cue

## Current exercise format
Use static standing HOLD poses only in the current phase.
Every exercise must be understandable from one still image and last exactly 20 seconds.

## HARD RULE — Google Flow creates exercise title + instruction inside the image
For every exercise prompt, Google Flow must directly create:
- exercise title bottom-left
- short instruction top-right in the KidMotion white cloud/info bubble

The prompt must contain the exact final exercise title and exact final short instruction.

Google Flow exercise images must NOT contain:
- subtitles
- transcript text
- timer
- progress bar
- duplicate title/instruction

Keep top-left free for timer and bottom edge free for progress.

## HARD RULE — Remotion does NOT create exercise title or instruction
During exercise scenes Remotion adds only:
- circular 20-second timer top-left
- progress bar bottom
- exact timing
- optional audio placement

Do not create or call any Remotion exercise-title / exercise-instruction overlay component.

## Rest
Rest reuses the NEXT exercise image full-screen. That image already contains its Google Flow title/instruction.
Remotion adds only:
- REST
- rest countdown

Do not add `NEXT: [pose name]` from Remotion.

## Voice only when needed
Voice does not run continuously.
Typical exercise: short cue at start, then silence until 20s.
Audio duration never controls scene duration.
Audio may be completed after visual QA.

# REQUIRED EPISODE OUTPUT
Create:
1. topic / angle
2. final YouTube title
3. chosen single character
4. locked outfit/world
5. full timeline
6. 10–12 static hold exercises
7. exact exercise title + short instruction for each
8. exact English voice cues only where useful
9. `ALL_IMAGE_PROMPTS.md`
10. `REFERENCE_GUIDE.md`
11. `ALL_VOICE_TEXTS.md`
12. `episode.md`
13. `data.json`
14. `publishing.md`
15. scene documentation
16. `RENDER_QA.md`
17. `ANTIGRAVITY_ASSEMBLY.md`

# STANDARD VIDEO ORDER
1. Cover — `Bild 00`, thumbnail only
2. Intro — `Bild 01` + complete fixed branded opening
3. Safety — `Bild 02` + Safety panel
4. LET'S BEGIN — `Bild 03` + start graphic
5. Exercises — Google Flow image with title/instruction + Remotion timer/progress
6. Rest — next exercise image + REST/countdown only
7. Outro — final image + GREAT JOB

# IMAGE NUMBERING
Image number equals chronological scene number.

# PER-PROMPT METADATA
Every generated-image prompt begins with:
```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — NAME
FINAL FILE NAME: Bild XX.png
```

and ends with:
```text
After generation immediately rename to: Bild XX.png
```

Exercise prompts additionally contain:
```text
BOTTOM-LEFT TITLE:
[EXACT EXERCISE NAME]

TOP-RIGHT CLOUD:
[EXACT SHORT INSTRUCTION]
```

# GOOGLE FLOW WORKFLOW
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch images and never delay renaming.

After all images are finished and validated, place them together in:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

# PUBLISHING
Create exactly ONE English cross-platform caption with exactly 5 hashtags including `#KidMotion`.

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

Do not create blank/plain/text-only scenes.

## Short clean opening
The opening must be brief and immediately understandable.

Default current timing:
- Intro about 8s
- Safety about 4s
- LET'S BEGIN about 2s

Intro should contain only necessary fixed information:
- KidMotion/theme label
- workout title
- number of poses + 20 SEC EACH
- FOLLOW ALONG

Do not add many slogans, repeated descriptions or narration-style text blocks.

## VOICE — INTRO ONLY
Current hard rule:
ONLY Scene 01 Intro may contain spoken Voice.
Target roughly 6–8 seconds.

After Intro, everything is silent:
- Safety silent
- LET'S BEGIN silent
- Exercises silent
- Rest silent
- Outro silent

Do not announce exercise names.
Do not read the instruction cloud aloud.
Do not add motivational filler during holds.

## No subtitles
Never create automatic captions, word-for-word Voice text, transcript bars, subtitle boxes, karaoke text or centered narration sentences.

## Reference workflow
1. Use approved master character to create Cover `Bild 00`.
2. Create Intro `Bild 01` with the episode outfit/world.
3. Approve `Bild 01`.
4. Use `Bild 01` as PRIMARY visual continuity reference for every later generated image.

## Current exercise format
Use static standing HOLD poses only in the current phase.
Every exercise must be understandable from one still image and last exactly 20 seconds.

## Google Flow exercise responsibility
Every exercise image must already contain:
- exercise title bottom-left
- short instruction top-right in KidMotion white cloud/info bubble

Do NOT bake into exercise images:
- subtitles
- transcript bars
- timer
- progress bar

## Remotion exercise responsibility
Remotion adds ONLY:
- 20-second timer top-left
- progress bar bottom
- exact scene timing

Remotion must not duplicate the title or instruction already generated inside the exercise image.

## Rest
Use next exercise image full-screen.
Remotion adds only REST + countdown.
No NEXT pose-name overlay.
Rest is silent.

# REQUIRED EPISODE OUTPUT
Create:
1. topic / angle
2. final YouTube title
3. chosen single character
4. locked outfit/world
5. full timeline
6. 10–12 static hold exercises
7. short instruction for each exercise
8. ONE short Intro Voice text only
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
2. Intro — `Bild 01` + minimal fixed Remotion opening + ONLY Voice
3. Safety — `Bild 02` + Safety panel, silent
4. LET'S BEGIN — `Bild 03` + start graphic, silent
5. Exercises — matching images, 20s each, silent
6. Rest — next exercise image + REST/countdown, silent
7. Outro — final image + GREAT JOB, silent

# IMAGE NUMBERING
Image number equals chronological scene number.

# PER-PROMPT METADATA
Every individual generated-image prompt begins with:
```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — NAME
FINAL FILE NAME: Bild XX.png
```

and ends with:
```text
After generation immediately rename to: Bild XX.png
```

# GOOGLE FLOW WORKFLOW
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch several episode images and never delay renaming.

After all images are finished and validated, place them together in:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Audio goes in:
`public/00-audio/`

Current standard normally needs only `Voice 01.mp3`.

# PUBLISHING
Create exactly ONE English cross-platform caption with exactly 5 hashtags including `#KidMotion`.

Also create:
- YouTube title
- description
- keywords/search phrases
- playlist recommendation
- thumbnail text/concept

# FINAL OBJECTIVE
The user should only need to:
1. generate the prepared images one by one
2. rename each immediately
3. stage the images
4. optionally add the one Intro Voice file
5. activate the episode
6. run the safe Remotion render
7. upload using the prepared publishing package

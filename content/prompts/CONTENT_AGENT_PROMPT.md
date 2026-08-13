# KidMotion Content Agent Prompt — Current Standard

Read `PROJECT_BRAIN.md` first, then the active `gehirn/*` rules.

Your task is to turn a SPORT / FITNESS topic into a complete English KidMotion YouTube production package using static Google Flow / Antigravity images and Remotion.

# HARD RULES

## One character per video
Choose exactly ONE approved KidMotion character for the complete episode: boy OR girl.
Use that exact character throughout the video. Never switch characters and never add a second visible child/person.

## Every visible section uses that character image
Current standard:
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
2. Use the approved master character to create clean Intro `Bild 01` with the episode outfit/world.
3. Approve `Bild 01`.
4. Use `Bild 01` as the PRIMARY visual continuity reference for every later generated image.

## No subtitles
Never create:
- automatic captions
- word-for-word voice text
- transcript bars
- subtitle boxes
- karaoke text
- centered sentence copies of narration
- Intro text that appears phrase-by-phrase in sync with the narration

The Intro uses a FIXED branded title graphic independent from the spoken sentence.

Allowed intentional Remotion UI:
- fixed Intro title + short descriptor
- Safety panel
- LET'S BEGIN graphic
- exercise title bottom-left
- short instruction upper-right
- timer top-left
- progress bar bottom
- REST / NEXT
- outro title

## Current exercise format
Use static standing HOLD poses only in the current phase.
Every exercise must be understandable from one still image and last exactly 20 seconds.
Do not default to repeated-motion exercises.

## Clean image generation
Except for Cover, normal generated images contain only:
- same episode character
- correct pose
- same outfit
- same world
- 16:9 composition

Do NOT bake into normal images:
- title
- instruction
- subtitles
- transcript text
- timer
- progress bar
- UI

## Remotion exercise layout
- title bottom-left
- short instruction upper-right in KidMotion cloud/info bubble
- circular 20-second timer top-left
- progress bar bottom
- do not cover face, hands, feet or important joints

Final exercise frame:
- timer = 0
- progress = 100%

## Voice only when needed
Voice does not run continuously.
Typical exercise:
- first ~2–4 seconds: short cue
- remaining hold time: silence

Never shorten a scene to match audio and never stretch voice to fill time.
Rest is silent by default.

# REQUIRED EPISODE OUTPUT
Create:
1. topic / angle
2. final YouTube title
3. chosen single character
4. locked outfit/world
5. full timeline
6. 10–12 static hold exercises
7. short instruction for each exercise
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
2. Intro — `Bild 01` + fixed Remotion title graphic
3. Safety — `Bild 02` + Safety panel
4. LET'S BEGIN — `Bild 03` + start graphic
5. Exercises — matching images, 20s each
6. Rest — next exercise image + Rest UI
7. Outro — final image + GREAT JOB

Current long-form target: at least about 5 minutes.

# IMAGE NUMBERING
Image number equals chronological scene number. Current normal episodes use continuous image numbering for actual scenes.

Example:
- Cover = `Bild 00.png`
- Intro = `Bild 01.png`
- Safety = `Bild 02.png`
- LET'S BEGIN = `Bild 03.png`

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

These are active-episode staging folders. Never mix episodes.

# IMAGE PROMPT REQUIREMENTS
Each prompt specifies:
- exact approved episode character reference
- exact static pose
- same outfit/world
- 16:9
- full body visible when needed
- overlay-safe negative space
- no other people
- no third-party logos
- no copyrighted characters
- no generated video UI except Cover text

# VOICE PACKAGE
`ALL_VOICE_TEXTS.md` contains only useful spoken cues in timeline order.
No subtitles or voice captions.

# PUBLISHING
Create exactly ONE English cross-platform caption, reused wherever technically possible.
It must contain exactly 5 hashtags including `#KidMotion`.

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
4. generate/stage the needed voice clips
5. activate the episode
6. run the safe Remotion render
7. upload using the prepared publishing package

# KidMotion — Image Prompt Template

## Current image rule
Every actual video section uses an image with the same chosen episode character.

Standard:
- `Bild 00.png` Cover — thumbnail only
- `Bild 01.png` Intro
- `Bild 02.png` Safety
- `Bild 03.png` LET'S BEGIN
- exercise scenes = matching `Bild XX.png`
- Outro = final matching image

Rest reuses the NEXT exercise image and does not use a blank card.

## Character continuity
One episode uses exactly one main character.
Create clean `Bild 01.png`, approve it, then use `Bild 01` as the primary visual reference for every later generated image.

Keep the same face, hair, age appearance, proportions, outfit, world and 3D style.

## Clean image rule
Except for Cover, generated images contain only:
- same character
- required pose
- same outfit
- same world
- clean 16:9 scene

Do not generate:
- exercise title
- instruction text
- subtitles
- transcript bars
- timer
- progress bar
- video UI

Remotion adds intentional scene graphics later.

## Numbering
Current standard uses continuous chronological image numbering with no Safety gap.

Every prompt begins with:
```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — NAME
FINAL FILE NAME: Bild XX.png
```

and ends with:
```text
After generation immediately rename to: Bild XX.png
```

## Google Flow workflow
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch episode images.

## Exercise prompt
```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — [POSE NAME]
FINAL FILE NAME: Bild XX.png

Use approved Bild 01 as the PRIMARY visual reference.
Show exactly the same KidMotion episode character, outfit and world.

POSE:
[short exact body-position description]

Full body clearly visible.
Static hold pose.
Keep top-left, top-right, bottom-left and bottom edge clear enough for Remotion UI.

Generate only character, pose and environment.
No title, instruction, subtitles, transcript text, timer, progress bar or UI.

After generation immediately rename to: Bild XX.png
```

## Intro / Safety / Start / Outro
These scenes also show the same character. Leave useful negative space for the Remotion graphic. The generated image remains text-free except Cover.

## Remotion adds
- fixed Intro title graphic, independent from narration
- Safety panel
- LET'S BEGIN graphic
- exercise title bottom-left
- short instruction upper-right
- timer top-left
- progress bar bottom
- Rest / Next over next exercise image
- Outro graphic

No subtitles or Voice transcription.

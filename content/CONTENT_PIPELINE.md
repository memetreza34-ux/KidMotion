# KidMotion Content Pipeline — Current Standard

## Core model
KidMotion uses static generated 16:9 scene images, Google Flow / Antigravity for image creation and Remotion for timing, overlays, voice placement, transitions and final rendering.

Current active focus: SPORT / FITNESS.

## End-to-end workflow
1. choose topic
2. choose exactly ONE recurring KidMotion main character for the episode
3. lock episode outfit and world
4. build 10–12 static standing hold exercises
5. build exact timeline
6. write short English voice cues only where useful
7. create `REFERENCE_GUIDE.md`
8. create `ALL_IMAGE_PROMPTS.md`
9. create `ALL_VOICE_TEXTS.md`
10. create `data.json`
11. create one cross-platform caption + publishing metadata
12. create `RENDER_QA.md`
13. Google Flow / Antigravity generates images one at a time
14. every image is renamed immediately to its chronological `Bild XX.png`
15. after all images are checked, move them together into the active public image staging folder
16. user generates only required audio
17. Antigravity / Codex / Remotion assembles and renders the final video

# Character rule
One episode = one main character from Cover to Outro.
No boy/girl switching inside one episode.
No second visible child/person in the current standard format.

# Current exercise rule
Use static standing HOLD poses that work from one still image.
Every exercise lasts exactly 20 seconds.

Do not default to repetitive movements such as jumping jacks, burpees or running in place.

# Image generation responsibility
Except for Cover, normal Google Flow / Antigravity images contain only:
- same episode character
- correct static pose
- same outfit
- same world
- clean 16:9 scene

They contain NO:
- exercise name
- instruction text
- cloud/bubble
- subtitles
- timer
- progress bar
- countdown
- video UI

Cover `Bild 00.png` is the exception and contains the final thumbnail text.
Cover is not played in the rendered video.

# Remotion responsibility
Remotion handles:
- full scene timing
- intro text blocks + explicit cue timing
- Safety screen
- LET'S BEGIN text
- exercise title bottom-left
- short instruction cloud upper-right
- circular 20-second timer top-left
- bottom progress bar
- 5-second rest screens where defined
- transitions / subtle zoom or pan
- outro text
- short voice placement
- intentional silent gaps
- final render

Final-frame rule for every 20-second exercise:
- timer starts at 20
- timer reaches 0 on final frame
- progress reaches 100% on final frame

# No subtitles
No automatic subtitles, transcript boxes, word-for-word captions or karaoke text.
Intentional exercise/scene UI is not a subtitle.

# Voice workflow
A 5+ minute video does not require 5+ minutes of voice.

Typical exercise:
- first 2–4 seconds: short cue
- remaining hold: silence
- visual scene still continues until exact 20 seconds

Rest screens are normally silent.
Audio duration never shortens video duration.
Preferred: individual short voice clips for scenes that need speech.
A single master audio is allowed only if it has correct gaps or is split/positioned during assembly.

# Image numbering
Image number equals chronological scene number.
Remotion-only scenes keep their number reserved.

Example:
- `Bild 00.png` Cover
- `Bild 01.png` Intro
- Scene 02 Safety = no image
- `Bild 03.png` LET'S BEGIN

# Google Flow / Antigravity generation loop
Mandatory:
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch episode images.

After ALL required images are generated and validated, move them together into:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Audio for the active episode goes into:
`public/00-audio/`

These public folders are ACTIVE-EPISODE staging only. Never mix assets from multiple episodes.

# Publishing
Each episode gets exactly ONE English cross-platform caption, reused where technically possible.
The caption ends with exactly 5 hashtags and includes `#KidMotion`.

Also prepare:
- final YouTube title
- description
- search phrases / keywords
- playlist
- thumbnail text/concept

## Principle
The repository is the production brain. The user should only need to generate the prepared images/audio, place them correctly, then trigger assembly/rendering.

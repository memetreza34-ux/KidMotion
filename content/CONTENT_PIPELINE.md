# KidMotion Content Pipeline — Current Standard

## Core model
KidMotion uses static 16:9 generated scene images, Google Flow / Antigravity for image creation and Remotion for timing, overlays, audio placement and final rendering.

Current active focus: SPORT / FITNESS.

## End-to-end workflow
1. choose topic
2. choose exactly ONE KidMotion main character
3. lock episode outfit/world
4. build 10–12 static hold exercises
5. build exact timeline
6. write short English voice cues only where useful
7. create `REFERENCE_GUIDE.md`
8. create `ALL_IMAGE_PROMPTS.md`
9. create `ALL_VOICE_TEXTS.md`
10. create `data.json`
11. create one cross-platform caption + publishing metadata
12. create `RENDER_QA.md`
13. Google Flow generates images one at a time
14. rename every image immediately
15. validate character consistency and numbering
16. stage images/audio for the active episode
17. activate the episode
18. run safe Remotion render

## Character rule
One episode = one main character.
No boy/girl switching and no second visible person.

## Every visible video section uses a character image
- Cover = `Bild 00`, thumbnail only
- Intro = `Bild 01`
- Safety = `Bild 02`
- LET'S BEGIN = `Bild 03`
- exercise = matching image
- Rest = reuse NEXT exercise image
- Outro = matching final image

No blank/plain/text-only scene replaces the character.

## Reference workflow
Create clean `Bild 01` from the approved master character, approve it, then use it as the primary visual continuity reference for all later scene images.

## Exercise rule
Current phase uses static standing HOLD poses. Every exercise lasts exactly 20 seconds.

## Google Flow responsibility
Except for Cover, generated images contain only:
- same character
- correct pose
- same outfit
- same world
- clean 16:9 scene

No generated:
- exercise title
- instruction
- subtitles
- transcript bars
- timer
- progress bar
- video UI

## Remotion responsibility
Remotion handles:
- full timeline
- fixed Intro title graphic
- Safety panel over `Bild 02`
- LET'S BEGIN graphic over `Bild 03`
- exercise title bottom-left
- short instruction upper-right
- circular 20-second timer top-left
- bottom progress bar
- Rest UI over the next exercise image
- outro title over final image
- short voice placement
- silent gaps
- final render

Final exercise frame:
- timer reaches 0
- progress reaches 100%

## No subtitles
Never create:
- automatic subtitles
- transcript boxes
- word-for-word narration text
- centered sentence copies of voice
- karaoke text
- Intro text that appears phrase-by-phrase with narration

Fixed scene UI is not a subtitle.

## Voice workflow
A 5+ minute video does not require 5+ minutes of narration.
Typical exercise:
- first 2–4 seconds: short cue
- remaining hold: silence

Rest is normally silent.
Audio length never shortens video duration.

## Image numbering
Current normal episodes use continuous chronological image numbers:
`Bild 00.png`, `Bild 01.png`, `Bild 02.png`, `Bild 03.png`, etc.

## Google Flow loop
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch episode images.

## Active staging
Images:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Audio:
`public/00-audio/`

Only one episode's assets may be staged at a time.

## Publishing
Each episode gets exactly ONE English cross-platform caption with exactly 5 hashtags including `#KidMotion`.

Also prepare:
- YouTube title
- description
- keywords/search phrases
- playlist
- thumbnail text/concept

## Principle
The repository is the production brain. The user should only need to generate the prepared images/audio, stage them, then run the safe render pipeline.

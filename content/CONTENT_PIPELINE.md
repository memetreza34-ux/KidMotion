# KidMotion Content Pipeline — Current Standard

## Core model
KidMotion uses static 16:9 generated scene images, Google Flow / Antigravity for image creation and Remotion for timing, limited UI, audio placement and final rendering.

Current active focus: SPORT / FITNESS.

## End-to-end workflow
1. choose topic
2. choose exactly ONE KidMotion main character
3. lock episode outfit/world
4. build 10–12 static hold exercises
5. define exact exercise title + short instruction for each
6. build exact timeline
7. write short English voice cues only where useful
8. create `REFERENCE_GUIDE.md`
9. create `ALL_IMAGE_PROMPTS.md`
10. create `ALL_VOICE_TEXTS.md`
11. create `data.json`
12. create one cross-platform caption + publishing metadata
13. create `RENDER_QA.md`
14. Google Flow generates images one at a time
15. rename every image immediately
16. validate character consistency, title/instruction placement and numbering
17. stage images/audio for the active episode
18. activate the episode
19. run safe Remotion render

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
Create `Bild 01` from the approved master character, approve it, then use it as the primary visual continuity reference for all later scene images.

## Exercise rule
Current phase uses static standing HOLD poses. Every exercise lasts exactly 20 seconds.

## Google Flow responsibility
For exercise images Google Flow creates:
- same character
- correct pose
- same outfit/world
- exercise title bottom-left
- short instruction top-right in the KidMotion white cloud/info bubble

Exercise images must NOT contain:
- subtitles
- transcript bars
- timer
- progress bar
- duplicate title/instruction

## Remotion responsibility
Remotion handles:
- full timeline
- complete fixed Intro opening graphic
- Safety panel over `Bild 02`
- LET'S BEGIN graphic over `Bild 03`
- circular 20-second timer top-left
- bottom progress bar
- REST + countdown over the next exercise image
- outro title over final image
- short voice placement
- silent gaps
- final render

Remotion does NOT handle exercise title or exercise instruction.
Remotion does NOT add `NEXT: [pose name]` during Rest.

Final exercise frame:
- timer reaches 0
- progress reaches 100%

## Beginning
The Intro must contain enough fixed information to explain the workout immediately: brand, workout title, focus, number of poses, hold duration and follow-along cue.
It must not be word-for-word narration text.

## No subtitles
Never create automatic subtitles, transcript boxes, word-for-word narration text, centered sentence copies of voice or karaoke text.

## Voice workflow
A 5+ minute video does not require 5+ minutes of narration.
Typical exercise: short cue at start, then silence.
Audio length never shortens video duration.
Audio is currently secondary to visual QA.

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

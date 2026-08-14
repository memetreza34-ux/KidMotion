# KidMotion Episodes — Current Standard

Each produced video gets one folder under `content/episodes/` with:
- episode.md
- REFERENCE_GUIDE.md
- ALL_IMAGE_PROMPTS.md
- ALL_VOICE_TEXTS.md
- publishing.md
- data.json
- RENDER_QA.md
- ANTIGRAVITY_ASSEMBLY.md
- scenes/

## Current image sequence
Every actual video section uses an image with the same chosen episode character.

- Bild 00.png = Cover only, not in MP4
- Bild 01.png = Intro
- Bild 02.png = Safety
- Bild 03.png = Let's Begin
- following scene images = exercises
- final scene image = Outro

Rest reuses the NEXT exercise image full-screen so the character remains visible.

## No subtitles
Never add automatic captions, transcript bars, word-for-word Voice text or narration subtitles.
Intro uses complete fixed branded information independent from Voice.

## Exercise text responsibility
Google Flow exercise images themselves contain:
- exercise title bottom-left
- short instruction top-right in the KidMotion white cloud/info bubble

Remotion does NOT add or duplicate those.
During an exercise Remotion adds only:
- 20-second timer top-left
- progress bar bottom
- timing / optional audio placement

During Rest, because the next exercise image already contains its title/instruction, Remotion adds only REST + countdown.

## Asset staging
Images:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Audio:
`public/00-audio/`

Only one episode may be staged there at a time.

## Current exercise standard
- one main character per episode
- every hold exercise exactly 20s
- Google Flow owns exercise title/instruction
- Remotion owns timer/progress
- timer reaches 0
- progress reaches 100%
- Rest normally silent
- audio is optional during current visual QA
- one cross-platform caption with exactly 5 hashtags

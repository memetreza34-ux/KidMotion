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

Current normal episodes do not leave a Safety image gap.

Rest reuses the NEXT exercise image full-screen so the character remains visible.

## No subtitles
Never add automatic captions, transcript bars, word-for-word Voice text or phrase-by-phrase Intro narration text.
Intro uses a fixed branded title graphic independent from Voice.

## Asset staging
Images:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Audio:
`public/00-audio/`

Only one episode may be staged there at a time.

## Current exercise standard
- one main character per episode
- clean Google Flow scene images
- Remotion adds intentional UI
- every hold exercise exactly 20s
- timer reaches 0
- progress reaches 100%
- Rest normally silent
- short Voice never shortens a scene
- one cross-platform caption with exactly 5 hashtags

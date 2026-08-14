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

## Short opening
Current default:
- Intro about 8s
- Safety about 4s
- LET'S BEGIN about 2s

Keep Intro minimal: theme/channel label, workout title, pose count + 20 SEC EACH, FOLLOW ALONG.

## Voice — current hard rule
Only Intro may contain spoken Voice.
Target about 6–8 seconds.

Everything after Intro is silent:
- Safety
- LET'S BEGIN
- Exercises
- Rest
- Outro

Do not announce exercise names or read instructions aloud.

## No subtitles
Never add automatic captions, transcript bars, word-for-word Voice text or narration subtitles.
Intro graphics are fixed branded information independent from Voice.

## Exercise text responsibility
Google Flow exercise images themselves contain:
- exercise title bottom-left
- short instruction top-right in the KidMotion white cloud/info bubble

Remotion does NOT add or duplicate those.
During an exercise Remotion adds only:
- 20-second timer top-left
- progress bar bottom
- exact timing

During Rest, because the next exercise image already contains its title/instruction, Remotion adds only REST + countdown.

## Asset staging
Images:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Audio:
`public/00-audio/`

Only one episode may be staged there at a time.
Current standard normally needs only `Voice 01.mp3`.

## Current exercise standard
- one main character per episode
- every hold exercise exactly 20s
- Google Flow owns exercise title/instruction
- Remotion owns timer/progress
- timer reaches 0
- progress reaches 100%
- only Intro has Voice
- everything after Intro silent
- one cross-platform caption with exactly 5 hashtags

# KidMotion Episode Template — Current Standard

## Episode identity
- Episode ID:
- Topic:
- Final YouTube title:
- Main character: boy OR girl — exactly one for the complete episode
- Target runtime: at least about 5 minutes
- Format: 16:9 / 1920x1080
- Theme / world:
- Episode outfit:

## Hard rules
- one main character for the complete episode
- no second visible person
- same face, hair, age, proportions, outfit and world throughout
- every visible video section uses an image with that character
- no blank/plain scene replacing the character
- static hold poses in current phase
- every exercise exactly 20 seconds
- no subtitles / voice captions / transcript bars
- Intro is short, clean and necessary
- ONLY Intro may contain Voice
- every scene after Intro is silent
- timer reaches 0 and progress reaches 100%

## Short opening standard
Default current timing:
- Intro: about 8s
- Safety: about 4s
- LET'S BEGIN: about 2s

Intro contains only necessary fixed information:
- channel/theme label
- workout title
- number of poses + 20 SEC EACH
- FOLLOW ALONG

Do not overload the opening with slogans or repeated text.

## Voice standard
Only Scene 01 Intro may use Voice, typically about 6–8 seconds.

After Intro:
- Safety silent
- LET'S BEGIN silent
- Exercises silent
- Rest silent
- Outro silent

Do not announce pose names or read instructions aloud.

## Reference workflow
1. Create Cover `Bild 00` from the approved master character.
2. Create Intro `Bild 01` with the episode outfit/world.
3. Approve `Bild 01`.
4. Use `Bild 01` as the PRIMARY continuity reference for every later episode image.

## Numbering
- Cover = `Bild 00.png` — thumbnail only
- Intro = `Bild 01.png`
- Safety = `Bild 02.png`
- LET'S BEGIN = `Bild 03.png`
- exercises = matching `Bild XX.png`
- Outro = matching final `Bild XX.png`

## Standard timeline
| Scene | Purpose | Visual | Duration | Audio | Remotion |
|---|---|---|---:|---|---|
| 00 | Cover | Bild 00.png | thumbnail only | none | not in video |
| 01 | Intro | Bild 01.png | ~8s | short Intro Voice only | minimal fixed title info |
| 02 | Safety | Bild 02.png | ~4s | silent | Safety panel |
| 03 | LET'S BEGIN | Bild 03.png | ~2s | silent | start graphic |
| 04+ | Exercises | matching Bild XX.png | exactly 20s | silent | timer + progress only |
| rest | reuse NEXT exercise image | typically 5s | silent | REST + countdown |
| final | Outro | final Bild XX.png | ~4s | silent | GREAT JOB |

## Exercise plan
Use about 10–12 static hold poses. For every exercise define:
- scene number
- exercise name
- body position
- short instruction
- duration 20s
- rest after

## Google Flow exercise image
Each exercise image must directly contain:
- exercise title bottom-left
- short instruction top-right in KidMotion cloud

Do NOT generate:
- subtitles
- transcript bars
- timer
- progress bar

## Remotion exercise overlay
Remotion adds ONLY:
- circular 20-second timer top-left
- progress bar along bottom

Remotion must not duplicate the title or instruction already inside the image.

## Rest
Rest uses the next exercise image full-screen.
Remotion adds only REST + countdown.
No NEXT pose-name overlay.
No Voice.

## No-subtitle definition
Forbidden:
- automatic captions
- word-for-word voice text
- subtitle bars
- centered sentence copies of narration
- karaoke text

## Image prompt pack
Every individual prompt begins with:
```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — NAME
FINAL FILE NAME: Bild XX.png
```

and ends with:
```text
After generation immediately rename to: Bild XX.png
```

## Google Flow loop
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch multiple episode images.

## Active staging
- images: `public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`
- audio: `public/00-audio/`

Stage only ONE episode at a time.
Under the current format, only `Voice 01.mp3` is normally needed.

## Publishing
Exactly ONE cross-platform English caption with exactly 5 hashtags, including `#KidMotion`.

Also create:
- YouTube title
- description
- keywords/search phrases
- playlist
- thumbnail text/concept

## Required files
```text
content/episodes/KM-XXX-slug/
├── episode.md
├── REFERENCE_GUIDE.md
├── ALL_IMAGE_PROMPTS.md
├── ALL_VOICE_TEXTS.md
├── publishing.md
├── data.json
├── RENDER_QA.md
├── ANTIGRAVITY_ASSEMBLY.md
└── scenes/
```

## Render checklist
- [ ] same one character in every video section
- [ ] Cover not played inside video
- [ ] opening short and uncluttered
- [ ] only Intro contains Voice
- [ ] everything after Intro silent
- [ ] no subtitles / transcript bars
- [ ] exercise title/instruction come from Google Flow image
- [ ] Remotion does not duplicate exercise text
- [ ] every exercise exactly 20s
- [ ] timer reaches 0
- [ ] progress reaches 100%
- [ ] Rest uses next exercise image + REST/countdown only
- [ ] one caption with exactly 5 hashtags

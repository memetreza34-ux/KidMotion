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
- Intro text is a fixed branded title graphic, not phrase-by-phrase voice text
- voice only when useful
- audio duration never controls video duration
- timer reaches 0 and progress reaches 100%

## Reference workflow
1. Create Cover `Bild 00` from the approved master character.
2. Create clean Intro `Bild 01` with the episode outfit/world.
3. Approve `Bild 01`.
4. Use `Bild 01` as the PRIMARY continuity reference for every later episode image.

## Numbering
Current standard uses a generated image for every actual scene:
- Cover = `Bild 00.png` — thumbnail only
- Intro = `Bild 01.png`
- Safety = `Bild 02.png`
- LET'S BEGIN = `Bild 03.png`
- exercises = matching `Bild XX.png`
- Outro = matching final `Bild XX.png`

No gap in normal current episodes.

## Standard timeline
| Scene | Purpose | Visual | Duration | Remotion |
|---|---|---|---:|---|
| 00 | Cover | Bild 00.png | thumbnail only | not in video |
| 01 | Intro | Bild 01.png | 8–15s | fixed title + short descriptor |
| 02 | Safety | Bild 02.png | 4–5s | Safety panel |
| 03 | LET'S BEGIN | Bild 03.png | 2–3s | start graphic |
| 04+ | Exercises | matching Bild XX.png | exactly 20s | title + instruction + timer + progress |
| rest | reuse NEXT exercise image | typically 5s | REST + timer + NEXT |
| final | Outro | final Bild XX.png | 4–6s | GREAT JOB |

Rest is normally silent.

## Exercise plan
Use about 10–12 static hold poses. For every exercise define:
- scene number
- exercise name
- body position
- short instruction
- duration 20s
- rest after
- short voice cue if useful

## Image generation
Except for Cover, Google Flow / Antigravity creates clean images containing only:
- same episode character
- correct pose
- same outfit
- same world
- 16:9 composition

Do NOT generate:
- exercise title
- instruction text
- subtitles
- transcript bars
- timer
- progress bar
- UI

## Remotion overlay layout
Exercise scene:
- title bottom-left
- short instruction upper-right
- circular 20-second timer top-left
- progress bar along bottom

Keep face, hands, feet and important joints unobstructed.

## No-subtitle definition
Forbidden:
- automatic captions
- word-for-word voice text
- subtitle bars
- centered sentence copies of narration
- karaoke text
- phrase-by-phrase narration text in Intro

Allowed intentional UI:
- fixed Intro title/descriptor
- Safety panel
- LET'S BEGIN
- exercise title/instruction
- timer/progress
- REST/NEXT
- outro title

## Voice
English only. Speak only when needed.
Typical exercise:
- first ~2–4s short cue
- remaining time silent

Never shorten or stretch a scene to match voice length.

## Image prompt pack
Every individual prompt must directly state:
```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — NAME
FINAL FILE NAME: Bild XX.png
```

and end with:
```text
After generation immediately rename to: Bild XX.png
```

## Google Flow loop
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch multiple episode images.

After all images are validated, place them together in:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

## Active staging
- images: `public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`
- audio: `public/00-audio/`

Stage only ONE episode at a time.

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
- [ ] Safety has its own character image
- [ ] Rest uses next exercise image, never blank screen
- [ ] no subtitles / transcript bars
- [ ] Intro is fixed title graphic, not narration text
- [ ] all exercise images clean
- [ ] every exercise exactly 20s
- [ ] title bottom-left
- [ ] instruction upper-right
- [ ] timer reaches 0
- [ ] progress reaches 100%
- [ ] voice only where useful
- [ ] silent gaps preserved
- [ ] one caption with exactly 5 hashtags

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
- voice only when useful
- audio duration never controls video duration
- timer reaches 0 and progress reaches 100%

## Beginning
The Intro must explain the workout clearly with fixed branded information while the character remains visible.
Do not use word-for-word narration text.
Typical opening information:
- Welcome / KidMotion brand
- workout title
- short workout focus
- number of poses
- 20 seconds each
- follow-along / have-fun cue

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
| Scene | Purpose | Visual | Duration | Remotion |
|---|---|---|---:|---|
| 00 | Cover | Bild 00.png | thumbnail only | not in video |
| 01 | Intro | Bild 01.png | 8–15s | complete fixed opening graphic |
| 02 | Safety | Bild 02.png | 4–5s | Safety panel |
| 03 | LET'S BEGIN | Bild 03.png | 2–3s | start graphic |
| 04+ | Exercises | matching Bild XX.png | exactly 20s | timer + progress ONLY |
| rest | reuse NEXT exercise image | typically 5s | REST + countdown ONLY |
| final | Outro | final Bild XX.png | 4–6s | GREAT JOB |

## Exercise plan
Use about 10–12 static hold poses. For every exercise define:
- scene number
- exercise name
- body position
- short instruction
- duration 20s
- rest after
- short voice cue if useful

## HARD RULE — Google Flow owns exercise name + instruction
For every exercise image, Google Flow directly creates:
- exercise title bottom-left
- short instruction top-right in KidMotion white cloud/info bubble

The exercise image must NOT contain:
- subtitles
- transcript bars
- timer
- progress bar
- duplicate title/instruction

Keep top-left clear for timer and bottom edge clear for progress.

## HARD RULE — Remotion does not duplicate exercise text
During exercises Remotion adds only:
- circular 20-second timer top-left
- progress bar bottom
- exact timing
- optional audio placement

Remotion must not add exercise title, description or instruction cloud.

## Rest
Rest reuses the NEXT exercise image full-screen.
Because that image already contains its title/instruction, Remotion adds only:
- REST
- countdown

No `NEXT: [POSE NAME]` overlay from Remotion.

## No-subtitle definition
Forbidden:
- automatic captions
- word-for-word voice text
- subtitle bars
- centered sentence copies of narration
- karaoke text

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

Exercise prompts must also explicitly include the exact title and exact short instruction to be generated in the image.

## Google Flow loop
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

After all images are validated, place them together in:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

## Active staging
- images: `public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`
- audio: `public/00-audio/`

Stage only ONE episode at a time.

## Publishing
Exactly ONE cross-platform English caption with exactly 5 hashtags, including `#KidMotion`.

## Render checklist
- [ ] same one character in every video section
- [ ] Cover not played inside video
- [ ] no blank scenes
- [ ] no subtitles / transcript bars
- [ ] Intro explains the workout completely
- [ ] each exercise image already contains exactly one title + one instruction cloud from Google Flow
- [ ] Remotion adds no exercise title/instruction
- [ ] every exercise exactly 20s
- [ ] timer reaches 0
- [ ] progress reaches 100%
- [ ] Rest shows next exercise image + REST/countdown only
- [ ] voice only where useful
- [ ] one caption with exactly 5 hashtags

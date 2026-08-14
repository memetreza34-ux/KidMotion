# KidMotion

KidMotion is an original English-language kids movement and fitness brand built around two recurring premium 3D character identities: one boy and one girl.

## Current active phase
SPORT / FITNESS long-form videos using static HOLD poses.

## Core model
- YouTube long-form first
- 16:9 / 1920x1080
- static AI-generated scene images
- Google Flow / Antigravity for image production
- Remotion for timing, limited scene UI, rests, audio placement and final rendering
- current target: at least about 5 minutes
- typical episode: about 10–12 exercises
- every hold exercise: exactly 20 seconds

## One video = one main character
A normal episode selects exactly ONE KidMotion character.
Do not switch boy/girl and do not add a second visible person.
Lock face, age, hair, skin tone, body proportions, episode outfit and world.

## Every actual video section uses that character image
- `Bild 00.png` Cover — thumbnail only, not in MP4
- `Bild 01.png` Intro
- `Bild 02.png` Safety
- `Bild 03.png` LET'S BEGIN
- exercise scenes = matching chronological images
- Rest = reuse the NEXT exercise image
- Outro = matching final image

No blank/plain/text-only scene replaces the character.

## No subtitles
Never add automatic captions, transcript bars, word-for-word Voice text, karaoke text or centered narration sentences.

The Intro uses fixed branded information independent from narration.

## Beginning
The opening must immediately explain the workout while the episode character remains visible.
For KM-001 the Intro contains:
- WELCOME TO
- KIDMOTION FOOTBALL
- 5 MIN FOOTBALL TRAINING
- BALANCE • CONTROL • STRONG POSITIONS
- 12 POSES
- 20 SEC EACH
- FOLLOW ALONG
- COPY • HOLD • HAVE FUN

## Google Flow exercise rule
For exercise images Google Flow itself creates the final:
- exercise title bottom-left
- short instruction top-right in a KidMotion white cloud/info bubble

Exercise source images must NOT contain subtitles, transcript bars, timer or progress bar.

Reference workflow:
1. create Cover `Bild 00`
2. create Intro `Bild 01`
3. approve `Bild 01`
4. use `Bild 01` as the primary visual reference for later scene images

Generate images one by one:
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

## Remotion exercise rule
During exercise scenes Remotion adds ONLY:
- circular 20-second timer top-left
- progress bar bottom
- exact scene timing
- optional audio placement

Remotion must NOT create or duplicate exercise names or descriptions.

During Rest, Remotion reuses the next exercise image and adds only REST + countdown. No Remotion `NEXT: [pose name]` text.

## Voice
Voice is used only when useful.
A short cue at the start of a 20-second exercise does not shorten the scene. The remaining hold time stays silent.
Audio length never controls video length.
Audio is currently secondary to visual QA.

## Active episode workflow
Active episode pointer:
`content/ACTIVE_EPISODE.json`

Activate an episode:
```bash
npm run kidmotion:activate -- --episode=KM-XXX-slug
```

Stage only that episode's assets in:
- images: `public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`
- audio: `public/00-audio/`

## Safe render
```bash
npm run render:safe
```

## Canonical memory
Read `PROJECT_BRAIN.md` first.

## Current reference episode
`KM-001-football-balance-training`

Reference rules:
- same KidMotion boy in every video image from `Bild 01` through `Bild 16`
- Safety uses `Bild 02`
- exercise images 04–15 already contain title + instruction from Google Flow
- Remotion adds no exercise title/instruction
- Rest reuses next exercise image and adds only REST/countdown
- no subtitles / transcript bars
- complete fixed Intro graphic
- 12 exercises × 20 seconds
- total 5:20

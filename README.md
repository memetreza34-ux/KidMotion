# KidMotion

KidMotion is an original English-language kids movement and fitness brand built around two recurring premium 3D character identities: one boy and one girl.

## Current active phase
SPORT / FITNESS long-form videos using static HOLD poses.

## Core model
- YouTube long-form first
- 16:9 / 1920x1080
- static AI-generated scene images
- Google Flow / Antigravity for image production
- Remotion for timing, intentional scene UI, rests, audio placement and final rendering
- current target: at least about 5 minutes
- typical episode: about 10–12 exercises
- every hold exercise: exactly 20 seconds

## One video = one main character
A normal episode selects exactly ONE KidMotion character.
Do not switch boy/girl and do not add a second visible person.
Lock face, age, hair, skin tone, body proportions, episode outfit and world.

## Every actual video section uses that character image
Current standard:
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

The Intro uses a fixed branded title graphic independent from narration. It must not reveal Voice text phrase-by-phrase.

Allowed Remotion UI includes:
- fixed Intro title / descriptor
- Safety panel
- LET'S BEGIN
- exercise title bottom-left
- short instruction upper-right
- timer top-left
- progress bar bottom
- REST / NEXT
- GREAT JOB

## Google Flow
Except for Cover, generated scene images are clean and contain only the selected character, pose and episode world.

Reference workflow:
1. create Cover `Bild 00`
2. create clean Intro `Bild 01`
3. approve `Bild 01`
4. use `Bild 01` as the primary visual reference for later scene images

Generate images one by one:
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

## Voice
Voice is used only when useful.
A short cue at the start of a 20-second exercise does not shorten the scene. The remaining hold time stays silent.
Audio length never controls video length.

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

Never mix two episodes in these staging folders.

## Safe render
```bash
npm run render:safe
```

This runs typecheck, preflight and final `KidMotionVideo` render.

## Canonical memory
Read `PROJECT_BRAIN.md` first.

## Current reference episode
`KM-001-football-balance-training`

Reference rules:
- same KidMotion boy in every video image from `Bild 01` through `Bild 16`
- Safety uses `Bild 02`
- Rest reuses the next exercise image
- no subtitles / transcript bars
- fixed Intro graphic, not narration captions
- 12 exercises × 20 seconds
- total 5:20

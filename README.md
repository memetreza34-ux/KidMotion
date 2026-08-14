# KidMotion

KidMotion is an original English-language kids movement and fitness brand built around two recurring premium 3D character identities: one boy and one girl.

## Current active phase
SPORT / FITNESS long-form videos using static HOLD poses.

## Core model
- YouTube long-form first
- 16:9 / 1920x1080
- static AI-generated scene images
- Google Flow / Antigravity for image production
- Remotion for timing, timer/progress, rests, opening/safety graphics and final rendering
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

## Short opening
Current default opening:
- Intro about 8s
- Safety about 4s
- LET'S BEGIN about 2s

The Intro should use only the necessary fixed information and stay visually clean.

## Voice — Intro only
Current hard rule:
**Only the Intro may contain spoken Voice.**

After Intro the whole video is silent:
- Safety
- LET'S BEGIN
- Exercises
- Rest
- Outro

A 5+ minute KidMotion video may therefore contain only about 6–8 seconds of spoken audio.
Do not announce pose names or read exercise instructions aloud.

## No subtitles
Never add automatic captions, transcript bars, word-for-word Voice text, karaoke text or centered narration sentences.

## Google Flow
Reference workflow:
1. create Cover `Bild 00`
2. create Intro `Bild 01`
3. approve `Bild 01`
4. use `Bild 01` as the primary visual reference for later scene images

For exercise images, Google Flow itself creates:
- exercise title bottom-left
- short instruction top-right in the KidMotion cloud

Google Flow does not create timer or progress bar.

Generate images one by one:
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

## Remotion
During exercises Remotion adds only:
- circular 20-second timer top-left
- progress bar bottom

Remotion must not duplicate the exercise title or instruction already inside the Google Flow image.

Rest uses the next exercise image and adds only REST + countdown.

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

Current audio standard normally requires only `Voice 01.mp3`.

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
- exercise title/instruction come from Google Flow image
- Remotion exercise overlay = timer + progress only
- Voice only in Intro
- Intro 8s / Safety 4s / LET'S BEGIN 2s / Outro 4s
- 12 exercises × 20 seconds
- total 5:13

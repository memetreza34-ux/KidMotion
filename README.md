# KidMotion

KidMotion is an original English-language kids movement and fitness brand built around two recurring premium 3D character identities: one boy and one girl.

## Current active phase
Current production focus: **SPORT / FITNESS long-form videos using static HOLD poses.**

Education and more complex movement formats are documented for later but are currently inactive.

## Core production model
- YouTube long-form first
- 16:9 / 1920x1080
- static AI-generated scene images
- Google Flow / Antigravity for image production
- Remotion for timeline, text/UI, timers, progress, rests, audio placement and final rendering
- current long-form target: at least about 5 minutes
- typical current episode: about 10–12 exercises
- every normal hold exercise: exactly 20 seconds

## Character rule
KidMotion has two recurring characters overall, but a normal episode selects exactly ONE of them.

**ONE VIDEO = ONE MAIN CHARACTER FROM COVER TO OUTRO.**

Within an episode:
- do not switch boy/girl
- do not add another child/person
- lock face, age, hair, skin tone, body proportions and 3D style
- lock the episode-specific outfit and world

The other recurring KidMotion character can lead another episode.

## Image / Remotion split
Except for the Cover, normal Google Flow video-scene images are CLEAN and contain no exercise text/UI.

Google Flow / Antigravity provides:
- selected episode character
- correct static pose
- episode outfit/world
- clean 16:9 image

Remotion adds directly on top of the image:
- exercise title bottom-left
- short instruction upper-right in the KidMotion white cloud/info bubble
- circular 20-second timer top-left
- progress bar along the bottom

No automatic subtitles or voice captions.

## Voice rule
Voice is used only when useful.
A 5+ minute workout may contain only roughly 45–75 seconds of spoken audio.
Short exercise cues play near the start; the rest of the 20-second hold stays silent while the visual timeline continues.

Audio length never controls video length.

## Google Flow generation rule
Generate episode images one by one:

`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Image number = chronological scene number.
Remotion-only scene numbers stay reserved.

## Canonical project memory
Read [`PROJECT_BRAIN.md`](PROJECT_BRAIN.md) first.
It is the source of truth for all current production decisions.

Important supporting files:
- [`gehirn/CHARACTERS.md`](gehirn/CHARACTERS.md)
- [`characters/CHARACTER_BIBLE.md`](characters/CHARACTER_BIBLE.md)
- [`gehirn/VIDEO-REGELN.md`](gehirn/VIDEO-REGELN.md)
- [`gehirn/IMAGE-PROMPT-TEMPLATE.md`](gehirn/IMAGE-PROMPT-TEMPLATE.md)
- [`gehirn/VOICE-REGELN.md`](gehirn/VOICE-REGELN.md)
- [`gehirn/CAPTION-REGELN.md`](gehirn/CAPTION-REGELN.md)

## Current reference episode
`KM-001-football-balance-training`

Current corrected reference workflow:
- one KidMotion boy for the whole episode
- 12 standing hold exercises × 20 seconds
- Cover is thumbnail only
- Safety is Remotion-only
- clean Google Flow scene images
- all exercise text/UI from Remotion
- no subtitles
- short voice cues + intentional silence
- approximately 5:20 total runtime

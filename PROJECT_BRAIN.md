# KidMotion — Project Brain

Canonical current rules for KidMotion.

## Current focus
English SPORT / FITNESS long-form videos using static Google Flow images and Remotion.

## One video = one character
KidMotion has a boy and girl overall, but each episode chooses exactly ONE main character. That exact character stays consistent through the complete episode. No switching and no second visible person.

## Every visible video section uses the character image
Current standard:
- Cover `Bild 00` = thumbnail only, not in MP4
- Intro `Bild 01`
- Safety `Bild 02`
- LET'S BEGIN `Bild 03`
- exercises = matching `Bild XX`
- Rest = reuse the NEXT exercise image full-screen
- Outro = matching final image

Do not use blank, plain, text-only or gradient-only screens for Intro, Safety, Rest, Start or Outro.

## No subtitles — hard rule
Never display spoken audio as text.
Forbidden:
- automatic captions
- word-for-word voice transcription
- subtitle bars
- transcript boxes
- karaoke text
- centered sentence copies of the voice

The Intro must not behave like a transcript. Intro graphics are fixed branded information, independent from narration.

## Opening — short, necessary, clean
The beginning must explain the workout quickly and then move on.

Current timing target:
- Intro about 8s
- Safety about 4s
- LET'S BEGIN about 2s

KM-001 Intro shows only the necessary fixed information:
- `KIDMOTION FOOTBALL`
- `5 MIN FOOTBALL TRAINING`
- `12 POSES • 20 SEC EACH`
- `FOLLOW ALONG`

Do not add extra slogans, repeated information or many text blocks.

## Voice — ONLY in the Intro
HARTE REGEL:
The only spoken voice in the current KidMotion format is the short Intro voice.

After Intro ends, the rest of the entire video is silent:
- Safety: no voice
- LET'S BEGIN: no voice
- Exercises: no voice
- Rest: no voice
- Outro: no voice

A 5+ minute video may therefore contain only about 6–8 seconds of speech.

KM-001 example Intro voice:
`Hi, KidMotion friends! Twelve football poses, twenty seconds each. Find some space and follow along!`

## Google Flow responsibility
Google Flow creates the actual episode scene images and preserves the same chosen character, outfit, world and 3D identity.

Reference workflow:
1. create Cover `Bild 00` from the approved master character
2. create Intro `Bild 01` from the approved master character
3. approve `Bild 01`
4. use `Bild 01` as the primary visual continuity reference for `Bild 02` through the final image

### Exercise images — HARD RULE
For every normal exercise image, Google Flow itself places:
- exercise name at BOTTOM-LEFT
- one short execution instruction at TOP-RIGHT inside the KidMotion white cloud/info bubble

The source image therefore already contains the final exercise title and instruction.

Exercise images must NOT contain:
- subtitles or transcript bars
- timer
- progress bar
- duplicate exercise title
- duplicate instruction

## Remotion responsibility
For exercise scenes, Remotion must NOT generate the exercise name or exercise description.
Remotion adds only:
- 20-second timer at top-left
- progress bar along bottom
- scene timing

For other sections Remotion may add intentional UI:
- minimal Intro branded information
- Safety panel
- LET'S BEGIN graphic
- REST + rest countdown
- GREAT JOB / completion graphic

During Rest, the NEXT exercise image is shown full-screen. Because that image already contains its Google Flow title/instruction, Remotion must not add `NEXT: [pose name]` or another pose description.

## Exercise timing
Current format uses static hold poses. Every exercise lasts exactly 20 seconds. Typical Rest = 5 seconds. Timer reaches 0 and progress reaches 100%.

## Google Flow generation workflow
Generate exactly one image at a time and rename it immediately before continuing:
`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

## Publishing
Exactly one cross-platform English caption per episode with exactly 5 hashtags including `#KidMotion`.

## KM-001 reference
- same approved boy in every video image from `Bild 01` through `Bild 16`
- `Bild 02` is the Safety image
- exercise images `Bild 04`–`Bild 15` contain their own Google Flow title + instruction cloud
- Remotion does not duplicate pose names/descriptions
- Rest reuses the next exercise image and adds only REST + countdown
- only Intro has Voice; everything after Intro is silent
- Intro 8s, Safety 4s, LET'S BEGIN 2s, Outro 4s
- 12 exercises × 20s
- 11 rests × 5s
- total 313s / 5:13

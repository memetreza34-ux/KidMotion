# KidMotion Content Pipeline

This document defines how KidMotion episodes are created from idea to final Remotion render.

## Core production model

KidMotion uses static generated images as the primary visual source. The user creates the images and audio manually using the prompts and scripts stored in the repository. Remotion then assembles the final video with timers, progress bars, labels, transitions, voiceover, sound effects and music.

## End-to-end workflow

1. Topic research
2. Topic selection
3. Episode concept
4. Exercise / learning structure
5. English script and voice text
6. Scene list
7. Image prompts for every required still image
8. Thumbnail concept and thumbnail prompt
9. User generates images externally
10. User generates voice/audio externally
11. Assets are placed into the episode folder
12. Episode data is added to Remotion
13. Remotion renders the final video
14. YouTube metadata is prepared

## Topic research rules

A KidMotion topic should satisfy as many of these as possible:

- understandable for children
- useful to parents
- works visually with still images
- strong participation element
- suitable for English-language audiences
- easy to repeat as a series
- safe and age-appropriate
- not dependent on copyrighted characters
- not dependent on continuous animation

Possible topic sources:

- evergreen kids fitness themes
- yoga / stretching themes
- school brain breaks
- seasonal topics
- sports basics
- educational movement
- animal movement
- adventure themes
- challenge formats
- search/trend research when available

## Script outputs required for every episode

Every episode package should contain:

- title
- concept summary
- target age
- estimated duration
- hook / intro voice text
- exercise-by-exercise voice text
- rest / transition voice text if needed
- outro voice text
- exact on-screen text
- timer lengths
- scene order

## Image prompt outputs required

Every required still image needs its own prompt.

Each prompt should specify:

- approved KidMotion character identity
- exact exercise / pose
- camera framing
- background / setting
- expression
- lighting
- composition
- where UI-safe empty space should remain
- no text inside generated image unless explicitly required
- no external logos
- no copyrighted characters

The approved character references and CHARACTER_BIBLE.md are mandatory inputs for prompt creation.

## Audio workflow

The repository provides the exact English voice text. The user generates the voice externally.

Recommended file naming:

- intro.wav
- exercise-01.wav
- exercise-02.wav
- rest-01.wav
- outro.wav

One combined narration file may also be used if timing is already fixed.

## Remotion responsibility

Remotion should handle:

- image placement
- scene timing
- countdown timers
- 3-2-1-GO sequences
- progress bars
- exercise labels
- instruction labels
- rest screens
- transitions
- zoom / pan motion on still images
- voiceover placement
- SFX placement
- music placement
- final render

## Principle

The repo should function as a production brain and factory specification.

The user should be able to open one episode folder and find everything needed to manually generate the images and audio, then place those assets back into the project for automated final assembly.

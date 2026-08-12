# KM-001 — Antigravity / Codex Assembly Instructions

Use this only AFTER the Google Flow images and voice audio are ready.

Read first:
1. `PROJECT_BRAIN.md`
2. this episode's `episode.md`
3. `data.json`
4. `ALL_VOICE_TEXTS.md`
5. `RENDER_QA.md`

# Inputs

## Images
Expected in:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Required:
`Bild 00.png, Bild 01.png, Bild 03.png, Bild 04.png, Bild 05.png, Bild 06.png, Bild 07.png, Bild 08.png, Bild 09.png, Bild 10.png, Bild 11.png, Bild 12.png, Bild 13.png, Bild 14.png, Bild 15.png, Bild 16.png`

There is intentionally no `Bild 02.png`.

## Audio
Preferred folder:
`public/00-audio/`

Preferred filenames:
`Voice 01.mp3` through `Voice 16.mp3` for scenes that need voice.
There is no requirement for rest-screen voice.

If the user supplies ONE master audio file instead of separate clips:
- inspect/split the spoken sections according to `ALL_VOICE_TEXTS.md`
- place each spoken cue at its intended scene start
- keep the silent waiting time in the video
- do NOT stretch the audio
- do NOT shorten the video to the audio length

# HARD VIDEO RULES

## Cover
`Bild 00.png` is thumbnail only.
DO NOT put it in the MP4 timeline.

## Character
The complete video uses the same approved KM-001 boy.
Do not add or switch characters.

## No subtitles
DO NOT generate:
- automatic captions
- word-for-word subtitles
- transcript boxes
- karaoke text

Intentional Remotion UI is allowed.

## Exercise text/UI
Google Flow exercise images are clean.
Remotion must place directly ON TOP of the image:
- exercise name bottom-left
- short instruction upper-right in white KidMotion cloud/info bubble
- circular 20-second timer top-left
- progress bar along bottom

## Timing
- Intro: 12s
- Safety: 5s
- LET'S BEGIN: 3s
- each of 12 exercises: EXACTLY 20s
- rest after Scenes 04–14: exactly 5s
- no rest after Scene 15
- Outro: 5s
- target total: 320s / 5:20

Audio length must never alter these scene durations.

# Exercise order
1. Football Ready Hold
2. Goalkeeper Squat Hold
3. Knee-Up Balance
4. Single-Leg Balance
5. Side Leg Hold
6. Standing Side Stretch
7. Calf Raise Hold
8. Wide Squat Hold
9. Side Lunge Hold
10. Forward Lunge Hold
11. Reach-Up Hold
12. Victory Balance

# Voice behavior
For exercises, voice is short and only at the beginning.
After the cue ends, leave the rest of the 20-second hold silent.

Do not add filler narration.

# Remotion implementation
Use the repository's `KidMotionVideo` composition.
Do not use the vertical `KidMotionShort` composition for this YouTube long-form episode.

The final render should use:
- 1920x1080
- 30fps
- 16:9

Before final rendering, confirm all referenced image and voice files exist.

# Final QA
Run every item in `RENDER_QA.md`.
If any item fails, fix it before accepting the MP4.

The final video must not be accepted if:
- it is shortened to match the voice
- any exercise is shorter than 20 seconds
- subtitles appear
- Cover appears inside the video
- exercise text is missing or placed as a generic centered subtitle
- character changes between scenes
- old exercises such as Kick Prep / Defender / Pass Prep / Sprint Start reappear

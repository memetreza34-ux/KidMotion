# KM-001 — Antigravity / Codex Assembly Instructions

Use this only AFTER the Google Flow images and voice audio are ready.

Read first:
1. `PROJECT_BRAIN.md`
2. this episode's `episode.md`
3. `REFERENCE_GUIDE.md`
4. `data.json`
5. `ALL_VOICE_TEXTS.md`
6. `RENDER_QA.md`

# Inputs

## Images
Expected in:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Required:
`Bild 00.png, Bild 01.png, Bild 03.png, Bild 04.png, Bild 05.png, Bild 06.png, Bild 07.png, Bild 08.png, Bild 09.png, Bild 10.png, Bild 11.png, Bild 12.png, Bild 13.png, Bild 14.png, Bild 15.png, Bild 16.png`

There is intentionally no `Bild 02.png`.

`Bild 00.png` is thumbnail only and must never be inserted into the MP4.

## Audio
Expected/preferred folder:
`public/00-audio/`

Preferred filenames:
`Voice 01.mp3` through `Voice 16.mp3` for the spoken scene cues.
There are NO rest-screen voice files for KM-001.

If the user supplies ONE master audio file instead of separate clips:
- identify the real spoken cue boundaries from `ALL_VOICE_TEXTS.md`
- split/extract or position each spoken cue at its intended scene start
- do not divide the master file into equal chunks blindly
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
`Bild 01.png` is the clean continuity reference for the later episode images.

## No subtitles
DO NOT generate:
- automatic captions
- word-for-word subtitles
- transcript boxes
- karaoke text
- centered subtitle-style copies of the voice

Intentional Remotion scene UI is allowed and required.

## Exercise text/UI
Google Flow exercise images are clean.
Remotion must place directly ON TOP of the image:
- exercise name bottom-left in KidMotion outlined athletic style
- short instruction upper-right in the KidMotion white cloud/info bubble
- circular 20-second timer top-left
- progress bar along bottom

Do not duplicate any generated text because normal Google Flow scene images must contain none.

## Timing — DO NOT INFER FROM AUDIO
Use the Remotion/workout data timeline:
- Intro: exactly 12s
- Safety: exactly 5s
- LET'S BEGIN: exactly 3s
- each of 12 exercises: EXACTLY 20s
- rest after Scenes 04–14: exactly 5s
- no rest after Scene 15
- Outro: exactly 5s
- final target: 320s / 5:20

Audio length must never alter these scene durations.

## Intro graphic cue timing
The intentional intro text blocks are NOT subtitles.
Use these cue windows:
- 0.0–2.3s → `HI, KIDMOTION FRIENDS!`
- 2.3–5.4s → `FOOTBALL TRAINING TODAY`
- 5.4–8.6s → `BALANCE • CONTROL • STRONG POSITIONS`
- 8.6–12.0s → `FIND SOME SPACE & FOLLOW ALONG`

## Exercise order
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
For exercises, voice is short and only at the beginning, normally roughly 3–4 seconds or less.
After the cue ends, leave the remainder of the 20-second hold silent.
All 5-second rest screens in KM-001 are silent.
Do not add filler narration.

# Remotion implementation
Use only the repository's active `KidMotionVideo` composition.
The old short/vertical composition has been removed from the active Remotion root to avoid accidental wrong-format rendering.

The final render must use:
- 1920x1080
- 30fps
- 16:9

# REQUIRED PRE-RENDER COMMAND
After staging the final images and audio, run:

```bash
npm run render:safe
```

This runs, in order:
1. TypeScript typecheck
2. `scripts/preflight.mjs`
3. the `KidMotionVideo` Remotion render

Do NOT bypass a failed typecheck or preflight.

The preflight verifies, among other things:
- required images/audio exist
- no accidental `Bild 02.png`
- no mixed-episode image/audio files are in staging
- exercise durations are 20s
- Cover is marked out of the video timeline
- subtitle/voice-caption settings are disabled
- KM-001 computes to 320 seconds

# Final technical checks
Before accepting the MP4:
- verify final duration is 320 seconds / about 5:20
- verify every exercise scene lasts exactly 20 seconds
- verify timer starts at 20 and reaches 0 on the final frame
- verify progress reaches 100% on the final frame
- verify no subtitle track or automatic subtitle graphics exist
- verify the Cover is absent from the MP4 timeline
- verify audio stops naturally after each short cue while the scene continues

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

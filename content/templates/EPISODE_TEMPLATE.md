# KidMotion Episode Template — Current Standard

## 1. Episode identity
- Episode ID:
- Topic:
- Final YouTube title:
- Main character: boy OR girl — exactly one for the complete episode
- Target age:
- Target runtime: at least about 5 minutes for current long-form phase
- Format: 16:9 / 1920x1080
- Theme / world:
- Episode outfit:

## 2. Locked episode rules
- one main character from Cover to Outro
- no second visible child/person
- same face, hair, age, proportions, outfit and world throughout
- static standing hold poses in current phase
- every exercise exactly 20 seconds
- no subtitles / voice captions
- voice only when useful
- audio duration never controls video duration
- timer reaches 0 on the final exercise frame
- progress reaches 100% on the final exercise frame

## 3. Reference workflow
1. Use approved KidMotion master reference for `Bild 00` Cover.
2. Use approved master reference for clean `Bild 01` Intro with the episode outfit/world.
3. After `Bild 01` is approved, use it as the PRIMARY continuity reference for later generated images.
4. Do not use the text-heavy Cover as the later primary reference when clean `Bild 01` exists.

## 4. Numbering
Scene number = image number.

Example:
- Cover = `Bild 00.png`
- Scene 01 = `Bild 01.png`
- Scene 02 Remotion-only = no `Bild 02.png`
- Scene 03 = `Bild 03.png`

Never compress numbering gaps.

## 5. Standard timeline
| Scene | Purpose | Image | Duration | Voice | Remotion |
|---|---|---|---:|---|---|
| 00 | Cover / thumbnail | Bild 00.png | thumbnail only | none | not in video |
| 01 | Intro | Bild 01.png | 8–15s | short | timed intro text blocks |
| 02 | Safety | no image | 4–5s | short optional | safety screen |
| 03 | LET'S BEGIN | Bild 03.png | 2–3s | optional | start text |
| 04+ | Exercises | matching Bild XX.png | exactly 20s each | short cue only | title + cloud + timer + progress |
| final | Outro | matching Bild XX.png | 4–6s | short | GREAT JOB text |

Rest between exercises: typically 5s and normally silent.

## 6. Exercise plan
Use about 10–12 clear static holds for current long-form phase.

For every exercise define:
- Scene number
- Exercise name
- Static body position
- Short instruction
- Duration: 20s
- Rest after
- Voice cue at start, if useful

## 7. Image-generation rule
Except for Cover, Google Flow / Antigravity creates CLEAN images only.

Normal video-scene image contains:
- same episode character
- correct static pose
- same episode outfit
- same world
- 16:9 composition

Normal video-scene image contains NO:
- exercise title
- instruction text
- cloud / bubble
- subtitles
- timer
- progress bar
- countdown
- UI

Remotion adds those elements later.

## 8. Remotion overlay layout
Exercise scene:
- exercise title bottom-left in KidMotion outlined athletic style
- short instruction upper-right in KidMotion white cloud / info bubble
- circular 20-second timer top-left
- progress bar along bottom

Keep face, hands, feet and important joints unobstructed.

Final frame:
- timer = 0
- progress = 100%

## 9. Voice
English only.
Speak only when needed.

Typical exercise:
- first ~2–4s: short cue
- remaining time until 20s: silence

Never fill the entire 20 seconds with narration just because the scene lasts 20 seconds.
Rest screens are silent by default.
No subtitles or voice captions.

## 10. Cover
`Bild 00.png` is thumbnail only and is not played in the video.
Cover must contain clear English text explaining the video.

## 11. Image prompt pack
Create `ALL_IMAGE_PROMPTS.md` in chronological order.

Every individual generated-image prompt MUST directly state:
```text
IMAGE NUMBER: Bild XX
SCENE: SCENE XX — NAME
FINAL FILE NAME: Bild XX.png
```

And end with:
```text
After generation immediately rename to: Bild XX.png
```

For a Remotion-only scene, explicitly document that no image is generated and its number stays reserved.

## 12. Google Flow agent workflow
Mandatory loop:

`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never generate multiple episode images at once.

Only after ALL images are generated, renamed and checked, move all finished images together into:
`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Do not distribute finished image binaries into individual scene folders.

## 13. Active-episode staging rule
Public staging folders:
- images: `public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`
- audio: `public/00-audio/`

Only ONE episode's assets may be staged there at a time because filenames such as `Bild 04.png` / `Voice 04.mp3` are reused.
Never mix two episodes.

## 14. Voice package
Create `ALL_VOICE_TEXTS.md` with only the voice actually needed.
Mark silent sections as `SILENCE / NO VOICE` when useful.

Preferred production: separate short clips per needed cue.
A single master audio file is allowed only if it already contains correct silence/gaps or is split/positioned by the assembly agent.

## 15. Publishing
Create exactly ONE cross-platform caption for YouTube, TikTok, Instagram, Facebook and other platforms when technically possible.

Caption requirements:
- English
- concise and engaging
- exactly 5 hashtags
- one hashtag is `#KidMotion`

Also include:
- final YouTube title
- YouTube description
- keywords/search phrases
- playlist recommendation
- thumbnail text/concept

Do NOT create separate platform captions or a second short-caption variant.

## 16. Recommended episode folder
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
    ├── 00-cover/
    ├── 01-intro/
    ├── 02-safety/
    ├── 03-lets-begin/
    ├── 04-exercise-01/
    ├── ...
    └── final-outro/
```

## 17. Render-ready checklist
- [ ] exactly one main character across episode
- [ ] Cover not played inside video
- [ ] scene/image numbering correct
- [ ] Remotion-only numbers stay reserved
- [ ] all exercise images clean with no baked-in video text/UI
- [ ] all exercises are static holds
- [ ] every exercise is exactly 20s
- [ ] Remotion exercise title visible bottom-left
- [ ] Remotion instruction cloud visible upper-right
- [ ] 20s timer visible and reaches 0
- [ ] progress bar visible and reaches 100%
- [ ] no subtitles / voice captions
- [ ] voice only where useful
- [ ] silent gaps preserved
- [ ] short audio never shortens a scene
- [ ] staging folders contain only this episode
- [ ] total long-form runtime reaches current ~5-minute minimum
- [ ] one cross-platform caption with exactly 5 hashtags
- [ ] no third-party logos / copyrighted characters

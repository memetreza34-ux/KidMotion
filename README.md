# KidMotion

KidMotion is an original English-language kids fitness YouTube project using premium stylized 3D characters, static one-frame HOLD poses, Google Flow images and Remotion assembly.

> `GEHIRN.md` is the highest-priority source of truth.

## Current format
- YouTube long-form only
- 16:9 / 1920×1080 / 30fps
- exactly ONE main character per episode
- static poses that are immediately understandable from one still image
- typical episode: 12 exercises
- every exercise: exactly 20s
- typical Rest: 5s
- standard runtime: 313s / 5:13

## Canonical episode structure
Episodes live under:
`episodes/KM-XXX-name/`

Each episode contains:
- `01-skript/` — one copy-ready Opening Voice paragraph
- `02-audio/` — `Voice 01.mp3` + `bg-music.mp3`
- `03-bilder/` — Google Flow images/prompts
- `04-data/` — `data.json`
- episode README + Antigravity + QA instructions

Do NOT create new episodes in legacy `content/episodes/`.

## Character rule
One video = exactly one recurring character.

The same character stays consistent through Intro, Safety, LET'S BEGIN, exercises, Rest backgrounds and Outro.
No second visible person.

## One-still clarity
Every exercise must work from exactly ONE still image.

Reject/replace a pose if:
- motion is required to understand it
- silhouette is unclear
- limbs overlap/hide important joints
- only a subtle micro-position makes the exercise different
- Google Flow still cannot depict it clearly after two serious attempts

## Image numbering
- `Bild 00.png` = Cover only; NEVER inside MP4
- `Bild 01.png` = Intro + PRIMARY character/world reference
- `Bild 02.png` = Safety
- `Bild 03.png` = LET'S BEGIN
- `Bild 04.png`–`Bild 15.png` = 12 exercise images
- `Bild 16.png` = Outro

## Google Flow responsibilities
### Exercise images
Google Flow creates directly in `Bild 04`–`Bild 15`:
- exercise name bottom-left
- one short instruction cloud top-right

After `Bild 04` is approved, use it as SECONDARY UI/LAYOUT reference for `Bild 05`–`Bild 15` so title/cloud styling stays consistent.

Exercise safe zones:
- top-left ~220×220 px clear for Remotion timer
- lowest ~90 px clear for Remotion progress

No thought-bubble dots, clipped titles, duplicate text, timer or progress baked into the images.

### Non-exercise images
`Bild 01`, `Bild 02`, `Bild 03`, `Bild 16` contain ZERO Google Flow text.
Remotion owns Intro/Safety/LET'S BEGIN/Outro graphics.

`Bild 16` must not contain GREAT JOB text.

### Prop rule
If a scene says no ball/prop: ZERO of that prop anywhere in frame.
If a scene uses one: EXACTLY ONE.
No stray background duplicates.

## Opening Voice
Exactly one spoken file:
`Voice 01.mp3`

It starts at 0s and may continue across the complete 14s opening:
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s

Target: about 11–14s.
It must end before exercise 1 starts.

After that:
- no exercise Voice
- no Rest Voice
- no Outro Voice
- no spoken countdown
- no subtitles/captions/transcripts

Every user-facing script is one continuous copy-ready paragraph.

## Background music
Final renders require `bg-music.mp3`:
- instrumental
- child-friendly / sporty-playful
- no lyrics or speech
- low under Opening Voice
- slightly louder afterward
- loop through the complete workout

## Remotion responsibilities
During exercises Remotion adds ONLY:
- circular 20s timer top-left
- progress bar
- exact timing

Exercise and Rest source images stay static at 1:1 framing.
No Ken Burns/zoom/pan on images containing baked Google Flow text.

Every scene image is visible from its first frame.
No full-scene opacity fade from zero, black flash, white flash or blank transition frame.

Rest:
- reuse NEXT exercise image
- compact `REST + countdown` top-left only
- no NEXT pose overlay
- never place Rest countdown top-right over the instruction cloud

## Current episode
Current production target:
`KM-002-basketball`

The previous KM-002 test render is rejected. Its known failures and fixes are documented in:
- `episodes/KM-002-basketball/README.md`
- `episodes/KM-002-basketball/ANTIGRAVITY.md`
- `episodes/KM-002-basketball/RENDER_QA.md`

## Production commands
Activate:
```bash
npm run kidmotion:activate -- --episode=KM-002-basketball
```

Final safe render:
```bash
npm run render:safe
```

`render:safe` runs:
1. TypeScript
2. Preflight
3. Longform render
4. Postrender QA

Do not call an episode PRODUCTION COMPLETE until the new MP4 also passes manual visual QA at every scene boundary.

# KidMotion

KidMotion is an original English-language kids fitness YouTube project using premium stylized 3D characters, static one-frame HOLD poses, Google Flow images and Remotion assembly.

> `GEHIRN.md` is the highest-priority source of truth.

## Current format
- YouTube long-form only
- 16:9 / 1920×1080 / 30fps
- exactly ONE main character per episode
- static poses understandable from one still image
- typical episode: 12 exercises
- every exercise: exactly 20s
- typical Rest: 5s
- standard runtime: 313s / 5:13

## Canonical episode structure
Episodes live only under:
`episodes/KM-XXX-name/`

Each episode contains:
- `01-skript/` — one copy-ready Opening Voice paragraph
- `02-audio/` — `Voice 01.mp3` + `bg-music.mp3`
- `03-bilder/` — Google Flow images/prompts
- `04-data/data.json`
- `04-data/VISUAL_REVIEW.json`
- `04-data/ASSET_APPROVAL.json` after approval
- `GENERATION-REVISION.txt`
- episode README + Antigravity + QA instructions

Legacy `content/episodes/` is not a production source.

## Character / pose rules
One video = exactly one recurring character. No second visible person.

Every exercise must work from exactly ONE still image. Reject/replace a pose if motion is needed, silhouette is unclear, anatomy is bad, important limbs overlap/crop, or Google Flow cannot depict it clearly after two serious attempts.

## Image numbering
- `Bild 00.png` = Cover only; NEVER inside MP4
- `Bild 01.png` = Intro + PRIMARY character/world reference
- `Bild 02.png` = Safety
- `Bild 03.png` = LET'S BEGIN
- `Bild 04.png`–`Bild 15.png` = 12 exercise images
- `Bild 16.png` = Outro

## Google Flow responsibilities
Exercise images contain directly:
- exercise name bottom-left
- one short instruction cloud top-right

Approved `Bild 04` becomes SECONDARY UI/LAYOUT reference for later exercise images.

Safe zones:
- top-left ~220×220 px clear for Remotion timer
- lowest ~90 px clear for Remotion progress

`Bild 01`, `Bild 02`, `Bild 03`, `Bild 16` contain ZERO Google Flow text.

Prop rule: ZERO props when scene says zero; EXACTLY ONE when scene says one. No stray duplicates.

## Opening Voice
Exactly one spoken file: `Voice 01.mp3`.

It may span the complete 14s opening:
- Intro 8s
- Safety 4s
- LET'S BEGIN 2s

Target about 11–14s and it must end before exercise 1.
After that: no spoken Voice, no spoken countdown, no subtitles/captions/transcripts.

## Background music
Final renders require `bg-music.mp3`, instrumental and child-friendly, low under Opening Voice and looped through the full workout.

## Remotion responsibilities
During exercises Remotion adds ONLY timer + progress + timing.
Exercise and Rest source images stay static. No Ken Burns/zoom/pan. No full-image fade from blank.

Rest reuses the NEXT exercise image and adds compact `REST + countdown` top-left only.

## Mandatory asset review lock
A final render is blocked until the actual final source files are visually reviewed.

1. Inspect every final image directly.
2. Set every required flag in `04-data/VISUAL_REVIEW.json` to true only after real inspection.
3. Run:
```bash
npm run assets:approve -- --episode=KM-XXX-name
```
4. This creates `ASSET_APPROVAL.json` with SHA-256 hashes.
5. If any approved image/audio changes afterward, rendering is blocked until re-review/re-approval.

## Guarded rendering
Both:
```bash
npm run render
```
and:
```bash
npm run render:safe
```
run the same guarded pipeline:

```text
TypeScript
→ project:doctor
→ preflight
→ asset:gate
→ KidMotionVideo render
→ postrender:qa
```

There is intentionally no normal npm raw-render path.

Postrender QA checks runtime, resolution/FPS, ongoing music, black/white/pale boundary flashes and suspicious repeated exercise scenes.

## Current target
`KM-002-basketball`

The previous KM-002 test render is rejected. Fix/acceptance rules are in:
- `episodes/KM-002-basketball/ANTIGRAVITY.md`
- `episodes/KM-002-basketball/RENDER_QA.md`

Do not call an episode PRODUCTION COMPLETE until all automated gates pass and the resulting MP4 is visually checked.

# KidMotion Episodes — Current Standard

Create one folder per produced video.

Recommended naming:
`KM-001-football-balance-training/`

Each episode folder should contain:
- `episode.md` — complete production plan
- `REFERENCE_GUIDE.md` — locked episode character/outfit/world
- `ALL_IMAGE_PROMPTS.md` — every required Google Flow prompt in chronological order
- `ALL_VOICE_TEXTS.md` — only the voice cues actually needed
- `publishing.md` — YouTube metadata + one cross-platform caption
- `data.json` — Remotion-ready scene/timing metadata
- `RENDER_QA.md` — pre-render acceptance checklist
- `ANTIGRAVITY_ASSEMBLY.md` where useful — assembly contract
- `scenes/` — scene documentation

Example:
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

# Important asset rule
Finished generated image binaries are NOT distributed into the individual scene-documentation folders.

Google Flow / Antigravity generates them one at a time, immediately renames them to their chronological filename, and after all images are validated they are placed together in the Remotion public staging folder:

`public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Voice clips for the active episode are staged in:
`public/00-audio/`

# HARD RULE — PUBLIC FOLDERS ARE ACTIVE-EPISODE STAGING
The public folders use generic chronological names such as `Bild 04.png` and `Voice 04.mp3`.
Therefore only ONE episode's assets may be staged there at a time.

Before switching to another episode:
1. archive current assets if needed
2. remove previous episode images/audio from staging
3. load only the new episode's files
4. verify filenames against the new episode data
5. render only after QA passes

Never mix files from two episodes in the staging folders.

# Numbering
Image number = chronological scene number.
Remotion-only scenes reserve their number.

Example:
- `Bild 00.png` Cover
- `Bild 01.png` Intro
- Scene 02 Safety → no image
- `Bild 03.png` LET'S BEGIN

# Current production rules
- exactly one main character per episode
- clean video-scene images with no baked-in exercise text/UI
- Remotion adds exercise title, instruction cloud, timer and progress bar
- every hold exercise exactly 20 seconds
- timer reaches 0 on the final frame
- progress reaches 100% on the final frame
- no subtitles / voice captions
- short voice only when needed
- rest screens normally silent
- a 5+ minute video can contain much less than 5 minutes of spoken audio
- exactly one cross-platform caption with exactly 5 hashtags

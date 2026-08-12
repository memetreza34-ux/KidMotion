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
Finished generated images are NOT distributed into the individual scene-documentation folders.

Google Flow / Antigravity generates them one at a time, immediately renames them to their chronological filename, and after all images are validated they are placed together in the Remotion public asset folder:

`00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

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
- no subtitles / voice captions
- short voice only when needed
- a 5+ minute video can contain much less than 5 minutes of spoken audio
- exactly one cross-platform caption with exactly 5 hashtags

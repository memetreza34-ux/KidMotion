# KidMotion Episode Template

## 1. Episode identity

- Episode ID:
- Working title:
- Final YouTube title:
- Content pillar:
- Main character: boy / girl / both
- Target age:
- Target duration:
- Format: long-form / short
- Theme / world:

## 2. Topic research

### Why this topic

Write the reason this topic is useful, attractive and appropriate for KidMotion.

### Search / trend notes

Add any relevant search terms, trend signals, competitor observations or evergreen reasoning.

### Differentiation

Explain what makes the KidMotion version original.

## 3. Episode concept

Short summary of what the child does from beginning to end.

## 4. Safety / suitability check

- age-appropriate movements:
- no dangerous exercise instructions:
- static-image format works:
- no copyrighted character dependency:
- no misleading health claims:

## 5. Master timeline

| # | Section | Duration | Character | Visual | Voice | UI |
|---|---|---:|---|---|---|---|
| 0 | Cover / Intro |  |  |  |  |  |
| 1 | Scene 01 |  |  |  |  |  |
| 2 | Scene 02 |  |  |  |  |  |
| 3 | Scene 03 |  |  |  |  |  |
| 4 | Scene 04 |  |  |  |  |  |
| 5 | Outro |  |  |  |  |  |

## 6. Full English voice script

All spoken language is English.

### Cover / Intro

...

### Scene 01

...

### Scene 02

...

### Scene 03

...

### Scene 04

...

### Outro

...

## 7. Per-scene production cards

Every visual scene gets its own folder and its own production card.

Required folder pattern:

`scenes/scene-01/`

Each scene folder contains:

- `scene.md` — all information for this scene
- `image-prompt.txt` — only the exact image prompt
- `voice.txt` — only the exact English voice line(s)
- generated image file(s)
- generated audio file(s), if scene-specific

### Scene 01 card

- Scene ID: scene-01
- Scene purpose:
- Character:
- Exercise / pose name:
- Duration:
- Timer duration:
- Rest after:
- Short on-screen cue:
- Short instruction text:
- Exact English voice text:
- Background / world:
- Image filename:
- Audio filename:
- Image prompt:

Repeat for every scene.

## 8. On-screen text system

Every movement image should have simple child-readable UI added by Remotion, NOT generated inside the source image.

Preferred text hierarchy:

1. Exercise / pose name — e.g. `TREE POSE`
2. Short cue / keyword — e.g. `BALANCE`
3. One very short instruction — e.g. `Stand tall. Lift one foot.`
4. Timer / countdown

Keep instructions short, visual and easy to read.

## 9. Cover / thumbnail scene

The cover belongs with the normal episode visual assets and is treated as scene `00-cover`.

Required folder:

`scenes/00-cover/`

The cover is different from normal scene images because the FINAL cover may contain text.

Store:

- `cover.md`
- `cover-prompt.txt`
- `cover-text.txt`
- final generated cover image

### Cover concept

...

### Cover text

Use very short, strong text. Prefer 2–5 words.

...

### Cover image prompt

...

If the image model handles typography poorly, generate the artwork without text and let Remotion or the thumbnail editor add the exact text afterward.

## 10. Image generation list

For every required image:

- filename
- scene ID
- character
- exercise / pose
- background
- expression
- image prompt

Source exercise images should normally contain NO generated text. Exercise labels and instructions are added in Remotion for consistency.

## 11. MASTER IMAGE PROMPT PACK

Create one file for batch production:

`ALL_IMAGE_PROMPTS.md`

It must contain ALL prompts in exact production order, including the cover first.

Required structure:

### 00 — COVER
Filename: `00-cover.png`
Prompt:
```text
...
```

### 01 — SCENE 01 — [POSE NAME]
Filename: `scene-01.png`
Prompt:
```text
...
```

### 02 — SCENE 02 — [POSE NAME]
Filename: `scene-02.png`
Prompt:
```text
...
```

Continue until every visual has a prompt.

This file exists so the user can open ONE document and generate every required image one after another without searching through scene files.

## 12. Audio generation list

Create one exact English voice line or voice block for each scene that needs speech.

| File | Scene | Voice text | Notes |
|---|---|---|---|
| intro.wav | cover |  |  |
| scene-01.wav | scene-01 |  |  |
| scene-02.wav | scene-02 |  |  |
| outro.wav | outro |  |  |

Also create:

`ALL_VOICE_TEXTS.md`

with all English voice texts in timeline order for fast external audio generation.

## 13. Caption / publishing copy

Create a strong English caption suitable for the target platform.

### Primary caption

...

### Short caption version

...

### YouTube description

...

### Hashtags

Use a focused set of relevant hashtags. Avoid spammy hashtag walls.

### Keywords / search phrases

...

### Suggested playlist

...

## 14. Remotion data

Specify:

- image filenames
- audio filenames
- exercise durations
- rest durations
- exercise / pose names
- short cue text
- short instruction text
- timer mode
- progress behavior
- music / SFX cues
- cover text

## 15. Recommended final episode folder

```text
content/episodes/KM-XXX-slug/
├── episode.md
├── data.json
├── ALL_IMAGE_PROMPTS.md
├── ALL_VOICE_TEXTS.md
├── publishing.md
├── scenes/
│   ├── 00-cover/
│   │   ├── cover.md
│   │   ├── cover-prompt.txt
│   │   ├── cover-text.txt
│   │   └── 00-cover.png
│   ├── scene-01/
│   │   ├── scene.md
│   │   ├── image-prompt.txt
│   │   ├── voice.txt
│   │   ├── scene-01.png
│   │   └── scene-01.wav
│   ├── scene-02/
│   │   └── ...
│   └── outro/
│       └── ...
└── render/
    └── final.mp4
```

## 16. Asset completion checklist

- [ ] topic approved
- [ ] script approved
- [ ] cover prompt ready
- [ ] every scene has its own folder
- [ ] every scene has an image prompt
- [ ] `ALL_IMAGE_PROMPTS.md` completed
- [ ] all images generated
- [ ] all images approved
- [ ] all English voice texts completed
- [ ] `ALL_VOICE_TEXTS.md` completed
- [ ] all audio generated
- [ ] all audio approved
- [ ] on-screen pose names completed
- [ ] short instructions completed
- [ ] caption completed
- [ ] YouTube description completed
- [ ] Remotion data completed
- [ ] render checked
- [ ] cover / thumbnail completed

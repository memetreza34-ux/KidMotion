# KidMotion — Project Brain

This file is the canonical memory for KidMotion. Every assistant, agent or collaborator must read this file FIRST before creating, changing or rendering any KidMotion episode.

## Mission

Build an original English-language YouTube / YouTube Kids movement, fitness and learning brand for children using recurring premium 3D animated-style characters presented primarily as STILL IMAGES / STATIC SCENES and assembled with Remotion.

KidMotion may be inspired by successful kids movement formats, but must remain an original brand and must not copy copyrighted characters, franchise-specific designs or third-party brand identities.

# SOURCE OF TRUTH — READ ORDER

Before doing any KidMotion work, read these files in this order:

1. `PROJECT_BRAIN.md` — canonical decisions and workflow
2. `gehirn/KANAL.md` — channel identity and positioning
3. `gehirn/CHARACTERS.md` — locked character rules
4. `characters/CHARACTER_BIBLE.md` — exact character generation details
5. `gehirn/BILDSTIL.md` — visual identity
6. `gehirn/MASTER-STYLE-PROMPT.md` — reusable image style block
7. `gehirn/IMAGE-PROMPT-TEMPLATE.md` — image prompt structure
8. `gehirn/VIDEO-REGELN.md` — scene and Remotion rules
9. `gehirn/COVER-REGELN.md` — cover/thumbnail rules
10. `gehirn/VOICE-REGELN.md` — English voice rules
11. `gehirn/CAPTION-REGELN.md` — captions/publishing rules
12. `gehirn/THEMEN-LOG.md` — avoid repeated topics

If two files conflict, `PROJECT_BRAIN.md` wins. Any intentional change to a locked rule must also update this file so future agents do not inherit contradictions.

# LOCKED CORE DECISIONS

## 1. Static-image-first production

KidMotion is NOT currently a full character animation channel.

Primary production format:
- still images / static generated scenes
- one or both recurring characters shown in exercise poses
- visual progression created through image changes, framing, UI overlays, timers, text, transitions and Remotion motion effects
- optional voiceover, music and SFX

Do NOT design episodes that require:
- continuous character animation
- lip-sync
- complex running cycles
- fights or chase scenes
- precise ball trajectories
- multi-character choreography that cannot be understood from still images

Every idea must pass this test:

> Can this be communicated clearly using one still image or a short sequence of static keyframes?

If not, redesign the idea.

## 2. Language and audience

- Channel language: English
- Audience: children
- Tone: simple, positive, energetic or calm depending on the episode
- Instructions: short, direct, easy to understand
- No unsupported health or medical claims

## 3. Two recurring main characters

KidMotion uses TWO recurring main characters:

1. one boy
2. one girl

They are equal co-stars in the same universe.

Do NOT divide content into “boy sports” and “girl sports.” Both may perform all suitable activities.

Do NOT create a random new child for every video.

### Approved boy design

Visual identity:
- around 10 years old
- medium warm skin tone
- short slightly textured dark brown hair
- large expressive brown eyes
- soft rounded facial features
- confident friendly smile
- slim active child-appropriate proportions
- bright blue athletic T-shirt with subtle green accents
- dark navy athletic shorts
- white crew socks
- blue-and-white sneakers
- energetic, adventurous, sporty personality

Do not casually redesign:
- face
- age appearance
- hairstyle
- skin tone
- body proportions
- base outfit colors
- overall rendering style

### Approved girl design

Visual identity:
- around 10 years old
- medium warm skin tone
- long dark brown hair in a sporty high ponytail
- large expressive brown eyes
- soft rounded facial features
- cheerful confident smile
- slim active child-appropriate proportions
- turquoise athletic T-shirt with subtle purple accents
- dark purple athletic leggings
- white socks
- turquoise-and-white sneakers
- energetic, flexible, positive personality

Do not casually redesign:
- face
- age appearance
- hairstyle
- skin tone
- body proportions
- base outfit colors
- overall rendering style

# LOCKED AUTOMATION CONTRACT

The goal is MAXIMUM practical automation.

For every episode, the assistant / content agent must prepare the complete production package BEFORE the user generates assets manually.

The package must include:
- topic and concept
- full episode structure
- all exercise / pose choices
- exact English voice script
- exact per-scene voice text files
- exact image prompt for EVERY generated image
- cover prompt
- intro character/background prompt if needed
- exercise scene prompts
- outro/background prompt if needed
- exact text that must appear in generated exercise images
- Remotion data for timings and dynamic UI
- publishing title / caption / description / hashtags / keywords
- all prompts collected in one file
- all voice texts collected in one file

The user's manual work should ideally be limited to:
1. generate the requested images using the prepared prompts
2. generate the requested voice/audio using the prepared texts
3. place the resulting assets into the specified episode folders
4. run / trigger the render

Do NOT make the user manually invent scene text, timers, timings, captions, folder names or Remotion values if the system can prepare them.

# RESPONSIBILITY SPLIT — IMAGE AI VS REMOTION

This split is LOCKED unless the user explicitly changes it.

## Image AI is responsible for

### Cover
- complete cover image
- visible English cover text explaining the video
- character pose and environment

### Normal exercise / pose scenes
The generated image itself MUST include:
- KidMotion character in the exact exercise pose
- large English exercise / pose name
- one short English instruction explaining HOW to perform it
- optional short keyword only if useful
- environment / background

Example generated image text:
- `SQUAT HOLD`
- `Sit low and keep your chest up.`

The image AI must NOT generate:
- timer
- countdown ring
- progress bar
- full spoken captions
- Remotion UI chrome

## Remotion is responsible for

### Intro scene (`01-intro`)
- all visible intro text
- phrase-by-phrase synchronization with the English voice
- text highlights / fade / slide behavior
- layout of static character next to synchronized text
- NO exercise timer

### Start cue
- `LET'S BEGIN!` / equivalent
- optional 3-2-1-GO
- timing and transitions

### Exercise scenes
Remotion overlays only the dynamic elements:
- 20-second circular countdown timer
- progress indicator
- optional spoken captions if used
- transitions / subtle zoom / pan

Do NOT duplicate the exercise name and short execution instruction in Remotion when they are already printed correctly inside the generated scene image.

### Rest / transition scenes
- rest countdown
- `NEXT:` label if used
- consistent KidMotion transition layout

### Outro
- `GREAT JOB!` / reward UI
- completion text
- optional celebration effects
- synchronization to final voice

# LOCKED VIDEO GRAMMAR

## Cover comes first as asset 00

Every episode includes a `00-cover` asset before Scene 1.

The cover ALWAYS contains visible English text that immediately explains what the video is about.

Cover design must remain recognizable across the channel:
- same KidMotion character identity
- same family of light, cheerful backgrounds
- bold white text with navy outline/shadow as the default
- bright accent color behind or around a key word when useful
- clear separation between text and character
- different poses / character side / accent details may vary so the channel does not look repetitive

Principle:

> SAME BRAND, DIFFERENT MOTIF.

## Scene 1 is ALWAYS the spoken intro

This is a HARD RULE.

After the cover, every KidMotion video begins with a dedicated spoken intro scene inspired by a friendly kids fitness host layout, but rendered in KidMotion’s own brand style.

Scene 1 must contain:
- one KidMotion main character as a static full-body or half-body image on one side
- large English intro text on the free side
- English voiceover
- text cues that appear or highlight in sync with the spoken voice
- a calm, recognizable KidMotion background
- NO exercise timer in Scene 1

Purpose of Scene 1:
1. greet the viewer
2. state what today’s video is about
3. give one short participation / motivation instruction
4. transition directly into the first exercise

Preferred text sync:
- phrase-by-phrase or sentence-by-sentence
- NOT mandatory word-by-word karaoke
- current phrase highlighted
- previous phrases may remain visible but visually weaker
- simple fade or slide transitions

Typical layout:
- text area: about 55–65% width
- character area: about 35–45% width
- character may alternate left/right between episodes
- maximum roughly 3–5 short text blocks

## Start cue

After the intro comes a short reusable start scene:
- default `LET'S BEGIN!`
- about 2–4 seconds
- optional `3…2…1…GO`
- same KidMotion visual identity

## Exercise scenes — HARD STANDARD

For the current first production phase:
- EVERY normal exercise / pose scene lasts EXACTLY 20 seconds
- each starts with a visible 20-second countdown and ends at 0
- Remotion controls this exact duration
- scene image and dynamic UI must end together

Every normal exercise image must already visually contain:
1. exercise / pose name
2. short execution instruction
3. optional keyword only when useful

Remotion adds:
- timer
- progress
- optional captions

## Video length — FIRST PHASE

Normal long-form KidMotion uploads should be at least about 5 minutes while the production workflow is being proven.

Do NOT design these first videos as only five exercise scenes.

Typical first-phase episode:
- about 10–12 active 20-second exercises / poses
- plus intro
- start cue
- short transitions / rests
- outro

Prefer slightly over 5 minutes rather than forcing exactly 5:00.

Once the workflow is reliable, longer videos may be introduced.

## Outro

The final scene is ALWAYS a positive completion/reward screen such as:
- `GREAT JOB!`
- `WORKOUT COMPLETE`
- `YOU FINISHED THE WORKOUT!`
- `YOU DID IT!`

Standard duration about 5 seconds, adjusted only as needed to finish the final voice cleanly.

# CONTENT SYSTEM

KidMotion is broader than yoga.

Primary content pillars:
1. Follow-the-Pose Fitness
2. Yoga / Stretching / Balance
3. Copy-the-Pose / Freeze Challenges
4. Educational Movement
5. Static Adventure Workouts
6. Sports Skill Poses
7. Brain Breaks / Coordination
8. Shorts

Other compatible formats:
- animal poses
- calm / focus / wind-down
- healthy routine movement reminders
- seasonal movement content
- easy / medium / hard challenges

Core brand formula:

> MOVE + PLAY + LEARN + EXPLORE

But every format must remain compatible with the static-image production model.

# IMAGE GENERATION RULES

For an episode, use the approved episode reference image to keep the same character, outfit, room/style and general rendering consistent across generated scenes.

Every normal exercise image prompt must specify:
- exact approved character
- exact clothing
- exact pose
- safe child-appropriate body position
- camera framing
- background / environment
- facial expression
- premium stylized 3D look
- exact exercise title printed in image
- exact short execution instruction printed in image
- 16:9 composition for long-form unless another format is explicitly required
- no timer / countdown / progress bar generated into image
- no third-party logos
- no copyrighted characters

# COVER IMAGE RULES

Cover MUST contain visible English text in the final image.

Prompt must include the exact text and explain the video immediately.

Example:
`5 MINUTE KIDS FITNESS`
`EASY FULL BODY WORKOUT`

If AI text is misspelled, regenerate or replace it cleanly before publishing.

# VOICE RULES

- English only for current channel
- short child-friendly sentences
- positive and direct
- no unnecessary long explanations
- intro text and Scene 1 text cues must be designed together so Remotion can synchronize them
- exercises may have a short spoken cue at the beginning / during the 20-second scene, but the still image itself provides the visible pose name and execution instruction

Each voice unit must have its own text file and all voice texts must also be collected in one episode-level file.

# EPISODE FOLDER CONTRACT

Every episode follows this structure:

```text
episodes/KM-XXX-slug/
├── 01-plan/
│   └── episode.md
├── 02-all-prompts/
│   └── ALL_IMAGE_PROMPTS.md
├── 03-scenes/
│   ├── 00-cover/
│   ├── 01-intro/
│   ├── 02-start-cue/
│   ├── 03-exercise-01/
│   ├── 04-exercise-02/
│   └── ...
├── 04-voice/
│   └── ALL_VOICE_TEXTS.md
├── 05-publishing/
│   └── publishing.md
├── 06-render/
└── data.json
```

Each exercise scene folder must be able to contain:
- `scene.md`
- `image-prompt.txt`
- `voice.txt`
- `on-image-text.txt`
- generated image
- generated audio

The cover folder must contain:
- cover prompt
- exact cover text
- generated cover image

The intro folder must contain:
- character/background asset prompt if needed
- voice text
- Remotion cue/timing data
- intro asset(s)

`ALL_IMAGE_PROMPTS.md` must contain cover + intro asset prompt(s) + every exercise scene prompt in generation order so the user can create all images in one session.

`ALL_VOICE_TEXTS.md` must contain all English spoken lines in order so the user can generate audio efficiently.

`publishing.md` must contain:
- final YouTube title
- English caption
- short caption variant
- YouTube description
- hashtags
- keywords / search phrases
- playlist suggestion

# REMOTION — LOCKED ARCHITECTURE

Remotion is the primary assembly/rendering system. Do not replace it with a manual-only editor unless the user explicitly changes direction.

Remotion is responsible for:
- synchronized Scene 1 intro text cues
- start cue
- optional 3-2-1-GO
- exact 20-second exercise timing
- circular exercise timer
- progress indicator
- optional voice captions
- rest screens
- transitions
- image zoom/pan
- outro / `GREAT JOB!`
- optional SFX/music
- final MP4 rendering

The video must be data-driven so new episodes can be created by changing episode data/assets rather than rebuilding layouts manually.

# QUALITY / CONSISTENCY RULES

Before an episode is considered render-ready, check:
- all required scene folders exist
- cover exists and has correct readable text
- Scene 1 exists and is the synchronized spoken intro
- start cue exists
- all exercise image prompts follow approved character/style rules
- every exercise prompt includes exact on-image exercise title + short execution instruction
- no timer/progress bar is accidentally baked into exercise images
- all voice text is English
- all scene images exist
- all required audio exists
- every exercise duration is exactly 20 seconds in the current standard format
- timer values are valid
- total video duration reaches the current ~5 minute minimum target
- no duplicate or contradictory scene IDs
- Remotion paths match real assets
- no missing files
- no copyrighted third-party characters or logos
- no unsafe or unclear exercise pose
- no conflicting instructions between `PROJECT_BRAIN.md` and `gehirn/*`

If a conflict is found, fix documentation/data before rendering. Do not silently guess.

# CURRENT PROJECT PHASE

PHASE 2 — Video system foundation and first real episode.

Approved so far:
- project name: KidMotion
- two recurring main characters
- approved boy and girl visual direction
- static-image-first production model
- English-language channel
- broad content system
- Remotion as primary renderer
- standardized cover concept
- Scene 1 as mandatory synchronized spoken intro
- image-AI-generated exercise title + execution instruction
- Remotion-generated dynamic timer/progress/captions
- exact 20-second exercise scenes
- first-phase long-form target of at least about 5 minutes
- episode folder workflow
- maximum practical automation as the target

# DECISION LOG

## 2026-08-08

- Chose two fixed recurring main characters instead of random characters.
- Chose one boy and one girl as equal co-stars.
- Both characters may perform all suitable activity types.
- Rejected generations that made the characters too young / too cartoonish.
- Approved the current individual boy and girl designs as the reference direction.
- Clarified that current production uses still images, not full animation.
- Chose Remotion as the primary video assembly/rendering system.
- Defined broad KidMotion content pillars.
- Defined a recognizable but non-repetitive cover system.
- Locked the rule that every final cover contains visible English text explaining the video.
- Locked the rule that Scene 1 is always the spoken intro with synchronized phrase-level text next to a static KidMotion character.
- Locked the rule that normal exercise images themselves contain the exercise name and a short execution instruction.
- Locked the rule that Remotion supplies dynamic timer/progress rather than duplicating that static text.
- Locked exact 20-second exercise scenes for the current standard format.
- Locked first-phase long-form videos at about 5 minutes minimum, using substantially more than five exercises.
- Locked maximum practical automation: assistant prepares all prompts, voice texts, metadata, scene data and Remotion timing so the user primarily generates assets and renders.
- Locked `PROJECT_BRAIN.md` as the top-level source of truth.

# INSTRUCTION TO FUTURE AGENTS

Do not start by inventing a new structure.

First read the files listed under SOURCE OF TRUTH — READ ORDER.

Preserve approved decisions unless the user explicitly changes them.

Do not introduce duplicate systems, competing folder structures or parallel rendering approaches.

Do not leave contradictory instructions in the repository.

When changing a core rule, update all directly affected docs in the same task.

Prefer one clear canonical implementation over multiple half-finished alternatives.

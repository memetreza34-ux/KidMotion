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

Example voice:
`Hi, KidMotion friends! Today we have five easy fitness moves. Follow along, do your best, and have fun. Get ready — let's move!`

Example synchronized text blocks:
- `HI, KIDMOTION FRIENDS!`
- `5 EASY FITNESS MOVES TODAY`
- `FOLLOW ALONG & HAVE FUN`
- `GET READY — LET'S MOVE!`

## Exercise scenes

Each exercise scene should communicate one clear movement or pose.

Standard text hierarchy:
1. Exercise / Pose Name — large
2. Keyword — very short, e.g. `BALANCE`, `ENERGY`, `POWER`
3. Mini instruction — short, e.g. `Lift one foot`
4. Voice captions — spoken English text
5. Timer / countdown
6. Progress indicator

Do not repeat the same sentence across all text levels.

Typical follow-along timing:
- spoken intro: about 8–18 s depending on voice
- start cue: 3…2…1…GO
- exercise: about 15–30 s
- rest: about 5–10 s
- outro/reward: about 3–8 s

## Outro

The final scene is a positive completion/reward screen such as:
- `GREAT JOB!`
- `WORKOUT COMPLETE`
- `YOU DID IT!`

Keep it short and visually clear.

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

Normal scene images should generally NOT contain generated text, timers, captions or UI. Remotion adds those so design remains consistent and editable.

Every normal image prompt must specify:
- exact approved character
- exact clothing
- exact pose
- safe child-appropriate body position
- camera framing
- background / environment
- facial expression
- premium stylized 3D look
- 16:9 composition for long-form unless another format is explicitly required
- negative space for UI when useful
- no third-party logos
- no copyrighted characters

For an episode, use the approved reference image from that episode to keep the same character and room/style consistent across all generated scenes.

# COVER IMAGE RULES

Cover differs from normal scenes:
- cover MUST contain visible English text in the final image
- prompt should include the exact text
- text must immediately explain the video
- text must be large and mobile-readable
- default structure: large main line + small explanatory line

Example:
`5 EASY FITNESS MOVES`
`FOR KIDS`

If AI text is misspelled, regenerate or replace it cleanly before publishing. Never publish a cover with broken text.

# VOICE RULES

- English only for current channel
- short child-friendly sentences
- positive and direct
- no unnecessary long explanations
- intro text and Scene 1 text cues must be designed together so Remotion can synchronize them

Each scene must have its own voice text file and all voice texts must also be collected in one episode-level file.

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
│   ├── 02-scene/
│   ├── 03-scene/
│   └── ...
├── 04-voice/
│   └── ALL_VOICE_TEXTS.md
├── 05-publishing/
│   └── publishing.md
├── 06-render/
└── data.json
```

Each normal scene folder must be able to contain:
- `scene.md`
- `image-prompt.txt`
- `voice.txt`
- `on-screen-text.txt`
- generated image
- generated audio

The cover folder must contain:
- cover prompt
- exact cover text
- generated cover image

`ALL_IMAGE_PROMPTS.md` must contain the cover prompt and every scene prompt in generation order so the user can create all images in one session.

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
- exercise titles
- keyword
- mini instructions
- captions
- timers
- 3-2-1-GO countdowns
- progress bars
- rest screens
- transitions
- image zoom/pan
- intro/outro layouts
- optional SFX/music
- final MP4 rendering

The video should be data-driven so new episodes can be created by changing episode data/assets rather than rebuilding layouts manually.

# QUALITY / CONSISTENCY RULES

Before an episode is considered render-ready, check:
- all required scene folders exist
- cover exists and has correct readable text
- Scene 1 exists and is the synchronized spoken intro
- all image prompts follow approved character/style rules
- all voice text is English
- all scene images exist
- all required audio exists
- every exercise has title, keyword, mini instruction, duration
- timer/rest values are valid
- no duplicate or contradictory scene IDs
- Remotion paths match real assets
- no missing files
- no copyrighted third-party characters or logos
- no unsafe or unclear exercise pose
- no conflicting instructions between `PROJECT_BRAIN.md` and `gehirn/*`

If a conflict is found, fix the documentation/data before rendering. Do not silently guess.

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
- data-driven exercise scenes with title / keyword / instruction / timer / progress
- episode folder workflow

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
- Locked the rule that `PROJECT_BRAIN.md` is the top-level source of truth and must be updated whenever a core decision changes.

# INSTRUCTION TO FUTURE AGENTS

Do not start by inventing a new structure.

First read the files listed under SOURCE OF TRUTH — READ ORDER.

Preserve approved decisions unless the user explicitly changes them.

Do not introduce duplicate systems, competing folder structures or parallel rendering approaches.

Do not leave contradictory instructions in the repository.

When changing a core rule, update all directly affected docs in the same task.

Prefer one clear canonical implementation over multiple half-finished alternatives.

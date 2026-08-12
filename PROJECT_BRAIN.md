# KidMotion — Project Brain

This file is the canonical source of truth for KidMotion. Every assistant, agent or collaborator must read it before creating, changing or rendering an episode.

# MISSION
Build an original English-language kids movement / fitness brand using recurring premium stylized 3D characters, static AI-generated scene images, Google Flow / Antigravity for image production and Remotion for assembly, timing, text/UI and final rendering.

Current active focus: SPORT / FITNESS only.
Educational formats are documented for later but are currently inactive.

# READ ORDER
1. `PROJECT_BRAIN.md`
2. `gehirn/KANAL.md`
3. `gehirn/CHARACTERS.md`
4. `characters/CHARACTER_BIBLE.md`
5. `gehirn/BILDSTIL.md`
6. `gehirn/MASTER-STYLE-PROMPT.md`
7. `gehirn/IMAGE-PROMPT-TEMPLATE.md`
8. `gehirn/VIDEO-REGELN.md`
9. `gehirn/COVER-REGELN.md`
10. `gehirn/VOICE-REGELN.md`
11. `gehirn/CAPTION-REGELN.md`
12. `gehirn/THEMEN-LOG.md`

If another file conflicts with this file, this file wins and the conflicting file must be corrected.

# LOCKED CHANNEL / PRODUCTION MODEL
- English-language content.
- YouTube long-form first.
- Standard long-form format: 16:9, 1920x1080.
- Static-image-first production.
- No normal exercise scene depends on full character animation or lip sync.
- Remotion creates motion through text/UI, timers, progress, transitions and subtle image movement.
- First production phase target: at least about 5 minutes per normal long-form workout.
- Typical first episodes: about 10–12 exercises.

# CHARACTER SYSTEM
KidMotion has two recurring characters overall: one boy and one girl.

HARD EPISODE RULE:
> ONE VIDEO = ONE MAIN CHARACTER FROM COVER TO OUTRO.

Within one episode:
- never switch boy/girl
- never replace the chosen character with another child
- no second visible child/person unless the user explicitly changes the format
- face, age appearance, skin tone, hairstyle, proportions and 3D style stay locked
- outfit and world stay consistent within the episode

Across different episodes either boy or girl may be selected.
Both may perform any suitable sport/activity.

# THEMED OUTFITS
Character identity stays locked, but outfit and environment may change between episodes to match the theme.
Examples: football, basketball, tennis, winter, space, original hero theme.

No real club logos, brand logos or copyrighted franchise character designs.

# CURRENT EXERCISE FORMAT
Start phase uses static standing HOLD poses that are understandable from one still image and can be held for 20 seconds.

Preferred examples:
- football ready hold
- goalkeeper squat hold
- knee-up balance
- single-leg balance
- side leg hold
- standing side stretch
- calf raise hold
- wide squat hold
- side lunge hold
- forward lunge hold
- reach-up hold
- victory balance

Avoid repetitive-motion exercises such as jumping jacks, burpees, running in place or repeated high knees in the current standard format.

# EXACT EXERCISE TIMING
Every normal hold exercise lasts EXACTLY 20 seconds.

Voice length does not control scene length.
Example:
- 0–3s short voice cue
- 3–20s silence
- image, timer and progress continue to 20 seconds

A roughly 5-minute video may contain only about 45–75 seconds of actual spoken audio.
Do not fill silence with unnecessary motivational narration.

# HARD RULE — NO SUBTITLES
No automatic subtitles or voice captions anywhere in normal KidMotion videos.
Do not add:
- word-for-word captions
- subtitle boxes
- automatic transcript overlays
- karaoke text

Intentional scene UI text is allowed and required where defined.

# RESPONSIBILITY SPLIT — GOOGLE FLOW / ANTIGRAVITY VS REMOTION

## Google Flow / Antigravity generates
- clean 16:9 scene images
- same chosen episode character
- correct static pose
- locked episode outfit
- locked episode environment
- Cover / thumbnail with its publishing text

Except for Cover, normal video-scene images must contain NO:
- exercise title
- instruction text
- cloud / speech bubble
- subtitles
- timer
- progress bar
- countdown
- other UI

## Remotion adds on top of the clean images
- intro text blocks
- safety screen
- LET'S BEGIN text
- exercise name
- short instruction cloud
- 20-second timer
- progress bar
- rest screens
- outro text
- transitions / subtle zoom or pan
- optional short voice clips at their correct scene starts
- final timeline and render

# STANDARD EXERCISE LAYOUT
On each exercise scene:
- clean full-screen Google Flow image
- exercise title: bottom-left
- instruction: upper-right in KidMotion white cloud / rounded info bubble
- circular 20-second timer: top-left
- progress bar: along bottom
- full body must remain visible
- overlays must not cover face, hands, feet or important joint positions

# VIDEO GRAMMAR
`Bild 00.png` is the separate YouTube thumbnail and is NOT played as a video scene.

Standard order:
1. `00-cover` — thumbnail only
2. `01-intro` — clean image + Remotion intro text + short voice
3. `02-safety` — Remotion-only safety screen
4. `03-lets-begin` — clean image + Remotion `LET'S BEGIN!`
5. exercise scenes — exactly 20s each
6. 5s rest / transition between exercises where defined
7. outro — same character + Remotion `GREAT JOB!`

# IMAGE NUMBERING — HARD RULE
Image number always equals chronological scene number.

Example:
- Cover = `Bild 00.png`
- Scene 01 = `Bild 01.png`
- Scene 02 Remotion-only = no `Bild 02.png`
- Scene 03 = `Bild 03.png`

Never compress numbering because a Remotion-only scene has no image.

# GOOGLE FLOW AGENT WORKFLOW — HARD RULE
Generate images strictly one at a time:

`PROMPT LESEN → GENAU EIN BILD ERZEUGEN → SOFORT UMBENENNEN → ERST DANN NÄCHSTES BILD`

Never batch several episode images.
Every individual prompt must directly contain:
- `IMAGE NUMBER`
- `SCENE`
- `FINAL FILE NAME`
- immediate rename instruction

After ALL required images are generated, renamed and validated, move them together into:
`00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Do not distribute finished image binaries into individual scene folders.

# VOICE SYSTEM
- English only.
- Speak only when useful.
- Short, child-friendly, simple cues.
- Intro and Safety may have short voice.
- LET'S BEGIN may have one short cue.
- Exercise cue usually only at scene start.
- Rest normally silent.
- Outro has short congratulations.
- No subtitles from voice.
- Remotion scene duration remains independent of audio duration.

Preferred asset workflow: separate short voice clips per required scene/cue.
If one master audio file is used, it must contain correct silence/gaps or be split/positioned by the assembly agent. Never stretch a short audio track to fill the full video.

# COVER
Cover always contains visible English text explaining the video.
Cover is `Bild 00.png` and is never part of the rendered video timeline.

# PUBLISHING
Each episode gets exactly ONE cross-platform caption reused on YouTube, TikTok, Instagram, Facebook and other platforms where technically possible.

Caption rules:
- English
- concise and engaging
- clear participation/challenge angle when appropriate
- exactly 5 hashtags
- final hashtag mix includes `#KidMotion`
- no guaranteed virality claims

Publishing package also contains:
- final YouTube title
- YouTube description
- keywords/search phrases
- playlist recommendation
- thumbnail text/concept

# EPISODE PACKAGE
Every episode should contain at minimum:
- `episode.md`
- `REFERENCE_GUIDE.md`
- `ALL_IMAGE_PROMPTS.md`
- `ALL_VOICE_TEXTS.md`
- `publishing.md`
- `data.json`
- scene documentation

The assistant/agent prepares topic, scene structure, exercises, prompts, voice texts, timings, Remotion data and publishing copy before manual asset generation.

# RENDER-READY QA
Before final render verify:
- Cover is not played in video
- exactly one main character across the episode
- same face/outfit/world across images
- no second person
- no subtitles / voice captions
- normal Google Flow images contain no baked-in exercise text/UI
- Remotion adds exercise title + instruction cloud
- every exercise is exactly 20 seconds
- timer visible
- progress bar visible
- rests have correct duration
- short voice clips do not shorten scenes
- silent gaps remain silent
- intro, safety, start and outro are separate scenes
- image numbering matches chronological scenes
- all Remotion paths match real assets
- total long-form runtime meets current ~5-minute minimum
- no third-party logos / copyrighted characters
- no contradictory rules remain in the active episode package

# CURRENT PHASE
Phase: first real SPORT workout production and workflow stabilization.

KM-001 is the reference implementation for the corrected workflow:
- one boy for entire video
- football theme
- clean Google Flow scene images
- all exercise text/UI from Remotion
- no subtitles
- short voice only when needed
- 12 standing hold exercises × 20 seconds
- approximately 5:20 total runtime

# KidMotion — Image Prompt Template

## Scene identity
- Episode:
- Scene:
- Character: boy / girl / both
- Pose / movement:
- Background / world:
- On-image exercise text:

# HARD RULE — NORMAL EXERCISE SCENES INCLUDE THEIR TEXT IN THE GENERATED IMAGE

For normal exercise / pose scenes, the image generator must create the scene WITH the visible exercise information already inside the image.

The generated image must normally include:
1. English exercise / pose name
2. one short English execution instruction describing how to do it
3. optional short keyword only when it adds real value

The generated image must NOT include:
- timer
- progress bar
- countdown ring
- captions / full spoken voice transcript
- Remotion controls

Those dynamic elements remain Remotion's responsibility.

Exception:
- `01-intro` is built with Remotion text synchronized to the voice and does NOT rely on generated intro text inside the character image.
- system screens such as start cue, rest and outro may be full generated images when explicitly defined that way.

# HARD RULE — FIRST WORKOUTS USE STATIC HOLD POSES, NOT REPETITIVE MOVEMENTS

For the first KidMotion workout format, normal exercise scenes should prefer static poses / holds that children can copy and hold for the full 20-second timer.

Examples:
- squat hold
- lunge hold
- star hold
- side stretch
- balance hold
- standing reach
- wide stance

Avoid repetitive movements such as jumping jacks, running in place, burpees or repeated high knees as the default first-format scenes.

The pose should be immediately understandable from ONE still image.

# LOCKED APPROVED EXERCISE SCENE LOOK

The Balance Hold test approved on 2026-08-08 is the visual reference for normal exercise scenes.

Use this layout:
- character: LARGE and CENTERED, full body visible
- pose name: BOTTOM-LEFT, bold KidMotion athletic style with white lettering, dark navy outline/shadow, small blue/lime accents; noticeable but not oversized
- short execution instruction: TOP-RIGHT area, simple clean dark navy rounded text, small and readable
- timer: NOT generated in the image; Remotion adds the circular 20-second timer in the top-right area
- progress bar: NOT generated in the image; Remotion adds it along the bottom

IMPORTANT:
- Keep the same overall balance and spacing as the approved Balance Hold example.
- Do not overdesign the instruction.
- Do not turn the instruction into a large card or second headline.
- Do not make the pose name plain or boring; keep the playful KidMotion outlined title style.
- Do not make the pose name excessively large.

# SHORT PROMPT STYLE — LOCKED

Image prompts should stay short, direct and easy for Flow / Nano Banana to follow.
Do not repeat the same rule many times in one prompt.

Preferred prompt structure:

```text
Use the provided KidMotion [boy/girl] reference exactly.

Create a 16:9 KidMotion fitness scene in the same light-blue studio.

POSE:
[POSE NAME].
[short exact body-position description].
Full body visible. Static hold pose.

BOTTOM-LEFT:
“[POSE NAME]”
Use bold white KidMotion athletic lettering, dark navy outline, soft shadow, small blue/lime accents. Keep it noticeable but not huge.

TOP-RIGHT:
“[SHORT EXECUTION INSTRUCTION]”
Use small clean rounded dark-navy text.

Do not generate a timer or progress bar.
Keep the same approved character, outfit, face, proportions, studio and premium 3D KidMotion style.
```

# REMOTION OVERLAY RULE

For normal exercise scenes, Remotion adds only the dynamic UI:
- circular 20-second countdown timer in the top-right area
- bottom progress bar
- optional captions / SFX when needed

The generated image already contains:
- pose name bottom-left
- short execution instruction top-right

Do not duplicate those two texts in Remotion.

## Required QA
- correct approved character identity
- static hold pose is easy to understand
- full body visible where needed
- character large and centered
- pose name bottom-left in approved playful KidMotion title style
- pose name not oversized
- short instruction top-right in small clean dark navy text
- no generated timer
- no generated progress bar
- no extra text
- no third-party logos or characters
- same light-blue KidMotion studio visual continuity

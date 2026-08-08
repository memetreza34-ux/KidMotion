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

The approved Side Stretch girl test from 2026-08-08 is now the visual reference for normal exercise scenes.

Use this layout:
- character: LARGE and CENTERED, full body visible
- pose name: BOTTOM-LEFT, bold KidMotion athletic style with white lettering, dark navy outline/shadow and small matching accent marks; noticeable but not oversized
- short execution instruction: TOP-RIGHT inside a WHITE CLOUD-SHAPED BUBBLE
- cloud bubble: soft rounded cloud silhouette, subtle colored outline matching the character palette, soft shadow, dark navy bold rounded text
- instruction bubble should sit clearly in the upper-right area and remain visually secondary to the character and pose name
- timer: NOT generated in the image; Remotion adds the circular 20-second timer later
- progress bar: NOT generated in the image; Remotion adds it along the bottom

IMPORTANT:
- Keep the approved cloud bubble look as-is; do not automatically shrink, simplify or move it unless the user explicitly asks.
- Do not replace the cloud bubble with a rectangular card or normal speech bubble.
- Keep the pose name playful and outlined, not plain text.
- Keep the pose name bottom-left.
- Keep the character large and centered.

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
Use bold white KidMotion athletic lettering, dark navy outline, soft shadow, and small matching accent marks. Keep it noticeable but not huge.

TOP-RIGHT:
Add a white cloud-shaped bubble with a soft colored outline and subtle shadow.
Inside write:
“[SHORT EXECUTION INSTRUCTION]”
Use dark navy bold rounded text.

Do not generate a timer or progress bar.
Keep the same approved character, outfit, face, proportions, studio and premium 3D KidMotion style.
```

# REMOTION OVERLAY RULE

For normal exercise scenes, Remotion adds only the dynamic UI:
- circular 20-second countdown timer
- bottom progress bar
- optional captions / SFX when needed

The generated image already contains:
- pose name bottom-left
- short execution instruction in the approved top-right cloud bubble

Do not duplicate those two texts in Remotion.

## Required QA
- correct approved character identity
- static hold pose is easy to understand
- full body visible where needed
- character large and centered
- pose name bottom-left in approved playful KidMotion title style
- pose name not oversized
- short instruction appears in the approved white cloud-shaped bubble at top-right
- cloud bubble uses a soft colored outline and subtle shadow
- no rectangular info card unless explicitly requested
- no generated timer
- no generated progress bar
- no extra text
- no third-party logos or characters
- same light-blue KidMotion studio visual continuity

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
1. large English exercise / pose name
2. one short English execution instruction describing how to do it
3. optional short keyword only when it adds real value

Example:
- `SQUAT HOLD`
- `Sit low and keep your chest up.`

The generated image must NOT include:
- timer
- progress bar
- countdown ring
- captions / full spoken voice transcript
- Remotion controls

Those dynamic elements remain Remotion's responsibility.

Exception:
- `01-intro` is built with Remotion text synchronized to the voice and does NOT rely on generated intro text inside the character image.
- system screens such as start cue, rest and outro are primarily Remotion layouts unless an episode explicitly defines a background asset.

## Prompt structure
```text
Create a premium KidMotion still image for an English-language kids movement video.

CHARACTER:
[approved boy / approved girl / both]

POSE:
[exact child-safe pose, body placement, feet, hands, torso, gaze]

EXPRESSION:
[friendly / focused / energetic / calm]

CAMERA:
[full body, front-facing or slight 3/4, readable pose]

SCENE:
[clear thematic environment]

COMPOSITION:
16:9 YouTube frame. Keep the character large and the pose anatomically readable. Reserve a clear text area that does not cover the face, hands, feet or important joint positions.

ON-IMAGE TEXT — REQUIRED FOR NORMAL EXERCISE SCENES:
Large title: `[EXERCISE / POSE NAME]`
Short instruction: `[short execution instruction]`
Optional keyword: `[only when useful]`

Text must be:
- English
- correctly spelled
- large and highly readable
- consistent with KidMotion typography/color direction
- visually separated from the character
- concise

DO NOT GENERATE:
- timer
- progress bar
- countdown numbers
- spoken captions
- extra explanatory paragraphs

[append full MASTER-STYLE-PROMPT.md block]
```

## Required QA
- correct approved character identity
- pose anatomically understandable
- full body visible where necessary
- exact requested exercise name is spelled correctly
- short instruction is readable and technically matches the pose
- no third-party logos
- no accidental timer / countdown / captions in the image
- still image works without continuous animation

# KidMotion — Image Prompt Template

## Scene identity
- Episode:
- Scene:
- Character: boy / girl / both
- Pose / movement:
- Background / world:
- UI-safe area:

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
16:9 YouTube frame. Keep [top-left / top-right / bottom] sufficiently clean for KidMotion UI overlays. Do not cover important body parts.

ON-IMAGE TEXT:
None for normal scenes. All labels, timers and captions are added later in Remotion.

[append full MASTER-STYLE-PROMPT.md block]
```

## Required QA
- correct approved character identity
- pose anatomically understandable
- full body visible where necessary
- no third-party logos
- no unwanted text
- enough UI-safe space
- still image works without continuous animation

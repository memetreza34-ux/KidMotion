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
- balance pose
- standing reach
- wide stance

Avoid using movements such as jumping jacks, running in place, burpees or repeated high knees as the default first-format scenes, because they require continuous motion to demonstrate properly.

The pose should be immediately understandable from ONE still image.

# HARD RULE — STANDARD EXERCISE IMAGE COMPOSITION

Use the full 16:9 frame efficiently. Do not leave excessive dead space.

Preferred composition:
- character: large, centered, full body clearly visible
- pose name: BOTTOM-LEFT, bold but deliberately compact
- short execution instruction: UPPER-RIGHT / MID-RIGHT, noticeably smaller and more polished than previous tests
- EXTREME TOP-RIGHT CORNER: keep a dedicated empty timer zone for the Remotion circular 20-second timer
- BOTTOM edge: keep enough safe space for Remotion progress UI

The character may overlap the visual center, but must not block the text areas or future timer area.

The standard KidMotion exercise layout is:

`character centered` + `pose name bottom-left` + `instruction upper-right/mid-right` + `timer extreme top-right corner (Remotion)` + `progress bottom (Remotion)`

The generated image itself must NOT contain the timer or progress bar.

## Text hierarchy — locked

POSE NAME:
- position: bottom-left
- clearly visible and bold, but intentionally smaller than previous tests
- target visual width: roughly 12–18% of the frame, depending on word length
- use established KidMotion white lettering with dark navy outline/shadow and optional restrained blue/lime accent shape
- do NOT make it thumbnail-sized
- keep comfortable margins from left and bottom edges
- must remain visually secondary to the character

SHORT INSTRUCTION:
- position: upper-right / mid-right, BELOW or slightly LEFT of the reserved timer corner
- noticeably smaller than the pose name
- use a cleaner, more premium text treatment than the earlier chunky dark-blue test
- preferred look: clean rounded sans-serif, semi-bold or bold, white or very light text with a subtle navy shadow/outline, or dark navy on a soft translucent/light panel when needed for contrast
- avoid oversized letters and avoid heavy stacked 3–4-line blocks
- target visual width: roughly 18–26% of the frame
- one short line whenever possible; maximum two compact lines
- should explain how to perform the pose, not its benefit
- must never overlap the timer zone

## Prompt structure
```text
Create a premium KidMotion still image for an English-language kids movement video.

CHARACTER:
[approved boy / approved girl / both]

POSE:
[exact static child-safe HOLD pose, body placement, feet, hands, torso, gaze]

The pose must be understandable from one still image and suitable for a child to copy and hold for 20 seconds.

EXPRESSION:
[friendly / focused / energetic / calm]

CAMERA:
Full-body, front-facing or slight 3/4 angle only when it makes the pose clearer. Keep the character large and centered.

SCENE:
[clear thematic environment]

COMPOSITION:
16:9 YouTube frame.
Use the complete frame efficiently.
Place the character large in the CENTER with the full pose visible from head to shoes.
Place the pose name in the BOTTOM-LEFT.
Place the short instruction in the UPPER-RIGHT / MID-RIGHT area, but BELOW or slightly LEFT of the dedicated timer corner.
Keep the extreme TOP-RIGHT corner clean because Remotion will add the circular 20-second countdown timer there.
Keep a safe strip along the BOTTOM for the Remotion progress bar.
Do not cover face, hands, feet or important joint positions with text.

ON-IMAGE TEXT — REQUIRED FOR NORMAL EXERCISE SCENES:
BOTTOM-LEFT — compact pose title: `[POSE NAME]`
UPPER-RIGHT / MID-RIGHT — short instruction: `[short execution instruction]`
Optional keyword: `[only when useful]`

POSE TITLE STYLE:
- bold KidMotion athletic lettering
- compact, not oversized
- roughly 12–18% of frame width when possible
- white letters with dark navy outline/shadow
- optional restrained blue or lime accent shape
- must remain visually secondary to the character

INSTRUCTION STYLE:
- smaller than pose title
- cleaner and more premium than the pose title
- preferably clean rounded sans-serif
- avoid very thick/chunky lettering
- one short line whenever possible, maximum two compact lines
- roughly 18–26% of frame width
- subtle shadow/outline or soft panel for contrast

Text must be:
- English
- correctly spelled
- highly readable
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
- pose is a static hold when using the standard first-workout format
- pose anatomically understandable
- full body visible where necessary
- character large and centered
- pose name appears bottom-left and is compact, not oversized
- short instruction appears upper-right / mid-right and is smaller, cleaner and more premium
- extreme top-right remains clear for Remotion timer
- bottom safe area remains usable for Remotion progress bar
- exact requested exercise / pose name is spelled correctly
- short instruction is readable and technically matches the pose
- no third-party logos
- no accidental timer / countdown / captions in the image
- still image works without continuous animation

# KM-001 Reference Guide — Antigravity / Google Flow

# HARD RULE — ONE CHARACTER FOR THE ENTIRE VIDEO
KM-001 uses exactly ONE visible recurring character from Cover through Outro:
**the approved KidMotion boy.**

Never switch to the girl. Never add teammates, coaches, spectators or background people.
The same boy must appear in every generated scene that contains a person.

Locked throughout the episode:
- face
- age appearance
- skin tone
- hairstyle / hair color
- body proportions
- overall premium 3D style
- football outfit
- football world

Only pose, facial expression and framing may change.

## Reference workflow
1. Generate `Bild 00.png` from the approved KidMotion boy master reference. This is the Cover and contains thumbnail text.
2. Generate the CLEAN intro asset `Bild 01.png` from the approved KidMotion boy master reference using the exact KM-001 football outfit/world.
3. After `Bild 01.png` is approved, use **Bild 01 as the PRIMARY visual reference for every later KM-001 image (`Bild 03`–`Bild 16`)**.
4. Do not use the text-heavy Cover as the primary later-scene reference when the clean `Bild 01.png` reference is available.
5. If any later scene drifts in face, outfit, body proportions or style, regenerate it before continuing.

This reference order reduces character drift and also prevents Cover typography from leaking into normal scene generations.

## Locked boy identity
Friendly athletic boy around 10 years old, medium warm skin, short slightly textured dark brown hair, large expressive brown eyes, soft rounded facial features, confident friendly smile, slim active child-appropriate proportions, premium stylized 3D family-entertainment rendering.

## Locked KM-001 football outfit
- bright royal-blue football jersey
- lime-green shoulder and side accents
- small original abstract KidMotion-style chest mark only
- dark navy football shorts
- long royal-blue football socks with one thin lime accent
- blue-and-white football boots
- no real club badge
- no sponsor
- no Nike / Adidas / Puma / brand logos

## Locked KM-001 world
- bright premium youth football training pitch
- vivid green grass
- soft blue sky
- modern stadium / training-ground background softly out of focus
- white goal when useful
- a few blue/lime cones when useful
- clean daylight
- no other people

# HARD RULE — CLEAN VIDEO IMAGES
Except for the separate Cover, generated video-scene images contain ONLY:
- the same boy
- the correct static pose
- the football outfit
- the football world

Do NOT generate into normal video-scene images:
- exercise title
- instruction text
- cloud / speech bubble
- subtitles
- voice captions
- timer
- progress bar
- countdown
- UI

Remotion places all video text and dynamic UI on top of the clean image.

## Composition for exercise scenes
- 16:9 YouTube landscape, 1920x1080 target
- exactly one boy visible
- full body clearly visible
- static standing hold pose
- character large and near center
- keep TOP-LEFT reasonably clear for the 20-second timer
- keep TOP-RIGHT reasonably clear for Remotion instruction cloud
- keep BOTTOM-LEFT reasonably clear for Remotion exercise title
- keep bottom edge clear for progress bar

## Cover exception
`Bild 00.png` is the YouTube thumbnail only and may contain:
- `5 MIN FOOTBALL TRAINING`
- `FOR KIDS`

The Cover is not played inside the video.

## Final consistency test
Before accepting each generated image verify:
- same boy
- same face/hair/age
- same outfit
- same 3D style
- same football world
- no second character
- correct scene number
- no unwanted text/UI in normal video scenes

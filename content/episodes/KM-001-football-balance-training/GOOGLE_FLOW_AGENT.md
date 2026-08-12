# KM-001 — Google Flow Agent Instructions

Use this file for the image-generation phase ONLY.
Do not assemble or render the video here.

Read first:
1. `REFERENCE_GUIDE.md`
2. `ALL_IMAGE_PROMPTS.md`

# GOAL
Generate the complete KM-001 image set with the SAME approved KidMotion boy throughout the episode.

# NON-NEGOTIABLE LOOP
For every required image:

`READ ONE PROMPT → GENERATE EXACTLY ONE IMAGE → CHECK IT → RENAME IT IMMEDIATELY → ONLY THEN CONTINUE`

Never generate two or more episode images at once.
Never postpone renaming.
Never compress scene numbering.

# ORDER
1. `Bild 00.png` — Cover
2. `Bild 01.png` — clean Intro
3. SKIP Scene 02 — Safety is Remotion-only; DO NOT create `Bild 02.png`
4. `Bild 03.png` — clean LET'S BEGIN background
5. `Bild 04.png`
6. `Bild 05.png`
7. `Bild 06.png`
8. `Bild 07.png`
9. `Bild 08.png`
10. `Bild 09.png`
11. `Bild 10.png`
12. `Bild 11.png`
13. `Bild 12.png`
14. `Bild 13.png`
15. `Bild 14.png`
16. `Bild 15.png`
17. `Bild 16.png` — clean Outro

# REFERENCE RULE
- Generate `Bild 00` using the approved KidMotion boy master reference.
- Generate `Bild 01` using the approved KidMotion boy master reference and the locked KM-001 football outfit/world.
- Check `Bild 01` carefully.
- Once `Bild 01` is approved, use **Bild 01 as the PRIMARY visual reference for every later image (`Bild 03`–`Bild 16`)**.

Do not use the text-heavy Cover as the primary later-scene reference once clean `Bild 01` exists.

# CHARACTER QA AFTER EVERY IMAGE
Before continuing, verify:
- exactly ONE visible character
- same approved boy
- same face
- same hair
- same age appearance
- same body proportions
- same royal-blue/lime football outfit
- same premium 3D style
- same football-world visual family
- no girl
- no second child
- no coach/spectator/background person

If any check fails, regenerate THIS image before continuing.

# CLEAN-IMAGE RULE
Only `Bild 00.png` may contain the final thumbnail text.

`Bild 01.png` and `Bild 03.png` through `Bild 16.png` must contain NO:
- exercise title
- instruction
- cloud / speech bubble
- subtitle
- caption
- timer
- progress bar
- countdown
- UI

Remotion adds all video text/UI later.

# POSE / COMPOSITION QA FOR EXERCISES
For `Bild 04`–`Bild 15`:
- 16:9 YouTube landscape
- full body clearly visible
- one static standing HOLD pose
- pose must be understandable from one image
- leave top-left reasonably clear for timer
- leave top-right reasonably clear for instruction cloud
- leave bottom-left reasonably clear for exercise title
- leave bottom edge clear for progress bar

# FINAL HANDOFF
Only after ALL required images are finished, renamed and validated:
1. confirm there is no `Bild 02.png`
2. confirm there are no duplicates or swapped scene numbers
3. confirm all normal video images are text/UI-free
4. confirm the same boy appears throughout
5. move/copy the complete set together into:
   `public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

That folder must contain only the active KM-001 episode assets before rendering.

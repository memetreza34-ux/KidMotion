# KM-002 — Render QA / Acceptance Gate

The uploaded test `KM-002-basketball.mp4` is REJECTED. Do not use it as the target reference.

## 1. Opening 0–14s
- [ ] Bild 01 visible immediately at 0.00s
- [ ] Intro is clean: badge + title + `12 POSES • 20 SEC EACH` + `FOLLOW ALONG` only
- [ ] no WELCOME TO
- [ ] no COPY • HOLD • HAVE FUN
- [ ] no duplicate chips
- [ ] Voice 01 starts at 0s
- [ ] Voice uses the current longer 11–14s script
- [ ] Voice may continue across Safety + LET'S BEGIN
- [ ] Voice ends before 14.00s / Scene 04
- [ ] background music is audible under Voice
- [ ] Safety Bild 02 visible from first frame, no pale blank flash
- [ ] LET'S BEGIN graphic is clearly visible on Bild 03

## 2. Every Exercise 04–15
- [ ] exercise image visible on its very first frame
- [ ] ZERO black flash at exercise start
- [ ] image does not zoom/pan
- [ ] full body stays visible
- [ ] pose passes one-still clarity
- [ ] exactly one Google Flow title bottom-left
- [ ] exactly one Google Flow instruction cloud top-right
- [ ] title/cloud style matches approved Bild 04 UI reference
- [ ] no thought-bubble dots
- [ ] title not clipped by frame/progress bar
- [ ] instruction cloud not clipped
- [ ] top-left timer safe zone remains clear
- [ ] correct ball count: ZERO or EXACTLY ONE according to data.json
- [ ] Remotion adds only timer + progress
- [ ] timer reaches visible 0
- [ ] progress reaches 100%
- [ ] no spoken Voice

## 3. Every Rest
- [ ] starts immediately with next exercise image visible
- [ ] ZERO white/pale flash
- [ ] no image zoom/pan
- [ ] compact REST + countdown appears TOP-LEFT only
- [ ] Rest UI does not overlap top-right instruction cloud
- [ ] no NEXT pose-name overlay
- [ ] no spoken Voice

## 4. Outro
- [ ] Bild 16 visible from first frame
- [ ] ZERO pale/blank flash
- [ ] Bild 16 itself contains ZERO generated text/graphics
- [ ] Remotion adds the ONE and ONLY `GREAT JOB!`
- [ ] one `WORKOUT COMPLETE` badge
- [ ] no duplicate completion text
- [ ] no spoken Voice

## 5. Audio
- [ ] Voice 01 is the current 11–14s opening recording
- [ ] no spoken Voice after 14s
- [ ] bg-music.mp3 exists
- [ ] bg music loops through full 5:13
- [ ] music audible around 20s
- [ ] music audible around midpoint
- [ ] music audible near end
- [ ] no lyrics/spoken samples

## 6. Technical
- [ ] 1920×1080
- [ ] 30 fps
- [ ] duration 313s / 5:13
- [ ] Cover Bild 00 not inside MP4
- [ ] `npm run typecheck` passes
- [ ] `npm run preflight` passes
- [ ] `npm run render` passes
- [ ] `npm run postrender:qa` passes

## Final rule
Do not mark PRODUCTION COMPLETE until this checklist is satisfied and the new MP4 has been visually reviewed at every scene boundary.

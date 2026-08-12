# KM-001 — Pre-Render QA

Antigravity / Codex / Remotion must pass every item before the final MP4 is accepted.

## Automated gate
- [ ] final KM-001 images are staged in `public/00-bildprompts/00-ALLE-BILDER-HIER-REIN/`
- [ ] final KM-001 voice clips are staged in `public/00-audio/`
- [ ] staging folders contain only KM-001 assets, not files from another episode
- [ ] `npm run typecheck` passes
- [ ] `npm run preflight` passes
- [ ] final render is performed with `npm run render:safe`

Do not bypass a failed automated check.

## Timeline
- [ ] `Bild 00.png` is NOT played inside the video; it is thumbnail only
- [ ] Intro is exactly 12s
- [ ] Safety is its own exactly 5s scene
- [ ] LET'S BEGIN is its own exactly 3s scene
- [ ] all 12 exercises are exactly 20s each
- [ ] rests after Scenes 04–14 are exactly 5s
- [ ] no rest after Scene 15
- [ ] Outro is exactly 5s
- [ ] final runtime is 320s / about 5:20

## Character / reference consistency
- [ ] exactly one recurring character appears: approved KM-001 boy
- [ ] no girl appears
- [ ] no second child / coach / spectator appears
- [ ] same face, hair, age appearance and proportions throughout
- [ ] same football outfit throughout
- [ ] same football-world visual family throughout
- [ ] `Bild 01.png` is the approved clean primary continuity reference for `Bild 03`–`Bild 16`

## Exercise plan
- [ ] 04 Football Ready Hold
- [ ] 05 Goalkeeper Squat Hold
- [ ] 06 Knee-Up Balance
- [ ] 07 Single-Leg Balance
- [ ] 08 Side Leg Hold
- [ ] 09 Standing Side Stretch
- [ ] 10 Calf Raise Hold
- [ ] 11 Wide Squat Hold
- [ ] 12 Side Lunge Hold
- [ ] 13 Forward Lunge Hold
- [ ] 14 Reach-Up Hold
- [ ] 15 Victory Balance
- [ ] every pose is static and understandable from one still image

## Google Flow images
- [ ] all images are 16:9
- [ ] `Bild 00.png` has correct thumbnail text
- [ ] normal video-scene images have NO exercise title baked in
- [ ] normal video-scene images have NO instruction text baked in
- [ ] normal video-scene images have NO cloud baked in
- [ ] no subtitles baked in
- [ ] no timer baked in
- [ ] no progress bar baked in
- [ ] no UI baked in

## Remotion exercise UI
- [ ] clean generated image fills the scene
- [ ] exercise title is bottom-left, not centered like a subtitle
- [ ] exercise title uses the KidMotion outlined athletic look
- [ ] instruction is upper-right in KidMotion white cloud/info bubble
- [ ] circular 20-second timer is top-left
- [ ] progress bar is along the bottom
- [ ] UI does not cover face, hands, feet or important joints
- [ ] timer starts at 20
- [ ] timer visibly reaches 0 on the final exercise frame
- [ ] progress bar reaches 100% on the final exercise frame

## Voice / audio
- [ ] voice is used only where needed
- [ ] no continuous narration just to fill time
- [ ] each exercise cue is short at the beginning, roughly 3–4s or less where natural
- [ ] remaining hold time is silent
- [ ] all 5-second KM-001 rest screens are silent
- [ ] short audio clips do NOT shorten exercise scenes
- [ ] no audio clip is stretched to fill a scene
- [ ] one master audio file, if used, is split/positioned correctly rather than stretched
- [ ] no automatic subtitles
- [ ] no voice captions

## Intro / start / outro
- [ ] Intro uses `Bild 01.png` with intentional Remotion text blocks
- [ ] Intro uses explicit cue timings: 0–2.3 / 2.3–5.4 / 5.4–8.6 / 8.6–12.0
- [ ] Intro text is designed scene UI, not transcript subtitles
- [ ] Safety does not overlap LET'S BEGIN
- [ ] `Bild 03.png` is clean and Remotion adds `LET'S BEGIN!`
- [ ] `Bild 16.png` is clean and Remotion adds `GREAT JOB!` / `WORKOUT COMPLETE`

## Publishing
- [ ] exactly one cross-platform caption
- [ ] exactly 5 hashtags
- [ ] caption includes `#KidMotion`

If any item fails, fix it before rendering or publishing.

# KM-003 — Full Body Workout — Pipeline V2

Status: Phase 1 complete. Image/audio production pending.

## Metadata
- Date: 2026-10-04
- Day: Sunday
- Theme: full-body-workout
- Topic: 5 minute full body workout for kids
- Episode: KM-003
- Runtime assets after activation: `public/episodes/2026-10-04/KM-003-full-body-workout/`

## Video
- 16:9 / 1920x1080 / 30 fps
- 313 seconds / 5:13
- one recurring KidMotion boy
- 12 different static full-body exercises
- 20 seconds each
- 11 transitions/rests of 5 seconds
- no spoken Voice after the 14-second opening

## Exercise order
1. READY SQUAT HOLD
2. STAR REACH HOLD
3. SIDE LUNGE HOLD
4. KNEE-UP BALANCE
5. WIDE SQUAT HOLD
6. AIRPLANE BALANCE
7. FORWARD LUNGE HOLD
8. SIDE LEG BALANCE
9. OVERHEAD REACH HOLD
10. KNEE HUG HOLD
11. SIDE STRETCH HOLD
12. POWER FINISH HOLD

## Production order
1. Generate three Bild 00 cover candidates and keep one winner.
2. Generate/approve Bild 01 as the primary character/outfit/world reference.
3. Generate Bild 02 and Bild 03.
4. Generate/approve Bild 04 as the exercise UI reference.
5. Generate Bild 05–15 using Bild 01 + Bild 04 references.
6. Generate Bild 16.
7. Inspect all final images and truthfully complete VISUAL_REVIEW.json.
8. Create Voice 01.mp3 and bg-music.mp3.
9. Run assets:approve, activate the episode, then render:safe.

## Runtime folder after activation

```text
public/episodes/2026-10-04/KM-003-full-body-workout/
├── images/
└── audio/
```

## Remotion ownership
Remotion only assembles the video/audio and draws the numeric countdown timer. Every other visible text element is generated inside the Google Flow images.

No final asset is approved yet.

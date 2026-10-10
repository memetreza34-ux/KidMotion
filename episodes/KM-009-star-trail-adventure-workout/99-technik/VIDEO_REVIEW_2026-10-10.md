# KM-009 — Review of uploaded FINAL_VIDEO (2026-10-10)

## Evidence and limits
User supplied actual 25.7 MB MP4 named `FINAL_VIDEO(20261010-153550).mp4`. Inspected sampled frames across the entire 313.045-second video and probed video/audio streams with ffprobe and FFmpeg. H.264 1920x1080, 30 fps, stereo AAC at 48 kHz. Audio stream exists; FFmpeg overall mean volume -28.8 dB and peak -5.3 dB (these values do not by themselves prove ideal spoken-word loudness or professional mixing). Video contains old 8-second thumbnail/title intro; newer GitHub prompt says HELLO. This uploaded MP4 must not be described as already updated by the source changes.

## Scene-by-scene observations and fixes

1. **0:00–0:08 (Szene 02):** Full-size STAR TRAIL ADVENTURE title, same marketing/thumbnail look. Viewer spends eight seconds on the video title. **FIX:** Cover image is standalone `COVER.png`, video begins with a real short greeting in a park (no repeated cover layout). Replace only through an authorized Phase-2 image/audio revision, then rerender and verify actual MP4.
2. **0:08–0:12 (Szene 03):** Large SAFETY FIRST message visible and easy to read. Keep basic safety content, but use a lighter visual balance where possible.
3. **0:12–0:14 (Szene 04):** A very brief LET'S BEGIN slide. Useful but ideally keep the momentum; do not reintroduce another oversized promotional title.
4. **0:14–5:09 exercises (12 x 20 seconds, 11 x 5-second GET READY):** Pose silhouettes generally readable, the girl maintains outfit and identity, and park materials and star trail are a meaningful improvement on Robot City. BUT still frames repeat for each entire 20-second hold; the child's next physical move is not demonstrated. Future engine should support a 1–3 second pose-in demonstration or approved 2–3 keyframes per exercise before a static hold and countdown, plus safe verbal cues if narration policy changes. Avoid inventing apparent motion from single still by zooming the entire figure.
5. **GET READY slides:** Large dark opaque panels remain in some frames (e.g. before LITTLE SQUAT). Standardize compact UI, preserve the full athlete and background, avoid the sign dominating half the screen.
6. **Background visual rhythm:** Similar golden-hour lighting, benches, fences, path angles and similar girl framing across most frames. Keep one coherent environment, but plan 3–5 zones and variable camera distance, angles and foreground visual progression; park is attractive but repetitive.
7. **Typography on phones:** Exercise name bottom-left and instruction top-right read on 1920x1080, but the smaller instruction may be difficult at mobile size. Contrast, font scale and safe placement should be verified at 360px preview width.
8. **Last scene 5:09–5:13:** GREAT JOB / TRAIL COMPLETE finale visually communicates completion, no need to insert the thumbnail here.
9. **Voice:** Per this episode's current contract, speech is concentrated in the first 14 seconds and the remaining workout is music. Do not fabricate synchronized full-video speech subtitles. If adding cues, first change audio contract and ensure matching recorded audio and captions. Consider brief helpful guidance at exercise changes with TTS timings grounded to actual speech.

## Recommended next build order

P0: Reliable real-image production, immediate canonical rename and automatic missing-output inventory (`flow:save`, `flow:verify`, `flow:batch`, `phase2:finalize`).
P0: Prevent stale title/cover from being used as the in-video greeting. Verify the **rendered MP4**, not just a prompt.
P1: Build optional pose-entry animation clips or preapproved instructional keyframes, with scene-integrity/postrender QA updated to allow the intended motion without masking wrong scenes.
P1: Move visual captions/UI to centrally controlled render overlays only after coordinated contract and postrender changes, to reduce inconsistent Google Flow text panels.
P2: More deliberate image variety and more meaningful progress cues, accessible high-contrast smartphone text, tasteful music/SFX with clear rights.

Do not claim that uploading this MP4 to chat places it on the user's Mac, in GitHub or inside the deployed Flow production. Source audit files are not proof of generated assets.

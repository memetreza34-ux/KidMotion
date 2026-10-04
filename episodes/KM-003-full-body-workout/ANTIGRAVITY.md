Read GEHIRN.md first.

HARD STOP WORKFLOW:
1. Generate exactly three cover candidates in `00-bildprompts/images/`.
2. Show all three to the user.
3. STOP and wait for the user's explicit choice. Do not generate Szene 02 or later before that choice.
4. After the user chooses, run `npm run kidmotion:select-cover -- --episode=KM-003-full-body-workout --candidate=<1|2|3>`.
5. The winner becomes `Szene 01.png`; rejected candidates are deleted.
6. Use `Szene 01.png` as the PRIMARY reference for character, face, hair, proportions, outfit, colors, lighting and world.
7. Only then generate `Szene 02.png` through `Szene 28.png`, renaming each accepted result immediately.
8. `Szene 05.png` is the SECONDARY exercise title/instruction UI reference.
9. Use the 12 R3 challenge poses from `IMAGE_PLAN.json`. Do not fall back to generic squat/lunge/balance repetition.
10. Every five-second transition has its own GET READY image. Never reuse the next 20-second exercise image.
11. Keep every final scene in the same flat `00-bildprompts/images/` folder.
12. Google Flow creates every visible text element except the changing countdown timer. Remotion adds only the timer.
13. Follow `02-audio/MUSIC_BRIEF.md` for the new music direction.
14. Never mark VISUAL_REVIEW true without inspecting all actual final R3 images.

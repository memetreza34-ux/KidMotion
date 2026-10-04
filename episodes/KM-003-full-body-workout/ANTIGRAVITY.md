Read GEHIRN.md first.

HARD STOP WORKFLOW:
1. Generate exactly three cover candidates in `00-bildprompts/images/`:
   - `Cover-Kandidat-01.png`
   - `Cover-Kandidat-02.png`
   - `Cover-Kandidat-03.png`
2. Show all three to the user.
3. STOP and wait for the user's explicit choice. Do not generate Szene 02 or later before that choice.
4. After the user chooses, run `npm run kidmotion:select-cover -- --episode=KM-003-full-body-workout --candidate=<1|2|3>`.
5. The winner becomes `Szene 01.png`; rejected candidates are deleted.
6. Use `Szene 01.png` as the PRIMARY reference for character, face, hair, proportions, outfit, colors, lighting and world for every later scene.
7. Only then generate `Szene 02.png` through `Szene 17.png`, renaming each accepted result immediately.
8. Generate and approve `Szene 05.png` before Szene 06–16. Use Szene 05 only as the SECONDARY exercise title/instruction UI reference.
9. Keep every final scene in the same flat `00-bildprompts/images/` folder.
10. Google Flow creates every visible text element except the changing countdown timer. Remotion adds only the timer.
11. Never mark VISUAL_REVIEW true without inspecting the actual final images.

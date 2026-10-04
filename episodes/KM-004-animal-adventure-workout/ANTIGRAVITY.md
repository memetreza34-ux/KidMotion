Read GEHIRN.md first.

HARD STOP:
1. Generate exactly three cover candidates only.
2. Show all three to the user.
3. STOP and wait for explicit user selection.
4. Select with `npm run kidmotion:select-cover -- --episode=KM-004-animal-adventure-workout --candidate=<1|2|3>`.
5. Winner becomes `Szene 01.png`.
6. Use `Szene 01.png` as PRIMARY reference for identity/outfit/world.
7. Only then generate `Szene 02.png` through `Szene 28.png`.
8. Use `Szene 05.png` only as SECONDARY exercise UI reference.
9. Exercise scenes and GET READY scenes must alternate after Szene 05.
10. Every GET READY scene must be neutral and must NOT reveal the next exercise pose.
11. Keep top-left 230x230 clear on Exercise and GET READY scenes.
12. Google Flow creates all visible text except the changing timer.
13. Remotion adds only the timer.
14. Never mark VISUAL_REVIEW true without inspecting the real final images.

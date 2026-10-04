# KM-002 — Antigravity V2

Read in this order:
1. `GEHIRN.md`
2. `config/pipeline.json`
3. `config/visual-policy.json`
4. `characters/CHARACTER_BIBLE.md`
5. `episodes/KM-002-basketball/99-technik/episode.json`
6. `episodes/KM-002-basketball/99-technik/IMAGE_PLAN.json`
7. `episodes/KM-002-basketball/00-bildprompts/google-flow-prompt.txt`

Hard workflow:
- Bild 00: 3 temporary cover candidates → 1 winner only.
- Bild 01: generate and approve first; PRIMARY character/world reference.
- Bild 04: generate and approve before Bild 05–15; SECONDARY UI reference.
- Final accepted images only in `00-bildprompts/images/`.
- Never set `VISUAL_REVIEW.json` true without actually inspecting the final files.
- Never bypass `assets:approve`, SHA-256 lock, preflight or asset gate.
- Do not create extra Voice files.
- Do not add Ken Burns/zoom/pan to Exercise or Rest images.

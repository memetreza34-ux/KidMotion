# KidMotion Agent instructions — Phase 1 handoff

Applies to ALL future KidMotion episodes, including workout, pure learning and learn-and-move.

**MANDATORY after Phase 1 is finished:** Run the correct QA (`npm run prompt:qa -- --episode=<folder>` for workout / learn-and-move; `npm run learning:prompt:qa -- --episode=<folder>` for pure learning) or `npm run phase1:links -- --episode=<folder>`. The two verified source files are `00-bildprompts/google-flow-prompt.txt` and `01-voice-script/voice-script.txt`. QA automatically writes `PHASE1_START_HIER.md` and `99-technik/PHASE1_HANDOFF.json` and prints two links. Commit/push the completed files and handoff before promising working tablet links. **Then always add two separately clickable links to the CHAT ANSWER** (not only a code block, document or console):

- [Google-Flow-Prompt öffnen](https://github.com/memetreza34-ux/KidMotion/blob/main/episodes/<episode-folder>/00-bildprompts/google-flow-prompt.txt)
- [Voice-over-Skript öffnen](https://github.com/memetreza34-ux/KidMotion/blob/main/episodes/<episode-folder>/01-voice-script/voice-script.txt)

Replace `<episode-folder>` with the actual episode folder. Link directly to the two content files, not to repository root or a placeholder. Mobile use: view/copy prompt into https://flow.google.com and voice text into TTS; a GitHub link does not automatically fill Google Flow. If QA fails, explain the blocker and do not claim Phase 1 is finished or link to an unpushed draft as completed. This is an ongoing requirement, not a one-off for KM-008. Do not generate images simply because Phase 1 is complete; cover selection and existing permission gates still apply.

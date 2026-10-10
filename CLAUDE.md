# Claude Code — KidMotion

Read and follow [AGENTS.md](AGENTS.md) and [START-HIER.md](START-HIER.md).

Critical user experience requirement: after **every passed Phase 1** for **every KidMotion format**, automatically print and include in the final assistant reply two clickable links: **Google-Flow-Prompt öffnen** and **Voice-over-Skript öffnen**, pointing to that specific episode's source files. The `prompt:qa` / `learning:prompt:qa` scripts now create `PHASE1_START_HIER.md` + `99-technik/PHASE1_HANDOFF.json` and emit the Markdown. Commit/push the finished sources and generated handoff before claiming they work on a tablet. See `npm run phase1:links -- --episode=<folder>` for verified regeneration. Never mark Phase 1 complete when QA fails.

## Mandatory Flow verification
Follow PHASE2_FLOW_AGENT.md. ALWAYS check actual real files after each Flow request, save and rename immediately, run `flow:verify` and retry genuinely absent scenes only. After 3 technical failures stop with an explicit error, preserve queue. Never promise automatic picture creation from the local checker, never regenerate existing images, never claim all 28 exist until `phase2:finalize` reports COMPLETE.

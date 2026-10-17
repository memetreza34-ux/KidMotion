# Claude Code — KidMotion

Read and follow [AGENTS.md](AGENTS.md) and [START-HIER.md](docs/START-HIER.md).

Critical user experience requirement: after **every passed Phase 1** for **every KidMotion format**, automatically print and include in the final assistant reply two clickable links: **Google-Flow-Prompt öffnen** and **Voice-over-Skript öffnen**, pointing to that specific episode's source files. The `prompt:qa` / `learning:prompt:qa` scripts now create `PHASE1_START_HIER.md` + `99-technik/PHASE1_HANDOFF.json` and emit the Markdown. Commit/push the finished sources and generated handoff before claiming they work on a tablet. See `npm run phase1:links -- --episode=<folder>` for verified regeneration. Never mark Phase 1 complete when QA fails.

## Mandatory Flow verification
Follow docs/PHASE2_FLOW_AGENT.md. ALWAYS check actual real files after each Flow request, save and rename immediately, run `flow:verify` and retry genuinely absent scenes only. After 3 technical failures stop with an explicit error, preserve queue. Never promise automatic picture creation from the local checker, never regenerate existing images, never claim all 28 exist until `phase2:finalize` reports COMPLETE.

## Highest priority — empirical learning

For each real video: create PENDING review via `npm run quality:review:init -- --episode=<folder> --video=<actual MP4>`, watch the full video and review real assets, then document findings, timestamped observations and precise next actions. `npm run quality:gate` blocks new episodes while any review is pending. Do NOT mark a report complete automatically or infer quality from prompts. Every new phase 1 must pass the `IMPROVEMENT_APPLICATION.json` real source-evidence checks. Update `config/continuous-improvement.json` with confirmed lessons, implement and test fixes in scripts and visual prompts, track analytics when truly accessible, and evaluate whether the next real video improved. Reference `quality/README.md` and YouTube Studio first-30-second retention and replay/drop-off locations.

## Absolutely required Phase-1 tablet handoff in chat

After EVERY successful Phase-1 QA (workout, learning, learn-and-move), push the finished sources and reply with **two separate directly clickable episode-specific GitHub URLs** in your **user-visible chat reply**: (1) the entire `google-flow-prompt.txt` (all covers and scenes); (2) the complete `voice-script.txt`. Read `99-technik/PHASE1_CHAT_ANTWORT.md` or `PHASE1_HANDOFF.json.chatReplyMarkdown`; both are automatically generated, and paste the real actual URLs. No placeholders, screenshots, indirect repo links, or console-only output. If not pushed/QA-passed, state the blocker. A GitHub hyperlink opens content for manual copy, it doesn't fill Google Flow automatically.

## Compact YouTube export

After each episode, `03-export` must have ONLY `YOUTUBE_UPLOAD.txt` with title, complete description and five hashtags, plus separate real `FINAL_VIDEO.mp4` and `COVER.png` once rendered. Move SRT, voice timestamps, video timeline, and `UPLOAD_METADATA.md` to `99-technik`. Never reintroduce duplicate `YOUTUBE_TITLE.txt`, `YOUTUBE_DESCRIPTION.txt` or `YOUTUBE_KOPIEREN.txt`; the export generator is responsible for this. Retain the two direct Phase 1 source links in chat.

## Mandatory immediate intro text
After the cover selection, the first video scene (Szene 02) must provide a clean LEFT area and NO BAKED TEXT. Remotion overlays the sole HELLO! immediately from first frame. Keep scene 01 as a separate thumbnail. Use `introVisualPolicy=greeting-overlay-frame-zero-v1` and the `introOverlayText=HELLO!` field for every newly generated workout. The intro Remotion overlay must appear from video frame zero, not after an empty scene. Do not add an episode-title/cover card or duplicate the HELLO inside Flow-generated picture. Existing episodes keep the previous policy until intentionally revised.

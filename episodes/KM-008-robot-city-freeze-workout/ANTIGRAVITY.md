# KM-008 — Antigravity instructions

Inherit global [ANTIGRAVITY.md](../../ANTIGRAVITY.md). No image generation by default, even if scenes 26 and 28 are missing.

Only after the user **explicitly says Antigravity should create specific missing images**, use the temporary Phase 2 repair flow. For example, if and only if the user expressly approves scenes 26 and 28:

```bash
npm run images:permission -- --episode=KM-008-robot-city-freeze-workout --grant=26,28 --user-instruction="the user's actual explicit instruction"
npm run images:permission -- --episode=KM-008-robot-city-freeze-workout --check=26
# Generate real Szene 26 using its exact IMAGE_PLAN prompt and selected Szene 01.png only.
npm run flow:save -- --episode=KM-008-robot-city-freeze-workout --scene=26 --source="/real/Flow-download.png" --antigravity=1
npm run images:permission -- --episode=KM-008-robot-city-freeze-workout --check=28
# Generate real Szene 28 using its exact IMAGE_PLAN prompt and selected Szene 01.png only.
npm run flow:save -- --episode=KM-008-robot-city-freeze-workout --scene=28 --source="/real/Flow-download.png" --antigravity=1
npm run phase2:finalize -- --episode=KM-008-robot-city-freeze-workout
```

**This is not authorization from the current policy discussion to generate scenes 26/28 right now.** The user must explicitly instruct that action.

After successful Phase 2 repair: `phase3:prepare` → actual image review → `assets:approve` → `kidmotion:activate` → `phase3:gate` → `render:safe`.
If images are already present, only normalize their filenames; do not regenerate.
Never generate or modify source images inside Phase 3 montage.

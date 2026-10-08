# KidMotion Scripts

## Format-Router

```bash
npm run kidmotion:new -- --format=workout --topic="..."
npm run kidmotion:new -- --format=learning --topic="..."
npm run kidmotion:new -- --format=learn-and-move --topic="..."
```

## Workout

- `npm run prompt:qa -- --episode=...`
- `npm run flow:batch -- --episode=...`
- `npm run scene:qa -- --episode=...`
- `npm run assets:approve -- --episode=...`
- `npm run kidmotion:activate -- --episode=...`
- `npm run phase3:gate -- --episode=...`
- `npm run render:safe`

## Pure Learning

- `npm run learning:prompt:qa -- --episode=...`
- `npm run learning:activate -- --episode=...`
- `npm run learning:preflight`
- `npm run learning:assets:approve -- --episode=...`
- `npm run learning:asset:gate`
- `npm run learning:render`

Pure Learning hat keinen Countdown-Timer, keine GET-READY-Pflicht und keinen Character-Zwang.

## Global

- `npm run scripts:check`
- `npm run project:doctor`
- `npm run repo:qa`

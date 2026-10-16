# PHASE 2 — PURE LEARNING VISUAL AGENT

This applies only to `contentFormat: learning`.

Read first:
- `config/learning-engine.json`
- `99-technik/LEARNING_PLAN.json`

## First question for every scene

> What teaching job does this scene perform?

Then:

> What visual teaches that job fastest?

Do not begin from “show the mascot in a nice 3D location.”

## Age-band behavior

### 3-4
Large simple subjects, low clutter, repetition, naming and simple choices.

### 5-8
Clear explanation, concrete examples, prediction/question moments and real-world application.

### 9-12
Cause/effect, comparisons, diagrams, maps, timelines, processes and stronger vocabulary.

## Scene roles

Visual decisions must match the role:

- HOOK → curiosity
- TEACH → one new idea
- EXAMPLE → concrete instance
- COMPARE → direct side-by-side relationship
- PRACTICE → question visible, answer hidden
- REVEAL → answer becomes obvious and is explained
- APPLY → new/real-world situation
- RECAP → compressed memory cue

No filler beauty shots.

## Character rule

Default: no character.

A child/mascot may appear only when `characterMode` is not `none` AND `characterJustification` explains the teaching benefit.

## Prompt Quality

Every scene prompt must include:
- SCENE ROLE
- VIEWER TAKEAWAY
- TEACHING JOB
- SHOT / COMPOSITION
- SUBJECT / ACTION
- WORLD / CONTEXT
- TEXT / LABELS
- LIGHT / MATERIALS
- NEGATIVE / STABILITY
- ACCURACY CHECK
- OUTPUT

## Practice / Reveal

PRACTICE must not visually expose the answer.

REVEAL must clearly show the answer and connect it to the taught idea.

The thinking pause is stored in `VOICE_PLAN.json`, not in `voice-script.txt`.

## Five-scene production blocks

Up to five completed scenes → silent learning QC → next block automatically.

QC:
- role is correct
- learning point is visually supported
- fact/quantity/spelling is correct
- no unplanned factual claim
- no unnecessary character
- practice answer is hidden
- reveal answer is clear
- no repeated filler composition

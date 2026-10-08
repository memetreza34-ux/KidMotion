# FORMAT ROUTER

KidMotion is a **general children's channel**, not a workout-only channel.

Before creating any episode, classify it.

## WORKOUT
Use when the main promise is physical activity.

Examples:
- 5 Minute Jungle Workout
- Animal Freeze Challenge
- Space Fitness Adventure

Rules:
- uses the existing Workout V3 contract
- 12 exercises / GET READY / countdown timer
- recurring mascot/character is part of the current workout visual system

## LEARNING
Use when the main promise is knowledge or a skill.

Examples:
- Learn Numbers 1–10
- ABC / Alphabet
- Colors and Shapes
- Why Do Volcanoes Erupt?
- Planets for Kids
- Animals and Their Habitats
- How Trains Work
- Simple Geography or Science

Rules:
- NO workout structure
- NO forced movement
- NO GET READY
- NO timer requirement
- NO child or mascot requirement
- narration may continue through the full video
- scene count and timing are flexible
- use objects, diagrams, animals, maps, illustrations, environments or characters according to what teaches best

## LEARN_AND_MOVE
Use only when movement truly improves learning.

Example:
- Count to 10 while doing ten simple movements

This is optional. It must never be used as the default for a learning topic.

## Generator

`npm run kidmotion:new -- --format=workout --topic="..."`

`npm run kidmotion:new -- --format=learning --topic="..."`

`npm run kidmotion:new -- --format=learn-and-move --topic="..."`

If no format is supplied, generation must stop instead of silently assuming workout.


## Learning Engine selection

Pure learning also requires:
- age band: `3-4 | 5-8 | 9-12`
- learning mode: `CONCEPT_STORY | QUESTION_EXPLAINER | SONG_MEMORY | PRACTICE_REVEAL | VISUAL_COMPARE | MINI_DOCUMENTARY`

Example:

`npm run kidmotion:new -- --format=learning --topic="Why do volcanoes erupt?" --age-band=5-8 --learning-mode=QUESTION_EXPLAINER`

The assistant should choose the mode from the teaching goal, not from visual style.

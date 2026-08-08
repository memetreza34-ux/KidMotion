# KidMotion — Episode Folder Standard

Jede neue Episode bekommt exakt diese Produktionsstruktur:

```text
episodes/KM-XXX-slug/
├── 01-plan/
│   ├── episode.md
│   └── scene-plan.json
├── 02-all-prompts/
│   ├── ALL_IMAGE_PROMPTS.md
│   └── ALL_VOICE_TEXTS.md
├── 03-scenes/
│   ├── 00-cover/
│   │   ├── scene.md
│   │   ├── image-prompt.txt
│   │   ├── cover-text.txt
│   │   └── 00-cover.png
│   ├── 01-scene/
│   │   ├── scene.md
│   │   ├── image-prompt.txt
│   │   ├── voice.txt
│   │   ├── scene-01.png
│   │   └── scene-01.wav
│   └── ...
├── 04-voice/
│   └── voice-manifest.md
├── 05-publishing/
│   └── publishing.md
├── 06-render/
│   └── final.mp4
└── data.json
```

## Pflichtinhalt jeder normalen Szene
- Exercise / Pose Name
- Keyword
- Mini instruction
- exact English voice text
- exact image prompt
- duration
- timer/rest behavior
- character
- filename mapping

## Pflichtinhalt 00-cover
- Cover concept
- exact cover text
- exact cover image prompt
- final cover image

## Sammeldateien
`ALL_IMAGE_PROMPTS.md` enthält Cover + alle Szenenprompts in Produktionsreihenfolge.
`ALL_VOICE_TEXTS.md` enthält alle Voice-Texte in Produktionsreihenfolge.

Der Nutzer kann dadurch alle Bilder und danach alle Audios am Stück extern erzeugen und anschließend in die jeweiligen Szenenordner legen.

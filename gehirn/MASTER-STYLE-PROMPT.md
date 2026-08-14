# KidMotion — Master Style Prompt

Use this block as the fixed visual-style foundation for KidMotion image prompts.

```text
High-end stylized 3D animation, polished family-entertainment quality, original character design, soft cinematic lighting, clean shapes, expressive but child-appropriate face, realistic-enough child body proportions for demonstrating fitness and sports poses, slightly stylized larger eyes but NOT oversized head, premium materials, soft skin shading, detailed hair, colorful but tasteful sportswear, clear readable static pose, uncluttered composition, premium YouTube Kids presentation, 16:9 landscape composition, full body visible when required.

Use ONLY the one approved KidMotion episode character selected for this video. Preserve exact face identity, age appearance, skin tone, hairstyle, body proportions and overall rendering style. Do not introduce the other KidMotion character or any second visible child/person.

Use the episode-specific themed outfit and world exactly as defined in that episode's REFERENCE_GUIDE.md. Outfit/world stay consistent within the episode.

For EXERCISE images, create the final exercise title BOTTOM-LEFT and the final short instruction TOP-RIGHT inside the KidMotion white cloud/info bubble exactly as specified in the scene prompt. Keep TOP-LEFT free for the Remotion timer and the bottom edge free for the Remotion progress bar.

Exercise images: NO subtitles, NO transcript/caption bars, NO timer, NO progress bar, NO duplicate title, NO duplicate instruction.

For Intro, Safety, LET'S BEGIN and Outro images, follow the scene prompt's negative-space requirement for its intentional Remotion graphic. Do not generate subtitles, transcript bars, timer or progress bar.

Cover / thumbnail Bild 00 contains its final thumbnail text as specified.

No existing brand logos. No copyrighted characters. No recognizable franchise resemblance. No photorealistic child. No adult proportions. No exaggerated muscles. No chibi proportions. No malformed hands or limbs.
```

## Usage
Every scene-specific prompt defines:
1. IMAGE NUMBER / scene / final filename
2. one locked episode character
3. exact static pose
4. expression
5. camera framing
6. episode background/world
7. exact text responsibility for that scene
8. negative-space needs for Remotion timer/progress or non-exercise UI
9. immediate rename instruction

For exercise scenes, the prompt must explicitly provide the exact final title and exact final instruction cloud text.

# KidMotion — Video-Regeln

# SOURCE OF TRUTH — AKTUELLE PRODUKTIONSSTRUKTUR

## 1. Ein Video = ein Hauptcharakter
Von Cover bis Outro wird innerhalb einer Episode derselbe KidMotion-Hauptcharakter verwendet.
Kein Wechsel zwischen Boy und Girl innerhalb desselben Videos.
Gesicht, Haare, Alter, Hautfarbe, Körperproportionen, Outfit und Themenwelt bleiben innerhalb der Episode konsistent.

## 2. YouTube Longform
- 16:9
- 1920x1080
- Startphase: mindestens ca. 5 Minuten
- ca. 10–12 Übungen pro Video

## 3. Cover
`Bild 00.png` ist ausschließlich das YouTube-Thumbnail.
Das Cover wird NICHT als erste Videoszene abgespielt.

## 4. Startphase = statische stehende Hold-Übungen
Aktuell bevorzugt KidMotion Übungen, die aus dem Stand mit EINEM statischen Bild eindeutig verstanden und für 20 Sekunden gehalten werden können.

Beispiele:
- football ready hold
- goalkeeper squat hold
- knee-up balance
- single-leg balance
- side leg hold
- standing side stretch
- calf raise hold
- wide squat hold
- side lunge hold
- forward lunge hold
- reach-up hold
- victory balance

Keine Jumping Jacks, Burpees, Running in Place oder andere wiederholte Bewegungen im aktuellen Standardformat.

## 5. Jede Übung exakt 20 Sekunden
Die aktive Pose dauert exakt 20 Sekunden.
Die Länge des Voice-Clips ändert diese 20 Sekunden NICHT.

Beispiel:
- Voice 0–3 s
- danach 17 s ohne Sprache
- Bild, Timer und Progress Bar laufen trotzdem bis Sekunde 20 weiter

## 6. HARTE REGEL — Google Flow erzeugt saubere Bilder OHNE Video-Text
Normale Szenenbilder aus Google Flow / Antigravity enthalten:
- denselben Hauptcharakter
- korrekte Pose
- passenden Hintergrund / Themenwelt
- vollständige Figur, wenn für die Pose nötig

Sie enthalten NICHT:
- Übungsname
- Anweisung
- Cloud/Textbubble
- Untertitel
- Timer
- Progress Bar
- Countdown
- sonstige Video-UI

Ausnahme: Das separate Cover `Bild 00.png` darf den Thumbnail-Text enthalten.

## 7. HARTE REGEL — Remotion setzt den sichtbaren Text AUF das Bild
Bei jeder Übung legt Remotion die Informationen über das Google-Flow-Bild:
- Übungsname
- kurze Ausführungsanweisung
- weiße Cloud / Info-Bubble für die Anweisung
- 20-Sekunden-Timer
- Progress Bar

Dadurch bleiben Schriftart, Größe, Position und Design über alle Szenen exakt konsistent.

Standard-Layout:
- Figur groß und klar sichtbar
- Übungsname unten links
- kurze Anweisung oben rechts in der KidMotion-Cloud
- Timer so positionieren, dass Cloud und Figur nicht verdeckt werden
- Progress Bar unten

## 8. HARTE REGEL — KEINE UNTERTITEL
Im gesamten KidMotion-Video gibt es keine automatischen Untertitel und keine Voice-Captions.

Nicht verwenden:
- Wort-für-Wort-Captions
- Subtitle-Box unten/mittig
- automatisch transkribierte Voice
- dauerhaft mitlaufenden gesprochenen Text

Sichtbar sind nur bewusst gestaltete UI-Texte der Szene.

## 9. Voice nur bei Bedarf
Ein 5-Minuten-Video darf nur etwa 45–75 Sekunden tatsächliche Sprache enthalten.

Voice ist sinnvoll für:
- Intro
- Safety
- optional kurzer Start-Cue
- kurzer Übungs-Cue am Anfang einer Pose
- optional kurzer Rest-Hinweis
- Outro

Während des größten Teils eines 20-Sekunden-Holds bleibt es ruhig.
Keine künstlichen Füllsätze.

## 10. Audio und Videolänge sind unabhängig
Remotion steuert die komplette Timeline.
Ein 3-Sekunden-Voice-Clip kann am Anfang einer 20-Sekunden-Szene liegen; danach läuft die Szene 17 Sekunden ohne Sprache weiter.

Eine kurze Audio-Gesamtdauer darf deshalb nicht dazu führen, dass das Video verkürzt wird.
Voice darf auch nicht künstlich auf die Szenenlänge gestreckt werden.

## 11. Standard-Timeline
1. `00-cover` — Thumbnail only, nicht Teil des Videos
2. `01-intro` — ca. 8–15 s, Bild + Remotion-Text + kurze Voice
3. `02-safety` — ca. 4–5 s, Remotion
4. `03-lets-begin` — ca. 2–3 s, Bild + Remotion-Text, optional kurzer Voice-Cue
5. Übungen — jeweils exakt 20 s
6. Rest/Transition — typischerweise 5 s zwischen Übungen
7. Outro — ca. 4–6 s, `GREAT JOB!`

## 12. Intro
Intro nutzt dasselbe Hauptcharakter-Bild und Remotion-Textblöcke.
Keine Untertitel.
Text erscheint nur als bewusst gestaltete Intro-Grafik, nicht als Transkript.

## 13. Safety
Safety ist eine eigene kurze Szene vor `LET'S BEGIN!`.
Sie darf nicht über die Startkarte oder erste Übung gelegt werden.

## 14. LET'S BEGIN
`LET'S BEGIN!` wird als Remotion-Text auf das saubere Szenenbild gelegt.
Kein Timer.
Keine Untertitel.

## 15. Rest-Screens
Kurze Rest-Szene zwischen Übungen.
Optional anzeigen:
- `REST`
- `NEXT: [POSE]`

Voice nur wenn sinnvoll.

## 16. Outro
Nach der letzten Übung:
- derselbe Hauptcharakter
- Victory-Pose
- Remotion-Text `GREAT JOB!`
- optional `WORKOUT COMPLETE`
- kurzer Glückwunsch als Voice
- keine Untertitel

## 17. Remotion ist zuständig für
- Timeline
- Szenendauer
- Intro-Texte
- Safety-Screen
- LET'S BEGIN-Text
- Übungsname
- Übungsanweisung / Cloud
- 20-Sekunden-Timer
- Progress Bar
- Rest-Screens
- Outro-Texte
- Voice-Platzierung mit bewussten Silent-Gaps
- Übergänge / dezente Zooms

## 18. Google Flow / Antigravity ist zuständig für
- saubere 16:9 Szenenbilder
- exakt denselben Charakter innerhalb der Episode
- richtige statische Pose
- konsistentes Outfit
- konsistente Themenwelt
- Cover mit Thumbnail-Text

Nicht für Video-Untertitel oder dynamische UI.

## 19. QA vor finalem Render
Prüfen:
- Cover nicht im Video
- ein einziger Hauptcharakter
- keine Untertitel
- alle Übungstexte von Remotion
- Google-Flow-Szenenbilder ohne eingebrannten Übungstext
- jede Pose exakt 20 s
- Timer sichtbar
- Progress Bar sichtbar
- Voice nur kurz bei Bedarf
- Silent-Gaps bleiben erhalten
- Video bleibt mindestens ca. 5 Minuten, auch wenn die Voice deutlich kürzer ist

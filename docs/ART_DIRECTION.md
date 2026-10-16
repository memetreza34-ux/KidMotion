# KidMotion — Storyworld Art Direction v1

Kinderfreundlich heißt NICHT babyhaft, künstlich bunt oder automatisch gut, nur weil ein Prompt „warm“ und „smile“ enthält. Das Ziel ist eine **liebevoll gestaltete glaubwürdige Erlebniswelt**.

## Ursache der bisherigen Fehler

Im am 9. Oktober 2026 gezeigten Google-Flow-Screenshot von KM-008 wirken die Szenen 25–27 wie sehr ähnliche leere Pastell-Sportplätze: hohe runde Fantasietürme, blasse Lichteffekte, wenig visuelle Geschichte. In GET READY verdrängt eine riesige dunkle Texttafel das Mädchen. Die menschliche Figur ist lesbar, aber das Set wirkt austauschbar.

## Verbindliche Regie

1. **Figur:** ein echter erkennbarer stilisierter *menschlicher* Junge oder ein Mädchen in Workout-Szenen; Mimik entspricht dem Moment (neugierige Erwartung, fokussierte Balance, echte Freude, stolz aufs Geschaffte). Kein identisches Dauergrinsen. Bewegungsstellung und Gelenke müssen gut lesbar bleiben.
2. **Welt:** Kindergerechter Bodenbezug und nachvollziehbare menschliche Proportionen. Ein echtes Spielgelände, Schulhof, Gartensportplatz, Turnraum, naturnaher Park oder klarer Aktivitätsweg. Weiche Gummimatten, Gras, bemalter Holzzaun, sanfte Baumformen und niedrige Bank sind greifbarer als riesige fremdartige Türme.
3. **Thema:** Robot City darf freundliche kleine Technikmotive haben (Bodenleuchten, lustige Schalter am Spielpfad, farbige Markierungen), aber keine absurde futuristische Skyline, übergroße Silos, merkwürdige Säulen oder leere Raumhafenflächen.
4. **Ein sichtbares Story-Detail je Bild:** Ein handbemalter Stern auf dem Boden, eine kleine Ziel-Fahne, Hüpfsteine, ein Bodenpfeil, ein markierter Balance-Pfad. Detail muss die *aktuelle* Bewegung oder Mission erklären. Keine zufälligen Gegenstände zur Dekoration.
5. **Farbdramaturgie:** Klarer Himmel, lebendiges Grün, warme Korall-Akzente, Sonnengelb, dosiertes Türkis und Lavendel. Abwechslung statt derselben verwaschenen Pfirsich/Türkis-CGI-Fläche in allen 28 Bildern.
6. **Tiefenwirkung:** Charakter und übungssicherer Vordergrund im Fokus, eine kleine charakteristische Zone im Mittelgrund, glaubwürdige ruhige Tiefe dahinter; keine sterile leere Kulisse.
7. **Variation mit Zusammenhalt:** Ein und dieselbe identifizierbare Welt mit 3–5 Zonen (Parkweg, Mattenzone, Gartenhof, Aktivitätsfeld, Zielmarkierung). Gleicher Character, aber für jede Szene eigene durchdachte Kameraperspektive, Bewegung, kleine Aufgabe.
8. **Textgestaltung:** In V3 bleibt Flow Eigentümer aller sichtbaren Nicht-Timer-Texte. Trotzdem darf `GET READY` nicht zur schwarzen Riesenplakatwand werden. Kompakte Schriftfläche, Figur bleibt Mittelpunkt; oben links 230×230 Pixel für den Timer freihalten.
9. **Keine heimliche Reparatur:** Aktuell gilt weiterhin die Einmal-Generierungsregel. Schlechte Bilder blockieren die Freigabe. Bereits vorhandene Bilder nur nach ausdrücklicher Genehmigung als neue kontrollierte Phase-2-Revision überarbeiten, nie in Phase 3 ersetzen.

## Kurze Promptbeispiele

Schlecht: „Colorful futuristic sports plaza with big pastel towers. A friendly girl smiles. One playful accent.“

Besser: „WORLD / ENVIRONMENT: sunny neighborhood activity park with low painted benches, real green trees, warm rubber sports floor and a small child-height signal marker on the side. PLAY DETAIL / STORY BEAT: a line of hand-painted star footprints leads to a tiny blue finish flag, matching the upward reach exercise. WARMTH / MOOD: the girl proudly smiles after finishing, with natural eye contact and lively afternoon light.“

Für eine Bodenübung: „WORLD / ENVIRONMENT: cozy school gym with an emerald green exercise mat on wood floor and low shelves in the back. PLAY DETAIL / STORY BEAT: three hand-painted circles beside the mat mark the imaginary power charge. WARMTH / MOOD: concentrated but friendly face, grounded realistic contact shadows.“

## Verbindliche Qualitätssperren

- Neue Episoden aus `kidmotion:new:workout` tragen `artDirectionPolicy: storyworld-v1`. Ihre Flow-Prompts erfordern `PLAY DETAIL / STORY BEAT:` plus genaue Umgebung und passende Mimik.
- Vor der Generierung `npm run prompt:qa -- --episode=<episode-folder>` ausführen; zusätzliche Kontrollen aus `scripts/art-direction-qa.mjs` stoppen austauschbare/plakative Setups.
- Nach der Generierung *echte* `Szene 01.png` bis `Szene 28.png` ansehen und `99-technik/ART_DIRECTION_REVIEW.json` pro Bild mit sichtbaren Beobachtungen, echten SHA256 und ehrlichen Kriterien ausfüllen. `assets:approve` ist ohne vollständige positive Review blockiert.
- Für alte Episoden bleibt die zusätzliche Prüfung aus, damit fertige Arbeiten nicht rückwirkend entwertet werden.
- Prompttext und Generator-Anweisungen ersetzen niemals das visuelle Prüfen tatsächlicher Bilder.

# Night Frequency — Mike Chaves's creative platform

Review worktree: `~/.codex/worktrees/cinematic-portfolio/portfolio`, branch `mike/cinematic-portfolio`. Base: PR #190 merge `443ec6854c4e4abb83a4b861df98bb576af44b55`. No merge or production deployment.

## Direction and the user's clarification

Three initial studies are preserved in `concepts/`: Afterimage, White Heat, and Night Frequency. I initially chose the restrained Afterimage composition. Mike then explicitly preferred the panoramic, dark project stage shown in his reference. The final direction follows that correction: Night Frequency, with real project artwork, editorial serif identity, indigo-black architecture, amber practical light, dimensional frames, and reflections.

Mike subsequently clarified that this is his expressive platform for fans of his projects, products, games, writing, music, acting, and appearances, while retaining a useful hiring-manager path. He explicitly rejected service positioning and promotional filler such as “Give your next idea a point of view.” This supersedes the original instruction to preserve every line of PR #190 homepage copy. The career facts, project descriptions, attribution, contact route, metadata, analytics controls, and résumé remain protected.

Final sequence: identity and three featured projects → optional Adaptive Focus → full-size selected work → writing → documented appearances and an acting placeholder → music placeholder → About/contact/résumé. No invented music releases, acting credits, clients, testimonials, or outcomes. Navigation: Work, Writing, Music, About, résumé, contact. About retains the substantive approved biography and all six professional records, education, and public talks. The supplied portrait is used without altering the image beyond web compression/resizing.

## Design system

Background #090a13; text #ebe5f7; amber #ff9a61; secondary text #b4afc2; dividers #33303f. Instrument Serif display type is self-hosted as a small WOFF2 and preloaded in both page shells, with its OFL source retained. Local Arial/Helvetica supports body/UI text. Homepage stage styles load only through the Pages shell, keeping case studies and writing lighter. Essential identity, project links, controls, and captions are HTML. No blocking intro, scroll hijack, particles, or autoplay audio.

The first-screen stage is now a real three-project carousel. Wizzo opens in the center; SpeakEasy and Playfold each rotate into the same large position. New premiere-style cover illustrations lead the opening: Wisp fills a celestial observatory, Playfold's worlds fold into one gateway, and a human voice opens SpeakEasy's immersive mountain landscape. Each uses a live HTML title treatment. They are conceptual portfolio covers, identified in alt text and documented in `PREMIERE-ART.md`, rather than product screenshots or additional claimed project work. The original project imagery remains in the work section and case studies. On mobile the active project fills the frame, with adjacent projects peeking in from the edges.

## Asset provenance

- Original Wizzo celestial identity: copied read-only from `success-tracker/public/images/brand/wizzo-observatory-master-v2.png`, compressed as WebP and retained in the case study. The new stage cover is a generated close-up interpretation of the same Wisp design.
- Playfold: existing `public/projects/x-games/generated-game-detail.webp` and existing design-story imagery. Its URL remains `/projects/x-games`.
- SpeakEasy: existing thesis-defense photograph, thesis, and exhibition material.
- Premiere covers: generated with the built-in Image Gen tool from those project references at Mike's request. Three masters, exact prompts and reference provenance are preserved in `premiere-art/` and `PREMIERE-ART.md`. Responsive WebP derivatives are in `public/visuals/premiere/`; larger variants load when a cover takes center stage. No generated study participants, shipped scenes, or hardware are claimed as actual evidence.
- Appearance images: existing public Futures Summit/GatherVerse assets, with existing dates/titles.
- About portrait: user-supplied “ChatGPT Image Sep 23, 2026, 07_33_41 PM.png”, resized to 900 × 1350 WebP. No likeness editing.
- Architectural background plate: original Image Gen portfolio scenography, not claimed client work. Three.js frame geometry, lights, camera motion and reflection are implemented in code. No Blender modeling is claimed. No paid assets/services purchased.
- Vendored Three.js/Reflector come from the repository's pinned 0.182.0 dependency and include the MIT license. No runtime CDN.

## Interaction and safeguards

All **eight** Adaptive Focus presets remain: creative direction, human-in-the-loop AI, AI product systems, LLM evaluation/training data, operational UX, design engineering, XR/voice/accessibility, and game UX/creator systems. Four are initially visible; four are under More lenses. Local matching supplies truthful evidence names and reorders the existing featured work. Reset restores the original order. Explore opens the complete evidence view; custom input retains the existing temporary session handoff, analysis privacy disclosure, and local failure fallback. No career facts are changed by a lens.

The carousel has previous/next arrows, Left/Right and Home/End keyboard navigation, touch swipes, and a seven-second automatic interval. Automatic rotation stops during pointer hover, after keyboard or manual interaction, offscreen, and in hidden documents. Play resumes it. Reduced-motion and save-data visitors use manual controls without automatic rotation. A polite announcement reports manual slide changes only. Project links remain direct case-study links.

The optional Three.js scene places the same key art on dimensional metal frames with warm/cool light and a floor reflection. Its geometry follows the actual HTML slide transitions, keeping frames, title overlays and link hit regions aligned. Manual transitions still animate after automatic rotation is paused. Heavy runtime loads after page load/idle on visible desktop scenes. Rendering is capped near 30fps and 1.5 device pixel ratio. Resize, navigation, pagehide/bfcache and WebGL context loss dispose/restore resources. Mobile, reduced motion and save-data retain the HTML carousel. Failed images expose a title fallback; failed WebGL restores the same covers and working carousel controls. No content depends on canvas.

The separate metaverse implementation and navigation are retired. `/metaverse` and `/?metaverse=true` permanently redirect to `/#selected-work`; the site's normal host/noindex policy remains. Other retired case-study redirects remain unchanged.

## Preservation

The original checkout and existing Playfold worktrees were inspected before editing and left untouched. This isolated worktree starts from the merged PR #190. Career/evidence data, project records and résumé were not edited. Approved résumé SHA-256:

`5e8ee9b0ed28531e98bddc3f0afaa81c6c6bfbad59b70604e2fc3b2329d81fed`

The canonical download and legacy PDF redirect are verified against the actual served bytes. Existing project URLs, structured data, canonical tags, noindex controls, and consent-gated analytics remain.

## Verification status

See `VERIFICATION.md` for the original rebuild checks and the subsequent premiere/carousel verification. All work remains local for review, with the approved résumé byte-for-byte preserved.

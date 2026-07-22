export type ProjectEvidenceSection = "situation" | "task" | "action" | "result" | "exhibition"

export interface ProjectMediaItem {
  alt: string
  caption: string
  index: number
  label: string
  section?: ProjectEvidenceSection
  src: string
}

interface ProjectMediaSource {
  gallery?: string[]
  id: string
  image: string
  title: string
}

interface ProjectMediaCopy {
  caption: string
  label: string
  section?: ProjectEvidenceSection
}

const PROJECT_MEDIA_COPY: Record<string, Record<string, ProjectMediaCopy>> = {
  "creative-supply-engine": {
    "/projects/creative-supply-engine/main-image.jpg": {
      label: "Localized 16:9 campaign output",
      caption: "The final citrus creative combines a reusable campaign hero with deterministic Pulse branding, English-market copy, CTA treatment, and a verified 1920 x 1080 output ratio.",
    },
    "/projects/creative-supply-engine/pulse-beverages-logo.png": {
      label: "Deterministic brand source",
      caption: "The source logo is composited after image generation so brand presence remains explicit, repeatable, and independently checkable across every ratio.",
      section: "task",
    },
    "/projects/creative-supply-engine/cli-run-summary.png": {
      label: "Repeatable CLI run",
      caption: "The pulse-cse command records brief loading, four localized creative sets, run-log output, and the browser review gallery produced by the same pipeline.",
      section: "action",
    },
    "/projects/creative-supply-engine/citrus-en-1x1.jpg": {
      label: "English citrus 1:1",
      caption: "The square placement preserves the English campaign message, CTA, logo, and product focus while recropping the same reusable hero asset.",
      section: "result",
    },
    "/projects/creative-supply-engine/citrus-en-9x16.jpg": {
      label: "English citrus 9:16",
      caption: "The vertical placement demonstrates ratio-aware cropping and safe deterministic overlays from the same brief and approved asset source.",
      section: "result",
    },
    "/projects/creative-supply-engine/oat-es-1x1.jpg": {
      label: "Spanish oat bar 1:1",
      caption: "The square oat-bar output applies Spanish-market message and CTA fields while retaining the shared Pulse brand rules.",
      section: "result",
    },
    "/projects/creative-supply-engine/oat-es-9x16.jpg": {
      label: "Spanish oat bar 9:16",
      caption: "The vertical oat-bar output keeps localized copy and the deterministic overlay system legible across the taller social format.",
      section: "result",
    },
    "/projects/creative-supply-engine/oat-es-16x9.jpg": {
      label: "Spanish oat bar 16:9",
      caption: "The landscape variation completes the representative review set and shows the same localized campaign state across all three output ratios.",
      section: "result",
    },
  },
  "material-explorer": {
    "/projects/material-explorer/main-image.png": {
      label: "Material authoring workspace",
      caption: "The product workspace combines a searchable material library, typed editor controls, and a live 3D preview so authors can inspect the system before committing a material.",
    },
    "/projects/material-explorer/live-pbr-lab.png": {
      label: "Live PBR material lab",
      caption: "The deployed lab renders a React Three Fiber preview alongside quick presets, environment and camera controls, and a starter library of editable materials.",
      section: "action",
    },
    "/projects/material-explorer/live-compare.png": {
      label: "Dual-canvas A/B comparison",
      caption: "The comparison state renders two live canvases side by side, keeping the material library visible while authors evaluate a saved reference against the current draft.",
      section: "result",
    },
    "/projects/material-explorer/texture-workflow.png": {
      label: "Texture-map workflow",
      caption: "The working editor exposes base-color, normal, roughness, metalness, AO, emissive, and alpha map inputs while preserving the live preview and library context.",
      section: "action",
    },
    "/projects/material-explorer/power-tools.png": {
      label: "Draft history and power tools",
      caption: "Draft recovery, undo and redo, duplicate, randomize, texture clearing, JSON transfer, and save controls make rapid iteration explicit instead of hiding it behind the renderer.",
      section: "result",
    },
  },
  "die-ai": {
    "/projects/die-ai/level-one.png": {
      label: "Preserved Sector 12 gameplay",
      caption: "The primary artifact is the original SWF gameplay state: a two-minute defense loop with score, timer, player movement, laser fire, robot waves, and an exit-failure condition preserved through Ruffle.",
    },
    "/projects/die-ai/live-ruffle-wrapper.png": {
      label: "Live Ruffle start state",
      caption: "The deployed GitHub Pages wrapper loads the original SWF through pinned Ruffle, exposes the runtime-confirmed A, D, and Space controls, and keeps source and project context beside the player.",
      section: "action",
    },
    "/projects/die-ai/start-screen.png": {
      label: "Original Flash start screen",
      caption: "The preserved opening screen keeps the 2018 neon-grid identity and first interaction intact rather than recreating it in a new engine.",
      section: "situation",
    },
    "/projects/die-ai/intro-good.png": {
      label: "AICorp launch narrative",
      caption: "The original intro establishes the Buddy Bot product launch before the attack, preserving the timeline-authored story context around the gameplay loop.",
      section: "task",
    },
    "/projects/die-ai/intro-hacked.png": {
      label: "Compromised Buddy Bot state",
      caption: "The hacked warning supplies the transition from product announcement to defense scenario and remains part of the unchanged SWF sequence.",
      section: "action",
    },
    "/projects/die-ai/game-over.png": {
      label: "Preserved failure state",
      caption: "The game-over screen confirms that the wrapper retains the original loss path and replay loop rather than stopping at a static screenshot or menu shell.",
      section: "result",
    },
    "/projects/die-ai/main-image.png": {
      label: "Modern preservation identity",
      caption: "The revival identity gives the archive a current public-facing frame while the playable artifact, screenshots, source, and checksums remain tied to the preserved 2018 build.",
      section: "result",
    },
  },
  geovoice: {
    "/projects/geovoice/main-image.png": {
      label: "Location-feedback concept",
      caption: "The initial concept frames location as the organizing unit for public input before the workflow is expressed through maps, forms, and project layers.",
    },
    "/projects/geovoice/situation.png": {
      label: "Stakeholder workflow brief",
      caption: "The project brief connects fragmented public-input channels with the need to collect, map, and review location-specific feedback in one workflow.",
      section: "situation",
    },
    "/projects/geovoice/geovoice-prototype.png": {
      label: "Location-selection prototype",
      caption: "The prototype lets a participant attach a comment to an address, parcel, identified map point, or current location before continuing through submission.",
      section: "task",
    },
    "/projects/geovoice/action.png": {
      label: "Research and build record",
      caption: "The action record documents stakeholder research, GIS review, iterative prototyping, map-layer integration, and the central feedback dashboard.",
      section: "action",
    },
    "/projects/geovoice/interface.png": {
      label: "Structured comment workflow",
      caption: "The submission form captures participant context, comment categories, and detailed feedback without separating the response from its selected map location.",
      section: "action",
    },
    "/projects/geovoice/geovoice-demo.png": {
      label: "Infrastructure feedback map",
      caption: "The working demo combines a project route, basemap controls, sign-up, measurement tools, and a persistent comment action in one public-facing map surface.",
    },
    "/projects/geovoice/geovoice-cvow.png": {
      label: "Regional project deployment",
      caption: "A Coastal Virginia Offshore Wind project view demonstrates the same layer, notification, and comment model across a substantially different infrastructure context.",
      section: "result",
    },
    "/projects/geovoice/result.png": {
      label: "Documented workflow outcomes",
      caption: "The case-study record attributes fewer information silos, faster feedback cycles, and reuse across regions and project types to the centralized map-and-comment workflow.",
      section: "result",
    },
  },
  "petition-ready": {
    "/projects/petition-ready/main-image.png": {
      label: "Matter readiness operating console",
      caption: "The working paralegal dashboard connects queue state, readiness scoring, blockers, next action, attorney-review items, and source-grounded Copilot evidence without hiding the human review boundary.",
    },
    "/projects/petition-ready/notifications.png": {
      label: "Exception and notification queue",
      caption: "The notification state surfaces new matters, document exceptions, top blockers, and the next paralegal action without separating alerts from the operating queue.",
      section: "action",
    },
    "/projects/petition-ready/selected-dashboard-state.jpeg": {
      label: "Selected-matter readiness review",
      caption: "A selected Chapter 13 matter connects its readiness score and payment-plan blocker to the evidence and cleanup action required before attorney review.",
      section: "result",
    },
    "/projects/petition-ready/matter-inspector.jpeg": {
      label: "Blocker-to-next-action inspector",
      caption: "The inspector keeps source notes, unresolved evidence, the next paralegal action, and attorney-review preparation in one inspectable matter state.",
      section: "action",
    },
    "/projects/petition-ready/copilot-review-state.png": {
      label: "Case-grounded Copilot evidence",
      caption: "The Copilot panel exposes its evidence snapshot alongside bounded modes for blocker analysis, conflict checks, client follow-up drafts, and attorney-review brief compilation.",
      section: "task",
    },
  },
  speakeasy: {
    "/projects/speakeasy/thesis-defense.jpg": {
      label: "Thesis defense",
      caption: "Michael Chaves publicly defended SpeakEasy as a voice-driven AI system for inclusive XR at San Jose State University on May 14, 2025.",
    },
    "/projects/speakeasy/situation.png": {
      label: "Controller-access problem frame",
      caption: "The thesis brief frames precise controller input and complex gesture navigation as barriers for people with limited upper-limb mobility and low muscle tone.",
      section: "situation",
    },
    "/projects/speakeasy/ten-pillars-recap.png": {
      label: "Ten-pillar implementation ledger",
      caption: "The final framework records six implemented pillars, two partial pillars, and two planned pillars rather than presenting the accessibility system as complete.",
      section: "task",
    },
    "/projects/speakeasy/action.png": {
      label: "Research-to-prototype record",
      caption: "The build record connects literature review and co-design with ShapesXR exploration, Unity development, voice recognition, multimodal feedback, and structured participant testing.",
      section: "action",
    },
    "/projects/speakeasy/result.png": {
      label: "Documented participant outcomes",
      caption: "The result record summarizes reported comfort and engagement gains while keeping broader scalability as a direction for future research.",
      section: "result",
    },
    "/projects/speakeasy/thesis-exhibition.jpg": {
      label: "Interactive thesis exhibition",
      caption: "The completed gallery installation pairs the Quest headset, live Unity environment, project framing, and process evidence in a public hands-on review setting.",
      section: "exhibition",
    },
    "/projects/speakeasy/exhibition.png": {
      label: "Exhibition plan",
      caption: "The planning artifact defines the prototype station, participant feedback, and future gesture and personalization concepts before the final installation was delivered.",
      section: "exhibition",
    },
  },
  wizzo: {
    "/projects/wizzo/app-interface.png": {
      label: "AI mentor product cockpit",
      caption: "Current product surface connecting chat, goals, voice, work context, and quest follow-through.",
      section: "action",
    },
    "/projects/wizzo/main-image.png": {
      label: "Quest progress system",
      caption: "Supporting product evidence showing the AI mentor, quest status, and progress-oriented navigation.",
      section: "result",
    },
  },
  "x-games": {
    "/projects/x-games/platform-home.png": {
      label: "Live game discovery platform",
      caption: "Production discovery surface connecting the post-to-game promise to a live catalog of generated games, creator attribution, genres, play actions, and engagement signals.",
      section: "situation",
    },
    "/projects/x-games/generated-game-detail.png": {
      label: "Generated-game control surface",
      caption: "A source post, generated game, tuning controls, play statistics, library action, and reporting path stay connected in one reviewable product surface.",
      section: "action",
    },
    "/projects/x-games/leaderboard.png": {
      label: "Ranked game ecosystem",
      caption: "The all-time leaderboard turns generated games into persistent social objects with ranked discovery, play counts, creator identity, and direct replay paths.",
      section: "result",
    },
  },
  "vulnerability-visualizer": {
    "/projects/vulnerability-visualizer/main-image.jpg": {
      label: "Security review operating dashboard",
      caption: "The primary operating surface combines source provenance, analysis modes, search and filters, severity counts, trend evidence, record exploration, and filtered export.",
    },
    "/projects/vulnerability-visualizer/full-dataset-ai-filter.png": {
      label: "Full-dataset AI analysis mode",
      caption: "The deployed prebuilt source exposes a 236,656-record baseline, a 224,697-record AI Analysis view, and the remaining severity mix without hiding the active mode or source.",
      section: "action",
    },
    "/projects/vulnerability-visualizer/analysis-charts.png": {
      label: "Manual-versus-AI analysis charts",
      caption: "Severity, status, risk-factor, trend, and manual-versus-AI relationship charts keep aggregate patterns and classification disagreement visible to the reviewer.",
      section: "action",
    },
    "/projects/vulnerability-visualizer/vulnerability-detail.png": {
      label: "Record-level vulnerability evidence",
      caption: "The Log4Shell detail view carries package, version, severity, status, score, risk factors, dates, and external references from the operating dashboard into one inspectable record.",
      section: "result",
    },
    "/projects/vulnerability-visualizer/local-sample-fallback.png": {
      label: "Visible local-sample fallback",
      caption: "When the full source was not ready, the dashboard remained usable with a ten-record local sample and labeled that provenance directly instead of presenting the fallback as complete evidence.",
      section: "task",
    },
  },
  "sound-escape-vr": {
    "/projects/soundescape/music-interface.png": {
      label: "Four-channel spatial sequencer",
      caption: "The primary artifact shows the in-headset music surface: four sample channels arranged across a 16-step grid with transport and tempo controls kept inside the composition space.",
    },
    "/projects/soundescape/fractal-visuals.png": {
      label: "Eight-band audio-reactive geometry",
      caption: "Project documentation captures Koch lines, neon towers, and the sequencer environment driven by normalized FFT bands rather than a disconnected animation timeline.",
      section: "action",
    },
    "/projects/soundescape/spatial-environment.png": {
      label: "Spatial performance environment",
      caption: "The environment board shows the sequencer, held sample objects, luminous architecture, and reflective space that turn loop building into a spatial performance rather than a flat control panel.",
      section: "result",
    },
    "/projects/soundescape/main-image.jpg": {
      label: "Original Sound Escape identity",
      caption: "The original identity establishes the synthwave world that framed the prototype before the interaction stack was reworked for Unity 2022 LTS and Meta Quest 3.",
      section: "situation",
    },
  },
  portals: {
    "/projects/portals/main-image.png": {
      label: "Three-destination Spectacles scene",
      caption: "The primary on-device artifact places Samoa, India, and San Francisco portals in one hackathon scene with visible spoken-entry prompts instead of a conventional menu.",
    },
    "/projects/portals/voice-portal-source.png": {
      label: "Guarded VoiceML portal lifecycle",
      caption: "The implemented Lens Studio script validates scene inputs, prevents competing VoiceML sessions, starts from a disabled portal state, and handles activation, animation, deactivation, and listening errors.",
      section: "action",
    },
    "/projects/portals/voice-routing-source.png": {
      label: "Phrase-routed destination states",
      caption: "The routing source defines explicit phrases for entering India, Samoa, and America and for exiting, leaving, or returning home, then maps final transcriptions into controlled scene-object states.",
      section: "action",
    },
    "/projects/portals/pinch-scale-source.png": {
      label: "Hand-tracked pinch scaling",
      caption: "A second input path reads active hand and pinch state, captures initial distance and scale, and uniformly resizes the portal while the gesture remains active.",
      section: "result",
    },
    "/projects/portals/devpost-showcase.png": {
      label: "Four-person hackathon showcase",
      caption: "The submitted Devpost frame preserves the project identity and four-person team context around the voice-and-hand Spectacles build.",
      section: "situation",
    },
  },
}

function getDefaultMediaCopy(title: string, index: number): ProjectMediaCopy {
  return {
    label: index === 0 ? "Primary artifact" : `Artifact ${String(index + 1).padStart(2, "0")}`,
    caption: index === 0 ? `Primary project image for ${title}.` : `Supporting project artifact for ${title}.`,
  }
}

function getMediaCopyKey(src: string) {
  return src.split(/[?#]/)[0] || src
}

function getMediaDisplaySrc(src: string, copyKey: string) {
  return src.startsWith("/projects/") ? copyKey : src
}

export function buildProjectMedia({ gallery = [], id, image, title }: ProjectMediaSource): ProjectMediaItem[] {
  const copyBySrc = PROJECT_MEDIA_COPY[id] || {}
  const seen = new Set<string>()
  const sources = [image, ...gallery, ...Object.keys(copyBySrc)].reduce<Array<{ copyKey: string; src: string }>>(
    (items, source) => {
      if (!source) return items
      const copyKey = getMediaCopyKey(source)

      if (seen.has(copyKey)) return items

      seen.add(copyKey)
      items.push({
        copyKey,
        src: getMediaDisplaySrc(source, copyKey),
      })

      return items
    },
    []
  )

  return sources.map(({ copyKey, src }, index) => {
    const copy = copyBySrc[copyKey] || getDefaultMediaCopy(title, index)

    return {
      alt: `${title}: ${copy.label}`,
      caption: copy.caption,
      index,
      label: copy.label,
      section: copy.section,
      src,
    }
  })
}

export function getSectionMedia(media: ProjectMediaItem[], section: ProjectEvidenceSection) {
  return media.filter((item) => item.section === section)
}

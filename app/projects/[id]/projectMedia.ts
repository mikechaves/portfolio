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
  "astrocade-qa-calibration-tool": {
    "/projects/astrocade/calibration-dashboard.png": {
      label: "Calibration metrics dashboard",
      caption: "Read-only calibration surface with sampling windows, scoped QA and final-review metrics, agreement, comment quality, and legacy-data exclusions.",
    },
    "/projects/astrocade/calibration-session-workspace.png": {
      label: "Side-by-side calibration session",
      caption: "A sampled game runs next to QA and final-review context, keeping the source evidence available while calibration decisions are recorded.",
      section: "action",
    },
    "/projects/astrocade/calibration-checklist.png": {
      label: "Calibration checklist",
      caption: "Decision-validation, evidence-quality, and standard-alignment rules that make reviewer judgments comparable.",
      section: "task",
    },
    "/projects/astrocade/calibration-ground-truth.png": {
      label: "Explicit ground truth",
      caption: "The calibrator selects the expected decision before evaluating whether QA reached it, separating decision correctness from reviewer sentiment.",
      section: "action",
    },
    "/projects/astrocade/calibration-failure-modes.png": {
      label: "Structured QA failure modes",
      caption: "When QA is incorrect, the session records a finite diagnosis such as false rejection, missed blocking issue, policy misapplication, or ambiguous standard.",
      section: "action",
    },
    "/projects/astrocade/calibration-feedback-quality.png": {
      label: "Creator feedback quality",
      caption: "The tool scores feedback as fully, partially, or not actionable, then checks for a reproducible creator-facing formula.",
      section: "action",
    },
    "/projects/astrocade/calibration-final-review.png": {
      label: "Final-review failure modes",
      caption: "Final-review correctness is computed from ground truth and outcome, then bounded by a separate diagnostic taxonomy.",
      section: "result",
    },
  },
  "apt-plus": {
    "/projects/apt-plus/main-image.png": {
      label: "APT+ field interface",
      caption: "Primary field-facing interface for time-study capture and production workflow review.",
    },
    "/projects/apt-plus/situation.png": {
      label: "Operational problem map",
      caption: "Process evidence showing where manual time studies created errors, delay, and data silos.",
      section: "situation",
    },
    "/projects/apt-plus/aptplus-prototype.png": {
      label: "Prototype system flow",
      caption: "Design artifact showing the early product structure before production hardening.",
      section: "task",
    },
    "/projects/apt-plus/action.png": {
      label: "Workflow design pass",
      caption: "Action-stage evidence of the interface and implementation work behind the tool.",
      section: "action",
    },
    "/projects/apt-plus/aptplus-interface.png": {
      label: "Production interface",
      caption: "Core UI evidence for the time-study capture and review workflow.",
      section: "action",
    },
    "/projects/apt-plus/aptplus-walkpatternanalysis.PNG": {
      label: "Walk-pattern analysis",
      caption: "Analysis view connecting captured movement data to operational decisions.",
      section: "result",
    },
    "/projects/apt-plus/result.png": {
      label: "Business outcome proof",
      caption: "Outcome artifact summarizing efficiency and accuracy improvements from the system.",
      section: "result",
    },
  },
  "creative-supply-engine": {
    "/projects/creative-supply-engine/main-image.jpg": {
      label: "Generated campaign hero",
      caption: "Primary AI-assisted product creative composed into a production-ready campaign asset.",
    },
    "/projects/creative-supply-engine/pulse-beverages-logo.png": {
      label: "Reusable brand source",
      caption: "Brand input reused across generated layouts so AI output stays inside deterministic rules.",
      section: "task",
    },
    "/projects/creative-supply-engine/cli-run-summary.png": {
      label: "CLI run summary",
      caption: "Automation proof showing brief loading, creative generation, compliance checks, and review output.",
      section: "action",
    },
    "/projects/creative-supply-engine/citrus-en-1x1.jpg": {
      label: "Citrus 1:1 output",
      caption: "Localized square creative generated from the same campaign brief and brand system.",
      section: "result",
    },
    "/projects/creative-supply-engine/citrus-en-9x16.jpg": {
      label: "Citrus 9:16 output",
      caption: "Story-format creative showing responsive layout control across social dimensions.",
      section: "result",
    },
    "/projects/creative-supply-engine/oat-es-1x1.jpg": {
      label: "Oat bar 1:1 output",
      caption: "Spanish-market square creative generated from localized campaign copy.",
      section: "result",
    },
    "/projects/creative-supply-engine/oat-es-9x16.jpg": {
      label: "Oat bar 9:16 output",
      caption: "Vertical localized output showing format-aware composition and copy placement.",
      section: "result",
    },
    "/projects/creative-supply-engine/oat-es-16x9.jpg": {
      label: "Oat bar 16:9 output",
      caption: "Wide localized creative proving the same system can support landscape placement.",
      section: "result",
    },
  },
  "die-ai": {
    "/projects/die-ai/main-image.png": {
      label: "Playable wrapper",
      caption: "Primary web wrapper that preserves the Flash game while making it portfolio-ready.",
    },
    "/projects/die-ai/start-screen.png": {
      label: "Start screen",
      caption: "Game premise and first interaction surface.",
      section: "situation",
    },
    "/projects/die-ai/intro-good.png": {
      label: "Intro sequence",
      caption: "Narrative setup connecting the player to the hacked AI threat.",
      section: "task",
    },
    "/projects/die-ai/intro-hacked.png": {
      label: "Hacked intro state",
      caption: "Animated story beat used to establish the AI takeover scenario.",
      section: "action",
    },
    "/projects/die-ai/level-one.png": {
      label: "Level one gameplay",
      caption: "Playable action surface with enemies, health, and shooting interactions.",
      section: "action",
    },
    "/projects/die-ai/game-over.png": {
      label: "Game over state",
      caption: "End-state feedback and completion loop for the preserved browser game.",
      section: "result",
    },
  },
  gaia: {
    "/projects/gaia/main-image.png": {
      label: "Gaia VisiPad field prototype",
      caption: "A tablet-based initiative-file workflow running on physical hardware, connecting enterprise project data to the spatial prototype system.",
    },
    "/projects/gaia/how-might-we.png": {
      label: "Opportunity and role framing",
      caption: "The project brief documents the lead UX and Unity development mandate, initial user stories, and the opportunity to contextualize store data through spatial interfaces.",
      section: "situation",
    },
    "/projects/gaia/gaia-prototype.png": {
      label: "VisiPad interaction map",
      caption: "Figma flows define initiative-file browsing, upload and deletion states, project metadata, and the handoff from a tablet workflow into spatial store configuration.",
      section: "action",
    },
    "/projects/gaia/wireframes-3d.png": {
      label: "3D wireframes",
      caption: "Spatial wireframes translate the information architecture into a navigable 3D environment before the Unity scenes are fully rendered.",
      section: "action",
    },
    "/projects/gaia/vr-testing.png": {
      label: "Immersive usability test",
      caption: "A headset test places store selection, role controls, and the physical retail model inside the same reviewable spatial environment.",
      section: "action",
    },
    "/projects/gaia/gaia-lobby-2.png": {
      label: "Store-selection environment",
      caption: "The Unity lobby presents a geographic store model with store cards and entry actions, making portfolio and location context inspectable in one scene.",
      section: "result",
    },
    "/projects/gaia/gaia-store-overview.png": {
      label: "Spatial store overview",
      caption: "A full-store model gives the reviewer an elevated operational view of layout, service areas, and retail context rather than reducing the project to a flat dashboard.",
      section: "result",
    },
  },
  geovoice: {
    "/projects/geovoice/main-image.png": {
      label: "Geospatial feedback interface",
      caption: "Primary map-driven platform for collecting and reviewing stakeholder feedback.",
    },
    "/projects/geovoice/situation.png": {
      label: "Stakeholder workflow problem",
      caption: "Context artifact showing the coordination problem across maps, feedback, and project teams.",
      section: "situation",
    },
    "/projects/geovoice/geovoice-prototype.png": {
      label: "Prototype flow",
      caption: "Early design artifact for location-specific feedback and project review.",
      section: "task",
    },
    "/projects/geovoice/action.png": {
      label: "Interaction design pass",
      caption: "Action-stage evidence of the feedback workflow and interface structure.",
      section: "action",
    },
    "/projects/geovoice/interface.png": {
      label: "Interface detail",
      caption: "Detailed UI evidence showing how non-technical stakeholders could add and review input.",
      section: "action",
    },
    "/projects/geovoice/geovoice-demo.png": {
      label: "Demo surface",
      caption: "Working project view used to validate map, feedback, and dashboard behavior.",
      section: "action",
    },
    "/projects/geovoice/geovoice-cvow.png": {
      label: "Regional application",
      caption: "Project-scale example showing how the system supports real infrastructure planning contexts.",
      section: "result",
    },
    "/projects/geovoice/result.png": {
      label: "Collaboration outcome",
      caption: "Outcome artifact summarizing faster feedback loops and broader project applicability.",
      section: "result",
    },
  },
  "petition-ready": {
    "/projects/petition-ready/main-image.png": {
      label: "Matter readiness console",
      caption: "Primary dashboard for paralegal review, readiness scoring, blockers, attorney-review items, and PetitionReady Copilot evidence.",
    },
    "/projects/petition-ready/notifications.png": {
      label: "Notification workflow",
      caption: "Dashboard state showing new matter alerts, top blockers, and next paralegal actions in the review queue.",
      section: "action",
    },
    "/projects/petition-ready/selected-dashboard-state.jpeg": {
      label: "Selected matter review",
      caption: "Selected-case view connecting readiness score, blocker evidence, and next action for paralegal cleanup.",
      section: "result",
    },
    "/projects/petition-ready/matter-inspector.jpeg": {
      label: "Matter inspector",
      caption: "Inspector panel for a retained matter with unresolved payment-plan evidence and attorney-review preparation.",
      section: "action",
    },
    "/projects/petition-ready/copilot-review-state.png": {
      label: "Copilot evidence snapshot",
      caption: "PetitionReady Copilot surface for blocker questions, conflict checks, client follow-up drafts, and attorney-review brief compilation.",
      section: "task",
    },
  },
  speakeasy: {
    "/projects/speakeasy/thesis-defense.jpg": {
      label: "Thesis defense",
      caption: "Primary proof point for the voice-controlled XR accessibility research system.",
    },
    "/projects/speakeasy/situation.png": {
      label: "Accessibility problem frame",
      caption: "Research artifact framing the interaction barriers faced by low-muscle-tone users.",
      section: "situation",
    },
    "/projects/speakeasy/ten-pillars-recap.png": {
      label: "Interaction principles",
      caption: "Design principles used to guide accessible XR and voice UI decisions.",
      section: "task",
    },
    "/projects/speakeasy/action.png": {
      label: "Prototype workflow",
      caption: "Action-stage artifact connecting voice control, XR interaction, and accessibility constraints.",
      section: "action",
    },
    "/projects/speakeasy/result.png": {
      label: "Research outcome",
      caption: "Result artifact showing the accessibility and interaction findings from the prototype.",
      section: "result",
    },
    "/projects/speakeasy/thesis-exhibition.jpg": {
      label: "Thesis exhibition",
      caption: "Live exhibition context where visitors could experience the prototype and research story.",
      section: "exhibition",
    },
    "/projects/speakeasy/exhibition.png": {
      label: "Exhibition station",
      caption: "Display artifact showing how the project was presented for hands-on review.",
      section: "exhibition",
    },
  },
  transcribe: {
    "/projects/transcribe/main-image.png": {
      label: "Drive-through transcription prototype",
      caption: "Primary accessibility tool for real-time speech-to-text in high-traffic retail operations.",
    },
    "/projects/transcribe/situation.png": {
      label: "Retail communication context",
      caption: "Situation artifact showing the communication gap this accessibility workflow addressed.",
      section: "situation",
    },
    "/projects/transcribe/action.png": {
      label: "Prototype and interface work",
      caption: "Design and build evidence for the real-time transcription workflow.",
      section: "action",
    },
    "/projects/transcribe/testing.png": {
      label: "Usability testing",
      caption: "Testing evidence used to validate the tool with accessibility and operational needs.",
      section: "action",
    },
    "/projects/transcribe/result.png": {
      label: "Deployment outcome",
      caption: "Result artifact tying the transcription workflow to accuracy and efficiency improvements.",
      section: "result",
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
      label: "AI-assisted vulnerability triage",
      caption: "Primary review surface for severity, status, AI versus manual assessment, comparison, and remediation workflows across large security datasets.",
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

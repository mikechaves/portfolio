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
      label: "APT+ workstation context",
      caption: "The production workflow shown in its enterprise workstation context, pairing detailed time-study data with a familiar desktop review environment.",
    },
    "/projects/apt-plus/situation.png": {
      label: "Time-study problem framing",
      caption: "The project record identifies labor-intensive tracking, slow interpretation, and disconnected data as the operational constraints behind the APT+ mandate.",
      section: "situation",
    },
    "/projects/apt-plus/aptplus-prototype.png": {
      label: "Annotated capture prototype",
      caption: "An annotated prototype maps task selection, timing events, work categories, and submission behavior before the workflow reaches the production interface.",
      section: "task",
    },
    "/projects/apt-plus/action.png": {
      label: "Design and engineering strategy",
      caption: "The action record documents field research, iterative prototyping, automated capture and analysis, and cross-functional delivery as one operating strategy.",
      section: "action",
    },
    "/projects/apt-plus/aptplus-interface.png": {
      label: "Production work-balance interface",
      caption: "The production surface combines operation rows, time values, work-balance bars, editable task context, and validation controls in one review workflow.",
      section: "action",
    },
    "/projects/apt-plus/aptplus-walkpatternanalysis.PNG": {
      label: "Walk-pattern analysis",
      caption: "A spatial analysis view connects operator movement, workstation geometry, and measured process context to the same time-study system.",
      section: "result",
    },
    "/projects/apt-plus/result.png": {
      label: "Documented operating outcomes",
      caption: "The project record attributes approximately $1M in annual savings per plant to reduced manual error and faster studies, alongside centralized performance insight.",
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
  transcribe: {
    "/projects/transcribe/main-image.png": {
      label: "Drive-through transcription system",
      caption: "The partner-facing display transcribes a customer order beside the existing point-of-sale workflow, making the accessibility concept inspectable in its retail context.",
    },
    "/projects/transcribe/situation.png": {
      label: "Communication roadmap and pilot plan",
      caption: "The project brief connects noisy drive-through communication, a speech-to-text hypothesis, partner and customer needs, hardware constraints, and a bounded store-test plan.",
      section: "situation",
    },
    "/projects/transcribe/action.png": {
      label: "Interface and implementation record",
      caption: "The action record documents accessibility research, MVP and stretch flows, React development, and Google Cloud Speech-to-Text integration.",
      section: "action",
    },
    "/projects/transcribe/testing.png": {
      label: "Listening-state and in-store testing",
      caption: "Muted and listening states are paired with an in-store usability review, preserving both interface behavior and the physical counter environment used for evaluation.",
      section: "action",
    },
    "/projects/transcribe/result.png": {
      label: "Documented pilot outcomes",
      caption: "The case-study record reports a 30% transcription-accuracy improvement and a 50% reduction in manual note-taking time alongside in-store pilot evidence.",
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

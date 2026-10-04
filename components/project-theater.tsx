import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react"
import { PortfolioEventLink } from "@/components/portfolio-event-link"

const works = [
  { id: "x-games", title: "Playfold", slot: "left", category: "Interactive storytelling", image: "playfold", alt: "New Playfold cover illustration: three game worlds fold into one luminous gateway" },
  { id: "wizzo", title: "Wizzo", slot: "center", category: "Brand + product direction", image: "wizzo", alt: "New Wizzo cover illustration: Wisp sweeps through a moonlit celestial observatory" },
  { id: "speakeasy", title: "SpeakEasy", slot: "right", category: "Voice-first XR accessibility", image: "speakeasy", alt: "Conceptual SpeakEasy cover illustration: a human voice opens an immersive mountain world" },
]

export function ProjectTheater() {
  return <section id="selected-work" className="project-theater" aria-label="Selected work" aria-roledescription="carousel" data-project-theater data-theater-active="wizzo">
    <div className="theater-canvas" aria-hidden="true" data-theater-canvas />
    <div id="featured-projects" className="theater-works" data-theater-track>
      {works.map((work) => <PortfolioEventLink key={work.id} href={`/projects/${work.id}`} eventName="project_evidence_opened" eventProperties={{ project_id: work.id, source: "home_featured", match_level: "unranked" }} className={`theater-work theater-work--${work.id}`} data-theater-work={work.id} data-theater-slot={work.slot} data-theater-title={work.title} data-theater-full-src={`/visuals/premiere/${work.image}-1672.webp`}>
        <div className="theater-picture">
          {/* eslint-disable-next-line @next/next/no-img-element -- responsive cover art; usable before optional WebGL */}
          <img src={`/visuals/premiere/${work.image}-1200.webp`} alt={work.alt}
            srcSet={`/visuals/premiere/${work.image}-480.webp 480w, /visuals/premiere/${work.image}-800.webp 800w, /visuals/premiere/${work.image}-1200.webp 1200w`}
            sizes={work.id === "wizzo" ? "(max-width: 700px) 90vw, 52vw" : "25vw"}
            width={1200} height={675} fetchPriority={work.id === "wizzo" ? "high" : "auto"} decoding="async" data-project-art />
          <span className="art-fallback" aria-hidden="true">{work.title}</span>
          <span className="theater-poster-title" aria-hidden="true">{work.title}</span>
        </div>
        <div className="theater-caption"><h2>{work.title}</h2><p>{work.category}</p><span aria-hidden="true"><ArrowUpRight size={18} /></span></div>
      </PortfolioEventLink>)}
    </div>
    <div className="theater-bottom">
      <p>Selected work</p>
      <div className="theater-carousel-controls" data-theater-controls hidden>
        <button type="button" data-theater-previous aria-label="Previous project" aria-controls="featured-projects"><ArrowLeft size={18} /></button>
        <span className="theater-counter" data-theater-counter aria-hidden="true">01 / 03</span>
        <button type="button" data-theater-next aria-label="Next project" aria-controls="featured-projects"><ArrowRight size={18} /></button>
        <button type="button" className="theater-rotation-toggle" data-theater-motion aria-pressed="false" aria-label="Pause carousel"><span data-theater-pause><Pause size={13} /></span><span data-theater-play hidden><Play size={13} /></span><span data-theater-motion-label>Pause</span></button>
      </div>
      <span className="sr-only" data-theater-slide-status aria-live="polite" aria-atomic="true" />
      <span className="sr-only" data-theater-status />
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- native navigation on the server-first homepage */}
      <a href="/projects">All projects <ArrowUpRight size={18} /></a>
    </div>
  </section>
}

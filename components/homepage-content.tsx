import { ArrowRight, ArrowUpRight, Download } from "lucide-react"
import { AdaptiveFocusEntry } from "@/components/adaptive-focus-entry"
import { FeaturedProjectCard } from "@/components/featured-project-card"
import { ProjectTheater } from "@/components/project-theater"
import { PortfolioEventLink } from "@/components/portfolio-event-link"
import { HOMEPAGE_FEATURED_PROJECT_IDS } from "@/data/portfolio-curation"
import { PROJECTS } from "@/data/projects"
import { posts } from "@/lib/posts"
import type { Project } from "@/types/project"

const featuredProjectPresentation = {
  wizzo: {
    eyebrow: "Brand + product direction",
    summary:
      "Creative direction and product design for Wizzo Labs’ AI mentor, giving progress a visual identity and a clear next move.",
    actionLabel: "View Wizzo",
  },
  "x-games": {
    eyebrow: "Interactive storytelling",
    summary:
      "Visual and interaction direction for Playfold, Wizzo Labs’ product that turns social posts into characters, worlds, and playable stories.",
    actionLabel: "View Playfold",
  },
  speakeasy: {
    eyebrow: "Voice-first XR accessibility",
    summary:
      "A voice-first mixed reality thesis: research, visual feedback, and hands-free interaction for people with low muscle tone.",
    actionLabel: "View SpeakEasy",
  },
} as const

const featuredProjects = HOMEPAGE_FEATURED_PROJECT_IDS.map((id) => {
  const project = PROJECTS.find((candidate) => candidate.id === id)
  return project ? { project, presentation: featuredProjectPresentation[id] } : null
}).filter(
  (entry): entry is { project: Project; presentation: (typeof featuredProjectPresentation)[keyof typeof featuredProjectPresentation] } =>
    Boolean(entry)
)


export function HomepageContent() {
  return <div className="home-immersive-page night-platform">
    <div className="home-content-layer">
      <div className="opening-world" data-opening-world>
        <div className="opening-atmosphere" aria-hidden="true" />
        <header className="home-journey-hero">
          <p className="home-section-kicker">Creative Director & Creative Technologist</p>
          <h1 id="home-title" className="home-masthead">Mike Chaves</h1>
          <p className="opening-location">Los Angeles, California</p>
        </header>
        <ProjectTheater />
      </div>
      <AdaptiveFocusEntry />
      <section id="work" className="home-evidence-section" aria-labelledby="selected-work-title">
        <div className="home-section-heading"><h2 id="selected-work-title">The work.</h2>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- server-first navigation */}
          <a href="/projects">All projects <ArrowUpRight size={18} /></a>
        </div>
        <div className="home-featured-grid">{featuredProjects.map(({project,presentation}) => <FeaturedProjectCard key={project.id} project={project} {...presentation} />)}</div>
      </section>
      <section id="writing" className="home-evidence-section platform-writing" aria-labelledby="public-practice-title">
        <div className="home-section-heading"><h2 id="public-practice-title">Writing.</h2>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- server-first navigation */}
          <a href="/blog">All writing <ArrowUpRight size={18} /></a>
        </div>
        <div className="platform-writing-list">{posts.slice(0,3).map((post,index) => <PortfolioEventLink key={post.id} href={`/blog/${post.id}`} eventName="public_practice_item_opened" eventProperties={{item_id:post.id,item_type:"writing",source:"home_public_practice"}}>
          <span className="writing-index">0{index+1}</span><div><time dateTime={post.publishedAt}>{post.date} · {post.readingTime}</time><h3>{post.title}</h3></div><ArrowUpRight size={26} aria-hidden="true" />
        </PortfolioEventLink>)}</div>
      </section>
      <section id="appearances" className="home-evidence-section platform-appearances" aria-labelledby="appearances-title">
        <div className="home-section-heading"><h2 id="appearances-title">Appearances.</h2>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- native navigation */}
          <a href="/about#public-practice-title">All appearances <ArrowUpRight size={18} /></a>
        </div>
        <div className="appearance-grid">
          <PortfolioEventLink href="/about#public-practice-title" eventName="public_practice_item_opened" eventProperties={{item_id:"futures-summit-2025",item_type:"panel",source:"home_public_practice"}}>
            {/* eslint-disable-next-line @next/next/no-img-element -- actual event artwork */}
            <img src="/events/chaves_futuressummit_2025_thumb.webp" alt="Futures Summit 2025 appearance" width="800" height="450" loading="lazy" />
            <p>Panel · September 2025</p><h3>The Rise of Synthetic AI Companions: Promise or Peril</h3><span>Futures Summit 2025 <ArrowUpRight size={18} /></span>
          </PortfolioEventLink>
          <PortfolioEventLink href="/about#public-practice-title" eventName="public_practice_item_opened" eventProperties={{item_id:"gatherverse-2025",item_type:"panel",source:"home_public_practice"}}>
            {/* eslint-disable-next-line @next/next/no-img-element -- actual event artwork */}
            <img src="/events/chaves_gatherverse_2025_thumb.webp" alt="GatherVerse XREvolve appearance" width="800" height="450" loading="lazy" />
            <p>Panel · June 2025</p><h3>AR & AI: The Intersection of the Future</h3><span>GatherVerse XREvolve <ArrowUpRight size={18} /></span>
          </PortfolioEventLink>
        </div>
        <div className="acting-placeholder"><h3>Acting.</h3><p>More to come.</p></div>
      </section>
      <section id="music" className="home-evidence-section platform-music" aria-labelledby="music-title">
        <div className="home-section-heading"><h2 id="music-title">Music.</h2></div>
        <a className="music-promo-link" href="https://open.spotify.com/artist/6532kzHXaCDA9tgWPP5aCs">
          {/* eslint-disable-next-line @next/next/no-img-element -- committed responsive WebP derivatives preserve the complete supplied graphic */}
          <img
            src="/music/kryterium-promo-1784.webp"
            srcSet="/music/kryterium-promo-446.webp 446w, /music/kryterium-promo-892.webp 892w, /music/kryterium-promo-1338.webp 1338w, /music/kryterium-promo-1784.webp 1784w, /music/kryterium-promo-2676.webp 2676w, /music/kryterium-promo-3568.webp 3568w"
            sizes="(min-width: 1920px) 1784px, (min-width: 701px) 93vw, calc(100vw - 44px)"
            width={3568}
            height={960}
            alt="KRYTERIUM, featuring Mike Chaves on vocals. Listen to Control and Plagued By Their Power on Spotify."
            loading="lazy"
            decoding="async"
          />
          <span className="music-promo-cta" aria-hidden="true">Listen on Spotify <ArrowUpRight size={16} /></span>
        </a>
      </section>
      <section id="contact" className="platform-signoff" aria-label="About and contact">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- server-first navigation */}
        <a href="/about" className="platform-about-link">About Mike <ArrowRight size={28} /></a>
        <div>
          <PortfolioEventLink href="/about#contact" eventName="portfolio_conversion_clicked" eventProperties={{destination:"contact",source:"home_contact"}}>Contact <ArrowUpRight size={15} /></PortfolioEventLink>
          <PortfolioEventLink href="/Michael_Chaves_Resume.pdf" download eventName="portfolio_conversion_clicked" eventProperties={{destination:"resume",source:"home_contact"}}>Résumé (PDF) <Download size={15} /></PortfolioEventLink>
        </div>
      </section>
    </div>
  </div>
}

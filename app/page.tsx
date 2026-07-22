"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, Database, Radio, Route, ShieldCheck } from "lucide-react"
import { AdaptiveFocusEntry } from "@/components/adaptive-focus-entry"
import { BlogCard } from "@/components/blog-card"
import { ProjectCard } from "@/components/project-card"
import { RecentHighlights } from "@/components/recent-highlights"
import { HOMEPAGE_FEATURED_PROJECT_IDS } from "@/data/portfolio-curation"
import { PROJECTS } from "@/data/projects"
import type { Project } from "@/types/project"

const HeroBackground = dynamic(
  () => import("@/components/hero-background").then((module) => module.HeroBackground),
  { ssr: false, loading: () => null }
)

const featuredProjects = HOMEPAGE_FEATURED_PROJECT_IDS.map((id) =>
  PROJECTS.find((project) => project.id === id)
).filter((project): project is Project => Boolean(project))

const systemStatus = [
  { icon: Radio, label: "Data stream", value: "Live" },
  { icon: Route, label: "Routing", value: "Evidence first" },
  { icon: ShieldCheck, label: "System integrity", value: "Reviewed" },
  { icon: Database, label: "Proof layer", value: "Synced" },
]

const skills = [
  "AI-native game and product systems",
  "Game UX and interactive systems",
  "Human-in-the-loop AI and evaluation",
  "Creator workflows and tools",
  "Product and design engineering",
  "Internal tools and operational UX",
  "Voice, XR, and accessibility",
  "Motion-rich and immersive interfaces",
]

const latestPosts = [
  {
    id: "voice-first-xr",
    title: "Voice-First XR: Five Lessons from the Front Lines of Inclusive Design",
    excerpt: "Key takeaways for crafting accessible voice interfaces in spatial computing.",
    date: "Jun 18, 2025",
    readingTime: "5 min read",
    url: "https://medium.com/@mikejchaves/voice-first-xr-five-lessons-from-the-front-lines-of-inclusive-design-e58dacf49c54",
    publication: "Leadership Brief",
  },
]

export default function Home() {
  return (
    <div className="home-immersive-page relative isolate">
      <HeroBackground />

      <div className="home-content-layer relative z-10 space-y-5">
        <section className="post-terminal-hero" aria-labelledby="home-title">
          <div className="post-terminal-hero-scene">
            <div className="post-terminal-status-strip" aria-hidden="true">
              <span>FOCUS / AI-NATIVE SYSTEMS</span>
              <span>PROOF / REVIEWED</span>
              <span>INTERFACE / ONLINE</span>
            </div>

            <div className="relative z-10 grid min-h-[21rem] items-center gap-8 px-5 pb-8 pt-12 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.55fr)_minmax(0,1.35fr)] lg:px-10">
              <div className="max-w-xl">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  AI-Native Design Engineer
                </p>
                <h1 id="home-title" className="font-display text-[clamp(4.25rem,6vw,6rem)] font-semibold uppercase leading-[0.8] tracking-normal text-white">
                  <span>Mike<span className="text-primary">_</span></span><span className="block md:inline">Chaves<span className="text-primary">_</span></span>
                </h1>
                <p className="mt-5 max-w-md text-sm leading-6 text-zinc-300 sm:text-base">
                  I design and build AI-native product systems that connect human intent to operational reality.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/projects" className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.1em] text-black transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    Inspect Proof <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <Link href="/about" className="inline-flex min-h-10 items-center gap-2 border border-white/25 bg-black/35 px-4 text-xs uppercase tracking-[0.1em] text-zinc-200 transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Read Positioning <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <dl className="hidden border-l border-white/15 pl-6 lg:block">
                {systemStatus.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="grid grid-cols-[1rem_1fr] gap-x-3 border-b border-white/10 py-2.5 last:border-b-0">
                    <Icon size={14} className="mt-0.5 text-zinc-500" aria-hidden="true" />
                    <div className="flex items-baseline justify-between gap-4 text-[0.62rem] uppercase tracking-[0.08em]">
                      <dt className="text-zinc-500">{label}</dt>
                      <dd className="text-zinc-300">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <AdaptiveFocusEntry />
        </section>

        <section className="signal-section" aria-labelledby="featured-projects-heading">
          <div className="signal-section-heading">
            <h2 id="featured-projects-heading">Featured Projects / Real-World Evidence</h2>
            <Link href="/projects">View all projects <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                {...project}
                analyticsContext="home_featured"
                priority={index < 3}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-3" aria-label="Systems and leadership signals">
          <div className="signal-panel">
            <div className="signal-panel-heading">
              <h2>Systems</h2>
              <span aria-hidden="true">01</span>
            </div>
            <ul className="grid gap-1.5 text-xs leading-5 text-zinc-400 sm:grid-cols-2 lg:grid-cols-1">
              {skills.map((skill) => (
                <li key={skill} className="flex gap-2">
                  <span className="text-primary" aria-hidden="true">→</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="signal-panel">
            <div className="signal-panel-heading">
              <h2>Leadership Brief</h2>
              <span className="text-[#ff2bd6]">New</span>
            </div>
            {latestPosts.map((post) => <BlogCard key={post.id} {...post} />)}
          </div>

          <RecentHighlights />
        </section>
      </div>
    </div>
  )
}

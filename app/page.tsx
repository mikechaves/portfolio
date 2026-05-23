"use client";

import { useCallback, useState } from "react"
import Link from "next/link"
import { Terminal } from "@/components/terminal"
import { ProjectFilter } from "@/components/project-filter"
import { BlogCard } from "@/components/blog-card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PROJECTS } from "@/data/projects"
import { ADAPTIVE_FOCUS_EXAMPLES } from "@/features/adaptive-focus"
import type { Project } from "@/types/project"
import dynamic from "next/dynamic"
const HeroBackground = dynamic(
  () => import("@/components/hero-background").then((m) => m.HeroBackground),
  {
    ssr: false,
    loading: () => null,
  }
)
import { RecentHighlights } from "@/components/recent-highlights"
import { NeonSeparator } from "@/components/neon-separator"

const FEATURED_PROJECT_IDS = ["astrocade-qa-calibration-tool", "wizzo", "x-games"]

const featuredProjects = FEATURED_PROJECT_IDS.map((id) =>
  PROJECTS.find((project) => project.id === id)
).filter((project): project is Project => Boolean(project))

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const [focusQuery, setFocusQuery] = useState("")
  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])

  const latestPosts = [
    {
      id: "voice-first-xr",
      title: "Voice-First XR: Five Lessons from the Front Lines of Inclusive Design",
      excerpt: "Key takeaways for crafting accessible voice interfaces in spatial computing.",
      date: "Jun 18, 2025",
      readingTime: "5 min read",
      url: "https://medium.com/@mikejchaves/voice-first-xr-five-lessons-from-the-front-lines-of-inclusive-design-e58dacf49c54",
      publication: "Bootcamp",
    },
  ];

  const skills = [
    "AI-assisted workflows",
    "Human-in-the-loop systems",
    "Product and design engineering",
    "Internal tools and operational UX",
    "Moderation and QA calibration",
    "Creator workflows",
    "Accessibility-focused interaction",
    "XR, voice UI, and emerging interfaces",
  ];

  return (
    <div className="home-immersive-page relative isolate">
      <HeroBackground />
      <h1 className="sr-only">Mike Chaves - AI-Native Design Engineer</h1>

      <div className="home-content-layer relative z-10 space-y-16">
      <section className="relative flex min-h-[42vh] flex-col justify-center py-12 sm:py-16">
        <Terminal
          text="AI-native design engineer for product systems, human-in-the-loop AI, and operational UX."
          typingSpeed={40}
          className="max-w-3xl mx-auto"
          onComplete={handleIntroComplete}
        />

        <div className="mt-8 flex min-h-10 justify-center">
          {introComplete && (
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-md transition-colors border border-primary/40 shadow-[0_0_10px_rgba(0,255,140,0.2)]"
            >
              View About <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>

      <NeonSeparator intensity="low" />

      <section className="terminal-window relative">
        <div className="infection-badge infection-badge-medium">INFECTION_INDEX: 34%</div>
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">what_im_built_for.sh</div>
        </div>
        <div className="terminal-content space-y-2">
          <h2 className="text-xl font-bold">What I’m Built For</h2>
          <p><span className="text-primary">$</span> Human-in-the-loop AI systems</p>
          <p><span className="text-primary">$</span> Internal tools and operational UX</p>
          <p><span className="text-primary">$</span> Product + design + engineering alignment</p>
          <p><span className="text-primary">$</span> Creator workflows, moderation, and QA calibration</p>
        </div>
      </section>

      <NeonSeparator intensity="medium" />

      <section className="space-y-4 relative">
        <div className="infection-badge infection-badge-medium">INFECTION_INDEX: 41%</div>
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">adaptive_focus.sh</div>
          </div>
          <div className="terminal-content space-y-3">
            <p className="text-sm text-muted-foreground">I design and build AI-native product systems for messy workflows where automation, human judgment, and operational tooling have to work together.</p>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const q = focusQuery.trim()
                if (!q) return
                window.location.href = `/projects?focus=${encodeURIComponent(q)}`
              }}
            >
              <Input
                value={focusQuery}
                onChange={(e) => setFocusQuery(e.target.value)}
                placeholder="e.g. I'm hiring for an AI-native design engineer"
                className="flex-1"
              />
              <Button type="submit">Show Role Fit</Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {ADAPTIVE_FOCUS_EXAMPLES.slice(0, 3).map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => (window.location.href = `/projects?focus=${encodeURIComponent(example)}`)}
                  className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NeonSeparator intensity="medium" />

      <section className="relative">
        <div className="infection-badge infection-badge-high">INFECTION_INDEX: 58%</div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link
            href="/projects"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <ProjectFilter featured={featuredProjects} projects={PROJECTS} />
      </section>

      <NeonSeparator intensity="low" />

      <section className="relative">
        <div className="infection-badge infection-badge-high">INFECTION_INDEX: 67%</div>
        <h2 className="text-2xl font-bold mb-6">Systems</h2>
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">system_specs.sh</div>
          </div>
          <div className="terminal-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-primary">$</span>
                  <span className="text-white">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NeonSeparator intensity="high" />

      <section className="relative">
        <div className="infection-badge infection-badge-critical">INFECTION_INDEX: 82%</div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Leadership Brief</h2>
          <Link
            href="/blog"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {latestPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      <RecentHighlights />
      </div>
    </div>
  );
}

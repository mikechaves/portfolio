"use client";

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { AdaptiveFocusEntry } from "@/components/adaptive-focus-entry"
import { BlogCard } from "@/components/blog-card"
import { ProjectCard } from "@/components/project-card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PROJECTS } from "@/data/projects"
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

const HOME_HERO_LINES = [
  "$ identify --mike_chaves",
  "AI-native design engineer for product systems,",
  "human-in-the-loop AI, and operational UX.",
  "",
  "$ trace --portfolio",
  "Start with the thesis, inspect the operating model,",
  "then open the proof in project case studies.",
]

function HomeHeroTerminal({ onComplete }: { onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const shouldReduceMotion = useReducedMotion()
  const fullText = HOME_HERO_LINES.join("\n")

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedText(fullText)
      setIsTyping(false)
      onComplete()
      return
    }

    let currentIndex = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    setDisplayedText("")
    setIsTyping(true)

    const typeNextCharacter = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        const typedCharacter = fullText[currentIndex]
        currentIndex += 1
        timer = setTimeout(typeNextCharacter, typedCharacter === "\n" ? 160 : 24)
        return
      }

      setIsTyping(false)
      onComplete()
    }

    timer = setTimeout(typeNextCharacter, 180)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [fullText, onComplete, shouldReduceMotion])

  const renderedLines = displayedText.split("\n")

  return (
    <div className="terminal-window relative mx-auto max-w-3xl overflow-hidden shadow-[0_0_34px_rgba(0,255,140,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,255,140,0.09),transparent_38%)]" />
      <div className="terminal-header relative z-10">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">homepage.launch</div>
        <div className="ml-auto hidden items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary/70 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {isTyping ? "routing" : "ready"}
        </div>
      </div>
      <div className="terminal-content relative z-10 min-h-[11rem] rounded border border-primary/20 bg-black/45 p-4 text-sm leading-7 text-zinc-100 sm:text-base">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {fullText}
        </div>
        <div className="whitespace-pre-wrap break-words" aria-hidden="true">
          {renderedLines.map((line, index) => {
            if (line.startsWith("$")) {
              return (
                <div key={`${line}-${index}`}>
                  <span className="text-primary">$</span>
                  {line.slice(1)}
                </div>
              )
            }

            return <div key={`${line}-${index}`}>{line || "\u00a0"}</div>
          })}
          {isTyping && <span className="terminal-cursor" />}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
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
        <HomeHeroTerminal onComplete={handleIntroComplete} />

        <div className="mt-8 flex min-h-10 flex-wrap justify-center gap-3">
          {introComplete && (
            <>
              <Button asChild>
                <Link href="/projects">
                  View Work <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/40 bg-black/30 text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/about">
                  View About <ArrowRight size={16} />
                </Link>
              </Button>
            </>
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
          <div className="mt-4 flex flex-wrap gap-3 border-t border-primary/20 pt-4">
            <Button asChild size="sm">
              <Link href="/about">
                Read Positioning <ArrowRight size={14} />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/projects">
                Inspect Proof <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
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
          <div className="terminal-content">
            <AdaptiveFocusEntry />
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              technologies={project.technologies}
              category={project.category}
              priority={index < 3}
            />
          ))}
        </div>
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

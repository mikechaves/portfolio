"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  featuredPortfolioProjects,
  portfolioCapabilities,
  portfolioWriting,
  type SceneSection,
  sceneSections,
} from "@/data/portfolio"
import { ArrowRight } from "lucide-react"

const IndustrialHomeExperience = dynamic(
  () => import("@/components/industrial-home-experience").then((m) => m.IndustrialHomeExperience),
  {
    ssr: false,
    loading: () => <div className="industrial-canvas industrial-canvas-fallback" aria-hidden="true" />,
  },
)

const waveformBars = Array.from({ length: 22 }, (_, index) => index)
const nodeReadoutValues = ["-10", "-12", "-09", "-13", "-08", "-11"]

function useHomeScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [sceneActive, setSceneActive] = useState(true)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setReducedMotion(media.matches)

    updateMotion()
    media.addEventListener("change", updateMotion)
    return () => media.removeEventListener("change", updateMotion)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setProgress(0)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const easedProgress = { value: 0 }
    let lastProgress = -1
    const syncProgress = () => {
      if (Math.abs(easedProgress.value - lastProgress) < 0.001) return
      lastProgress = easedProgress.value
      setProgress(easedProgress.value)
    }
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
      invalidateOnRefresh: true,
      scrub: 0.75,
      onUpdate: (self) => {
        gsap.to(easedProgress, {
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
          value: self.progress,
        })
      },
    })

    gsap.ticker.add(syncProgress)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(syncProgress)
      trigger.kill()
      gsap.killTweensOf(easedProgress)
    }
  }, [reducedMotion])

  useEffect(() => {
    const updateVisibility = () => setSceneActive(document.visibilityState === "visible" && document.hasFocus())

    updateVisibility()
    document.addEventListener("visibilitychange", updateVisibility)
    window.addEventListener("focus", updateVisibility)
    window.addEventListener("blur", updateVisibility)

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility)
      window.removeEventListener("focus", updateVisibility)
      window.removeEventListener("blur", updateVisibility)
    }
  }, [])

  return { progress, reducedMotion, sceneActive }
}

function useActiveSceneSection(sections: SceneSection[], progress: number) {
  return useMemo(() => {
    return sections.find((section) => progress >= section.range[0] && progress <= section.range[1]) ?? sections[0]
  }, [progress, sections])
}

export default function Home() {
  const { progress, reducedMotion, sceneActive } = useHomeScrollProgress()
  const activeSection = useActiveSceneSection(sceneSections, progress)

  return (
    <div className="industrial-home" data-active-section={activeSection.id}>
      <IndustrialHomeExperience progress={progress} reducedMotion={reducedMotion} sceneActive={sceneActive} />
      <div className="industrial-atmosphere" aria-hidden="true">
        <span className="industrial-atmosphere-screen industrial-atmosphere-screen-left" />
        <span className="industrial-atmosphere-screen industrial-atmosphere-screen-right" />
        <span className="industrial-atmosphere-light industrial-atmosphere-light-a" />
        <span className="industrial-atmosphere-light industrial-atmosphere-light-b" />
        <span className="industrial-atmosphere-cables" />
        <span className="industrial-atmosphere-floor" />
        <span className="industrial-atmosphere-gantry industrial-atmosphere-gantry-left" />
        <span className="industrial-atmosphere-gantry industrial-atmosphere-gantry-right" />
        <span className="industrial-atmosphere-tower industrial-atmosphere-tower-left" />
        <span className="industrial-atmosphere-tower industrial-atmosphere-tower-right" />
        <span className="industrial-atmosphere-smoke" />
      </div>
      <aside className="industrial-section-rail" aria-hidden="true">
        {sceneSections.map((section) => (
          <span key={section.id} className={section.id === activeSection.id ? "is-active" : undefined}>
            {section.index}
          </span>
        ))}
      </aside>

      <section id="top" className="industrial-hero-section">
        <div className="industrial-hero-copy">
          <h1>Mike Chaves</h1>
          <p>AI product systems, spatial interfaces, and forward-deployed execution.</p>
          <div className="industrial-actions">
            <Link href="#work" className="industrial-button industrial-button-primary">
              Enter the Work <ArrowRight size={16} />
            </Link>
            <Link href="/projects" className="industrial-button industrial-button-ghost">
              View Projects
            </Link>
          </div>
        </div>
        <div className="industrial-scroll-hint">Scroll to explore</div>
      </section>

      <section id="work" className="industrial-story-section industrial-work-section">
        <div className="industrial-section-copy">
          <span className="industrial-index">02</span>
          <h2>Selected Work</h2>
          <p>Scroll through projects where AI systems, spatial interfaces, and product execution meet real operating constraints.</p>
          <div className="industrial-waveform" aria-hidden="true">
            {waveformBars.map((index) => (
              <span key={index} />
            ))}
          </div>
          <Link href="/projects" className="industrial-text-link">
            View all projects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="industrial-project-list">
          {featuredPortfolioProjects.map((project, index) => (
            <Link href={project.href} className="industrial-project-slab" key={project.id}>
              <span>{String(index + 1).padStart(2, "0")} / 04</span>
              <h3>{project.title}</h3>
              <p>{project.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="systems" className="industrial-story-section industrial-systems-section">
        <div className="industrial-section-copy">
          <span className="industrial-index">03</span>
          <h2>Systems I Build</h2>
          <p>Capabilities and systems thinking that power the work.</p>
          <div className="industrial-node-readout" aria-hidden="true">
            {nodeReadoutValues.map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
        <div className="industrial-capability-grid">
          {portfolioCapabilities.map((capability) => (
            <div key={capability.id} className="industrial-capability-panel">
              <h3>{capability.label}</h3>
              <p>{capability.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="industrial-story-section industrial-contact-section">
        <div className="industrial-writing-list">
          <span className="industrial-index">04</span>
          <h2>Writing</h2>
          {portfolioWriting.slice(0, 4).map((post) => (
            <a key={post.id} href={post.href} target="_blank" rel="noopener noreferrer">
              {post.title} <ArrowRight size={14} />
            </a>
          ))}
          <Link href="/blog" className="industrial-text-link">
            View all writing <ArrowRight size={14} />
          </Link>
        </div>
        <div className="industrial-contact-panel">
          <h2>Let&apos;s build something real.</h2>
          <p>I partner on high-impact projects at the intersection of AI, systems, and space.</p>
          <Link href="/about#contact" className="industrial-button industrial-button-ghost">
            Start a conversation <ArrowRight size={16} />
          </Link>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>founder@gowizzo.io</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>SF Bay Area</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Selective partnerships</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}

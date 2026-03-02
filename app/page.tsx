"use client";

import { useState } from "react"
import Link from "next/link"
import { Terminal } from "@/components/terminal"
import { ProjectCard } from "@/components/project-card"
import { ProjectFilter } from "@/components/project-filter"
import { BlogCard } from "@/components/blog-card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ADAPTIVE_FOCUS_EXAMPLES } from "@/features/adaptive-focus"
import dynamic from "next/dynamic"
const HeroBackground = dynamic(
  () => import("@/components/hero-background").then((m) => m.HeroBackground),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      />
    ),
  }
)
import { RecentHighlights } from "@/components/recent-highlights"

const allProjects = [
  {
    id: "astrocade-qa-calibration-tool",
    title: "Astrocade QA Calibration Tool",
    description:
      "Built and operated a human-in-the-loop QA calibration system for Astrocade's UGC moderation pipeline, improving precision/recall tuning, reducing repeat rejections, and accelerating daily review throughput.",
    image: "/projects/astrocade/main-image.png?height=400&width=600",
    technologies: ["Python", "Moderation Tooling", "Analytics", "Human-in-the-Loop QA"],
    category: "development" as const,
  },
  {
    id: "wizzo",
    title: "Wizzo",
    description:
      "Founded Wizzo Labs, building a SaaS platform for goal tracking and personal productivity currently in beta launch. Driving product vision and technical prototyping across AI and web interfaces while leading fundraising, strategy, and early team formation.",
    image: "/projects/wizzo/main-image.png?height=400&width=600",
    technologies: ["SaaS Platform", "Goal Tracking", "Productivity Tools", "AI Integration"],
    category: "web" as const,
  },
  {
    id: "geovoice",
    title: "GeoVoice",
    description:
      "A platform created to streamline geospatial data analysis and stakeholder feedback, primarily for large-scale infrastructure and environmental planning projects. The result is a more transparent and efficient way to collaborate.",
    image: "/projects/geovoice/main-image.png?height=400&width=600",
    technologies: ["Geospatial Mapping", "UX/UI Design", "Data Visualization"],
    category: "web" as const,
  },
  {
    id: "transcribe",
    title: "Transcribe",
    description:
      "Improved communication in Starbucks stores with real-time speech-to-text transcription, enhancing inclusivity and operational efficiency.",
    image: "/projects/transcribe/main-image.png?height=400&width=600",
    technologies: ["React.js", "UX/UI Design", "Speech-to-Text API"],
    category: "web" as const,
  },
  {
    id: "gaia",
    title: "Gaia",
    description:
      "Transformed data analytics into practical, experiential contexts through spatial computing for Starbucks, enhancing store operations and training.",
    image: "/projects/gaia/main-image.png?height=400&width=600",
    technologies: ["UX Design", "AR/VR", "Unity3D"],
    category: "ar-vr" as const,
  },
  {
    id: "apt-plus",
    title: "APT+",
    description:
      "Streamlined manufacturing workflows for Ford by improving time studies, saving approximately $1M per plant annually.",
    image: "/projects/apt-plus/main-image.png?height=400&width=600",
    technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
    category: "design" as const,
  },
  {
    id: "speakeasy",
    title: "SpeakEasy",
    description:
      "Reimagining XR for a more inclusive future with voice-driven AI interfaces for users with physical challenges.",
    image: "/projects/speakeasy/thesis-defense.jpg?height=400&width=600",
    technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
    category: "research" as const,
  },
  {
    id: "sound-escape-vr",
    title: "Sound Escape VR",
    description:
      "An immersive VR music creation and visualization experience with a retro 80s synthwave aesthetic, allowing users to compose music and see the environment transform in response.",
    image: "/projects/soundescape/main-image.jpg?height=400&width=600",
    technologies: ["Unity3D", "C#", "VR Development", "Audio Visualization"],
    category: "ar-vr" as const,
  },
  {
    id: "material-explorer",
    title: "Material Explorer",
    description:
      "An actively maintained 3D material lab with real-time PBR editing, A/B compare, autosave, and share/export workflows built with React + Three.js.",
    image: "/projects/material-explorer/main-image.png?height=400&width=600",
    technologies: ["TypeScript", "React 19", "Three.js", "React Three Fiber"],
    category: "development" as const,
  },
  {
    id: "portals",
    title: "Portals",
    description:
      "An immersive AR experience for Snap Spectacles designed to bring music, culture, and climate awareness to life through interactive and accessible features.",
    image: "/projects/portals/main-image.png?height=400&width=600",
    technologies: ["AR", "Snap Spectacles", "Spatial Audio", "Voice UI", "Accessibility"],
    category: "ar-vr" as const,
  },
  {
    id: "ai-energy-consumption",
    title: "AI Energy Consumption",
    description:
      "An interactive 3D data visualization showcasing the global impact of AI's energy consumption and CO2 emissions across different countries and regions.",
    image: "/projects/ai-energy-consumption/main-image.png?height=400&width=600",
    technologies: ["A-Frame", "D3.js", "3D Visualization", "Data Storytelling"],
    category: "development" as const,
  },
  {
    id: "die-ai",
    title: "Die, AI!",
    description:
      "A Flash shooter demo built in Adobe Animate and ActionScript, now revived for modern browsers with Ruffle.",
    image: "/projects/die-ai/main-image.png?height=400&width=600",
    technologies: ["ActionScript", "Adobe Animate", "Ruffle"],
    category: "development" as const,
  },
]

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const [focusQuery, setFocusQuery] = useState("")

  const featuredProjects = [
    {
      id: "astrocade-qa-calibration-tool",
      title: "Astrocade QA Calibration Tool",
      description:
        "Built and operated a human-in-the-loop QA calibration system for Astrocade's UGC moderation pipeline, improving precision/recall tuning, reducing repeat rejections, and accelerating daily review throughput.",
      image: "/projects/astrocade/main-image.png?height=400&width=600",
      technologies: ["Moderation Tooling", "Analytics", "Human-in-the-Loop QA"],
      category: "development" as const,
    },
    {
      id: "wizzo",
      title: "Wizzo",
      description:
        "Founded Wizzo Labs, building a SaaS platform for goal tracking and personal productivity currently in beta launch. Driving product vision and technical prototyping across AI and web interfaces while leading fundraising, strategy, and early team formation.",
      image: "/projects/wizzo/main-image.png?height=400&width=600",
      technologies: ["SaaS Platform", "Productivity Tools", "AI Integration"],
      category: "web" as const,
    },
    {
      id: "gaia",
      title: "Gaia",
      description:
        "Transformed data analytics into practical, experiential contexts through spatial computing for Starbucks, enhancing store operations and training.",
      image: "/projects/gaia/main-image.png?height=400&width=600",
      technologies: ["UX Design", "AR/VR", "Unity3D"],
      category: "ar-vr" as const,
    },
    {
      id: "apt-plus",
      title: "APT+",
      description:
        "Streamlined manufacturing workflows for Ford by improving time studies, saving approximately $1M per plant annually.",
      image: "/projects/apt-plus/main-image.png?height=400&width=600",
      technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
      category: "design" as const,
    },
  ];


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
    "UX Design",
    "UI Development",
    "AR/VR",
    "User Research",
    "Prototyping",
    "Creative Direction",
    "Team Leadership",
    "Front-end Development",
  ];

  return (
    <div className="space-y-16">
      <h1 className="sr-only">Mike Chaves - UX Designer & Developer</h1>

      <section className="py-12 relative">
        <HeroBackground />
        <Terminal
          text="Hello, World. I am MIKE_CHAVES. I design immersive, user-centered experiences that push boundaries."
          typingSpeed={40}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-md transition-colors border border-primary/40 shadow-[0_0_10px_rgba(0,255,140,0.2)]"
            >
              Learn more about me <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">adaptive_focus.sh</div>
          </div>
          <div className="terminal-content space-y-3">
            <p className="text-sm text-muted-foreground">Describe what you want to evaluate and jump into a focused projects view.</p>
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
                placeholder="e.g. I'm hiring for an AI design engineer"
                className="flex-1"
              />
              <Button type="submit">Focus Projects</Button>
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

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link
            href="/projects"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <ProjectFilter featured={featuredProjects} projects={allProjects} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
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

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest from the Blog</h2>
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
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Terminal } from "@/components/terminal"
import { ProjectCard } from "@/components/project-card"
import { ProjectFilter } from "@/components/project-filter"
import { BlogCard } from "@/components/blog-card"
import { ArrowRight } from "lucide-react"
import { HeroBackground } from "@/components/hero-background"
import { RecentHighlights } from "@/components/recent-highlights"

const allProjects = [
  {
    id: "geovoice",
    title: "GeoVoice",
    description:
      "A platform created to streamline geospatial data analysis and stakeholder feedback, primarily for large-scale infrastructure and environmental planning projects. The result is a more transparent and efficient way to collaborate.",
    image: "/projects/geovoice/main-image.png?height=400&width=600",
    technologies: ["Geospatial Mapping", "UX/UI Design", "Data Visualization"],
  },
  {
    id: "transcribe",
    title: "Transcribe",
    description:
      "Improved communication in Starbucks stores with real-time speech-to-text transcription, enhancing inclusivity and operational efficiency.",
    image: "/projects/transcribe/main-image.png?height=400&width=600",
    technologies: ["React.js", "UX/UI Design", "Speech-to-Text API"],
  },
  {
    id: "gaia",
    title: "Gaia",
    description:
      "Transformed data analytics into practical, experiential contexts through spatial computing for Starbucks, enhancing store operations and training.",
    image: "/projects/gaia/main-image.png?height=400&width=600",
    technologies: ["UX Design", "AR/VR", "Unity3D"],
  },
  {
    id: "apt-plus",
    title: "APT+",
    description:
      "Streamlined manufacturing workflows for Ford by improving time studies, saving approximately $1M per plant annually.",
    image: "/projects/apt-plus/main-image.png?height=400&width=600",
    technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
  },
  {
    id: "speakeasy",
    title: "SpeakEasy",
    description:
      "Reimagining XR for a more inclusive future with voice-driven AI interfaces for users with physical challenges.",
    image: "/projects/speakeasy/thesis-defense.jpg?height=400&width=600",
    technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
  },
  {
    id: "sound-escape-vr",
    title: "Sound Escape VR",
    description:
      "An immersive VR music creation and visualization experience with a retro 80s synthwave aesthetic, allowing users to compose music and see the environment transform in response.",
    image: "/projects/soundescape/main-image.jpg?height=400&width=600",
    technologies: ["Unity3D", "C#", "VR Development", "Audio Visualization"],
  },
  {
    id: "material-explorer",
    title: "Material Explorer",
    description:
      "An interactive web application for creating, customizing, and visualizing 3D materials in real-time using Three.js and React Three Fiber.",
    image: "/projects/material-explorer/main-image.png?height=400&width=600",
    technologies: ["TypeScript", "React", "Three.js", "WebGL"],
  },
  {
    id: "portals",
    title: "Portals",
    description:
      "An immersive AR experience for Snap Spectacles designed to bring music, culture, and climate awareness to life through interactive and accessible features.",
    image: "/projects/portals/main-image.png?height=400&width=600",
    technologies: ["AR", "Snap Spectacles", "Spatial Audio", "Voice UI", "Accessibility"],
  },
  {
    id: "ai-energy-consumption",
    title: "AI Energy Consumption",
    description:
      "An interactive 3D data visualization showcasing the global impact of AI's energy consumption and CO2 emissions across different countries and regions.",
    image: "/projects/ai-energy-consumption/main-image.png?height=400&width=600",
    technologies: ["A-Frame", "D3.js", "3D Visualization", "Data Storytelling"],
  },
]

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)

  const featuredProjects = [
    {
      id: "gaia",
      title: "Gaia",
      description:
        "Transformed data analytics into practical, experiential contexts through spatial computing for Starbucks, enhancing store operations and training.",
      image: "/projects/gaia/main-image.png?height=400&width=600",
      technologies: ["UX Design", "AR/VR", "Unity3D"],
    },
    {
      id: "apt-plus",
      title: "APT+",
      description:
        "Streamlined manufacturing workflows for Ford by improving time studies, saving approximately $1M per plant annually.",
      image: "/projects/apt-plus/main-image.png?height=400&width=600",
      technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
    },
    {
      id: "speakeasy",
      title: "SpeakEasy",
      description:
        "Reimagining XR for a more inclusive future with voice-driven AI interfaces for users with physical challenges.",
      image: "/projects/speakeasy/thesis-defense.jpg?height=400&width=600",
      technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
    },
  ]


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
  ]

  const skills = [
    "UX Design",
    "UI Development",
    "AR/VR",
    "User Research",
    "Prototyping",
    "Creative Direction",
    "Team Leadership",
    "Front-end Development",
  ]

  return (
    <div className="space-y-16">
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

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link href="/projects" className="text-primary hover:underline inline-flex items-center gap-1">
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
          <Link href="/blog" className="text-primary hover:underline inline-flex items-center gap-1">
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
  )
}

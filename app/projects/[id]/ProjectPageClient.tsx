"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { ImageModal } from "@/components/image-modal"

interface ProjectPageClientProps {
  project: any
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const images = project ? [project.image, ...(project.gallery || [])] : []

  const closeModal = useCallback(() => setSelectedIndex(null), [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null) return null
      return (i - 1 + images.length) % images.length
    })
  }, [images.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null) return null
      return (i + 1) % images.length
    })
  }, [images.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleNext, handlePrev])

  return (
    <div className="space-y-8 pt-8">
      <h1 className="sr-only">{project.title || "Project Details"}</h1>
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">project_details.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> cat {project.id}.json
          </p>
          <div className="mb-4">
            <p>
              <span className="text-primary">title:</span> {project.title}
            </p>
            <p>
              <span className="text-primary">category:</span> {project.category}
            </p>
            <p>
              <span className="text-primary">client:</span> {project.details.client}
            </p>
            <p>
              <span className="text-primary">date:</span> {project.details.date}
            </p>
            <p className="flex flex-wrap gap-2 mt-2">
              <span className="text-primary">stack:</span>
              {project.technologies.map((tech: string, index: number) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                  {tech}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div
        className="relative h-80 rounded-md overflow-hidden cursor-pointer"
        onClick={() => setSelectedIndex(0)}
      >
        <Image
          src={
            project.image ||
            `/api/placeholder?width=1200&height=600&text=${encodeURIComponent(project.title)}`
          }
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      {project.gallery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {project.gallery.map((img: string, index: number) => (
            <div
              key={index}
              className="bg-zinc-100 rounded-md overflow-hidden h-[200px] flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedIndex(index + 1)}
            >
              <Image
                src={
                  img ||
                  `/api/placeholder?width=800&height=600&text=${encodeURIComponent(project.title)}`
                }
                alt={`${project.title} gallery image ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors"
        >
          <Github size={16} /> View on GitHub
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
        >
          <ExternalLink size={16} /> Live Demo
        </a>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p className="text-muted-foreground">{project.description || "No description available."}</p>
      </div>

      {project.details && project.details.situation && typeof project.details.situation === "string" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Situation</h2>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <p className="text-zinc-300">{project.details.situation}</p>
          </div>
        </div>
      )}

      {project.details && project.details.situation && Array.isArray(project.details.situation) && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Situation</h2>
          <div className="space-y-4">
            {project.details.situation.map((item: any, index: number) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {item.title}
                </h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.task && typeof project.details.task === "string" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Task</h2>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <p className="text-zinc-300">{project.details.task}</p>
          </div>
        </div>
      )}

      {project.details && project.details.task && Array.isArray(project.details.task) && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Task</h2>
          <div className="space-y-4">
            {project.details.task.map((item: any, index: number) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {item.title}
                </h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.actions && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Action</h2>
          <div className="space-y-4">
            {project.details.actions.map((action: any, index: number) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">{index + 1}.</span> {action.title}
                </h3>
                <p className="text-zinc-400">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.results && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Result</h2>
          <div className="space-y-4">
            {project.details.results.map((result: any, index: number) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {result.title}
                </h3>
                <p className="text-zinc-400">{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.details && project.details.result && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Result</h2>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <p className="text-zinc-300">{project.details.result}</p>
          </div>
        </div>
      )}

      {project.details && project.details.exhibition && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Exhibition & Future Directions</h2>
          <div className="space-y-4">
            {project.details.exhibition.map((item: any, index: number) => (
              <div key={index} className="border border-zinc-800 rounded-md p-4 bg-black">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-primary mr-2">•</span> {item.title}
                </h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <ImageModal
        open={selectedIndex !== null}
        onOpenChange={(o) => !o && closeModal()}
        src={selectedIndex !== null ? images[selectedIndex] : ""}
        alt={project.title}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}

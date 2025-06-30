"use client"

import { useState, useEffect } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
}

interface ProjectFilterProps {
  projects: Project[]
}

export function ProjectFilter({ projects }: ProjectFilterProps) {
  const [query, setQuery] = useState("")
  const [personalized, setPersonalized] = useState(false)
  const [display, setDisplay] = useState<Project[]>(projects)

  useEffect(() => {
    setDisplay(projects)
  }, [projects])

  const handlePersonalize = () => {
    const text = query.trim().toLowerCase()
    if (!text) {
      setDisplay(projects)
      setPersonalized(false)
      return
    }
    const matches = projects.filter((p) =>
      p.technologies.some((tag) => tag.toLowerCase().includes(text))
    )
    if (matches.length > 0) {
      setDisplay(matches)
      setPersonalized(true)
    } else {
      setDisplay(projects)
      setPersonalized(false)
    }
  }

  const handleReset = () => {
    setQuery("")
    setDisplay(projects)
    setPersonalized(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a keyword"
          className="flex-1"
        />
        <Button onClick={handlePersonalize}>Personalize</Button>
        {personalized && (
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        )}
      </div>

      {personalized && (
        <h3 className="text-xl font-bold">
          Projects aligned with “{query.trim()}”:
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {display.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}

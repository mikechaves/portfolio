"use client"

import { useState, useEffect, useCallback, useId, type FormEvent } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Project } from "@/types/project"

interface ProjectFilterProps {
  featured: Project[]
  projects: Project[]
}

export function ProjectFilter({ featured, projects }: ProjectFilterProps) {
  const [query, setQuery] = useState("")
  const [personalized, setPersonalized] = useState(false)
  const [display, setDisplay] = useState<Project[]>(featured)
  const inputId = useId()

  useEffect(() => {
    setDisplay(featured)
  }, [featured])

  const handlePersonalize = () => {
    const text = query.trim().toLowerCase()
    if (!text) {
      setDisplay(featured)
      setPersonalized(false)
      return
    }

    const matches = projects.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(text) ||
        (p.description || "").toLowerCase().includes(text) ||
        (p.technologies || []).some((tag) => (tag || "").toLowerCase().includes(text))
    )

    if (matches.length > 0) {
      setDisplay(matches)
      setPersonalized(true)
    } else {
      setDisplay(featured)
      setPersonalized(false)
    }
  }

  const handleReset = () => {
    setQuery("")
    setDisplay(featured)
    setPersonalized(false)
  }

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      handlePersonalize()
    },
    [handlePersonalize]
  )

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col sm:flex-row gap-2"
        onSubmit={handleSubmit}
      >
        <label htmlFor={inputId} className="sr-only">
          Filter by keyword
        </label>
        <Input
          id={inputId}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a keyword"
          className="flex-1"
        />
        <Button type="submit">Personalize</Button>
        {personalized && (
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        )}
      </form>

      {personalized && (
        <h3 className="text-xl font-bold">
          Projects aligned with “{query.trim()}”:
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {display.map((project, index) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            technologies={project.technologies}
            category={project.category}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  )
}

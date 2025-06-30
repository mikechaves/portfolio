"use client"

import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProjectFilterProps {
  onPersonalize: (query: string) => void
  onReset: () => void
}

export function ProjectFilter({ onPersonalize, onReset }: ProjectFilterProps) {
  const [query, setQuery] = useState("")

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onPersonalize(query)
  }

  function handleReset() {
    setQuery("")
    onReset()
  }

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your interests"
      />
      <Button type="submit">Personalize</Button>
      <Button type="button" variant="secondary" onClick={handleReset}>
        Reset
      </Button>
    </form>
  )
}

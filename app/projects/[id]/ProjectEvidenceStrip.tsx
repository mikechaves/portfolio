"use client"

import Image from "next/image"
import { Maximize2 } from "lucide-react"
import type { ProjectMediaItem } from "./projectMedia"

interface ProjectEvidenceStripProps {
  media: ProjectMediaItem[]
  onOpen: (index: number) => void
  title: string
}

export function ProjectEvidenceStrip({ media, onOpen, title }: ProjectEvidenceStripProps) {
  if (media.length === 0) return null

  return (
    <section className="terminal-window case-study-terminal mt-4" aria-label={`${title} media evidence`}>
      <div className="terminal-header">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">{`evidence_${title.toLowerCase()}.log`}</div>
      </div>

      <div className={media.length === 1 ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        {media.map((item) => (
          <figure key={item.src} className="overflow-hidden rounded border border-zinc-800 bg-black/70">
            <button
              type="button"
              onClick={() => onOpen(item.index)}
              className="group relative flex min-h-56 w-full items-center justify-center overflow-hidden bg-black p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Open ${item.label} evidence fullscreen`}
            >
              <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-20" />
              <Image
                src={item.src}
                alt={item.alt}
                width={900}
                height={620}
                className="relative z-10 max-h-80 w-full rounded-sm object-contain"
                sizes="(min-width: 768px) 460px, 100vw"
                quality={84}
              />
              <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded border border-primary/30 bg-black/70 px-2 py-1 text-xs text-primary opacity-90 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                Open
              </span>
            </button>
            <figcaption className="border-t border-zinc-800 p-3">
              <p className="font-mono text-sm text-primary">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

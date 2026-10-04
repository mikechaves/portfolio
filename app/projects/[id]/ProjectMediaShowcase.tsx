"use client"
/* eslint-disable @next/next/no-img-element -- Precompressed local artifacts use native lazy loading without an image runtime. */

import { Maximize2 } from "lucide-react"
import type { ProjectMediaItem } from "./projectMedia"

interface ProjectMediaShowcaseProps {
  media: ProjectMediaItem[]
  onOpen: (index: number) => void
  className?: string
  priority?: boolean
}

function getThumbnailLabel(item: ProjectMediaItem) {
  return `Open ${item.label} from artifact viewer fullscreen`
}

export function ProjectMediaShowcase({ media, onOpen, className, priority = false }: ProjectMediaShowcaseProps) {
  if (media.length === 0) return null

  const primaryItem = media[0]
  const supportingMedia = media.slice(1)

  return (
    <section className={["cinematic-media-viewer", className].filter(Boolean).join(" ")} aria-label="Project media">
      <div className="cinematic-media-layout">
        <div>
          <button
            type="button"
            onClick={() => onOpen(primaryItem.index)}
            className="group relative flex aspect-[16/11] min-h-[16rem] w-full items-center justify-center overflow-hidden rounded-md border border-primary/25 bg-black/70 p-3 text-left transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-[26rem]"
            aria-label={`Open ${primaryItem.label} primary media fullscreen`}
          >


            <img
              src={primaryItem.src}
              alt={primaryItem.alt}
              width={1600}
              height={1000}
              className="relative z-10 max-h-[min(68vh,620px)] w-full rounded-sm object-contain"
              loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "low"} decoding="async"
            />
            <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded border border-primary/30 bg-black/70 px-2 py-1 text-xs text-primary opacity-90 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              Fullscreen
            </span>
          </button>
          <div className="mt-3 border-l border-primary/40 pl-3">
            <p className="font-mono text-sm text-primary">{primaryItem.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{primaryItem.caption}</p>
          </div>
        </div>

        {supportingMedia.length > 0 && (
          <div
            className="grid grid-cols-3 gap-3 lg:max-h-[min(68vh,620px)] lg:grid-cols-1 lg:auto-rows-[5.5rem] lg:overflow-y-auto lg:pr-1"
            aria-label="Supporting media"
          >
            {supportingMedia.map((item) => (
              <button
                key={item.src}
                type="button"
                onClick={() => onOpen(item.index)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded border border-zinc-800 bg-black/80 p-1 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:aspect-auto lg:h-auto"
                aria-label={getThumbnailLabel(item)}
              >
                <img
                  src={item.thumbnailSrc ?? item.src}
                  alt={item.alt}
                  loading="lazy" fetchPriority="low" decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-primary/80">
                  {String(item.index + 1).padStart(2, "0")}
                </span>
                <span className="absolute bottom-1.5 left-1.5 right-1.5 hidden truncate rounded bg-black/70 px-1.5 py-0.5 text-left text-[10px] text-zinc-200 lg:block">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import { Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProjectMediaItem } from "./projectMedia"

interface ProjectMediaShowcaseProps {
  media: ProjectMediaItem[]
  onOpen: (index: number) => void
  className?: string
}

function getThumbnailLabel(item: ProjectMediaItem) {
  return `Open ${item.label} from artifact viewer fullscreen`
}

export function ProjectMediaShowcase({ media, onOpen, className }: ProjectMediaShowcaseProps) {
  if (media.length === 0) return null

  const primaryItem = media[0]
  const supportingMedia = media.slice(1)

  return (
    <section className={cn("terminal-window case-study-terminal overflow-hidden", className)} aria-label="Project media">
      <div className="terminal-header">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">artifact_viewer.sh</div>
        <div className="ml-auto hidden text-xs uppercase text-primary/70 sm:block">
          {media.length} artifact{media.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div>
          <button
            type="button"
            onClick={() => onOpen(primaryItem.index)}
            className="group relative flex aspect-[16/11] min-h-[16rem] w-full items-center justify-center overflow-hidden rounded-md border border-primary/25 bg-black/70 p-3 text-left transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-[26rem]"
            aria-label={`Open ${primaryItem.label} primary media fullscreen`}
          >
            <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-25" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,255,140,0.10),transparent_24%,rgba(0,0,0,0.40))]" />
            <Image
              src={primaryItem.src}
              alt={primaryItem.alt}
              width={1600}
              height={1000}
              className="relative z-10 max-h-[min(68vh,620px)] w-full rounded-sm object-contain"
              sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
              priority
              quality={86}
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
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading="eager"
                  className="object-contain"
                  sizes="(min-width: 1024px) 224px, 128px"
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

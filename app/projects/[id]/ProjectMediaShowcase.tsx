"use client"

import Image from "next/image"
import { Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectMediaShowcaseProps {
  title: string
  images: string[]
  onOpen: (index: number) => void
  className?: string
}

function getImageAlt(title: string, index: number) {
  return index === 0 ? `${title} primary project image` : `${title} supporting artifact ${index}`
}

function getThumbnailLabel(title: string, index: number) {
  return `Open ${title} artifact thumbnail ${index + 1} fullscreen`
}

export function ProjectMediaShowcase({ title, images, onOpen, className }: ProjectMediaShowcaseProps) {
  if (images.length === 0) return null

  const primaryImage = images[0]

  return (
    <section className={cn("terminal-window overflow-hidden", className)} aria-label={`${title} project media`}>
      <div className="terminal-header">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">artifact_viewer.sh</div>
        <div className="ml-auto hidden text-xs uppercase text-primary/70 sm:block">
          {images.length} artifact{images.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-md border border-primary/25 bg-black/70 p-3 text-left transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:min-h-[26rem]"
          aria-label={`Open ${getImageAlt(title, 0)} fullscreen`}
        >
          <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-25" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,255,140,0.10),transparent_24%,rgba(0,0,0,0.40))]" />
          <Image
            src={primaryImage}
            alt={getImageAlt(title, 0)}
            width={1600}
            height={1000}
            className="relative z-10 max-h-[min(68vh,620px)] w-full rounded-sm object-contain"
            sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
            priority
          />
          <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded border border-primary/30 bg-black/70 px-2 py-1 text-xs text-primary opacity-90 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            Fullscreen
          </span>
        </button>

        {images.length > 1 && (
          <div
            className="grid grid-cols-3 gap-3 lg:max-h-[min(68vh,620px)] lg:grid-cols-1 lg:auto-rows-[5.5rem] lg:overflow-y-auto lg:pr-1"
            aria-label={`${title} supporting media`}
          >
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => onOpen(index)}
                className="group relative h-20 w-full overflow-hidden rounded border border-zinc-800 bg-black/80 p-1 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:h-auto"
                aria-label={getThumbnailLabel(title, index)}
              >
                <Image
                  src={image}
                  alt={getImageAlt(title, index)}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 224px, 128px"
                />
                <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-primary/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

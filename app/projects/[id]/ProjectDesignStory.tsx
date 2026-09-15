import Image from "next/image"
import { ArrowDownToLine, ArrowUpRight, Maximize2 } from "lucide-react"
import type { ProjectDesignStory as DesignStory } from "@/types/project-detail"
import type { ProjectMediaItem } from "./projectMedia"

export function ProjectDesignStory({ story, media, onOpen }: {
  story: DesignStory
  media: ProjectMediaItem[]
  onOpen: (index: number) => void
}) {
  return (
    <>
      {story.sections.map((section) => (
        <section key={section.id} id={section.id} className="case-study-section space-y-5">
          <p className="dossier-section-kicker">{section.label}</p>
          <h2 className="case-study-section-title">{section.title}</h2>
          <p className="case-study-detail-body">{section.body}</p>
          {section.decisions && (
            <div className="case-study-detail-grid">
              {section.decisions.map((decision) => (
                <div key={decision.title} className="case-study-detail-card">
                  <h3 className="case-study-detail-title">{decision.title}</h3>
                  <p className="case-study-detail-body mt-2">{decision.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.images && (
            <div className={section.images.length > 1 ? "grid gap-5 md:grid-cols-2" : "grid gap-5"}>
              {section.images.map((src) => {
                const item = media.find((entry) => entry.src === src)
                if (!item) return null
                return (
                  <figure key={src} className="min-w-0 overflow-hidden rounded-lg border border-zinc-800 bg-black/40">
                    <button type="button" onClick={() => onOpen(item.index)}
                      aria-label={`Open ${item.label} fullscreen`}
                      className="group relative block w-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                      <Image src={src} alt={item.alt} width={1440} height={1000} loading="lazy"
                        sizes={section.images!.length > 1 ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 1024px) 900px, 100vw"}
                        className="max-h-[34rem] w-full object-contain" />
                      <Maximize2 aria-hidden="true" size={18} className="absolute right-4 top-4 rounded bg-black/80 p-0.5 text-zinc-200" />
                    </button>
                    <figcaption className="border-t border-zinc-800 p-4">
                      <p className="text-sm font-semibold text-zinc-100">{item.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.caption}</p>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          )}
          {section.note && <p className="text-sm leading-relaxed text-zinc-400">{section.note}</p>}
          {section.link && <a href={section.link.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
            {section.link.label}<ArrowUpRight aria-hidden="true" size={16} />
          </a>}
        </section>
      ))}

      <section id="downloads" className="case-study-section space-y-5">
        <p className="dossier-section-kicker">Take a closer look</p>
        <h2 className="case-study-section-title">Case study and design guides</h2>
        <p className="case-study-detail-body">Download the complete design narrative, identity guidance and reusable system specifications.</p>
        <div className="grid gap-4">
          {story.downloads.map((file) => (
            <a key={file.url} href={file.url} download
              className="group flex min-w-0 items-start justify-between gap-5 rounded-lg border border-primary/25 bg-primary/5 p-5 transition-colors hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span><span className="block text-lg font-semibold text-zinc-100">{file.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-zinc-400">{file.description}</span>
                <span className="mt-3 block text-xs font-semibold uppercase tracking-wider text-primary">PDF · {file.pages} pages · {file.size}</span>
              </span>
              <ArrowDownToLine aria-hidden="true" className="mt-1 shrink-0 text-primary" size={22} />
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

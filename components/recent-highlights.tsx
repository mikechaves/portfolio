interface Highlight {
  id: string
  event: string
  role: string
  title: string
  date: string
  description?: string
  image?: string
}

const highlights: Highlight[] = [
  {
    id: "futuressummit-2025",
    event: "Futures Summit 2025",
    role: "Panelist",
    title: "The Rise of Synthetic AI Companions: Promise or Peril",
    date: "September 2025",
    description: "Panel explored AI companionship across education and industry.",
    image: "/events/chaves_futuressummit_2025_thumb.png",
  },
  {
    id: "gatherverse-xrevolve-2025",
    event: "GatherVerse XREvolve 2025",
    role: "Panelist",
    title: "AR & AI: The Intersection of the Future",
    date: "June 2025",
    description: "Roundtable on the future of AI-powered XR and accessibility",
    image: "/events/chaves_gatherverse_2025_thumb.png",
  },
  {
    id: "xr-access-2024",
    event: "XR Access Symposium (2024)",
    role: "Speaker",
    title: "Voice-Driven Mixed Reality for Accessibility",
    date: "July 2024",
    image: "/events/chaves_xraccess_2024_thumb.png",
  },
  {
    id: "adobe-experiential-2023",
    event: "Adobe Experiential Horizons Symposium (2023)",
    role: "Host/Presenter",
    title: "Industry Roundtable, Demo Showcase",
    date: "October 2023",
    image: "/events/chaves_adobesympo_2023_thumb.png",
  },
]

export function RecentHighlights() {
  return (
    <section className="signal-panel">
      <div className="signal-panel-heading">
        <h2>Latest Signals</h2>
        <span aria-hidden="true">03</span>
      </div>
      <ul className="divide-y divide-white/10">
        {highlights.map((h) => (
          <li key={h.id} className="grid grid-cols-[1fr_auto] gap-4 py-2 text-xs first:pt-0 last:pb-0">
            <div className="min-w-0">
              <h3 className="truncate text-zinc-300">{h.event} — {h.role}</h3>
              <p className="mt-0.5 line-clamp-1 text-[0.65rem] text-zinc-600">{h.title}</p>
            </div>
            <time className="whitespace-nowrap text-[0.62rem] text-[#ffc247]">{h.date}</time>
          </li>
        ))}
      </ul>
    </section>
  )
}

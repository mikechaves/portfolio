import Image from "next/image"

interface Highlight {
  event: string
  role: string
  title: string
  date: string
  description?: string
  image?: string
}

const highlights: Highlight[] = [
  {
    event: "GatherVerse XREvolve 2025",
    role: "Panelist",
    title: "AR & AI: The Intersection of the Future",
    date: "June 2025",
    description: "Roundtable on the future of AI-powered XR and accessibility",
  },
  {
    event: "XR Access Symposium (2024)",
    role: "Speaker",
    title: "Voice-Driven Mixed Reality for Accessibility",
    date: "July 2024",
  },
  {
    event: "Adobe Experiential Horizons Symposium (2023)",
    role: "Host/Presenter",
    title: "Industry Roundtable, Demo Showcase",
    date: "October 2023",
  },
]

export function RecentHighlights() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Recent Highlights</h2>
      <ul className="grid gap-6 md:grid-cols-3">
        {highlights.map((h) => (
          <li
            key={h.event}
            className="card-hover bg-card rounded-md p-4 flex gap-4"
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={
                  h.image ||
                  `/api/placeholder?width=64&height=64&text=${encodeURIComponent(
                    h.event
                  )}`
                }
                alt=""
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="text-sm flex flex-col">
              <h3
                className="font-bold text-white glitch"
                data-text={h.event}
              >
                {h.event}
              </h3>
              <p className="text-muted-foreground">{h.title}</p>
              {h.description && (
                <p className="text-muted-foreground text-xs mt-1">
                  {h.description}
                </p>
              )}
              <span className="mt-auto text-primary text-xs">
                {h.role} &ndash; {h.date}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

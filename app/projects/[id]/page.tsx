import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params

  // This would typically come from an API or database
  const projects: Record<string, any> = {
    starbucks: {
      title: "Starbucks Technology",
      description: "Work with Starbucks Technology Emerging Technology division on innovative digital experiences.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["UX Design", "Emerging Tech", "Innovation"],
      category: "design",
      github: "https://github.com/mikechaves/starbucks-project",
      demo: "https://mikechaves.io/work/starbucks",
      longDescription:
        "Collaborated with the Starbucks Technology Emerging Technology division to design and develop innovative digital experiences for customers and employees. Focused on creating intuitive interfaces that enhance the coffee experience while maintaining the brand's identity and values. Worked on projects involving mobile ordering, in-store digital experiences, and experimental technology integrations.",
    },
    // Other projects...
  }

  const project = projects[id]

  if (!project) {
    return notFound()
  }

  return (
    <div className="space-y-8">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
        Back to projects
      </Link>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">project_details.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> cat {id}.json
          </p>
          <div className="mb-4">
            <p>
              <span className="text-primary">title:</span> {project.title}
            </p>
            <p>
              <span className="text-primary">category:</span> {project.category}
            </p>
            <p className="flex flex-wrap gap-2 mt-2">
              <span className="text-primary">stack:</span>
              {project.technologies.map((tech: string, index: number) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                  {tech}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-80 rounded-md overflow-hidden">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors"
        >
          View on GitHub
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
        >
          Live Demo
        </a>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p className="text-muted-foreground">{project.longDescription}</p>
      </div>
    </div>
  )
}


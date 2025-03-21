"use client"

import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()

  // This would typically come from an API or database
  const projects = {
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
    ford: {
      title: "Ford Digital Experience",
      description: "Digital experience design for Ford's customer-facing applications and interfaces.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["UX/UI", "Digital Design", "Automotive"],
      category: "design",
      github: "https://github.com/mikechaves/ford-project",
      demo: "https://mikechaves.io/work/ford",
      longDescription:
        "Led the design of digital experiences for Ford's customer-facing applications, focusing on creating intuitive and accessible interfaces. Worked closely with engineering and product teams to ensure designs were technically feasible while meeting user needs. Conducted user research and usability testing to validate design decisions and improve the overall user experience.",
    },
    snap: {
      title: "Snap Inc's Spectacles",
      description: "Leading a team in the Spectacles Accelerator Program to create innovative AR experiences.",
      image: "/placeholder.svg?height=600&width=800",
      technologies: ["AR", "Team Leadership", "Product Design"],
      category: "ar",
      github: "https://github.com/mikechaves/snap-project",
      demo: "https://mikechaves.io/work/snap",
      longDescription:
        "Currently leading a team in Snap Inc's Spectacles Accelerator Program, focusing on creating innovative augmented reality experiences. Working with cutting-edge AR technology to push the boundaries of what's possible in spatial computing. Responsible for both the creative direction and technical implementation of AR applications, ensuring they are intuitive, engaging, and provide real value to users.",
    },
  }

  const project = projects[id as keyof typeof projects]

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={16} /> Back to projects
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
              {project.technologies.map((tech, index) => (
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
          <Github size={16} /> View on GitHub
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
        >
          <ExternalLink size={16} /> Live Demo
        </a>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p className="text-muted-foreground">{project.longDescription}</p>
      </div>
    </div>
  )
}


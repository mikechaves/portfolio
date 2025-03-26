import Link from "next/link"
import Image from "next/image"
import { Github, ExternalLink } from "lucide-react"

export default function AIEnergyConsumptionPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <span className="text-primary">←</span> Back to projects
      </Link>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button-red"></div>
          <div className="terminal-button-yellow"></div>
          <div className="terminal-button-green"></div>
          <div className="terminal-title">project_details.sh</div>
        </div>
        <p
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: "1.5",
            margin: "0",
            marginBottom: ".25rem",
          }}
          className="mb-3"
        >
          <span className="text-primary">$</span> cat ai-energy-consumption.json
        </p>
        <p
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: "1.5",
            margin: "0",
            marginBottom: ".25rem",
          }}
          className="mb-1"
        >
          <span className="text-primary">title:</span> AI Energy Consumption
        </p>
        <p
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: "1.5",
            margin: "0",
            marginBottom: ".25rem",
          }}
          className="mb-1"
        >
          <span className="text-primary">category:</span> web
        </p>
        <p
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: "1.5",
            margin: "0",
            marginBottom: ".25rem",
          }}
          className="mb-4"
        >
          <span className="text-primary">stack:</span>{" "}
          <span className="inline-flex flex-wrap gap-2 ml-1">
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">A-Frame</span>
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">D3.js</span>
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">3D Visualization</span>
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">Data Storytelling</span>
          </span>
        </p>
        <p
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: "1.5",
            margin: "0",
            marginBottom: ".25rem",
          }}
          className="mb-1"
        >
          <span className="text-primary">client:</span> Personal Project
        </p>
        <p
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: "1.5",
            margin: "0",
            marginBottom: ".25rem",
          }}
          className="mb-1"
        >
          <span className="text-primary">date:</span> October 2023
        </p>
      </div>

      <div className="bg-zinc-100 rounded-md overflow-hidden h-[280px] flex items-center justify-center">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="AI Energy Consumption Visualization"
          width={1200}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-4">
        <Link
          href="https://github.com/mikechaves/ai-energy-consumption"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-colors text-white px-4 py-2 rounded-md"
        >
          <Github size={16} /> View on GitHub
        </Link>
        <Link
          href="https://mikechaves.github.io/ai-energy-consumption/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-transparent border border-primary text-primary hover:bg-primary/10 transition-colors px-4 py-2 rounded-md"
        >
          <ExternalLink size={16} /> Live Demo
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p className="text-zinc-300 leading-relaxed">
          An interactive 3D data visualization showcasing the global impact of AI's energy consumption and CO2 emissions
          across different countries and regions. Built using A-Frame and D3.js, this project combines immersive 3D
          graphics with data storytelling to highlight the rising energy demands associated with AI technologies.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Situation</h2>
        <div className="space-y-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">•</span> Environmental Impact Awareness
            </h3>
            <p className="text-zinc-400">
              As AI technologies continue to advance and become more widespread, their energy consumption and
              environmental impact are growing concerns that often go unnoticed by the general public and even many
              technology professionals.
            </p>
          </div>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">•</span> Data Visualization Challenge
            </h3>
            <p className="text-zinc-400">
              Presenting complex environmental data in an engaging, accessible way is difficult. Traditional charts and
              graphs often fail to convey the scale and significance of the issue in a way that resonates with viewers.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Task</h2>
        <div className="space-y-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">•</span> Create an Immersive Experience
            </h3>
            <p className="text-zinc-400">
              Design and develop an interactive 3D visualization that makes abstract data about AI energy consumption
              tangible and impactful for users.
            </p>
          </div>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">•</span> Combine Technical Accuracy with Accessibility
            </h3>
            <p className="text-zinc-400">
              Present scientifically accurate data in a way that's understandable and engaging for both technical and
              non-technical audiences.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Action</h2>
        <div className="space-y-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">1.</span> Research & Data Collection
            </h3>
            <p className="text-zinc-400">
              Gathered and analyzed data on AI energy consumption across different countries and regions, focusing on
              both training and inference phases of AI systems.
            </p>
          </div>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">2.</span> Technical Implementation
            </h3>
            <p className="text-zinc-400">
              Developed a web-based 3D visualization using A-Frame for the immersive environment and D3.js for data
              binding and manipulation. Created custom shaders and animations to represent energy consumption patterns.
            </p>
          </div>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">3.</span> User Experience Design
            </h3>
            <p className="text-zinc-400">
              Designed an intuitive interface that allows users to explore the data from different perspectives, with
              interactive elements that reveal additional information and context.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Result</h2>
        <div className="space-y-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">•</span> Engaging Visualization
            </h3>
            <p className="text-zinc-400">
              Created a compelling 3D experience that transforms abstract data into a visually striking representation
              of AI's environmental impact.
            </p>
          </div>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">•</span> Educational Tool
            </h3>
            <p className="text-zinc-400">
              The project serves as both a data visualization and an educational resource, helping users understand the
              environmental implications of AI advancement.
            </p>
          </div>
          <div className="border border-zinc-800 rounded-md p-4 bg-black">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span className="text-primary mr-2">•</span> Technical Achievement
            </h3>
            <p className="text-zinc-400">
              Successfully integrated complex 3D graphics with data visualization techniques in a web-based application
              that performs well across different devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


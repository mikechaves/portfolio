"use client"

import type { RefObject } from "react"
import Link from "next/link"
import { ExternalLink, Pencil, RotateCcw, X } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { PROJECTS } from "@/data/projects"
import type {
  AdaptiveCapability,
  AdaptiveFocusV2Result,
  ProjectMatch,
} from "@/features/adaptive-focus"
import { CAPABILITY_LABELS } from "@/features/adaptive-focus"

const PROJECTS_BY_ID = new Map(PROJECTS.map((project) => [project.id, project]))

const SOURCE_DISCLOSURE: Record<AdaptiveFocusV2Result["analysisSource"], string> = {
  gpt: "GPT interpreted the role. Project matches and explanations come from reviewed portfolio evidence.",
  preset: "This preset uses a predefined role lens. No model request was needed.",
  "local-fallback": "Advanced role analysis is unavailable. This result uses the local Adaptive Focus parser.",
}

const MATCH_LABELS: Record<ProjectMatch["level"], string> = {
  primary: "Primary proof",
  supporting: "Strong supporting proof",
  adjacent: "Adjacent experience",
}

function ProjectProof({ match, priority = false }: { match: ProjectMatch; priority?: boolean }) {
  const project = PROJECTS_BY_ID.get(match.projectId)
  if (!project) return null

  return (
    <article className="grid gap-5 border-t border-primary/20 py-6 first:border-t-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <ProjectCard
        id={project.id}
        title={project.title}
        description={project.description}
        image={project.image}
        technologies={project.technologies}
        category={project.category}
        priority={priority}
      />
      <div className="space-y-4 py-1">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">{MATCH_LABELS[match.level]}</p>
          <h4 className="mt-1 text-lg font-bold">{project.title}</h4>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Requirements covered">
          {match.matchedRequirements.map((requirement) => (
            <span key={requirement} className="rounded-full border border-primary/25 px-2.5 py-1 text-xs text-foreground">
              {requirement}
            </span>
          ))}
        </div>
        <div>
          <h5 className="text-sm font-semibold">Why this matches</h5>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{match.explanation}</p>
        </div>
        <ul className="space-y-3">
          {match.evidence.map((evidence) => (
            <li key={evidence.evidenceId} className="border-l-2 border-primary/35 pl-3 text-sm leading-6 text-foreground">
              {evidence.statement}
              {evidence.outcome ? (
                <span className="mt-1 block text-xs text-muted-foreground">Outcome: {evidence.outcome}</span>
              ) : null}
            </li>
          ))}
        </ul>
        <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          Inspect case study <ExternalLink size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

interface RoleFitBriefProps {
  brief: AdaptiveFocusV2Result
  headingRef: RefObject<HTMLHeadingElement | null>
  onRemoveCapability: (capability: AdaptiveCapability) => void
  onEdit: () => void
  onReset: () => void
}

export function RoleFitBrief({
  brief,
  headingRef,
  onRemoveCapability,
  onEdit,
  onReset,
}: RoleFitBriefProps) {
  const interpretation = brief.interpretation

  return (
    <section className="space-y-8 border-y border-primary/30 py-7" aria-labelledby="role-fit-brief-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Adaptive Focus</p>
          <h2 id="role-fit-brief-heading" ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-bold focus:outline-none">
            {brief.briefTitle}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{brief.summary}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onEdit}>
            <Pencil size={14} aria-hidden="true" /> Edit
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={onReset}>
            <RotateCcw size={14} aria-hidden="true" /> Reset
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">Interpretation preview</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Role family</dt>
            <dd className="mt-1 capitalize">{interpretation.roleFamily.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Seniority</dt>
            <dd className="mt-1 capitalize">{interpretation.seniority}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Company context</dt>
            <dd className="mt-1">{interpretation.companyContext ?? "Not specified"}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2" aria-label="Interpreted capabilities">
          {interpretation.requirements.map((requirement) => (
            <button
              key={requirement.capability}
              type="button"
              onClick={() => onRemoveCapability(requirement.capability)}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Remove ${CAPABILITY_LABELS[requirement.capability]} requirement`}
            >
              {CAPABILITY_LABELS[requirement.capability]}
              <span className="text-muted-foreground">{requirement.importance}</span>
              <X size={12} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="text-xs leading-5 text-muted-foreground">{SOURCE_DISCLOSURE[brief.analysisSource]}</p>
      </div>

      {brief.interpretation.clarificationNeeded ? (
        <div className="border-l-2 border-yellow-400/70 pl-4">
          <h3 className="font-semibold">More context needed</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {brief.interpretation.clarificationQuestion ?? "Add a role, capability, or workflow."}
          </p>
        </div>
      ) : null}

      {brief.groups.primary.length ? (
        <div>
          <h3 className="text-xl font-bold">Primary proof</h3>
          <p className="mt-1 text-sm text-muted-foreground">The strongest reviewed evidence for the interpreted requirements.</p>
          <div className="mt-4">
            {brief.groups.primary.map((match, index) => (
              <ProjectProof key={match.projectId} match={match} priority={index === 0} />
            ))}
          </div>
        </div>
      ) : null}

      {brief.groups.supporting.length ? (
        <div>
          <h3 className="text-xl font-bold">Supporting proof</h3>
          <div className="mt-3 divide-y divide-primary/15 border-y border-primary/15">
            {brief.groups.supporting.slice(0, 5).map((match) => {
              const project = PROJECTS_BY_ID.get(match.projectId)
              if (!project) return null
              return (
                <div key={match.projectId} className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr_auto] sm:items-center">
                  <Link href={`/projects/${project.id}`} className="font-semibold text-primary hover:underline">
                    {project.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{match.evidence[0]?.statement}</p>
                  <span className="text-xs text-muted-foreground">{MATCH_LABELS[match.level]}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {brief.requirementCoverage.length ? <div>
        <h3 className="text-xl font-bold">Requirement coverage</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-primary/25 text-xs uppercase text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">Requirement</th>
                <th scope="col" className="py-2 pr-4 font-medium">Importance</th>
                <th scope="col" className="py-2 pr-4 font-medium">Coverage</th>
                <th scope="col" className="py-2 font-medium">Supporting projects</th>
              </tr>
            </thead>
            <tbody>
              {brief.requirementCoverage.map((item) => (
                <tr key={item.capability} className="border-b border-primary/10 align-top">
                  <th scope="row" className="py-3 pr-4 font-medium text-foreground">{item.label}</th>
                  <td className="py-3 pr-4 capitalize text-muted-foreground">{item.importance}</td>
                  <td className="py-3 pr-4 capitalize">{item.coverage.replace("-", " ")}</td>
                  <td className="py-3 text-muted-foreground">
                    {item.projectIds.length
                      ? item.projectIds.map((id) => PROJECTS_BY_ID.get(id)?.title ?? id).join(", ")
                      : "None documented"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> : null}

      {brief.gaps.length ? (
        <div>
          <h3 className="text-xl font-bold">Evidence gaps</h3>
          <ul className="mt-3 space-y-2">
            {brief.gaps.map((gap) => (
              <li key={gap.capability} className="border-l-2 border-yellow-400/70 pl-3 text-sm text-muted-foreground">
                {gap.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {brief.groups.adjacent.length ? (
        <div>
          <h3 className="text-base font-semibold">Adjacent experience</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {brief.groups.adjacent.slice(0, 6).map((match) => {
              const project = PROJECTS_BY_ID.get(match.projectId)
              return project ? (
                <Link key={project.id} href={`/projects/${project.id}`} className="text-muted-foreground hover:text-primary hover:underline">
                  {project.title}
                </Link>
              ) : null
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}

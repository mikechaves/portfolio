"use client"

import Link from "next/link"
import { ArrowRight, Download, FileSearch2, MessageSquareText } from "lucide-react"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"
import type { DossierExitPath as DossierExitPathData } from "./dossierExitPathData"

export function DossierExitPath({
  exitPath,
  projectId,
  projectTitle,
}: {
  exitPath: DossierExitPathData
  projectId: string
  projectTitle: string
}) {
  return (
    <section className="dossier-exit-path" aria-labelledby="dossier-exit-title">
      <div className="dossier-exit-status" aria-hidden="true">
        <span>NEXT SIGNAL / EVIDENCE ROUTING</span>
        <span>ROLE FIT / READY</span>
        <span>CONTACT / OPEN</span>
      </div>

      <div className="dossier-exit-grid">
        <div className="dossier-exit-intro">
          <p className="dossier-section-kicker">Continue the evidence trail</p>
          <h2 id="dossier-exit-title">From proof to role fit</h2>
          <p>
            Compare {projectTitle} with adjacent systems, or carry its reviewed capabilities into an
            Adaptive Focus brief.
          </p>
          <div className="dossier-exit-capabilities" aria-label="Capabilities carried into Adaptive Focus">
            {exitPath.capabilityLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="dossier-related-evidence" aria-label="Related project evidence">
          <p>Related evidence</p>
          {exitPath.relatedProjects.map((related, index) => (
            <Link
              key={related.projectId}
              href={`/projects/${related.projectId}`}
              onClick={() =>
                trackPortfolioEvent("project_evidence_opened", {
                  project_id: related.projectId,
                  source: "dossier_related",
                  match_level: "supporting",
                })
              }
            >
              <span className="dossier-related-index">0{index + 1}</span>
              <span>
                <strong>{related.title}</strong>
                <small>
                  {related.sharedCapabilities.length > 0
                    ? `Shared evidence / ${related.sharedCapabilityLabels.join(" + ")}`
                    : "Continue through the reviewed project archive"}
                </small>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className="dossier-exit-actions" aria-label="Role fit and contact actions">
          <Link
            href={exitPath.focusHref}
            onClick={() =>
              trackPortfolioEvent("portfolio_conversion_clicked", {
                destination: "role_fit",
                source: "dossier_exit",
                project_id: projectId,
              })
            }
            className="dossier-exit-primary-action"
          >
            <FileSearch2 size={17} aria-hidden="true" />
            <span>
              <strong>Build Role Fit Brief</strong>
              <small>Carry these capabilities into Adaptive Focus</small>
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/about#contact-title"
            onClick={() =>
              trackPortfolioEvent("portfolio_conversion_clicked", {
                destination: "contact",
                source: "dossier_exit",
                project_id: projectId,
              })
            }
          >
            <MessageSquareText size={17} aria-hidden="true" />
            Start a conversation
          </Link>
          <a
            href="/Michael_Chaves_Resume_min.pdf"
            download
            onClick={() =>
              trackPortfolioEvent("portfolio_conversion_clicked", {
                destination: "resume",
                source: "dossier_exit",
                project_id: projectId,
              })
            }
          >
            <Download size={17} aria-hidden="true" />
            Download resume
          </a>
        </div>
      </div>
    </section>
  )
}

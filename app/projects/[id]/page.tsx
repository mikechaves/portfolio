import { promises as fs } from 'fs'
import path from 'path'
import { permanentRedirect, redirect } from 'next/navigation'
import ProjectPageClient from './ProjectPageClient'
import { getDossierExitPath } from './dossierExitPathData'
import { RETIRED_PROJECT_REDIRECTS } from './retiredProjectRedirects'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const retiredDestination = RETIRED_PROJECT_REDIRECTS[id]
  if (retiredDestination) permanentRedirect(retiredDestination)

  const filePath = path.join(process.cwd(), 'public', 'data', 'projects.json')
  const json = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(json)
  const p = Object.hasOwn(data, id) ? data[id as keyof typeof data] : undefined
  if (!p) {
    redirect('/error?message=' + encodeURIComponent('Project not found'))
  }
  const project = { id, ...p }
  return <ProjectPageClient dossierExitPath={getDossierExitPath(id)} project={project} />
}

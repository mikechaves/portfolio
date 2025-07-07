import { promises as fs } from 'fs'
import path from 'path'
import { redirect } from 'next/navigation'
import ProjectPageClient from './ProjectPageClient'

interface ProjectPageProps {
  params: { id: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'projects.json')
  const json = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(json)
  const p = Object.hasOwn(data, params.id) ? data[params.id as keyof typeof data] : undefined
  if (!p) {
    redirect('/error?message=' + encodeURIComponent('Project not found'))
  }
  const project = { id: params.id, ...p }
  return <ProjectPageClient project={project} />
}

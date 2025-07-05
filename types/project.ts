export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: 'design' | 'web' | 'research' | 'ar-vr' | 'development'
}

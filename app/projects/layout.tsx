import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo/site"

export const metadata = createPageMetadata({
  title: "Creative Direction & Interactive Design Projects",
  description:
    "Explore Mike Chaves’s creative direction, visual design, playable storytelling, accessible XR, and hands-on interactive work.",
  path: "/projects",
  imageAlt: "Mike Chaves creative direction and interactive design projects",
})

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return children
}

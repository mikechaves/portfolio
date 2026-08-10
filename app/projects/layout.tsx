import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo/site"

export const metadata = createPageMetadata({
  title: "AI Product, Game & Design Engineering Projects",
  description:
    "Explore reviewed case studies in AI-native products, human-in-the-loop workflows, game and creator systems, XR accessibility, and interactive tools.",
  path: "/projects",
  imageAlt: "Mike Chaves reviewed AI product and design engineering projects",
})

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return children
}

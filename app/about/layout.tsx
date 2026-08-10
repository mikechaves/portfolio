import type { ReactNode } from "react"
import { JsonLd } from "@/components/json-ld"
import { createPageMetadata } from "@/lib/seo/site"
import { getProfilePageStructuredData } from "@/lib/seo/structured-data"

export const metadata = createPageMetadata({
  title: "AI-Native Design Engineer: Approach & Experience",
  description:
    "How Mike Chaves frames workflows, builds AI-native product systems, instruments human review, and turns reviewed evidence into operational product decisions.",
  path: "/about",
  imageAlt: "Mike Chaves operating model and professional experience",
})

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd id="profile-page-structured-data" data={getProfilePageStructuredData()} />
      {children}
    </>
  )
}

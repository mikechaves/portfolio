import type { Metadata } from "next"
import { Suspense } from "react"
import { MetaverseNav } from "@/components/metaverse-nav"
import { getCanonicalUrl } from "@/lib/seo/site"

export const metadata: Metadata = {
  title: "Metaverse Navigation",
  description: "Optional immersive navigation for Mike Chaves's portfolio.",
  alternates: { canonical: getCanonicalUrl("/") },
  robots: { index: false, follow: false },
}

export default function MetaverseEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-primary" role="status">
          Loading immersive navigation...
        </div>
      }
    >
      <MetaverseNav />
    </Suspense>
  )
}

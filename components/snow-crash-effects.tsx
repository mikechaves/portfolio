'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
const MetaverseNav = dynamic(
  () => import('./metaverse-nav').then((m) => m.MetaverseNav),
  {
    ssr: false,
    loading: () => (
      <div className="fixed top-0 left-0 w-full z-50">
        <header className="h-20 border-b border-border/40 backdrop-blur-sm" />
      </div>
    ),
  },
)
const SiteNav = dynamic(() => import('./site-nav').then((m) => m.SiteNav), { ssr: false })

export function SnowCrashEffects() {
  const pathname = usePathname()
  const showMetaverseEntry = pathname === "/"

  return (
    <>
      {showMetaverseEntry ? <MetaverseNav /> : <SiteNav />}
    </>
  )
}

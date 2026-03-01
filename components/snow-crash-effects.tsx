'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
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

// Only non-essential effects are dynamically loaded to keep the initial
// bundle small while ensuring the main navigation is present immediately.
const SumerianVirus = dynamic(() => import('./sumerian-virus').then(m => m.SumerianVirus), { ssr: false })
const KatanaCursor = dynamic(() => import('./katana-cursor').then(m => m.KatanaCursor), { ssr: false })

export function SnowCrashEffects() {
  return (
    <>
      <MetaverseNav />
      <Suspense>
        <SumerianVirus />
        <KatanaCursor />
      </Suspense>
    </>
  )
}

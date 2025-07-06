'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MetaverseNav = dynamic(() => import('./metaverse-nav').then(m => m.MetaverseNav), { ssr: false })
const SumerianVirus = dynamic(() => import('./sumerian-virus').then(m => m.SumerianVirus), { ssr: false })
const KatanaCursor = dynamic(() => import('./katana-cursor').then(m => m.KatanaCursor), { ssr: false })

export function SnowCrashEffects() {
  return (
    <Suspense>
      <>
        <MetaverseNav />
        <SumerianVirus />
        <KatanaCursor />
      </>
    </Suspense>
  )
}

'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { MetaverseNav } from './metaverse-nav'

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

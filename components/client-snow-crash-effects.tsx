'use client'

import dynamic from 'next/dynamic'

export const SnowCrashEffects = dynamic(
  () => import('./snow-crash-effects').then((m) => m.SnowCrashEffects),
  { ssr: false },
)

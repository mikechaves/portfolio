"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import type React from "react"
import { getRouteTransitionState } from "./route-transition-state"

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const transitionState = getRouteTransitionState(shouldReduceMotion)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        {...transitionState}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

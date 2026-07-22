"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { getRouteTransitionState } from "./route-transition-state"

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const [hasMounted, setHasMounted] = useState(false)
  const transitionState = getRouteTransitionState(hasMounted ? shouldReduceMotion : null)

  useEffect(() => setHasMounted(true), [])

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

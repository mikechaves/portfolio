const STANDARD_EASING = [0.22, 1, 0.36, 1] as const

export function getRouteTransitionState(shouldReduceMotion: boolean | null) {
  if (shouldReduceMotion) {
    return {
      initial: false as const,
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    }
  }

  return {
    initial: { opacity: 0, y: 10, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
    transition: { duration: 0.28, ease: STANDARD_EASING },
  }
}

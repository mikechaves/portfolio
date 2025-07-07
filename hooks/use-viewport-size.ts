"use client"

import { useRef, useEffect } from "react"

export function useViewportSize() {
  const sizeRef = useRef({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      sizeRef.current.width = window.innerWidth
      sizeRef.current.height = window.innerHeight
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return sizeRef
}

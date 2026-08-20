"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const FeaturedProjectImage = dynamic(
  () =>
    import("@/components/featured-project-image").then(
      (module) => module.FeaturedProjectImage
    ),
  { ssr: false }
)

interface DeferredFeaturedProjectImageProps {
  alt: string
  objectPosition: string
  src: string
}

export function DeferredFeaturedProjectImage({
  alt,
  objectPosition,
  src,
}: DeferredFeaturedProjectImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !("IntersectionObserver" in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      setShouldLoad(true)
      observer.disconnect()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="home-featured-image">
      {shouldLoad ? (
        <FeaturedProjectImage alt={alt} objectPosition={objectPosition} src={src} />
      ) : null}
    </div>
  )
}

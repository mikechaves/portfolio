"use client"

import { useEffect, useRef } from "react"

const HERO_VISUAL_SRC = "/visuals/black-sun-signal-grid-static.webp"
const MOBILE_BREAKPOINT_PX = 767

export function HeroVisualCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d", { alpha: false })
    if (!context) return

    const image = new window.Image()
    image.decoding = "async"
    image.src = HERO_VISUAL_SRC
    let disposed = false

    const draw = () => {
      if (disposed || !image.naturalWidth || !image.naturalHeight) return
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(bounds.width * pixelRatio))
      const height = Math.max(1, Math.round(bounds.height * pixelRatio))
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const renderedWidth = image.naturalWidth * scale
      const renderedHeight = image.naturalHeight * scale
      const horizontalPosition = window.innerWidth <= MOBILE_BREAKPOINT_PX ? 0.58 : 1
      const x = (width - renderedWidth) * horizontalPosition
      const y = (height - renderedHeight) * 0.5

      context.fillStyle = "#020504"
      context.fillRect(0, 0, width, height)
      context.drawImage(image, x, y, renderedWidth, renderedHeight)
    }

    const resizeObserver = new ResizeObserver(draw)
    resizeObserver.observe(canvas)
    image.addEventListener("load", draw)
    if (image.complete) draw()

    return () => {
      disposed = true
      resizeObserver.disconnect()
      image.removeEventListener("load", draw)
    }
  }, [])

  return <canvas ref={canvasRef} className="home-journey-visual" aria-hidden="true" />
}

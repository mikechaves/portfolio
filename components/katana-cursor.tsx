"use client"

import { useState, useEffect } from "react"
import { useViewportSize } from "@/hooks/use-viewport-size"
import { motion } from "framer-motion"

export function KatanaCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isSlashing, setIsSlashing] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const viewport = useViewportSize()

  useEffect(() => {
    // More reliable touch device detection
    const checkTouchDevice = () => {
      // Check for actual mobile devices rather than touch capability
      // Many modern laptops have touch screens but should still show the cursor
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Additional check for small screen sizes typical of mobile devices
      const isSmallScreen = viewport.current.width < 768

      setIsTouchDevice(isMobile || isSmallScreen)
    }

    // Hide the default cursor when our custom cursor is active
    if (!isTouchDevice) {
      document.body.classList.add("cursor-none")
    } else {
      document.body.classList.remove("cursor-none")
    }

    // Initial check
    checkTouchDevice()

    // Also check on resize in case of device orientation changes
    window.addEventListener("resize", checkTouchDevice)

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseDown = () => {
      setIsSlashing(true)
      setTimeout(() => setIsSlashing(false), 300)
    }

    // Only add mouse event listeners if not a touch device
    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseleave", handleMouseLeave)
      window.addEventListener("mousedown", handleMouseDown)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("resize", checkTouchDevice)

      // Reset cursor to default when component unmounts
      document.body.classList.remove("cursor-none")
    }
  }, [isTouchDevice])

  // Don't render anything on touch devices
  if (isTouchDevice) {
    return null
  }

  return (
    <>
      <motion.div
        className="fixed z-[1000] pointer-events-none"
        aria-hidden="true"
        animate={{
          x: position.x,
          y: position.y,
          opacity: isVisible ? 1 : 0,
          rotate: isSlashing ? [0, 45, 90, 135, 180, 225, 270, 315, 360] : 0,
          scale: isSlashing ? [1, 1.2, 1] : 1,
        }}
        transition={{
          x: { duration: 0.1, ease: "linear" },
          y: { duration: 0.1, ease: "linear" },
          rotate: { duration: 0.3, ease: "easeInOut" },
          scale: { duration: 0.3, ease: "easeInOut" },
        }}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Katana handle */}
          <div className="absolute w-1.5 h-4 bg-zinc-800 rounded-full translate-y-2"></div>

          {/* Katana blade */}
          <div className="absolute w-0.5 h-12 bg-white/80 rounded-full -translate-y-2 shadow-[0_0_5px_rgba(255,255,255,0.7)]"></div>

          {/* Slash effect */}
          {isSlashing && (
            <motion.div
              className="absolute w-20 h-20 rounded-full border border-primary"
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </motion.div>
    </>
  )
}

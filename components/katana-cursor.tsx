"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function KatanaCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isSlashing, setIsSlashing] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // More reliable touch device detection
    const checkTouchDevice = () => {
      // Check for actual mobile devices rather than touch capability
      // Many modern laptops have touch screens but should still show the cursor
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Additional check for small screen sizes typical of mobile devices
      const isSmallScreen = window.innerWidth < 768

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
          {/* Snow Crash style katana blade - bright magenta/pink */}
          <div className="absolute w-[3px] h-16 bg-[#ff1a75] -translate-y-5 shadow-[0_0_8px_rgba(255,26,117,0.7)]">
            {/* Center line of the blade */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#ff4d94]"></div>
          </div>

          {/* Simple cross guard - geometric style */}
          <div className="absolute w-5 h-[3px] bg-[#ff1a75] translate-y-3 shadow-[0_0_5px_rgba(255,26,117,0.7)]"></div>

          {/* Handle with circular details */}
          <div className="absolute w-[3px] h-6 bg-[#ff1a75] translate-y-6 shadow-[0_0_5px_rgba(255,26,117,0.7)]">
            {/* Circular details on handle */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-black border border-[#ff1a75]"></div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-black border border-[#ff1a75]"></div>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-black border border-[#ff1a75]"></div>
          </div>

          {/* Slash effect - using purple from the hero background */}
          {isSlashing && (
            <motion.div
              className="absolute w-24 h-24 rounded-full border-2 border-[#8a2be2]"
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Digital circuit glow effect */}
          <div className="absolute w-2 h-16 bg-[#ff1a75]/20 blur-md -translate-y-5"></div>

          {/* Purple accent glow from hero background */}
          <div className="absolute w-2 h-16 bg-[#8a2be2]/20 blur-lg -translate-y-5 -rotate-3"></div>
        </div>
      </motion.div>
    </>
  )
}


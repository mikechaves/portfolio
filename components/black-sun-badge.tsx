"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export function BlackSunBadge() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Disable the badge completely on the About page
  const isAboutPage = pathname === "/about"

  useEffect(() => {
    // Only show the badge if we're not on the About page
    if (!isAboutPage) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isAboutPage])

  // Don't render anything on the About page
  if (isAboutPage) {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-1000"></div>
        <button
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-black rounded-full border border-primary/50 overflow-hidden"
          onClick={() => window.open("https://github.com/mikechaves", "_blank")}
          aria-label="Open GitHub"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black border-2 border-primary"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary"></div>
          </div>
          <div className="absolute inset-0 bg-black/10"></div>
        </button>
      </div>

      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 backdrop-blur-sm border border-primary/30 rounded px-3 py-1 text-xs text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Black Sun Access
      </div>
    </motion.div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useViewportSize } from "@/hooks/use-viewport-size"
import { motion, AnimatePresence } from "framer-motion"

// Sumerian-inspired glyphs from Snow Crash (using dynamic generation)
const getSumerianGlyphs = () => {
  // Generate Sumerian cuneiform glyphs using String.fromCodePoint
  const startCodePoint = 0x1202D // 𒀭
  const glyphs = []
  for (let i = 0; i < 40; i++) {
    glyphs.push(String.fromCodePoint(startCodePoint + i))
  }
  return glyphs
}

const glyphs = getSumerianGlyphs()

export function SumerianVirus() {
  const [isActive, setIsActive] = useState(false)
  const [glyphStream, setGlyphStream] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const viewport = useViewportSize()

  // Messages that will be displayed during the "infection"
  const messages = [
    "Initializing nam-shub protocol...",
    "Scanning for linguistic vulnerabilities...",
    "Metavirus detected in neural pathways...",
    "Deploying countermeasures...",
    "Sumerian defense activated...",
    "System protected.",
  ]

  useEffect(() => {
    // Random chance to trigger the virus effect when navigating to a new page
    const shouldTrigger = Math.random() < 0.2 // 20% chance

    if (shouldTrigger) {
      // Start the effect after a random delay
      const timer = setTimeout(
        () => {
          setIsActive(true)

          // Generate random glyph stream
          const interval = setInterval(() => {
            setGlyphStream((prev) => {
              const newStream = [...prev]
              if (newStream.length > 100) newStream.shift()
              return [...newStream, glyphs[Math.floor(Math.random() * glyphs.length)]]
            })
          }, 50)

          // Display messages in sequence
          let messageIndex = 0
          const messageInterval = setInterval(() => {
            setMessage(messages[messageIndex])
            messageIndex++

            if (messageIndex >= messages.length) {
              clearInterval(messageInterval)

              // End the effect after all messages are shown
              setTimeout(() => {
                clearInterval(interval)
                setIsActive(false)
              }, 2000)
            }
          }, 1200)

          return () => {
            clearInterval(interval)
            clearInterval(messageInterval)
          }
        },
        Math.random() * 5000 + 2000,
      )

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background glyph stream */}
          <div
            className="absolute inset-0 text-primary/20 overflow-hidden pointer-events-none select-none"
            aria-hidden="true"
          >
            {glyphStream.map((glyph, index) => (
              <motion.span
                key={index}
                className="absolute text-xl"
                initial={{
                  opacity: 1,
                  x: Math.random() * viewport.width,
                  y: -30,
                }}
                animate={{
                  y: viewport.height + 30,
                  opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  ease: "linear",
                }}
              >
                {glyph}
              </motion.span>
            ))}
          </div>

          {/* Central message */}
          <motion.div
            className="relative z-10 max-w-md text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="text-primary text-xl font-bold mb-4 glitch"
              data-text={message}
              role="alert"
              aria-live="assertive"
            >
              {message}
            </div>

            <div className="flex justify-center">
              <div className="w-32 h-32 relative" aria-hidden="true">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-full h-full rounded-full border-4 border-primary animate-spin"
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-3/4 h-3/4 rounded-full border-4 border-primary/70 animate-spin"
                    style={{ animationDuration: "2s", animationDirection: "reverse" }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-1/2 h-1/2 rounded-full border-4 border-primary/50 animate-spin"
                    style={{ animationDuration: "1.5s" }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-primary">{String.fromCodePoint(0x1202D)}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

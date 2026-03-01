"use client"

import { useState, useEffect } from "react"
import { useViewportSize } from "@/hooks/use-viewport-size"
import { motion, AnimatePresence } from "framer-motion"

// Sumerian-inspired glyphs from Snow Crash (using safe Unicode escape sequences)
const getSumerianGlyphs = () => {
  // Use Unicode escape sequences to avoid build issues
  const glyphs = [
    '\uD803\uDC2D', // 𒀭
    '\uD803\uDC2E', // 𒀮
    '\uD803\uDC2F', // 𒀯
    '\uD803\uDC30', // 𒀰
    '\uD803\uDC31', // 𒀱
    '\uD803\uDC32', // 𒀲
    '\uD803\uDC33', // 𒀳
    '\uD803\uDC34', // 𒀴
    '\uD803\uDC35', // 𒀵
    '\uD803\uDC36', // 𒀶
    '\uD803\uDC37', // 𒀷
    '\uD803\uDC38', // 𒀸
    '\uD803\uDC39', // 𒀹
    '\uD803\uDC3A', // 𒀺
    '\uD803\uDC3B', // 𒀻
    '\uD803\uDC3C', // 𒀼
    '\uD803\uDC3D', // 𒀽
    '\uD803\uDC3E', // 𒀾
    '\uD803\uDC3F', // 𒀿
    '\uD803\uDC40', // 𒁀
    '\uD803\uDC41', // 𒁁
    '\uD803\uDC42', // 𒁂
    '\uD803\uDC43', // 𒁃
    '\uD803\uDC44', // 𒁄
    '\uD803\uDC45', // 𒁅
    '\uD803\uDC46', // 𒁆
    '\uD803\uDC47', // 𒁇
    '\uD803\uDC48', // 𒁈
    '\uD803\uDC49', // 𒁉
    '\uD803\uDC4A', // 𒁊
    '\uD803\uDC4B', // 𒁋
    '\uD803\uDC4C', // 𒁌
    '\uD803\uDC4D', // 𒁍
    '\uD803\uDC4E', // 𒁎
    '\uD803\uDC4F', // 𒁏
    '\uD803\uDC50', // 𒁐
    '\uD803\uDC51', // 𒁑
    '\uD803\uDC52', // 𒁒
    '\uD803\uDC53', // 𒁓
    '\uD803\uDC54', // 𒁔
  ]
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
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-primary">{'\uD803\uDC2D'}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

// Import R3F components dynamically
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-primary">Loading 3D Scene...</div>
  ),
})

// Dynamic import wrapper for the 3D scene
const DynamicStreet = dynamic(() => import("./street-scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-primary">Loading Street...</div>
  ),
})

// Error boundary component for 3D content
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("MetaverseNav 3D Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export function MetaverseNav() {
  const pathname = usePathname()
  const [showMetaverse, setShowMetaverse] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [canRender3D, setCanRender3D] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)

    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        setCanRender3D(!!gl)
      } catch (e) {
        setCanRender3D(false)
      }
    }

    checkMobile()
    checkWebGL()

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navItems = [
    { name: "home", path: "/" },
    { name: "projects", path: "/projects" },
    { name: "blog", path: "/blog" },
    { name: "about", path: "/about" },
  ]

  const handleNavigate = (path: string) => {
    if (path === pathname) {
      setShowMetaverse(false)
      return
    }
    setTransitioning(true)
    setTimeout(() => {
      window.location.href = path
    }, 500)
  }

  const toggleMetaverse = () => setShowMetaverse(!showMetaverse)
  const exitMetaverse = () => setShowMetaverse(false)

  // Fallback 2D navigation
  const Fallback2DNav = () => (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="grid grid-cols-2 gap-8 max-w-2xl p-4">
        {navItems.map((item) => (
          <motion.div
            key={item.path}
            className={`border ${
              pathname === item.path ? "border-primary" : "border-zinc-700"
            } rounded-md overflow-hidden cursor-pointer`}
            whileHover={{ scale: 1.05, borderColor: "#00ff8c" }}
            onClick={() => handleNavigate(item.path)}
          >
            <div className="p-6 bg-black/80">
              <h3
                className={`text-xl font-bold mb-2 ${pathname === item.path ? "text-primary" : "text-white"} glitch`}
                data-text={item.name}
              >
                {item.name}
              </h3>
              <div className="h-1 w-12 bg-primary/50 mb-4"></div>
              <div className="flex items-center">
                <span className="text-primary mr-2">$</span>
                <span className="text-zinc-400">cd /{item.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <header className="border-b border-border/40 backdrop-blur-sm h-20">
          <div className="container mx-auto px-4 h-full">
            <nav className="flex items-center justify-between h-full">
              <Link href="/" className="text-xl font-bold text-primary glitch" data-text="MIKE_CHAVES">
                MIKE_CHAVES
              </Link>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMetaverse}
                  className="px-4 py-2 bg-black/50 border border-primary/30 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  {showMetaverse ? "Exit Metaverse" : "Enter Metaverse"}
                </button>
                <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </button>
              </div>
              <ul className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`command-prompt hover:text-primary transition-colors ${pathname === item.path ? "text-primary" : "text-white"}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-b border-border/40">
            <div className="container mx-auto px-4 py-4">
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`command-prompt block hover:text-primary transition-colors ${pathname === item.path ? "text-primary" : "text-white"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <motion.div
        className="fixed inset-0 bg-black/90 z-50"
        initial={{ opacity: 0, clipPath: "circle(0% at 50% 0%)" }}
        animate={{
          opacity: showMetaverse ? 1 : 0,
          clipPath: showMetaverse ? "circle(150% at 50% 0%)" : "circle(0% at 50% 0%)",
          pointerEvents: showMetaverse ? "auto" : "none",
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={exitMetaverse}
            className="px-4 py-2 bg-red-900/50 border border-red-500/30 text-red-500 rounded-md hover:bg-red-900/80 transition-colors"
          >
            Exit Metaverse
          </button>
        </div>

        {showMetaverse && (
          <div className="w-full h-screen">
            <ThreeErrorBoundary fallback={<Fallback2DNav />}>
              {canRender3D ? (
                <Canvas camera={{ fov: 75, near: 0.1, far: 1000 }}>
                  <Suspense fallback={null}>
                    <DynamicStreet
                      navItems={navItems}
                      pathname={pathname}
                      onNavigate={handleNavigate}
                      isMobile={isMobile}
                    />
                  </Suspense>
                </Canvas>
              ) : (
                <Fallback2DNav />
              )}
            </ThreeErrorBoundary>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-500">
          Navigate The Street by clicking on destinations
        </div>
      </motion.div>

      <motion.div
        className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: transitioning ? 1 : 0, pointerEvents: transitioning ? "auto" : "none" }}
      >
        <div className="text-primary text-2xl font-bold glitch" data-text="LOADING STREET...">
          LOADING STREET...
        </div>
      </motion.div>
    </>
  )
}

"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-primary">Loading 3D Canvas...</div>
  ),
})

const StreetScene = dynamic(() => import("./street-scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-primary">
      Loading Street Scene...
    </div>
  ),
})

class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onCatch?: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode; onCatch?: (error: Error) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("MetaverseNav ThreeErrorBoundary caught an error:", error, errorInfo)
    if (this.props.onCatch) {
      this.props.onCatch(error)
    }
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
  const [hasCaughtError, setHasCaughtError] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        const canRender = !!gl
        setCanRender3D(canRender)
        console.log("WebGL Check: canRender3D =", canRender)
      } catch (e) {
        setCanRender3D(false)
        console.error("WebGL Check failed:", e)
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

  const toggleMetaverse = () => {
    console.log(
      "Toggling Metaverse. Current showMetaverse:",
      showMetaverse,
      "canRender3D:",
      canRender3D,
      "hasCaughtError:",
      hasCaughtError,
    )
    if (!hasCaughtError) {
      // Only allow showing metaverse if no error has been caught yet
      setShowMetaverse(!showMetaverse)
    } else {
      console.log("Preventing metaverse display due to previously caught error.")
      // Optionally, inform the user why it's not showing
    }
  }
  const exitMetaverse = () => setShowMetaverse(false)

  const Fallback2DNav = ({ isErrorFallback }: { isErrorFallback?: boolean }) => (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-2xl p-4">
        {isErrorFallback && (
          <p className="col-span-full text-center text-red-500 mb-4">
            3D navigation unavailable due to an error. Using 2D fallback.
          </p>
        )}
        {!canRender3D && !isErrorFallback && (
          <p className="col-span-full text-center text-yellow-500 mb-4">
            WebGL not supported or disabled. Using 2D fallback.
          </p>
        )}
        {navItems.map((item) => (
          <motion.div
            key={item.path}
            className={`border ${pathname === item.path ? "border-primary" : "border-zinc-700"} rounded-md overflow-hidden cursor-pointer w-full`}
            whileHover={{ scale: 1.05, borderColor: "#00ff8c" }}
            onClick={() => handleNavigate(item.path)}
          >
            <div className="p-4 sm:p-6 bg-black/80">
              <h3
                className={`text-lg sm:text-xl font-bold mb-2 ${pathname === item.path ? "text-primary" : "text-white"} glitch`}
                data-text={item.name.toUpperCase()}
              >
                {item.name.toUpperCase()}
              </h3>
              <div className="h-1 w-12 bg-primary/50 mb-2 sm:mb-4"></div>
              <div className="flex items-center text-xs sm:text-sm">
                <span className="text-primary mr-2">$</span>
                <span className="text-zinc-400">cd /{item.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const handleBoundaryCatch = () => {
    setHasCaughtError(true)
    setShowMetaverse(false) // Ensure metaverse is hidden if an error occurs
  }

  console.log(
    "Render MetaverseNav: showMetaverse =",
    showMetaverse,
    ", canRender3D =",
    canRender3D,
    ", hasCaughtError =",
    hasCaughtError,
  )

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Standard Header */}
        <header className="border-b border-border/40 backdrop-blur-sm h-20">
          <div className="container mx-auto px-4 h-full">
            <nav className="flex items-center justify-between h-full">
              <Link href="/" className="text-xl font-bold text-primary glitch" data-text="MIKE_CHAVES">
                MIKE_CHAVES
              </Link>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMetaverse}
                  disabled={hasCaughtError && !showMetaverse}
                  className={`px-4 py-2 bg-black/50 border border-primary/30 text-primary rounded-md hover:bg-primary/20 transition-colors ${hasCaughtError && !showMetaverse ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {showMetaverse ? "Exit Metaverse" : hasCaughtError ? "3D Nav Error" : "Enter Metaverse"}
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
        {/* Mobile Menu */}
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

      {/* Metaverse Container */}
      <motion.div
        className="fixed inset-0 bg-black/95 z-40" // z-index lower than header
        initial={{ opacity: 0, clipPath: "circle(0% at 50% 50px)" }} // Animate from top center (approx header height)
        animate={{
          opacity: showMetaverse ? 1 : 0,
          clipPath: showMetaverse ? "circle(150% at 50% 50px)" : "circle(0% at 50% 50px)",
          pointerEvents: showMetaverse ? "auto" : "none",
        }}
        transition={{ duration: 0.7, ease: "circOut" }}
      >
        <div className="absolute top-4 right-4 z-[60]">
          {" "}
          {/* Higher z-index for exit button */}
          <button
            onClick={exitMetaverse}
            className="px-4 py-2 bg-red-900/50 border border-red-500/30 text-red-500 rounded-md hover:bg-red-900/80 transition-colors"
          >
            Exit Metaverse
          </button>
        </div>

        {showMetaverse && (
          <div className="w-full h-screen">
            <ThreeErrorBoundary fallback={<Fallback2DNav isErrorFallback={true} />} onCatch={handleBoundaryCatch}>
              {canRender3D ? (
                <Canvas
                  camera={{ fov: 75, near: 0.1, far: 1000 }}
                  gl={{ antialias: true, alpha: true }}
                  onCreated={({ gl }) => {
                    gl.setClearColor("#000000", 0)
                  }}
                >
                  <Suspense fallback={null}>
                    <StreetScene
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
        {!showMetaverse && hasCaughtError && (
          <div className="w-full h-screen flex items-center justify-center">
            <p className="text-red-500 text-xl">3D Navigation is currently unavailable due to an error.</p>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-500 pointer-events-none">
          Navigate The Street by clicking on destinations
        </div>
      </motion.div>

      {/* Transition Overlay */}
      <motion.div
        className="fixed inset-0 bg-black z-[70] flex items-center justify-center" // Highest z-index for transition
        initial={{ opacity: 0 }}
        animate={{ opacity: transitioning ? 1 : 0, pointerEvents: transitioning ? "auto" : "none" }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-primary text-2xl font-bold glitch" data-text="LOADING STREET...">
          LOADING STREET...
        </div>
      </motion.div>
    </>
  )
}

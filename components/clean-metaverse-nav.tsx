"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamic imports to avoid SSR issues
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
})

const CleanStreetScene = dynamic(() => import("./clean-street-scene"), {
  ssr: false,
})

export function CleanMetaverseNav() {
  const pathname = usePathname()
  const [showMetaverse, setShowMetaverse] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
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
                  {isMobileMenuOpen ? "✕" : "☰"}
                </button>
              </div>
              <ul className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`command-prompt hover:text-primary transition-colors ${
                        pathname === item.path ? "text-primary" : "text-white"
                      }`}
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
                      className={`command-prompt block hover:text-primary transition-colors ${
                        pathname === item.path ? "text-primary" : "text-white"
                      }`}
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
        className="fixed inset-0 bg-black/90 z-40"
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
            <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
              <Suspense fallback={null}>
                <CleanStreetScene
                  navItems={navItems}
                  pathname={pathname}
                  onNavigate={handleNavigate}
                  isMobile={isMobile}
                />
              </Suspense>
            </Canvas>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-500">
          Navigate The Street by clicking on the boxes
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

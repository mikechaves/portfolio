"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, Environment } from "@react-three/drei"
import { motion } from "framer-motion"

// Navigation item component that renders in 3D space
function NavItem({
  name,
  path,
  active,
  position,
  onClick,
}: {
  name: string
  path: string
  active: boolean
  position: [number, number, number]
  onClick: () => void
}) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    // Subtle floating animation
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
    // Rotate slightly based on mouse position
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, (state.mouse.x * Math.PI) / 8, 0.1)
  })

  return (
    <mesh ref={mesh} position={position} onClick={onClick}>
      <Text color={active ? "#00ff8c" : "white"} fontSize={0.3} anchorX="center" anchorY="middle">
        {name}
        <meshStandardMaterial
          color={active ? "#00ff8c" : "white"}
          emissive={active ? "#00ff8c" : "#444444"}
          emissiveIntensity={active ? 0.8 : 0.2}
        />
      </Text>
    </mesh>
  )
}

// The Street scene that contains all navigation items
function Street({
  navItems,
  pathname,
  onNavigate,
  isMobile,
}: {
  navItems: { name: string; path: string }[]
  pathname: string
  onNavigate: (path: string) => void
  isMobile: boolean
}) {
  const { camera } = useThree()

  useEffect(() => {
    // Position camera based on screen size
    if (isMobile) {
      // Move camera back further on mobile to show all nav items
      camera.position.set(0, 0, 7)
    } else {
      camera.position.set(0, 0, 5)
    }
  }, [camera, isMobile])

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.2} />

      <Environment preset="night" />

      {/* The Street - a glowing grid that extends to the horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial color="#000000" wireframe={true} emissive="#00ff8c" emissiveIntensity={0.2} />
      </mesh>

      {/* Navigation items positioned along the street */}
      {navItems.map((item, index) => {
        // Adjust spacing based on screen size
        const spacing = isMobile ? 1.2 : 1.5

        const position: [number, number, number] = [
          (index - (navItems.length - 1) / 2) * spacing, // Spread items horizontally with adjusted spacing
          0, // All at same height
          0, // All at same depth
        ]

        return (
          <NavItem
            key={item.path}
            name={item.name}
            path={item.path}
            active={pathname === item.path}
            position={position}
            onClick={() => onNavigate(item.path)}
          />
        )
      })}
    </>
  )
}

export function MetaverseNav() {
  const pathname = usePathname()
  const [showMetaverse, setShowMetaverse] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
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

  // Function to toggle metaverse view
  const toggleMetaverse = () => {
    setShowMetaverse(!showMetaverse)
  }

  // Function to exit metaverse view
  const exitMetaverse = () => {
    setShowMetaverse(false)
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Regular navigation bar - ensure consistent height */}
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

              {/* Mobile menu button */}
              <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                    xmlns="http://www.w3.org/2000/svg"
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

            {/* Desktop navigation */}
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

      {/* Mobile navigation */}
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

      {/* Metaverse navigation overlay */}
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

        <div className="w-full h-screen">
          <Canvas>
            <Street navItems={navItems} pathname={pathname} onNavigate={handleNavigate} isMobile={isMobile} />
          </Canvas>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-500">
          Navigate The Street by clicking on destinations
        </div>
      </motion.div>

      {/* Transition overlay */}
      <motion.div
        className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: transitioning ? 1 : 0, pointerEvents: transitioning ? "auto" : "none" }}
      >
        <div className="text-primary text-2xl font-bold glitch" data-text="LOADING STREET...">
          LOADING STREET...
        </div>
      </motion.div>
    </div>
  )
}


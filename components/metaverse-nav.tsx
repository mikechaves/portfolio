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
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (!mesh.current) return
    // Subtle floating animation
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
    // Rotate slightly based on mouse position
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, (state.mouse.x * Math.PI) / 8, 0.1)
    // Scale on hover
    const targetScale = isHovered ? 1.2 : 1
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={onClick}
      onPointerOver={(event) => {
        event.stopPropagation() // Prevent events from bubbling up to parent elements
        setIsHovered(true)
        document.body.style.cursor = "pointer" // Change cursor to pointer on hover
      }}
      onPointerOut={(event) => {
        setIsHovered(false)
        document.body.style.cursor = "none" // Revert to custom cursor
      }}
    >
      <Text color={active ? "#00ff8c" : "white"} fontSize={0.3} anchorX="center" anchorY="middle">
        {name}
        <meshStandardMaterial
          color={active ? "#00ff8c" : isHovered ? "#00ffff" : "white"} // Cyan for hover
          emissive={active ? "#00ff8c" : isHovered ? "#00ffff" : "#444444"}
          emissiveIntensity={active ? 0.8 : isHovered ? 0.6 : 0.2} // Brighter emissive on hover
        />
      </Text>
    </mesh>
  )
}

// Add this new component before the Street component
function DataStream({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.position.y += 0.01
    if (mesh.current.position.y > 5) {
      mesh.current.position.y = -5
    }
    mesh.current.rotation.z += 0.02
  })

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.02, 0.1, 0.02]} />
      <meshStandardMaterial color="#00ff8c" emissive="#00ff8c" emissiveIntensity={0.5} />
    </mesh>
  )
}

// Add this after the existing NavItem component
function HolographicPreview({ show, content }: { show: boolean; content: string }) {
  return (
    <group visible={show}>
      <Text position={[0, 1, 0]} fontSize={0.15} color="#00ff8c" anchorX="center">
        {content}
        <meshStandardMaterial color="#00ff8c" emissive="#00ff8c" emissiveIntensity={0.3} transparent opacity={0.8} />
      </Text>
    </group>
  )
}

// Add this component for background cityscape
function CyberCity() {
  const buildings = Array.from({ length: 20 }, (_, i) => ({
    position: [(Math.random() - 0.5) * 50, Math.random() * 5 + 2, -20 - Math.random() * 30] as [number, number, number],
    height: Math.random() * 8 + 2,
    width: Math.random() * 2 + 0.5,
  }))

  return (
    <group>
      {buildings.map((building, i) => (
        <mesh key={i} position={building.position}>
          <boxGeometry args={[building.width, building.height, building.width]} />
          <meshStandardMaterial
            color="#111111"
            emissive="#00ff8c"
            emissiveIntensity={0.1}
            wireframe={Math.random() > 0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

// Add this for floating code elements
function FloatingCode() {
  const codeFragments = ["{ }", "< />", "01", "AI", "XR", "UX"]

  return (
    <group>
      {codeFragments.map((code, i) => (
        <Text
          key={i}
          position={[(Math.random() - 0.5) * 20, Math.random() * 10 - 5, (Math.random() - 0.5) * 20]}
          fontSize={0.2}
          color="#00ff8c"
          anchorX="center"
        >
          {code}
          <meshStandardMaterial color="#00ff8c" emissive="#00ff8c" emissiveIntensity={0.2} transparent opacity={0.6} />
        </Text>
      ))}
    </group>
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
      {/* Existing lighting and environment */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.2} />
      <Environment preset="night" />

      {/* Add the new components */}
      <CyberCity />
      <FloatingCode />

      {/* Add data streams around navigation */}
      {Array.from({ length: 10 }, (_, i) => (
        <DataStream
          key={i}
          position={[(Math.random() - 0.5) * 15, Math.random() * 10 - 5, (Math.random() - 0.5) * 10]}
        />
      ))}

      {/* Existing street grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial color="#000000" wireframe={true} emissive="#00ff8c" emissiveIntensity={0.2} />
      </mesh>

      {/* Navigation items positioned along the street */}
      {navItems.map((item, index) => {
        const spacing = isMobile ? 1.2 : 1.5
        const position: [number, number, number] = [(index - (navItems.length - 1) / 2) * spacing, 0, 0]

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

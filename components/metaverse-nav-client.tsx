"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import * as THREE from "three"

// Dynamically import R3F components
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-primary">Loading 3D Scene...</div>
  ),
})

// Import R3F hooks directly
import { useFrame, useThree } from "@react-three/fiber"

// 3D navigation item that communicates position to parent
function NavItem3D({
  name,
  position,
  active = false,
  onClick,
  onPositionUpdate,
}: {
  name: string
  position: [number, number, number]
  active?: boolean
  onClick: () => void
  onPositionUpdate: (name: string, screenPos: { x: number; y: number }, hovered: boolean) => void
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [isHovered, setIsHovered] = useState(false)
  const { camera, size } = useThree()

  useFrame((state) => {
    if (!mesh.current || !camera) return

    // Animate the 3D position
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, (state.mouse.x * Math.PI) / 8, 0.1)
    const targetScale = isHovered ? 1.2 : 1
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    // Project 3D position to screen coordinates
    const vector = new THREE.Vector3(mesh.current.position.x, mesh.current.position.y, mesh.current.position.z)
    vector.project(camera)

    const x = (vector.x * 0.5 + 0.5) * size.width
    const y = (vector.y * -0.5 + 0.5) * size.height

    onPositionUpdate(name, { x, y }, isHovered)
  })

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={onClick}
      onPointerOver={(event: any) => {
        event.stopPropagation()
        setIsHovered(true)
        if (document.body) document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setIsHovered(false)
        if (document.body) document.body.style.cursor = "auto"
      }}
    >
      <boxGeometry args={[1.5, 0.3, 0.1]} />
      <meshStandardMaterial
        transparent
        opacity={0.2}
        color={active ? "#00ff8c" : isHovered ? "#00ffff" : "white"}
        emissive={active ? "#00ff8c" : isHovered ? "#00ffff" : "#000000"}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// Data stream component
function DataStream({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame(() => {
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

// Cyber city component
function CyberCity() {
  const buildings = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        key: i,
        position: [(Math.random() - 0.5) * 50, Math.random() * 5 + 2, -20 - Math.random() * 30] as [
          number,
          number,
          number,
        ],
        height: Math.random() * 8 + 2,
        width: Math.random() * 2 + 0.5,
      })),
    [],
  )

  return (
    <group>
      {buildings.map((building) => (
        <mesh key={building.key} position={building.position}>
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

// Floating code component using simple geometry
function FloatingCode() {
  const codeElements = React.useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        key: i,
        position: [(Math.random() - 0.5) * 20, Math.random() * 10 - 5, (Math.random() - 0.5) * 20] as [
          number,
          number,
          number,
        ],
      })),
    [],
  )

  return (
    <group>
      {codeElements.map((element) => (
        <mesh key={element.key} position={element.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#00ff8c" emissive="#00ff8c" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// The Street scene component
function Street({
  navItems,
  pathname,
  onNavigate,
  isMobile,
  onNavPositionUpdate,
}: {
  navItems: { name: string; path: string }[]
  pathname: string
  onNavigate: (path: string) => void
  isMobile: boolean
  onNavPositionUpdate: (name: string, screenPos: { x: number; y: number }, hovered: boolean) => void
}) {
  const { camera } = useThree()

  useEffect(() => {
    if (!camera) return
    if (isMobile) {
      camera.position.set(0, 0, 7)
    } else {
      camera.position.set(0, 0, 5)
    }
    camera.lookAt(0, 0, 0)
  }, [camera, isMobile])

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.2} />

      <CyberCity />
      <FloatingCode />

      {Array.from({ length: 10 }, (_, i) => (
        <DataStream
          key={i}
          position={[(Math.random() - 0.5) * 15, Math.random() * 10 - 5, (Math.random() - 0.5) * 10]}
        />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial color="#000000" wireframe={true} emissive="#00ff8c" emissiveIntensity={0.2} />
      </mesh>

      {navItems.map((item, index) => {
        const spacing = isMobile ? 1.2 : 1.5
        const position: [number, number, number] = [(index - (navItems.length - 1) / 2) * spacing, 0, 0]

        return (
          <NavItem3D
            key={item.path}
            name={item.name}
            position={position}
            active={pathname === item.path}
            onClick={() => onNavigate(item.path)}
            onPositionUpdate={onNavPositionUpdate}
          />
        )
      })}
    </>
  )
}

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
      return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-red-500">
          3D Navigation Error - Please refresh the page
        </div>
      )
    }
    return this.props.children
  }
}

interface MetaverseNavClientProps {
  showMetaverse: boolean
  transitioning: boolean
  isMobile: boolean
  canRender3D: boolean
  navPositions: Record<string, { x: number; y: number; hovered: boolean }>
  navItems: { name: string; path: string }[]
  pathname: string
  onNavigate: (path: string) => void
  onNavPositionUpdate: (name: string, screenPos: { x: number; y: number }, hovered: boolean) => void
  onExitMetaverse: () => void
}

export function MetaverseNavClient({
  showMetaverse,
  transitioning,
  isMobile,
  canRender3D,
  navPositions,
  navItems,
  pathname,
  onNavigate,
  onNavPositionUpdate,
  onExitMetaverse,
}: MetaverseNavClientProps) {
  return (
    <>
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
            onClick={onExitMetaverse}
            className="px-4 py-2 bg-red-900/50 border border-red-500/30 text-red-500 rounded-md hover:bg-red-900/80 transition-colors"
          >
            Exit Metaverse
          </button>
        </div>
        <div className="w-full h-screen relative">
          {showMetaverse && (
            <ThreeErrorBoundary
              fallback={
                <div className="w-full h-screen bg-black flex items-center justify-center text-red-500">
                  3D Navigation Error - Please refresh the page
                </div>
              }
            >
              {canRender3D ? (
                <>
                  <Canvas camera={{ fov: 75, near: 0.1, far: 1000 }}>
                    <Suspense fallback={null}>
                      <Street
                        navItems={navItems}
                        pathname={pathname}
                        onNavigate={onNavigate}
                        isMobile={isMobile}
                        onNavPositionUpdate={onNavPositionUpdate}
                      />
                    </Suspense>
                  </Canvas>

                  {/* HTML text overlays positioned outside Canvas */}
                  {navItems.map((item) => {
                    const pos = navPositions[item.name]
                    if (!pos) return null

                    const isActive = pathname === item.path

                    return (
                      <div
                        key={item.path}
                        style={{
                          position: "absolute",
                          left: pos.x,
                          top: pos.y,
                          transform: "translate(-50%, -50%)",
                          pointerEvents: "none",
                          zIndex: 1000,
                          fontSize: pos.hovered ? "24px" : "20px",
                          fontWeight: "bold",
                          color: isActive ? "#00ff8c" : pos.hovered ? "#00ffff" : "white",
                          textShadow: "0 0 10px currentColor",
                          transition: "all 0.2s ease",
                          fontFamily: "inherit",
                        }}
                        className="glitch"
                        data-text={item.name.toUpperCase()}
                      >
                        {item.name.toUpperCase()}
                      </div>
                    )
                  })}
                </>
              ) : (
                <div className="w-full h-screen bg-black flex items-center justify-center text-yellow-500">
                  WebGL not supported
                </div>
              )}
            </ThreeErrorBoundary>
          )}
        </div>
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

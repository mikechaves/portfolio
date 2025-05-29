"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

// Extremely minimal scene with just basic Three.js primitives
export default function MinimalStreetScene({
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
  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Simple ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Navigation items as simple boxes */}
      {navItems.map((item, index) => {
        const spacing = isMobile ? 2 : 3
        const position: [number, number, number] = [(index - (navItems.length - 1) / 2) * spacing, 0, 0]
        const isActive = pathname === item.path

        return <NavBox key={item.path} position={position} isActive={isActive} onClick={() => onNavigate(item.path)} />
      })}
    </>
  )
}

// Extremely simple navigation box
function NavBox({
  position,
  isActive,
  onClick,
}: {
  position: [number, number, number]
  isActive: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh position={position} ref={meshRef} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={isActive ? "#00ff8c" : "#444"} />
    </mesh>
  )
}

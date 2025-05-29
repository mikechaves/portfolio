"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type * as THREE from "three"

// Clean navigation item component using only Three.js primitives
function CleanNavItem({
  position,
  active,
  onClick,
}: {
  position: [number, number, number]
  active: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <boxGeometry args={[1.5, 0.8, 0.3]} />
      <meshStandardMaterial
        color={active ? "#00ff8c" : "#333333"}
        emissive={active ? "#00ff8c" : "#001100"}
        emissiveIntensity={active ? 0.3 : 0.1}
      />
    </mesh>
  )
}

// Simple particle system
function Particles() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={particleCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#00ff8c" size={0.1} />
    </points>
  )
}

// Main scene component
export default function CleanStreetScene({
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
    camera.position.set(0, 0, isMobile ? 8 : 6)
    camera.lookAt(0, 0, 0)
  }, [camera, isMobile])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.4} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#111111" wireframe />
      </mesh>

      {/* Navigation items */}
      {navItems.map((item, index) => {
        const spacing = isMobile ? 2.5 : 3
        const position: [number, number, number] = [(index - (navItems.length - 1) / 2) * spacing, 0, 0]
        return (
          <CleanNavItem
            key={item.path}
            position={position}
            active={pathname === item.path}
            onClick={() => onNavigate(item.path)}
          />
        )
      })}

      {/* Background elements */}
      <Particles />

      {/* Simple background buildings */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 30, Math.random() * 5, -15 - Math.random() * 10]}>
          <boxGeometry args={[1, Math.random() * 8 + 2, 1]} />
          <meshStandardMaterial color="#222222" transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  )
}

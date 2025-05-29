"use client"

import React, { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
// Not using Drei Text for now to simplify
// import { Text } from "@react-three/drei"
import * as THREE from "three"

// Simplified Navigation item component - using a simple mesh
function NavItem({
  name, // Still passing name for potential future use, but not rendering it as text
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
  const groupRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    // Subtle animation for the group
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 0.2) * 0.05
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (state.mouse.x * Math.PI) / 10, 0.1)
    const targetScale = isHovered ? 1.25 : 1
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={(event) => {
        event.stopPropagation()
        setIsHovered(true)
        if (document.body) document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setIsHovered(false)
        if (document.body) document.body.style.cursor = "none"
      }}
    >
      <mesh>
        <boxGeometry args={[1.5, 0.4, 0.2]} /> {/* Simple box as the button */}
        <meshStandardMaterial
          color={active ? "#00ff8c" : isHovered ? "#00ffff" : "#005555"}
          emissive={active ? "#00ff8c" : isHovered ? "#00ffff" : "#005555"}
          emissiveIntensity={active ? 0.7 : isHovered ? 0.5 : 0.2}
        />
      </mesh>
      {/* Placeholder for where text would be, to help visualize */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[1.4, 0.3]} />
        <meshBasicMaterial color={active ? "#000" : "#fff"} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Data stream component (remains the same)
function DataStream({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (!mesh.current) return
    mesh.current.position.y += 0.01
    if (mesh.current.position.y > 5) mesh.current.position.y = -5
    mesh.current.rotation.z += 0.02
  })
  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.02, 0.1, 0.02]} />
      <meshBasicMaterial color="#00ff8c" />
    </mesh>
  )
}

// Floating code component (remains the same)
function FloatingCode() {
  const codeElements = React.useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        position: [(Math.random() - 0.5) * 20, Math.random() * 10 - 5, (Math.random() - 0.5) * 20] as [
          number,
          number,
          number,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
          number,
          number,
          number,
        ],
        scale: Math.random() * 0.5 + 0.5,
      })),
    [],
  )
  return (
    <group>
      {codeElements.map((element, i) => (
        <mesh key={i} position={element.position} rotation={element.rotation} scale={element.scale}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#00ff8c" wireframe />
        </mesh>
      ))}
    </group>
  )
}

// Cyber city component (remains the same)
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
        wireframe: Math.random() > 0.7,
      })),
    [],
  )
  return (
    <group>
      {buildings.map((building) => (
        <mesh key={building.key} position={building.position}>
          <boxGeometry args={[building.width, building.height, building.width]} />
          <meshBasicMaterial
            color="#111111"
            wireframe={building.wireframe}
            transparent
            opacity={building.wireframe ? 0.8 : 0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

// The Street scene component
export default function StreetScene({
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
    console.log("StreetScene: isMobile:", isMobile)
    if (isMobile) {
      camera.position.set(0, 0, 9) // Adjusted for potentially larger nav items without text
    } else {
      camera.position.set(0, 0, 6) // Adjusted
    }
    camera.lookAt(0, 0, 0)
  }, [camera, isMobile])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.4} />
      <directionalLight position={[0, 5, 5]} intensity={0.3} color="#55aaff" />

      <CyberCity />
      <FloatingCode />

      {Array.from(
        { length: 15 },
        (
          _,
          i, // Increased data streams
        ) => (
          <DataStream
            key={i}
            position={[(Math.random() - 0.5) * 20, Math.random() * 10 - 5, (Math.random() - 0.5) * 15]}
          />
        ),
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        {" "}
        {/* Lowered ground slightly */}
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial
          color="#050505"
          wireframe={true}
          emissive="#00ff8c"
          emissiveIntensity={0.1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {navItems.map((item, index) => {
        const spacing = isMobile ? 2.0 : 2.5 // Adjusted spacing for simpler boxes
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

      <group>
        {" "}
        {/* More particles */}
        {Array.from({ length: 80 }, (_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 35, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 35]}>
            <sphereGeometry args={[0.015, 4, 4]} />
            <meshBasicMaterial color="#00ff8c" transparent opacity={Math.random() * 0.6 + 0.1} />
          </mesh>
        ))}
      </group>
    </>
  )
}

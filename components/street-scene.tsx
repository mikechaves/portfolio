"use client"

import React, { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text } from "@react-three/drei" // Using Drei's Text for 3D text
import * as THREE from "three"

// Navigation item component - using Drei's Text for 3D text
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
  const groupRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (state.mouse.x * Math.PI) / 8, 0.1)
    const targetScale = isHovered ? 1.2 : 1
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
        if (document.body) document.body.style.cursor = "none" // Or your custom cursor class
      }}
    >
      {/* Background plane for the text */}
      <mesh>
        <planeGeometry args={[2, 0.6]} />
        <meshStandardMaterial
          color={active ? "#00ff8c" : isHovered ? "#003333" : "#001a1a"}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text
        color={active ? "#000000" : isHovered ? "#00ffff" : "white"}
        fontSize={0.25}
        anchorX="center"
        anchorY="middle"
        font="/fonts/GeistMono-Regular.ttf" // Using a built-in font
      >
        {name.toUpperCase()}
      </Text>
    </group>
  )
}

// Data stream component
function DataStream({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null)

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
      <meshBasicMaterial color="#00ff8c" />
    </mesh>
  )
}

// Floating code component using basic geometries
function FloatingCode() {
  const codeElements = React.useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      position: [(Math.random() - 0.5) * 20, Math.random() * 10 - 5, (Math.random() - 0.5) * 20] as [
        number,
        number,
        number,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: Math.random() * 0.5 + 0.5,
    }))
  }, [])

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
    if (isMobile) {
      camera.position.set(0, 0, 7)
    } else {
      camera.position.set(0, 0, 5)
    }
    camera.lookAt(0, 0, 0)
  }, [camera, isMobile])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.3} />

      {/* Background elements */}
      <CyberCity />
      <FloatingCode />

      {/* Data streams */}
      {Array.from({ length: 10 }, (_, i) => (
        <DataStream
          key={i}
          position={[(Math.random() - 0.5) * 15, Math.random() * 10 - 5, (Math.random() - 0.5) * 10]}
        />
      ))}

      {/* Ground grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshBasicMaterial color="#000000" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Navigation items */}
      {navItems.map((item, index) => {
        const spacing = isMobile ? 1.8 : 2.2 // Adjusted spacing for 3D Text
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

      {/* Particle effects */}
      <group>
        {Array.from({ length: 50 }, (_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30]}>
            <sphereGeometry args={[0.01, 4, 4]} />
            <meshBasicMaterial color="#00ff8c" transparent opacity={Math.random() * 0.5 + 0.2} />
          </mesh>
        ))}
      </group>
    </>
  )
}

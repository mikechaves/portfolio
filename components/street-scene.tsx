"use client"

import React, { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Environment } from "@react-three/drei"
import * as THREE from "three"

// Navigation item component
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
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, (state.mouse.x * Math.PI) / 8, 0.1)
    const targetScale = isHovered ? 1.2 : 1
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <mesh
      ref={mesh}
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
      <Text
        color={active ? "#00ff8c" : isHovered ? "#00ffff" : "white"}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </mesh>
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
      <meshStandardMaterial color="#00ff8c" emissive="#00ff8c" emissiveIntensity={0.5} />
    </mesh>
  )
}

// Floating code component
function FloatingCode() {
  const codeFragments = React.useMemo(() => ["{ }", "< />", "01", "AI", "XR", "UX"], [])
  const positions = React.useMemo(
    () => codeFragments.map(() => [(Math.random() - 0.5) * 20, Math.random() * 10 - 5, (Math.random() - 0.5) * 20]),
    [codeFragments],
  )

  return (
    <group>
      {codeFragments.map((code, i) => (
        <Text
          key={i}
          position={positions[i] as [number, number, number]}
          fontSize={0.2}
          color="#00ff8c"
          anchorX="center"
        >
          {code}
        </Text>
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
          <meshStandardMaterial
            color="#111111"
            emissive="#00ff8c"
            emissiveIntensity={0.1}
            wireframe={building.wireframe}
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
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.2} />

      <Environment preset="night" />

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

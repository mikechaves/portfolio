"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { featuredPortfolioProjects, portfolioCapabilities } from "@/data/portfolio"

const tunnelRings = Array.from({ length: 18 }, (_, index) => index)
const stageRails = Array.from({ length: 14 }, (_, index) => index)
const towerPositions = [
  [-6.8, 1.6, -4],
  [6.6, 2.2, -6],
  [7.4, 3.4, -13],
  [-7.2, 2.8, -15],
] as const
const cableRuns = [
  [-4.8, 5.1, 5, -0.52, 0.18, 0.08, 22],
  [-2.5, 5.8, 3, -0.36, -0.12, -0.06, 24],
  [1.6, 5.5, 4, -0.22, 0.22, 0.03, 26],
  [4.7, 5.2, 2, -0.42, -0.18, -0.08, 23],
] as const
const floorLightPositions = Array.from({ length: 12 }, (_, index) => index)
const smokePlumes = [
  [-3.6, -0.65, -4, 1.2],
  [3.5, -0.72, -7, 1.5],
  [-2.2, -0.7, -14, 1.35],
  [4.8, -0.7, -18, 1.1],
] as const

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setReducedMotion(media.matches)
    updateMotion()
    media.addEventListener("change", updateMotion)
    return () => media.removeEventListener("change", updateMotion)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setProgress(0)
      return
    }

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        setProgress(Math.min(window.scrollY / max, 1))
      })
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [reducedMotion])

  return { progress, reducedMotion }
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function IndustrialScene({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const red = useMemo(() => new THREE.Color("#b51218"), [])
  const amber = useMemo(() => new THREE.Color("#b88556"), [])
  const steel = useMemo(() => new THREE.Color("#171717"), [])

  useFrame(({ camera, clock }) => {
    const t = reducedMotion ? 0 : progress
    camera.position.set(lerp(0, 7, t), lerp(1.4, 4.6, t), lerp(18, -10, t))
    camera.rotation.set(lerp(-0.05, -0.2, t), lerp(0, -0.3, t), 0)
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.035
    }
  })

  return (
    <>
      <color attach="background" args={["#030303"]} />
      <fog attach="fog" args={["#030303", 10, 42]} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 8, 8]} intensity={12} color="#f1efe6" distance={34} />
      <pointLight position={[-7, 2, 3]} intensity={8} color={red} distance={20} />
      <pointLight position={[8, 3, -8]} intensity={5} color={amber} distance={24} />
      <group ref={groupRef}>
        <OverheadCables />
        <Tunnel />
        <StageArchitecture />
        <IndustrialSideScreens />
        <ProjectSlabs />
        <CapabilityField />
        <ContactBeacon />
        <FloorRunway />
        <SmokeLayer />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, -5]}>
          <planeGeometry args={[42, 80, 20, 20]} />
          <meshStandardMaterial color={steel} roughness={0.82} metalness={0.7} />
        </mesh>
      </group>
    </>
  )
}

function Tunnel() {
  return (
    <group position={[0, 0, 0]}>
      {tunnelRings.map((index) => (
        <group key={index}>
          <mesh position={[0, 0, -index * 1.85]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[4.8 + index * 0.03, 0.035, 8, 72]} />
            <meshStandardMaterial
              color={index % 4 === 0 ? "#5d5650" : "#2a2724"}
              emissive={index % 4 === 0 ? "#211717" : "#000000"}
              emissiveIntensity={index % 4 === 0 ? 0.45 : 0.08}
              metalness={0.95}
              roughness={0.36}
            />
          </mesh>
          <mesh position={[0, 0, -index * 1.85]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[4.82 + index * 0.03, 0.008, 8, 72]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#8c7e70" : "#332b28"} />
          </mesh>
        </group>
      ))}
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} position={[x, -0.8, -12]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 34]} />
          <meshStandardMaterial color="#49443d" metalness={0.9} roughness={0.45} />
        </mesh>
      ))}
      {Array.from({ length: 22 }, (_, index) => (
        <mesh key={index} position={[(index % 2 ? -5.4 : 5.4), 2.9 + (index % 4) * 0.4, -index * 1.5]}>
          <cylinderGeometry args={[0.015, 0.015, 4.5, 8]} />
          <meshStandardMaterial color="#26211f" metalness={0.8} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function StageArchitecture() {
  return (
    <group>
      {stageRails.map((index) => (
        <mesh key={`rail-${index}`} position={[0, -1.03, -index * 2.6]} rotation={[0, 0, 0]}>
          <boxGeometry args={[9.5, 0.018, 0.018]} />
          <meshBasicMaterial color={index % 2 === 0 ? "#8a7d6e" : "#3b332e"} />
        </mesh>
      ))}
      {[-5.8, 5.8].map((x) =>
        stageRails.map((index) => (
          <mesh key={`walk-${x}-${index}`} position={[x, -0.75, -index * 2.4]}>
            <boxGeometry args={[0.05, 1.8, 0.05]} />
            <meshStandardMaterial color="#2d2924" emissive="#120d0c" emissiveIntensity={0.18} metalness={0.85} roughness={0.48} />
          </mesh>
        )),
      )}
      {towerPositions.map(([x, y, z], index) => (
        <group key={`tower-${index}`} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[0.16, 4.8, 0.16]} />
            <meshStandardMaterial color="#1b1715" metalness={0.8} roughness={0.44} />
          </mesh>
          <mesh position={[0, 0.9, 0.03]}>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshBasicMaterial color="#ff1b22" />
          </mesh>
          <pointLight position={[0, 0.9, 0.2]} intensity={5} color="#b51218" distance={7} />
        </group>
      ))}
      <mesh position={[3.8, 1.8, -7]} rotation={[0, -0.32, 0]}>
        <boxGeometry args={[3.6, 2, 0.08]} />
        <meshStandardMaterial color="#0d0d0d" emissive="#181818" emissiveIntensity={0.6} metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[3.8, 1.8, -6.93]} rotation={[0, -0.32, 0]}>
        <planeGeometry args={[3.3, 1.7]} />
        <meshBasicMaterial color="#d9d1c2" transparent opacity={0.24} />
      </mesh>
      <mesh position={[4.8, 0.8, -3.5]} rotation={[0.1, -0.45, 0]}>
        <boxGeometry args={[1.8, 1.8, 0.08]} />
        <meshBasicMaterial color="#5b1013" />
      </mesh>
    </group>
  )
}

function OverheadCables() {
  return (
    <group>
      {cableRuns.map(([x, y, z, rotX, rotY, rotZ, length], index) => (
        <mesh key={`cable-${index}`} position={[x, y, z]} rotation={[rotX, rotY, rotZ]}>
          <boxGeometry args={[0.035, 0.035, length]} />
          <meshStandardMaterial color="#070707" metalness={0.55} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function IndustrialSideScreens() {
  return (
    <group>
      {[
        [-4.9, 1.5, -4.8, 0.36],
        [6.1, 1.8, -7.5, -0.45],
      ].map(([x, y, z, rotationY], index) => (
        <group key={`screen-${index}`} position={[x, y, z]} rotation={[0, rotationY, 0]}>
          <mesh>
            <boxGeometry args={[3.4, 1.9, 0.09]} />
            <meshStandardMaterial color="#080807" emissive="#111111" emissiveIntensity={0.9} metalness={0.55} roughness={0.48} />
          </mesh>
          <mesh position={[0, 0, 0.058]}>
            <planeGeometry args={[3.05, 1.55]} />
            <meshBasicMaterial color={index === 0 ? "#f1ede3" : "#8d1115"} transparent opacity={index === 0 ? 0.28 : 0.24} />
          </mesh>
          {Array.from({ length: 7 }, (_, line) => (
            <mesh key={`screen-line-${index}-${line}`} position={[0, -0.58 + line * 0.18, 0.07]}>
              <boxGeometry args={[2.62 - (line % 3) * 0.42, 0.012, 0.01]} />
              <meshBasicMaterial color={index === 0 ? "#eee7d8" : "#ff2028"} transparent opacity={0.36} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function FloorRunway() {
  return (
    <group position={[0, -1.16, -9]}>
      {floorLightPositions.map((index) => (
        <mesh key={`floor-light-${index}`} position={[(index % 2 === 0 ? -1 : 1) * 1.72, 0.05, 4 - index * 2.2]}>
          <boxGeometry args={[0.62, 0.018, 0.035]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#e6ded0" : "#b51218"} transparent opacity={0.62} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 1.9, 48]} />
        <meshBasicMaterial color="#b51218" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function SmokeLayer() {
  return (
    <group>
      {smokePlumes.map(([x, y, z, scale], index) => (
        <mesh key={`smoke-${index}`} position={[x, y, z]} rotation={[0, 0, index * 0.3]}>
          <planeGeometry args={[3.2 * scale, 1.1 * scale]} />
          <meshBasicMaterial color="#d7d0c4" transparent opacity={0.055} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function ProjectSlabs() {
  return (
    <group position={[-0.4, 0.55, -8]}>
      {featuredPortfolioProjects.map((project, index) => (
        <group key={project.id} position={[-3.8 + index * 2.75, 0.15 + index * 0.18, -index * 2.15]} rotation={[0, -0.22, 0]}>
          <mesh>
            <boxGeometry args={[1.75, 2.65, 0.08]} />
            <meshStandardMaterial color={index === 0 ? "#2b2a27" : "#171716"} metalness={0.75} roughness={0.52} />
          </mesh>
          <mesh position={[0, 0, 0.055]}>
            <planeGeometry args={[1.55, 2.42]} />
            <meshStandardMaterial color="#0a0a0a" transparent opacity={0.52} roughness={0.8} />
          </mesh>
          <pointLight position={[0.72, 1.16, 0.25]} intensity={index === 0 ? 2.8 : 1.1} color="#a40f15" distance={4} />
        </group>
      ))}
    </group>
  )
}

function CapabilityField() {
  return (
    <group position={[2.3, -0.2, -19]}>
      {portfolioCapabilities.map((capability, index) => {
        const angle = (index / portfolioCapabilities.length) * Math.PI * 2
        const x = Math.cos(angle) * 3.4
        const z = Math.sin(angle) * 2.6
        return (
          <group key={capability.id} position={[x, 0.1 + (index % 2) * 0.45, z]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 1.3, 12]} />
              <meshStandardMaterial color="#25211f" metalness={0.9} roughness={0.42} />
            </mesh>
            <mesh position={[0, 0.76, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#7f1014" emissive="#5f0609" emissiveIntensity={1.2} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#130b0b" emissive="#4d0508" emissiveIntensity={0.55} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  )
}

function ContactBeacon() {
  return (
    <group position={[7.2, 0.2, -28]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 5.6, 24]} />
        <meshStandardMaterial color="#ff1b22" emissive="#b51218" emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, 1.2, 0]} intensity={9} color="#b51218" distance={10} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.08, 48]} />
        <meshStandardMaterial color="#151210" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  )
}

export function IndustrialHomeExperience() {
  const { progress, reducedMotion } = useScrollProgress()

  return (
    <div className="industrial-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.4, 18], fov: 42, near: 0.1, far: 90 }}
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <IndustrialScene progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
      <div className="industrial-stage-illustration" />
    </div>
  )
}

"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { AdaptiveDpr, PerformanceMonitor, Preload, Sparkles } from "@react-three/drei"
import { Bloom, ChromaticAberration, EffectComposer, Noise, Scanline, Vignette } from "@react-three/postprocessing"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { BlendFunction } from "postprocessing"
import { featuredPortfolioProjects, portfolioCapabilities } from "@/data/portfolio"

const tunnelRings = Array.from({ length: 24 }, (_, index) => index)
const lowPowerTunnelRings = tunnelRings.filter((index) => index < 22 && index % 2 === 0)
const stageRails = Array.from({ length: 14 }, (_, index) => index)
const lowPowerStageRails = stageRails.filter((index) => index % 2 === 0)
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
const cableCurveSeeds = [
  [-5.8, 5.2, 5, -2.4, 4.4, -8, 1.2, 4.7, -22],
  [-3.4, 5.8, 6, -1.2, 3.9, -9, 2.6, 5.1, -24],
  [1.4, 5.5, 5, 0.3, 4.2, -7, -2.2, 4.6, -23],
  [4.8, 5.2, 3, 2.1, 3.7, -10, -1.4, 4.9, -25],
  [7.1, 4.4, -1, 3.2, 3.2, -12, 0.2, 3.9, -27],
] as const
const floorLightPositions = Array.from({ length: 12 }, (_, index) => index)
const lowPowerFloorLightPositions = floorLightPositions.filter((index) => index % 2 === 0)
const runwayPlatePositions = Array.from({ length: 18 }, (_, index) => index)
const lowPowerRunwayPlatePositions = runwayPlatePositions.filter((index) => index % 2 === 0)
const screenLineIndices = Array.from({ length: 12 }, (_, index) => index)
const tunnelStruts = Array.from({ length: 24 }, (_, index) => index)
const lowPowerTunnelStruts = tunnelStruts.filter((index) => index % 2 === 0)
const wallRibs = Array.from({ length: 14 }, (_, index) => index)
const lowPowerWallRibs = wallRibs.filter((index) => index % 2 === 0)
const scaffoldLevels = Array.from({ length: 6 }, (_, index) => index)
const runwayGrates = Array.from({ length: 22 }, (_, index) => index)
const lowPowerRunwayGrates = runwayGrates.filter((index) => index % 2 === 0)
const rearSpokeIndices = Array.from({ length: 16 }, (_, index) => index)
const lowPowerRearSpokeIndices = rearSpokeIndices.filter((index) => index % 2 === 0)
const heroTowerRows = Array.from({ length: 9 }, (_, index) => index)
const heroTrussRuns = Array.from({ length: 7 }, (_, index) => index)
const heroLightStacks = Array.from({ length: 8 }, (_, index) => index)
const foregroundRailPosts = Array.from({ length: 12 }, (_, index) => index)
const lowPowerForegroundRailPosts = foregroundRailPosts.filter((index) => index % 2 === 0)
const gantryLadderRungs = Array.from({ length: 10 }, (_, index) => index)
const apertureSpokes = Array.from({ length: 28 }, (_, index) => index)
const lowPowerApertureSpokes = apertureSpokes.filter((index) => index % 2 === 0)
const verticalLightStackRows = Array.from({ length: 9 }, (_, index) => index)
const slabCableIndices = Array.from({ length: 4 }, (_, index) => index)
const beaconSteps = Array.from({ length: 5 }, (_, index) => index)
const smokePlumes = [
  [-3.6, -0.65, -4, 1.2],
  [3.5, -0.72, -7, 1.5],
  [-2.2, -0.7, -14, 1.35],
  [4.8, -0.7, -18, 1.1],
] as const
const sideScreenSpecs = [
  { position: [-5.15, 1.55, -4.8], rotationY: 0.36, width: 3.7, height: 2.08, tint: "#eee7d8" },
  { position: [6.35, 1.86, -7.5], rotationY: -0.45, width: 3.85, height: 2.14, tint: "#b51218" },
  { position: [7.4, 2.55, -14.5], rotationY: -0.55, width: 0.08, height: 4.4, tint: "#f1ede3" },
] as const

const floorVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const floorFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying vec3 vPosition;

  float line(float value, float width) {
    return 1.0 - smoothstep(0.0, width, abs(fract(value) - 0.5));
  }

  void main() {
    float lateral = abs(vPosition.x);
    float depthFade = smoothstep(38.0, 4.0, abs(vPosition.y));
    float lane = line(vUv.x * 18.0, 0.035) * 0.12;
    float cross = line(vUv.y * 34.0 + uTime * 0.08, 0.04) * 0.10;
    float center = 1.0 - smoothstep(0.0, 1.4, lateral);
    float redPulse = center * (0.32 + sin(uTime * 1.4 + vUv.y * 16.0) * 0.08);
    vec3 graphite = vec3(0.015, 0.014, 0.013);
    vec3 steel = vec3(0.30, 0.27, 0.23);
    vec3 red = vec3(0.74, 0.04, 0.055);
    vec3 color = graphite + steel * (lane + cross) * depthFade + red * redPulse * (0.16 + uProgress * 0.16);
    float alpha = 0.78 * depthFade;
    gl_FragColor = vec4(color, alpha);
  }
`

const screenFragmentShader = `
  uniform float uTime;
  uniform vec3 uTint;
  uniform float uSignal;
  varying vec2 vUv;

  float random(vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    float scan = step(0.74, fract(vUv.y * 42.0 + uTime * 0.5)) * 0.26;
    float columns = step(0.92, fract(vUv.x * 18.0)) * 0.18;
    float noise = random(floor(vUv * vec2(90.0, 44.0)) + uTime) * 0.18;
    float edge = smoothstep(0.02, 0.12, vUv.x) * smoothstep(0.98, 0.86, vUv.x) * smoothstep(0.02, 0.12, vUv.y) * smoothstep(0.98, 0.82, vUv.y);
    vec3 color = uTint * (0.22 + scan + columns + noise + uSignal * 0.16);
    gl_FragColor = vec4(color, edge * 0.46);
  }
`

const screenVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

type IndustrialHomeExperienceProps = {
  progress: number
  reducedMotion: boolean
  sceneActive: boolean
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function canUseWebGL() {
  if (typeof window === "undefined") return false
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl"))
  } catch {
    return false
  }
}

function shouldStartLowPower() {
  if (typeof window === "undefined") return false
  const cores = window.navigator.hardwareConcurrency || 4
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches
  const compactViewport = window.matchMedia("(max-width: 760px)").matches
  return cores <= 4 || (coarsePointer && compactViewport)
}

function IndustrialScene({
  lowPower,
  onPerformanceDecline,
  progress,
  reducedMotion,
  sceneActive,
}: {
  lowPower: boolean
  onPerformanceDecline: () => void
  progress: number
  reducedMotion: boolean
  sceneActive: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const red = useMemo(() => new THREE.Color("#b51218"), [])
  const amber = useMemo(() => new THREE.Color("#b88556"), [])

  useFrame(({ camera, clock }) => {
    if (!sceneActive) return
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
      <pointLight position={[0, 8, 8]} intensity={15} color="#f1efe6" distance={36} />
      <pointLight position={[-7, 2, 3]} intensity={8} color={red} distance={20} />
      <pointLight position={[8, 3, -8]} intensity={6} color={amber} distance={24} />
      <spotLight position={[0, 9, 2]} angle={0.42} penumbra={0.7} intensity={28} color="#f2eadc" distance={38} />
      <group ref={groupRef}>
        <CinematicLightVolume progress={progress} />
        <OverheadCables />
        <CableCurtain />
        <IndustrialParticles lowPower={lowPower} />
        <Tunnel lowPower={lowPower} />
        <HeroSetPieces lowPower={lowPower} progress={progress} />
        <IndustrialLightStacks lowPower={lowPower} progress={progress} />
        <ForegroundRunwayRig lowPower={lowPower} progress={progress} />
        <RearTunnelCore lowPower={lowPower} progress={progress} />
        <IndustrialWallScaffolds lowPower={lowPower} progress={progress} />
        <StageArchitecture lowPower={lowPower} />
        <IndustrialSideScreens progress={progress} />
        <ProjectSlabs />
        <CapabilityField />
        <ContactBeacon />
        <FloorRunway lowPower={lowPower} progress={progress} />
        <SmokeLayer lowPower={lowPower} />
        <ShaderFloor lowPower={lowPower} progress={progress} />
      </group>
      <PerformanceMonitor onDecline={onPerformanceDecline} onFallback={onPerformanceDecline} />
      <AdaptiveDpr pixelated />
      <Preload all />
      <CinematicEffects lowPower={lowPower} reducedMotion={reducedMotion} />
    </>
  )
}

function IndustrialParticles({ lowPower }: { lowPower: boolean }) {
  return (
    <group visible={!lowPower}>
      <Sparkles count={72} speed={0.18} opacity={0.42} color="#eee7d8" size={1.7} scale={[8.5, 3.2, 24]} position={[1.1, 1.15, -11]} />
      <Sparkles count={28} speed={0.28} opacity={0.36} color="#b51218" size={2.2} scale={[7, 2.6, 20]} position={[3.2, 1.5, -13]} />
    </group>
  )
}

function HeroSetPieces({ lowPower, progress }: { lowPower: boolean; progress: number }) {
  const activeRows = lowPower ? heroTowerRows.filter((index) => index % 2 === 0) : heroTowerRows
  const activeTrusses = lowPower ? heroTrussRuns.filter((index) => index % 2 === 0) : heroTrussRuns

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={`hero-side-${side}`} position={[side * 5.85, 0.45, -5.2]} rotation={[0, side * -0.08, 0]}>
          {activeRows.map((index) => (
            <group key={`hero-rib-${side}-${index}`} position={[side * (0.12 + (index % 2) * 0.32), 0.15, -index * 1.95]}>
              <mesh position={[0, 1.8, 0]}>
                <boxGeometry args={[0.09, 4.8 + (index % 3) * 0.9, 0.08]} />
                <meshStandardMaterial color="#12100e" emissive="#060303" emissiveIntensity={0.35} metalness={0.9} roughness={0.42} />
              </mesh>
              <mesh position={[side * -0.42, 3.82, -0.16]} rotation={[0, side * 0.12, side * 0.2]}>
                <boxGeometry args={[1.35, 0.045, 0.055]} />
                <meshStandardMaterial color="#2f2924" emissive="#0e0807" emissiveIntensity={0.26} metalness={0.9} roughness={0.38} />
              </mesh>
              <mesh position={[side * -0.2, 0.62, 0.18]}>
                <boxGeometry args={[0.78, 0.18, 0.26]} />
                <meshStandardMaterial color="#0b0a09" emissive={index % 4 === 0 ? "#210708" : "#030202"} emissiveIntensity={0.42 + progress * 0.2} metalness={0.72} roughness={0.55} />
              </mesh>
              {heroLightStacks.map((light) => (
                <mesh key={`hero-light-${side}-${index}-${light}`} position={[side * -0.15, 0.85 + light * 0.34, 0.34]} visible={index % 3 === 0 && light < 5}>
                  <boxGeometry args={[0.035, 0.12, 0.025]} />
                  <meshBasicMaterial color={light % 2 === 0 ? "#ff252b" : "#b88556"} transparent opacity={0.72} />
                </mesh>
              ))}
            </group>
          ))}
          <mesh position={[side * -0.55, -0.72, -7.4]} rotation={[-Math.PI / 2, 0, side * 0.03]}>
            <boxGeometry args={[1.2, 18, 0.035]} />
            <meshStandardMaterial color="#181512" emissive="#080404" emissiveIntensity={0.2} metalness={0.9} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {activeTrusses.map((index) => (
        <group key={`hero-truss-${index}`} position={[0.9, 4.45 - (index % 2) * 0.22, -2.4 - index * 2.7]} rotation={[0.05, 0, index % 2 === 0 ? 0.04 : -0.04]}>
          <mesh>
            <boxGeometry args={[10.8, 0.055, 0.055]} />
            <meshStandardMaterial color="#090807" metalness={0.78} roughness={0.58} />
          </mesh>
          <mesh position={[0, -0.32, 0]} rotation={[0, 0, 0.18]}>
            <boxGeometry args={[10.2, 0.028, 0.034]} />
            <meshStandardMaterial color="#15110f" metalness={0.82} roughness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh position={[1.35, -0.78, -8.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1.65, 22, 0.03]} />
        <meshStandardMaterial color="#171411" emissive="#110606" emissiveIntensity={0.34} metalness={0.94} roughness={0.33} />
      </mesh>
      <mesh position={[1.35, -0.735, -8.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.28, 20, 3, 28]} />
        <meshBasicMaterial color="#82796b" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function IndustrialLightStacks({ lowPower, progress }: { lowPower: boolean; progress: number }) {
  const rows = lowPower ? verticalLightStackRows.filter((index) => index % 2 === 0) : verticalLightStackRows
  const stacks = [
    [-6.3, 1.2, -9.2, 0.18],
    [6.8, 1.6, -8.4, -0.18],
    [7.75, 2.4, -14.6, -0.28],
    [-7.4, 2.2, -16.2, 0.22],
  ] as const

  return (
    <group>
      {stacks.map(([x, y, z, rotY], stackIndex) => (
        <group key={`industrial-light-stack-${stackIndex}`} position={[x, y, z]} rotation={[0, rotY, 0]}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.16, 4.1, 0.12]} />
            <meshStandardMaterial color="#090807" emissive="#120606" emissiveIntensity={0.26} metalness={0.86} roughness={0.48} />
          </mesh>
          {rows.map((row) => (
            <mesh key={`stack-light-${stackIndex}-${row}`} position={[0, -0.05 + row * 0.38, 0.08]}>
              <boxGeometry args={[0.05, 0.15, 0.035]} />
              <meshBasicMaterial color={row % 3 === 0 ? "#eee7d8" : "#ff252b"} transparent opacity={0.54 + progress * 0.18} />
            </mesh>
          ))}
          <pointLight position={[0, 1.45, 0.4]} intensity={2.2 + progress * 1.4} color="#b51218" distance={5.8} />
        </group>
      ))}
    </group>
  )
}

function ForegroundRunwayRig({ lowPower, progress }: { lowPower: boolean; progress: number }) {
  const activePosts = lowPower ? lowPowerForegroundRailPosts : foregroundRailPosts
  const glowOpacity = 0.42 + progress * 0.18

  return (
    <group position={[0, -0.92, 0.4]}>
      {[-1, 1].map((side) => (
        <group key={`runway-rig-${side}`} position={[side * 3.05, 0, -5.2]} rotation={[0, side * -0.04, 0]}>
          {activePosts.map((index) => (
            <group key={`runway-post-${side}-${index}`} position={[side * (0.24 + (index % 2) * 0.12), 0.1, -index * 2.05]}>
              <mesh position={[0, 0.62, 0]}>
                <boxGeometry args={[0.045, 1.34, 0.045]} />
                <meshStandardMaterial color="#171411" emissive="#060404" emissiveIntensity={0.18} metalness={0.88} roughness={0.46} />
              </mesh>
              <mesh position={[side * -0.28, 1.18, -0.2]} rotation={[0, side * 0.04, 0]}>
                <boxGeometry args={[0.82, 0.035, 0.035]} />
                <meshStandardMaterial color="#3d352e" emissive="#120c0b" emissiveIntensity={0.22} metalness={0.9} roughness={0.38} />
              </mesh>
              <mesh position={[side * -0.04, 1.42, 0.04]} visible={index % 3 === 0}>
                <boxGeometry args={[0.05, 0.22, 0.05]} />
                <meshBasicMaterial color="#ff252b" transparent opacity={glowOpacity} />
              </mesh>
              <pointLight position={[side * -0.04, 1.42, 0.2]} intensity={index % 3 === 0 ? 1.55 + progress : 0} color="#b51218" distance={3.2} />
            </group>
          ))}
          <mesh position={[side * -0.1, 1.22, -11.4]}>
            <boxGeometry args={[0.035, 0.035, 25.5]} />
            <meshStandardMaterial color="#5b5045" emissive="#1a1110" emissiveIntensity={0.24} metalness={0.9} roughness={0.38} />
          </mesh>
          <mesh position={[side * -0.26, 0.82, -11.4]}>
            <boxGeometry args={[0.026, 0.026, 25.5]} />
            <meshStandardMaterial color="#221e1a" metalness={0.82} roughness={0.52} />
          </mesh>
        </group>
      ))}
      <group position={[0.8, 4.2, -7.5]} rotation={[0.05, 0, 0]}>
        <mesh>
          <boxGeometry args={[8.6, 0.07, 0.07]} />
          <meshStandardMaterial color="#11100e" emissive="#060303" emissiveIntensity={0.22} metalness={0.9} roughness={0.42} />
        </mesh>
        {gantryLadderRungs.map((index) => (
          <mesh key={`gantry-ladder-${index}`} position={[-3.9 + index * 0.86, -0.34, -0.04]} rotation={[0, 0, index % 2 === 0 ? 0.62 : -0.62]}>
            <boxGeometry args={[0.92, 0.022, 0.028]} />
            <meshStandardMaterial color="#211c18" metalness={0.84} roughness={0.48} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Tunnel({ lowPower }: { lowPower: boolean }) {
  const activeTunnelRings = lowPower ? lowPowerTunnelRings : tunnelRings
  const activeTunnelStruts = lowPower ? lowPowerTunnelStruts : tunnelStruts

  return (
    <group position={[1.35, 0, 0]}>
      {activeTunnelRings.map((index) => (
        <group key={index}>
          <mesh position={[0, 0.4, -index * 1.85]}>
            <torusGeometry args={[4.8 + index * 0.03, 0.035, 8, 72]} />
            <meshStandardMaterial
              color={index % 4 === 0 ? "#82796b" : "#332f2a"}
              emissive={index % 4 === 0 ? "#30211e" : "#080606"}
              emissiveIntensity={index % 4 === 0 ? 0.72 : 0.16}
              metalness={0.95}
              roughness={0.36}
            />
          </mesh>
          <mesh position={[0, 0.4, -index * 1.85]}>
            <torusGeometry args={[4.82 + index * 0.03, 0.008, 8, 72]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#8c7e70" : "#332b28"} />
          </mesh>
        </group>
      ))}
      {activeTunnelRings
        .filter((index) => index % 3 === 0)
        .map((index) => (
          <group key={`tunnel-cross-${index}`} position={[0, 0.4, -index * 1.85]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[7.2, 0.018, 0.018]} />
              <meshStandardMaterial color="#1b1714" emissive="#080504" emissiveIntensity={0.2} metalness={0.8} roughness={0.5} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[7.2, 0.018, 0.018]} />
              <meshStandardMaterial color="#1b1714" emissive="#080504" emissiveIntensity={0.2} metalness={0.8} roughness={0.5} />
            </mesh>
          </group>
        ))}
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} position={[x, -0.8, -12]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 34]} />
          <meshStandardMaterial color="#49443d" metalness={0.9} roughness={0.45} />
        </mesh>
      ))}
      {activeTunnelStruts.map((index) => (
        <mesh key={index} position={[(index % 2 ? -5.4 : 5.4), 2.9 + (index % 4) * 0.4, -index * 1.5]}>
          <cylinderGeometry args={[0.015, 0.015, 4.5, 8]} />
          <meshStandardMaterial color="#26211f" metalness={0.8} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function CinematicLightVolume({ progress }: { progress: number }) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.025 + Math.sin(clock.elapsedTime * 0.8) * 0.006 + progress * 0.01
    }
  })

  return (
    <group position={[0, 1.1, -9]}>
      <mesh position={[0, 1.7, 0]} rotation={[-0.92, 0, 0]}>
        <coneGeometry args={[4.6, 12.5, 48, 1, true]} />
        <meshBasicMaterial ref={materialRef} color="#f2eadc" transparent opacity={0.025} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[3.8, 1.3, -6]} rotation={[-0.74, 0.28, -0.12]}>
        <coneGeometry args={[3.4, 8.8, 36, 1, true]} />
        <meshBasicMaterial color="#b51218" transparent opacity={0.055} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function RearTunnelCore({ lowPower, progress }: { lowPower: boolean; progress: number }) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const activeSpokes = lowPower ? lowPowerRearSpokeIndices : rearSpokeIndices
  const activeApertureSpokes = lowPower ? lowPowerApertureSpokes : apertureSpokes

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.18 + Math.sin(clock.elapsedTime * 0.6) * 0.025 + progress * 0.06
    }
  })

  return (
    <group position={[1.35, 0.56, -24.5]}>
      <pointLight position={[0, 0.1, 1.3]} intensity={13 + progress * 7} color="#f1efe6" distance={18} />
      <mesh>
        <torusGeometry args={[2.55, 0.045, 8, 96]} />
        <meshStandardMaterial color="#eee7d8" emissive="#4b3027" emissiveIntensity={0.65} metalness={0.92} roughness={0.34} />
      </mesh>
      <mesh>
        <torusGeometry args={[1.65, 0.025, 8, 96]} />
        <meshStandardMaterial color="#766e62" emissive="#241817" emissiveIntensity={0.8} metalness={0.9} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <circleGeometry args={[1.22, 64]} />
        <meshBasicMaterial ref={materialRef} color="#eee7d8" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {activeSpokes.map((index) => {
        const angle = (index / 16) * Math.PI * 2
        return (
          <mesh key={`rear-spoke-${index}`} position={[Math.cos(angle) * 1.95, Math.sin(angle) * 1.95, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[1.25, 0.018, 0.018]} />
            <meshBasicMaterial color={index % 4 === 0 ? "#8f8172" : "#332a25"} transparent opacity={0.72} />
          </mesh>
        )
      })}
      {activeApertureSpokes.map((index) => {
        const angle = (index / apertureSpokes.length) * Math.PI * 2
        const radius = index % 2 === 0 ? 3.05 : 3.42
        return (
          <mesh key={`aperture-spoke-${index}`} position={[Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5, -0.18]} rotation={[0, 0, angle]}>
            <boxGeometry args={[radius, 0.012, 0.012]} />
            <meshBasicMaterial color={index % 4 === 0 ? "#6f655a" : "#211a17"} transparent opacity={0.48} />
          </mesh>
        )
      })}
    </group>
  )
}

function IndustrialWallScaffolds({ lowPower, progress }: { lowPower: boolean; progress: number }) {
  const activeWallRibs = lowPower ? lowPowerWallRibs : wallRibs

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={`wall-side-${side}`} position={[side * 7.25, 1.2, -1.5]} rotation={[0, side * -0.12, 0]}>
          {activeWallRibs.map((index) => (
            <WallRib key={`wall-rib-${side}-${index}`} index={index} progress={progress} side={side} />
          ))}
          {scaffoldLevels.map((level) => (
            <mesh key={`wall-level-${side}-${level}`} position={[side * -0.42, -0.1 + level * 0.72, -14.6]}>
              <boxGeometry args={[1.25, 0.035, 30]} />
              <meshStandardMaterial color="#161310" metalness={0.86} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function StageArchitecture({ lowPower }: { lowPower: boolean }) {
  const activeStageRails = lowPower ? lowPowerStageRails : stageRails

  return (
    <group>
      {activeStageRails.map((index) => (
        <mesh key={`rail-${index}`} position={[0, -1.03, -index * 2.6]} rotation={[0, 0, 0]}>
          <boxGeometry args={[9.5, 0.018, 0.018]} />
          <meshBasicMaterial color={index % 2 === 0 ? "#8a7d6e" : "#3b332e"} />
        </mesh>
      ))}
      {[-5.8, 5.8].map((x) =>
        activeStageRails.map((index) => (
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

function WallRib({ index, progress, side }: { index: number; progress: number; side: number }) {
  const markerVisible = index % 4 === 0

  return (
    <group position={[0, 0, -index * 2.35]}>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[0.08, 4.3 + (index % 3) * 0.7, 0.08]} />
        <meshStandardMaterial color="#151210" metalness={0.86} roughness={0.5} />
      </mesh>
      <mesh position={[side * -0.72, 0.9, 0]} rotation={[0, 0, side * 0.34]}>
        <boxGeometry args={[1.7, 0.035, 0.04]} />
        <meshStandardMaterial color="#1e1916" metalness={0.82} roughness={0.48} />
      </mesh>
      <mesh position={[side * -0.4, 2.72, 0]}>
        <boxGeometry args={[1.2, 0.03, 0.04]} />
        <meshStandardMaterial color="#2d2722" metalness={0.85} roughness={0.46} />
      </mesh>
      <mesh position={[side * -0.08, 2.35, 0.08]} visible={markerVisible}>
        <boxGeometry args={[0.055, 0.42, 0.055]} />
        <meshBasicMaterial color="#ff2229" transparent opacity={0.84} />
      </mesh>
      <pointLight position={[side * -0.08, 2.35, 0.25]} intensity={2.4 + progress * 1.2} color="#b51218" distance={4.2} visible={markerVisible} />
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

function CableCurtain() {
  const curves = useMemo(
    () =>
      cableCurveSeeds.map(([x1, y1, z1, x2, y2, z2, x3, y3, z3]) =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(x1, y1, z1),
          new THREE.Vector3(x2, y2, z2),
          new THREE.Vector3(x3, y3, z3),
        ]),
      ),
    [],
  )

  return (
    <group>
      {curves.map((curve, index) => (
        <mesh key={`curve-cable-${index}`}>
          <tubeGeometry args={[curve, 48, index % 2 === 0 ? 0.032 : 0.022, 8, false]} />
          <meshStandardMaterial color="#030303" roughness={0.9} metalness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function IndustrialSideScreens({ progress }: { progress: number }) {
  const materialRefs = useRef<Array<THREE.ShaderMaterial | null>>([])
  const screenUniforms = useMemo(
    () =>
      sideScreenSpecs.map(({ tint }) => ({
        uTime: { value: 0 },
        uTint: { value: new THREE.Color(tint) },
        uSignal: { value: 0 },
      })),
    [],
  )

  useFrame(({ clock }) => {
    materialRefs.current.forEach((material, index) => {
      if (!material) return
      material.uniforms.uTime.value = clock.elapsedTime + index * 1.7
      material.uniforms.uSignal.value = 0.4 + progress
    })
  })

  return (
    <group>
      {sideScreenSpecs.map(({ position, rotationY, width, height }, index) => (
        <group key={`screen-${index}`} position={position} rotation={[0, rotationY, 0]}>
          <mesh>
            <boxGeometry args={[width, height, 0.09]} />
            <meshStandardMaterial color="#080807" emissive="#111111" emissiveIntensity={0.9} metalness={0.55} roughness={0.48} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[Math.max(width - 0.28, 0.06), Math.max(height - 0.32, 0.4)]} />
            <shaderMaterial
              ref={(material) => {
                materialRefs.current[index] = material
              }}
              vertexShader={screenVertexShader}
              fragmentShader={screenFragmentShader}
              uniforms={screenUniforms[index]}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {screenLineIndices.map((line) => (
            <mesh key={`screen-line-${index}-${line}`} position={[0, -0.68 + line * 0.13, 0.08]}>
              <boxGeometry args={[index === 2 ? 0.018 : 2.7 - (line % 4) * 0.38, 0.01, 0.01]} />
              <meshBasicMaterial color={index === 0 ? "#eee7d8" : "#ff2028"} transparent opacity={0.36} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function FloorRunway({ lowPower, progress }: { lowPower: boolean; progress: number }) {
  const activeRunwayPlates = lowPower ? lowPowerRunwayPlatePositions : runwayPlatePositions
  const activeRunwayGrates = lowPower ? lowPowerRunwayGrates : runwayGrates
  const activeFloorLights = lowPower ? lowPowerFloorLightPositions : floorLightPositions

  return (
    <group position={[0, -1.16, -9]}>
      {[-1, 1].map((side) => (
        <group key={`runway-side-${side}`} position={[side * 2.34, 0.04, -9]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.06, 35, 0.035]} />
            <meshStandardMaterial color="#4b4339" emissive="#170d0c" emissiveIntensity={0.22} metalness={0.88} roughness={0.42} />
          </mesh>
          <mesh position={[side * 0.34, 0.52, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.9, 34]} />
            <meshStandardMaterial color="#191512" metalness={0.85} roughness={0.5} />
          </mesh>
        </group>
      ))}
      {activeRunwayPlates.map((index) => (
        <mesh key={`runway-plate-${index}`} position={[0, 0.025, 8 - index * 2.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.95 + (index % 2) * 0.28, 1.18, 0.018]} />
          <meshStandardMaterial color="#10100f" emissive={index % 5 === 0 ? "#221110" : "#050505"} emissiveIntensity={0.22 + progress * 0.18} metalness={0.9} roughness={0.38} />
        </mesh>
      ))}
      {activeRunwayGrates.map((index) => (
        <mesh key={`runway-grate-${index}`} position={[0, 0.058, 7.2 - index * 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.34, 0.018, 0.016]} />
          <meshBasicMaterial color={index % 6 === 0 ? "#b51218" : "#74695d"} transparent opacity={index % 6 === 0 ? 0.44 : 0.22} />
        </mesh>
      ))}
      {activeFloorLights.map((index) => (
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

function ShaderFloor({ lowPower, progress }: { lowPower: boolean; progress: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = clock.elapsedTime
    materialRef.current.uniforms.uProgress.value = progress
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.245, -6]}>
      <planeGeometry args={lowPower ? [42, 84, 14, 28] : [42, 84, 28, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={floorVertexShader}
        fragmentShader={floorFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function SmokeLayer({ lowPower }: { lowPower: boolean }) {
  const activeSmokePlumes = lowPower ? smokePlumes.slice(0, 2) : smokePlumes

  return (
    <group>
      {activeSmokePlumes.map(([x, y, z, scale], index) => (
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
          {slabCableIndices.map((cable) => (
            <mesh key={`slab-cable-${project.id}-${cable}`} position={[-0.64 + cable * 0.42, 2.45, -0.02]}>
              <boxGeometry args={[0.014, 3.6, 0.014]} />
              <meshBasicMaterial color="#0b0a09" transparent opacity={0.78} />
            </mesh>
          ))}
          <mesh>
            <boxGeometry args={[1.75, 2.65, 0.08]} />
            <meshStandardMaterial color={index === 0 ? "#2b2a27" : "#171716"} metalness={0.75} roughness={0.52} />
          </mesh>
          <mesh position={[0, 0, 0.073]}>
            <boxGeometry args={[1.9, 2.8, 0.018]} />
            <meshBasicMaterial color={index === 0 ? "#f1eadb" : "#7a7064"} transparent opacity={index === 0 ? 0.13 : 0.07} />
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
  const nodePositions = portfolioCapabilities.map((capability, index) => {
    const angle = (index / portfolioCapabilities.length) * Math.PI * 2
    const x = Math.cos(angle) * 3.4
    const z = Math.sin(angle) * 2.6
    return { capability, index, x, z }
  })

  return (
    <group position={[2.3, -0.2, -19]}>
      {nodePositions.map(({ capability, index, x, z }) => {
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
      {nodePositions.map(({ capability, x, z }) => {
        const length = Math.sqrt(x * x + z * z)
        const angle = Math.atan2(z, x)
        return (
          <mesh key={`capability-link-${capability.id}`} position={[x / 2, 0.62, z / 2]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[length, 0.018, 0.018]} />
            <meshBasicMaterial color="#918578" transparent opacity={0.22} />
          </mesh>
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
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 2.15, 64]} />
        <meshBasicMaterial color="#b51218" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      {beaconSteps.map((step) => (
        <mesh key={`beacon-step-${step}`} position={[0, -0.18 - step * 0.05, 1.15 + step * 0.58]}>
          <boxGeometry args={[3.1 + step * 0.5, 0.04, 0.26]} />
          <meshStandardMaterial color="#12100e" emissive={step % 2 === 0 ? "#170707" : "#050303"} emissiveIntensity={0.22} metalness={0.84} roughness={0.44} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <group key={`beacon-side-${side}`} position={[side * 2.6, 0.1, 0.2]}>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.1, 1.9, 0.1]} />
            <meshStandardMaterial color="#100e0d" emissive="#070303" emissiveIntensity={0.24} metalness={0.9} roughness={0.44} />
          </mesh>
          <mesh position={[0, 1.55, 0.04]}>
            <boxGeometry args={[0.05, 0.28, 0.04]} />
            <meshBasicMaterial color="#ff252b" transparent opacity={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function CinematicEffects({ lowPower, reducedMotion }: { lowPower: boolean; reducedMotion: boolean }) {
  if (reducedMotion || lowPower) return null

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom intensity={0.82} luminanceThreshold={0.06} luminanceSmoothing={0.52} mipmapBlur />
      <ChromaticAberration offset={[0.00055, 0.00032]} />
      <Scanline density={1.18} opacity={0.09} />
      <Noise opacity={0.025} blendFunction={BlendFunction.SCREEN} />
      <Vignette eskil={false} offset={0.14} darkness={0.78} />
    </EffectComposer>
  )
}

export function IndustrialHomeExperience({ progress, reducedMotion, sceneActive }: IndustrialHomeExperienceProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const [deviceLowPower, setDeviceLowPower] = useState(false)
  const [adaptiveLowPower, setAdaptiveLowPower] = useState(false)
  const lowPower = deviceLowPower || adaptiveLowPower
  const dpr: [number, number] = lowPower ? [1, 1.15] : [1, 1.45]
  const frameloop = sceneActive && !reducedMotion ? "always" : "demand"
  const handlePerformanceDecline = useCallback(() => setAdaptiveLowPower(true), [])

  useEffect(() => {
    setWebglSupported(canUseWebGL())
    setDeviceLowPower(shouldStartLowPower())
  }, [])

  if (webglSupported === false) {
    return (
      <div className="industrial-canvas industrial-canvas-fallback industrial-canvas-unavailable" aria-hidden="true">
        <div className="industrial-fallback-stage" />
      </div>
    )
  }

  return (
    <div className={`industrial-canvas ${canvasReady ? "is-ready" : "is-loading"} ${lowPower ? "is-low-power" : ""}`} aria-hidden="true">
      {webglSupported ? (
        <Canvas
          camera={{ position: [0, 1.4, 18], fov: 42, near: 0.1, far: 90 }}
          dpr={dpr}
          frameloop={frameloop}
          gl={{ antialias: !deviceLowPower, alpha: false, powerPreference: deviceLowPower ? "default" : "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#030303")
            window.requestAnimationFrame(() => setCanvasReady(true))
          }}
        >
          <IndustrialScene lowPower={lowPower} onPerformanceDecline={handlePerformanceDecline} progress={progress} reducedMotion={reducedMotion} sceneActive={sceneActive} />
        </Canvas>
      ) : null}
      {!canvasReady ? (
        <div className="industrial-canvas-loader">
          <span>Initializing WebGL stage</span>
          <i />
        </div>
      ) : null}
      <div className="industrial-stage-illustration" />
    </div>
  )
}

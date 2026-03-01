"use client"

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"

// -----------------------------------------------------------------------------
// R3F Canvas
// -----------------------------------------------------------------------------
const Canvas = dynamic(() => import("@react-three/fiber").then((m) => m.Canvas), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-primary">
      Loading 3D Scene...
    </div>
  ),
})

// -----------------------------------------------------------------------------
// Shared HUD style tokens (inject once)
// -----------------------------------------------------------------------------
function HUDStyleTokens() {
  return (
    <style jsx global>{`
      .hud-font {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .hud-rim {
        border: 1px solid color-mix(in oklab, var(--hud), transparent 65%);
        box-shadow:
          inset 0 0 12px color-mix(in oklab, var(--hud), transparent 80%),
          0 0 22px color-mix(in oklab, var(--hud), transparent 86%);
        background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.15));
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
      }
      .hud-scan::after {
        content: "";
        position: absolute; inset: 0;
        background:
          repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0) 0 1px,
            rgba(255,255,255,.04) 1px 2px
          );
        pointer-events: none;
        mix-blend-mode: screen;
        opacity: .6;
        border-radius: inherit;
        clip-path: inherit;
      }
      .hud-notch {
        --notch: 10px;
        clip-path: polygon(
          0% 0%,
          calc(100% - var(--notch)) 0%,
          100% var(--notch),
          100% 100%,
          0% 100%
        );
      }

      /* Top ribbon */
      .hud-top {
        position: fixed; left: 12px; top: 12px;
        z-index: 90; pointer-events: none;
        padding: 8px 12px; border-radius: 10px;
        font-size: 12px; color: rgba(210,255,240,.92);
        text-shadow: 0 0 6px rgba(0,255,190,.4);
        animation: hudPulse 2s ease-in-out infinite;
      }
      @keyframes hudPulse {
        0%,100% { filter: drop-shadow(0 0 0px rgba(0,255,200,0)); }
        50%     { filter: drop-shadow(0 0 6px rgba(0,255,200,.35)); }
      }

      /* Center chips */
      .hud-chip {
        position: absolute;
        transform: translate(-50%, -50%);
        padding: 6px 12px;
        font-size: 12px;
        color: #dff7f2;
        text-shadow: 0 0 6px currentColor;
        border-radius: 12px;
        pointer-events: none;
        white-space: nowrap;
        z-index: 1000;
      }
      .hud-chip[data-hover="true"] { filter: drop-shadow(0 0 6px var(--hud)); }
      .hud-chip[data-active="true"] {
        color: white;
        border-color: color-mix(in oklab, var(--hud), transparent 30%);
        box-shadow:
          inset 0 0 16px color-mix(in oklab, var(--hud), transparent 68%),
          0 0 18px color-mix(in oklab, var(--hud), transparent 80%);
      }
      .hud-chip[data-active="true"]::before {
        content: "";
        position: absolute;
        left: 50%; bottom: -8px;
        transform: translateX(-50%);
        width: 10px; height: 8px;
        background: currentColor;
        clip-path: polygon(0 0, 50% 100%, 100% 0);
        filter: drop-shadow(0 0 6px currentColor);
        opacity: .9;
      }

      /* Bottom dock */
      .hud-dock {
        position: fixed; left: 12px;
        bottom: max(0.75rem, env(safe-area-inset-bottom));
        display: flex; gap: 10px; align-items: center;
        z-index: 80; pointer-events: none;
      }
      .hud-frame {
        position: relative;
        display: flex; gap: 8px; align-items: center;
        padding: 8px;
        border-radius: 14px;
        pointer-events: auto;
      }
      .hud-divider { width: 1px; height: 18px; background: rgba(255,255,255,.1); }
      .hud-hint {
        font-size: 10px; color: rgba(255,255,255,.6);
        padding: 4px 8px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,.18);
      }
      .hud-btn {
        position: relative;
        padding: 6px 10px;
        border-radius: 10px;
        clip-path: polygon(0% 0%, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 0% 100%);
        border: 1px solid color-mix(in oklab, var(--hud), transparent 65%);
        background: linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.15));
        color: rgba(255,255,255,.74);
        transition: filter .15s ease, color .15s ease, border-color .15s ease;
      }
      .hud-btn:hover {
        filter: drop-shadow(0 0 6px color-mix(in oklab, var(--hud), transparent 55%));
        color: #fff;
        border-color: color-mix(in oklab, var(--hud), transparent 40%);
      }
      .hud-btn.active {
        color: white;
        border-color: color-mix(in oklab, var(--hud), transparent 30%);
        box-shadow:
          inset 0 0 12px color-mix(in oklab, var(--hud), transparent 70%),
          0 0 12px color-mix(in oklab, var(--hud), transparent 82%);
      }
      /* radius presets */
      .hud-razor { --r: 4px; 
      }      /* very sharp */
      .hud-micro { --r: 8px; 
      }      /* recommended default */
      .hud-pill  { --r: 16px; 
      }     /* soft, near-future */
      /* unify radius application */
      .hud-top,
      .hud-chip,
      .hud-frame,
      .hud-btn { border-radius: var(--r); 
      }
    `}</style>
  )
}

// -----------------------------------------------------------------------------
// Helpers / theme
// -----------------------------------------------------------------------------
type MotionLevel = "off" | "calm" | "normal"
const clampStep = (v: number, maxStep: number) => Math.max(-maxStep, Math.min(maxStep, v))
const BUILD_VARIANTS = { lines: 0.22, wire: 0.38, solid: 0.4 } as const
const HIDE_3D_BARS = true // keep nav meshes for hit-testing, but invisible

// utilities (place near pageAccent)
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "")
  const val = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16)
  return { r: (val >> 16) & 255, g: (val >> 8) & 255, b: val & 255 }
}
const rgba = (hex: string, a: number) => {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const pageAccent = (path: string) =>
  path === "/about" ? "#ff00ff" : path === "/blog" ? "#ff8c00" : path === "/projects" ? "#00ff8c" : "#00ffff"

const MOTION_PRESETS: Record<
  MotionLevel,
  {
    speeds: { float: number; stream: number; rotate: number; pulseHz: number }
    amplitudes: { floatY: number; pulse: number }
    counts: { streamsDesktop: number; streamsMobile: number; buildingsDesktop: number; buildingsMobile: number }
    emissive: { base: number; pulse: number }
  }
> = {
  off: {
    speeds: { float: 0, stream: 0, rotate: 0, pulseHz: 0 },
    amplitudes: { floatY: 0, pulse: 0 },
    counts: { streamsDesktop: 4, streamsMobile: 3, buildingsDesktop: 10, buildingsMobile: 8 },
    emissive: { base: 0.15, pulse: 0 },
  },
  calm: {
    speeds: { float: 0.35, stream: 0.18, rotate: 0.08, pulseHz: 0.07 },
    amplitudes: { floatY: 0.04, pulse: 0.035 },
    counts: { streamsDesktop: 6, streamsMobile: 5, buildingsDesktop: 14, buildingsMobile: 10 },
    emissive: { base: 0.18, pulse: 0.03 },
  },
  normal: {
    speeds: { float: 0.6, stream: 0.45, rotate: 0.2, pulseHz: 0.15 },
    amplitudes: { floatY: 0.07, pulse: 0.06 },
    counts: { streamsDesktop: 10, streamsMobile: 7, buildingsDesktop: 20, buildingsMobile: 14 },
    emissive: { base: 0.22, pulse: 0.05 },
  },
}

// -----------------------------------------------------------------------------
// HUD (status) — fixed top-left so it never fights the dock
// -----------------------------------------------------------------------------
function HUDOverlay({
  motionLabel,
  pathname,
  accent = pageAccent(pathname),
}: {
  motionLabel: string
  pathname: string
  accent?: string
}) {
  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        top: 12,
        zIndex: 90,
        pointerEvents: "none",

        // CRISP RIBBON: no blur, no soft glow
        padding: "8px 10px",
        border: `1px solid ${rgba(accent, 0.55)}`,
        background: "rgba(0,0,0,0.35)",
        // two pixel-perfect rims instead of a blur:
        boxShadow: `0 0 0 1px ${rgba(accent, 0.28)} inset, 0 0 0 1px ${rgba(accent, 0.18)}`,
        borderRadius: 0,
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",

        // typography
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize: 12,
        letterSpacing: 1.2,

        // keep edges sharp on some GPUs when moving
        transform: "translateZ(0)",
      }}
    >
      {/* white text like the dock */}
      <span style={{ color: "#eaf6f6" }}>
        STREET • {pathname.toUpperCase()} • MOTION {motionLabel.toUpperCase()}
      </span>

      {/* subtle scanlines, but crisp (1px lines, no blur) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0.15,
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0, transparent 2px, rgba(255,255,255,0.12) 2px, rgba(255,255,255,0.12) 3px)",
        }}
      />
    </div>
  )
}

// -----------------------------------------------------------------------------
// 3D NAV ITEM (invisible bars for hit testing; we render pretty HTML chips)
// -----------------------------------------------------------------------------
function NavItem3D({
  name,
  position,
  active = false,
  onClick,
  onPositionUpdate,
  motion,
  paused = false,
}: {
  name: string
  position: [number, number, number]
  active?: boolean
  onClick: () => void
  onPositionUpdate: (name: string, screenPos: { x: number; y: number }, hovered: boolean) => void
  motion: (typeof MOTION_PRESETS)[MotionLevel]
  paused?: boolean
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [isHovered, setIsHovered] = useState(false)
  const { camera, size } = useThree()

  const motionRef = useRef(motion)
  const pausedRef = useRef(paused)
  useEffect(() => void (motionRef.current = motion), [motion])
  useEffect(() => void (pausedRef.current = paused), [paused])

  useFrame((state) => {
    if (!mesh.current || !camera || pausedRef.current) return
    const m = motionRef.current

    const t = state.clock.elapsedTime
    const y0 = position[1]
    const dy = Math.sin(t * m.speeds.float + position[0]) * m.amplitudes.floatY
    const nextY = y0 + dy
    const step = clampStep(nextY - mesh.current.position.y, 0.02)
    mesh.current.position.y += step

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
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
        document.body && (document.body.style.cursor = "pointer")
      }}
      onPointerOut={() => {
        setIsHovered(false)
        document.body && (document.body.style.cursor = "auto")
      }}
    >
      <boxGeometry args={[1.5, 0.3, 0.1]} />
      <meshStandardMaterial
        transparent
        opacity={HIDE_3D_BARS ? 0 : 0.18}
        color={active ? "#00ff8c" : isHovered ? "#00ffff" : "white"}
        emissive={active ? "#00ff8c" : isHovered ? "#00ffff" : "#000000"}
        emissiveIntensity={HIDE_3D_BARS ? 0 : 0.25}
        depthWrite={false}
      />
    </mesh>
  )
}

// -----------------------------------------------------------------------------
// Ambient effects: CodeLine, GlyphParticles, AsciiGlyphs
// -----------------------------------------------------------------------------
function CodeLine({
  position,
  currentPage,
  motion,
  paused = false,
}: {
  position: [number, number, number]
  currentPage: string
  motion: (typeof MOTION_PRESETS)[MotionLevel]
  paused?: boolean
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const color = pageAccent(currentPage)

  const motionRef = useRef(motion)
  const pausedRef = useRef(paused)
  useEffect(() => void (motionRef.current = motion), [motion])
  useEffect(() => void (pausedRef.current = paused), [paused])

  useFrame((state, delta) => {
    if (!mesh.current || pausedRef.current) return
    const m = motionRef.current
    mesh.current.position.y += delta * (m.speeds.stream * 0.12)
    if (mesh.current.position.y > 6) mesh.current.position.y = -6
    mesh.current.rotation.z += delta * (m.speeds.rotate * 0.06)

    const t = state.clock.elapsedTime
    const mat = mesh.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = m.emissive.base + m.emissive.pulse * Math.sin(t * (m.speeds.pulseHz * 0.8))
  })

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.01, 1.2, 0.01]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.16}
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

function GlyphParticles({
  color = "#00ff8c",
  count = 140,
  spread = 18,
  motion,
  paused = false,
}: {
  color?: string
  count?: number
  spread?: number
  motion: (typeof MOTION_PRESETS)[MotionLevel]
  paused?: boolean
}) {
  const pointsRef = useRef<THREE.Points>(null!)

  const discTexture = useMemo(() => {
    const s = 64
    const c = document.createElement("canvas")
    c.width = c.height = s
    const ctx = c.getContext("2d")!
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    g.addColorStop(0.0, "rgba(255,255,255,1)")
    g.addColorStop(0.5, "rgba(255,255,255,0.35)")
    g.addColorStop(1.0, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
    const t = new THREE.CanvasTexture(c)
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    t.generateMipmaps = false
    t.needsUpdate = true
    return t
  }, [])

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
      spd[i] = 0.1 + Math.random() * 0.6
    }
    return { positions: pos, speeds: spd }
  }, [count, spread])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color,
        size: 0.085,
        sizeAttenuation: true,
        map: discTexture,
        alphaTest: 0.01,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, discTexture]
  )

  const motionRef = useRef(motion)
  const pausedRef = useRef(paused)
  useEffect(() => void (motionRef.current = motion), [motion])
  useEffect(() => void (pausedRef.current = paused), [paused])

  useFrame((_, delta) => {
    if (pausedRef.current || !pointsRef.current) return
    const m = motionRef.current
    const arr = (pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1
      arr[iy] += delta * (m.speeds.stream * 0.4 + speeds[i] * 0.15)
      if (arr[iy] > spread / 2) arr[iy] = -spread / 2
    }
    ;(pointsRef.current.material as THREE.PointsMaterial).opacity =
      0.7 + 0.25 * Math.sin(performance.now() * 0.002 * (m.speeds.pulseHz + 0.6))
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geom} material={mat} />
}

function AsciiGlyphs({
  color = "#00ff8c",
  count = 240,
  spread = 22,
  size = 18,
  motion,
  paused = false,
}: {
  color?: string
  count?: number
  spread?: number
  size?: number
  motion: (typeof MOTION_PRESETS)[MotionLevel]
  paused?: boolean
}) {
  const pointsRef = useRef<THREE.Points>(null!)
  const { size: viewport } = useThree()

  const atlasTex = useMemo(() => {
    const S = 512
    const CELLS = 16
    const cell = S / CELLS
    const cnv = document.createElement("canvas")
    cnv.width = cnv.height = S
    const ctx = cnv.getContext("2d")!
    ctx.clearRect(0, 0, S, S)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white"
    ctx.font = `bold ${Math.floor(cell * 0.72)}px Menlo, Monaco, Consolas, monospace`
    ctx.shadowColor = "white"
    ctx.shadowBlur = Math.floor(cell * 0.25)
    for (let i = 0; i < 256; i++) {
      const col = i % CELLS
      const row = (i / CELLS) | 0
      const x = col * cell + cell / 2
      const y = row * cell + cell / 2
      const ch = i >= 32 ? String.fromCharCode(i) : "·"
      ctx.fillText(ch, x, y)
    }
    const tex = new THREE.CanvasTexture(cnv)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    tex.needsUpdate = true
    return tex
  }, [])

  const { positions, speeds, phases, glyphs, angles } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const pha = new Float32Array(count)
    const gly = new Float32Array(count)
    const ang = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
      spd[i] = 0.2 + Math.random() * 0.8
      pha[i] = Math.random() * Math.PI * 2
      gly[i] = 32 + Math.floor(Math.random() * 95)
      ang[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, speeds: spd, phases: pha, glyphs: gly, angles: ang }
  }, [count, spread])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1))
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1))
    g.setAttribute("aGlyph", new THREE.BufferAttribute(glyphs, 1))
    g.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1))
    return g
  }, [positions, speeds, phases, glyphs, angles])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAtlas: { value: atlasTex },
      uColor: { value: new THREE.Color(color) },
      uSize: { value: size },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
    }),
    [atlasTex, color, size]
  )

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2)
  }, [viewport.width, viewport.height, uniforms])

  const vert = /* glsl */ `
    attribute float aSpeed;
    attribute float aPhase;
    attribute float aGlyph;
    attribute float aAngle;
    uniform float uTime;
    uniform float uSize;
    uniform float uPixelRatio;
    varying float vGlyph;
    varying float vTwinkle;
    varying float vAngle;
    void main() {
      vGlyph = aGlyph;
      vAngle = aAngle + uTime * 0.25;
      vTwinkle = 0.65 + 0.35 * sin(uTime * 1.7 + aPhase);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uSize * (uPixelRatio / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `
  const frag = /* glsl */ `
    uniform sampler2D uAtlas;
    uniform vec3 uColor;
    varying float vGlyph;
    varying float vTwinkle;
    varying float vAngle;
    void main() {
      vec2 uv = gl_PointCoord;
      vec2 p = uv - 0.5;
      float c = cos(vAngle), s = sin(vAngle);
      uv = mat2(c, -s, s, c) * p + 0.5;
      float cols = 16.0;
      float rows = 16.0;
      float gi = clamp(vGlyph, 0.0, 255.0);
      float gx = mod(gi, cols);
      float gy = floor(gi / cols);
      vec2 tileUV = (uv + vec2(gx, gy)) / vec2(cols, rows);
      vec4 tex = texture2D(uAtlas, tileUV);
      float a = tex.a;
      if (a < 0.15) discard;
      vec3 col = uColor * (0.6 + 0.4 * tex.r);
      gl_FragColor = vec4(col, a * vTwinkle);
    }
  `
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms]
  )

  const motionRef = useRef(motion)
  const pausedRef = useRef(paused)
  useEffect(() => void (motionRef.current = motion), [motion])
  useEffect(() => void (pausedRef.current = paused), [paused])

  const timeSinceSwap = useRef(0)
  useFrame((_, delta) => {
    if (!pointsRef.current) return
    uniforms.uTime.value += pausedRef.current ? 0 : delta
    if (pausedRef.current) return

    const m = motionRef.current
    const pos = (pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array
    const glyphAttr = pointsRef.current.geometry.getAttribute("aGlyph") as THREE.BufferAttribute
    const half = spread / 2

    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1
      pos[iy] += delta * (m.speeds.stream * 0.6 + speeds[i] * 0.25)
      if (pos[iy] > half) pos[iy] = -half
    }
    ;(pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true

    timeSinceSwap.current += delta
    if (timeSinceSwap.current > 0.12) {
      timeSinceSwap.current = 0
      for (let k = 0; k < 6; k++) {
        const idx = (Math.random() * count) | 0
        glyphs[idx] = 32 + Math.floor(Math.random() * 95)
      }
      glyphAttr.needsUpdate = true
    }
  })

  return <points ref={pointsRef} geometry={geom} material={mat} />
}

// -----------------------------------------------------------------------------
// Snow Crash vibes: StreetPlane / Billboard / MonoRail / Buildings
// -----------------------------------------------------------------------------
function StreetPlane({ color = "#00ffff" as string }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(1000, 200, color, color) as THREE.GridHelper & {
      material: THREE.Material & { opacity?: number; transparent?: boolean }
    }
    g.material.transparent = true
    ;(g.material as any).opacity = 0.15
    return g
  }, [color])
  return <primitive object={grid} position={[0, -1, 0]} />
}

function Billboard({
  position,
  size = [3, 1.2] as [number, number],
  color = "#00ffff",
  mouse = [0, 0] as [number, number],
  paused = false,
}: {
  position: [number, number, number]
  size?: [number, number]
  color?: string
  mouse?: [number, number]
  paused?: boolean
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const { camera } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uAlpha: { value: 0.8 },
      uScan: { value: 800.0 },
    }),
    [color]
  )

  useFrame((_, delta) => {
    if (!mesh.current || !materialRef.current) return
    uniforms.uTime.value += (paused ? 0 : delta) * 1.0
    mesh.current.lookAt(camera.position)
    mesh.current.rotation.x = 0
    mesh.current.rotation.z = 0
    mesh.current.position.x = position[0] + mouse[0] * 0.05
    mesh.current.position.z = position[2] + mouse[1] * 0.05
  })

  const frag = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uAlpha;
    uniform float uScan;
    varying vec2 vUv;
    float hash(float n){ return fract(sin(n)*43758.5453); }
    float noise(vec2 x){
      vec2 p=floor(x); vec2 f=fract(x);
      f=f*f*(3.0-2.0*f);
      float n=p.x+p.y*57.0;
      return mix(mix(hash(n+0.0),hash(n+1.0),f.x), mix(hash(n+57.0),hash(n+58.0),f.x), f.y);
    }
    void main(){
      float scan = 0.35 + 0.65 * step(0.5, fract(vUv.y * uScan));
      vec2 d = vUv - 0.5;
      float vig = 1.0 - smoothstep(0.35, 0.9, dot(d,d) * 3.0);
      float flick = 0.9 + 0.1 * noise(vUv * 40.0 + uTime * 6.0);
      vec3 col = uColor * scan * vig * flick;
      gl_FragColor = vec4(col, uAlpha * (0.8 + 0.2 * scan));
    }
  `
  const vert = `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `
  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={size} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.PlaneGeometry(size[0], size[1]))}>
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </lineSegments>
    </mesh>
  )
}

function MonoRail({ motion, paused = false, color = "#00ffff" }: { motion: (typeof MOTION_PRESETS)[MotionLevel]; paused?: boolean; color?: string }) {
  const group = useRef<THREE.Group>(null!)
  const car = useRef<THREE.Mesh>(null!)
  const ghosts = useRef<THREE.Mesh[]>([])
  const tRef = useRef(0)

  const motionRef = useRef(motion)
  const pausedRef = useRef(paused)
  useEffect(() => void (motionRef.current = motion), [motion])
  useEffect(() => void (pausedRef.current = paused), [paused])

  const railGeom = useMemo(() => new THREE.BoxGeometry(20, 0.05, 0.05), [])
  const supportGeom = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 2, 8), [])
  const carGeom = useMemo(() => new THREE.BoxGeometry(0.6, 0.28, 0.28), [])
  const railMat = useMemo(() => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.2, transparent: true, opacity: 0.5 }), [color])
  const supportMat = useMemo(() => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.08, transparent: true, opacity: 0.15 }), [color])
  const carMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, transparent: true, opacity: 0.35, depthWrite: false }),
    [color]
  )

  useFrame((state, delta) => {
    if (!group.current || pausedRef.current) return
    const m = motionRef.current
    tRef.current += delta * (m.speeds.stream * 0.25 + 0.15)
    const span = 22
    const x = ((tRef.current * 6) % span) - span / 2
    const y = 2.4 + Math.sin(tRef.current * 1.3) * 0.12
    const z = -6 + Math.sin(tRef.current * 0.7) * 0.4
    if (car.current) {
      car.current.position.set(x, y, z)
      car.current.rotation.y = Math.sin(tRef.current * 2.0) * 0.08
      ;(car.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.25 + 0.1 * Math.sin(state.clock.elapsedTime * (m.speeds.pulseHz * 2))
    }
    ghosts.current.forEach((g, i) => {
      const lag = (i + 1) * 0.06
      const gx = (((tRef.current - lag) * 6) % span) - span / 2
      const gy = 2.4 + Math.sin((tRef.current - lag) * 1.3) * 0.12
      const gz = -6 + Math.sin((tRef.current - lag) * 0.7) * 0.4
      g.position.set(gx, gy, gz)
      const alpha = Math.max(0, 0.35 - i * 0.06)
      ;(g.material as THREE.MeshStandardMaterial).opacity = alpha
    })
  })

  return (
    <group ref={group}>
      <mesh geometry={railGeom} material={railMat} position={[0, 2.4, -6]} />
      {[-10, -6, -2, 2, 6, 10].map((sx) => (
        <mesh key={sx} geometry={supportGeom} material={supportMat} position={[sx, 1.4, -6]} />
      ))}
      <mesh ref={car} geometry={carGeom} material={carMat} />
      {[0.12, -0.12].map((off, i) => (
        <mesh key={i} position={[0.35, 2.42, -6 + off]}>
          <coneGeometry args={[0.06, 0.4, 12, 1, true]} />
          <meshBasicMaterial color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => el && (ghosts.current[i] = el)}
          geometry={carGeom}
          material={
            new THREE.MeshStandardMaterial({
              color,
              emissive: color,
              emissiveIntensity: 0.15,
              transparent: true,
              opacity: 0.25,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          }
        />
      ))}
    </group>
  )
}

function CyberCity({
  mousePosition,
  currentPage,
  motion,
  paused = false,
  buildingCount,
}: {
  mousePosition: [number, number]
  currentPage: string
  motion: (typeof MOTION_PRESETS)[MotionLevel]
  paused?: boolean
  buildingCount: number
}) {
  type Variant = "solid" | "wire" | "lines"
  const buildings = useMemo(
    () =>
      Array.from({ length: buildingCount }, (_, i) => {
        const r = Math.random()
        const variant: Variant = r < BUILD_VARIANTS.lines ? "lines" : r < BUILD_VARIANTS.lines + BUILD_VARIANTS.wire ? "wire" : "solid"
        return {
          key: i,
          position: [(Math.random() - 0.5) * 20, Math.random() * 5 + 2, -5 - Math.random() * 10] as [number, number, number],
          height: Math.random() * 8 + 2,
          width: Math.random() * 2 + 0.5,
          baseEmissiveIntensity: Math.random() * 0.22 + 0.08,
          variant,
        }
      }),
    [buildingCount]
  )

  const theme = { color: pageAccent(currentPage), emissive: pageAccent(currentPage) }

  return (
    <group>
      {buildings.map((b) => {
        const dx = b.position[0] - mousePosition[0]
        const dz = b.position[2] - mousePosition[1]
        const distance = Math.sqrt(dx * dx + dz * dz)
        const glowIntensity = Math.max(0.08, 1 - distance / 10)
        const scaleMultiplier = distance < 4 ? 1.08 : 1.0
        return (
          <BuildingMesh
            key={b.key}
            building={b}
            theme={theme}
            glowIntensity={glowIntensity}
            scaleMultiplier={scaleMultiplier}
            motion={motion}
            paused={paused}
          />
        )
      })}
    </group>
  )
}

function BuildingMesh({
  building,
  theme,
  glowIntensity,
  scaleMultiplier,
  motion,
  paused = false,
}: {
  building: {
    key: number
    position: [number, number, number]
    height: number
    width: number
    baseEmissiveIntensity: number
    variant: "solid" | "wire" | "lines"
  }
  theme: { color: string; emissive: string }
  glowIntensity: number
  scaleMultiplier: number
  motion: (typeof MOTION_PRESETS)[MotionLevel]
  paused?: boolean
}) {
  const group = useRef<THREE.Group>(null!)
  const solidRef = useRef<THREE.Mesh>(null!)
  const wireRef = useRef<THREE.LineSegments>(null!)

  const motionRef = useRef(motion)
  const pausedRef = useRef(paused)
  useEffect(() => void (motionRef.current = motion), [motion])
  useEffect(() => void (pausedRef.current = paused), [paused])

  const basePos = useRef<[number, number, number]>(building.position)
  useEffect(() => void (basePos.current = building.position), [building.position])

  const geom = useMemo(() => new THREE.BoxGeometry(building.width, building.height, building.width), [building.width, building.height])
  const edges = useMemo(() => new THREE.EdgesGeometry(geom), [geom])
  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: theme.emissive, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }),
    [theme.emissive]
  )

  useFrame((state) => {
    if (!group.current || pausedRef.current) return
    const m = motionRef.current
    const t = state.clock.elapsedTime
    const yBob = Math.sin(t * (m.speeds.float * 0.8) + building.key) * (m.amplitudes.floatY * 1.6)
    const xSway = Math.sin(t * (m.speeds.float * 0.6) + building.key * 1.37) * 0.08
    group.current.position.set(basePos.current[0] + xSway, basePos.current[1] + yBob, basePos.current[2])
    if (solidRef.current) {
      const tPulse = m.amplitudes.pulse * Math.sin(t * m.speeds.pulseHz + building.key)
      ;(solidRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        building.baseEmissiveIntensity + glowIntensity * 0.35 + tPulse
    }
  })

  if (building.variant === "lines") {
    return (
      <group ref={group} scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}>
        <lineSegments ref={wireRef} geometry={edges} material={lineMat} />
      </group>
    )
  }
  if (building.variant === "wire") {
    return (
      <group ref={group} scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}>
        <lineSegments ref={wireRef} geometry={edges} material={lineMat} />
        <mesh ref={solidRef} geometry={geom}>
          <meshStandardMaterial
            color={theme.color}
            emissive={theme.emissive}
            emissiveIntensity={building.baseEmissiveIntensity + glowIntensity * 0.25}
            transparent
            opacity={0.18}
            depthWrite={false}
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      </group>
    )
  }
  return (
    <group ref={group} scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}>
      <mesh ref={solidRef} geometry={geom}>
        <meshStandardMaterial
          color={theme.color}
          emissive={theme.emissive}
          emissiveIntensity={building.baseEmissiveIntensity + glowIntensity * 0.35}
          transparent
          opacity={0.28}
          depthWrite={false}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

// -----------------------------------------------------------------------------
// Scene wrapper
// -----------------------------------------------------------------------------
function Street({
  navItems,
  pathname,
  onNavigate,
  isMobile,
  onNavPositionUpdate,
  motion,
  paused,
}: {
  navItems: { name: string; path: string }[]
  pathname: string
  onNavigate: (path: string) => void
  isMobile: boolean
  onNavPositionUpdate: (name: string, screenPos: { x: number; y: number }, hovered: boolean) => void
  motion: (typeof MOTION_PRESETS)[MotionLevel]
  paused: boolean
}) {
  const { camera, mouse, scene } = useThree()
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0])
  const lastMouse = useRef<[number, number]>([0, 0])

  useEffect(() => {
    camera.position.set(0, 0, isMobile ? 7 : 5)
    camera.lookAt(0, 0, 0)
  }, [camera, isMobile])

  useEffect(() => {
    scene.background = new THREE.Color("#000000")
    scene.fog = new THREE.Fog("#000000", 8, 60)
  }, [scene])

  useFrame((_, delta) => {
    const targetX = mouse.x * 10
    const targetZ = mouse.y * 10
    lastMouse.current = [
      lastMouse.current[0] + (targetX - lastMouse.current[0]) * Math.min(1, delta * 6),
      lastMouse.current[1] + (targetZ - lastMouse.current[1]) * Math.min(1, delta * 6),
    ]
    setMousePosition([lastMouse.current[0], lastMouse.current[1]])
  })

  const buildingCount = isMobile ? motion.counts.buildingsMobile : motion.counts.buildingsDesktop
  const streamCount = isMobile ? motion.counts.streamsMobile : motion.counts.streamsDesktop
  const accent = pageAccent(pathname)

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#00ff8c" intensity={0.2} />

      <StreetPlane color={accent} />
      <MonoRail motion={motion} paused={paused} color={accent} />
      <Billboard position={[-6, 3.2, -8]} color="#00ffff" mouse={mousePosition} />
      <Billboard position={[5, 2.6, -9]} color="#00ff8c" mouse={mousePosition} size={[2.4, 1.0]} />

      <CyberCity mousePosition={mousePosition} currentPage={pathname} motion={motion} paused={paused} buildingCount={buildingCount} />
      <GlyphParticles motion={motion} paused={paused} color={accent} count={140} />
      <AsciiGlyphs motion={motion} paused={paused} color={accent} count={260} spread={26} size={20} />

      {Array.from({ length: streamCount }).map((_, i) => (
        <CodeLine
          key={i}
          position={[((Math.random() - 0.5) * 15) as number, (Math.random() * 12 - 6) as number, ((Math.random() - 0.5) * 10) as number]}
          currentPage={pathname}
          motion={motion}
          paused={paused}
        />
      ))}

      {navItems.map((item, index) => {
        const spacing = isMobile ? 1.0 : 1.2
        const pos: [number, number, number] = [(index - (navItems.length - 1) / 2) * spacing, 0, 0]
        return (
          <NavItem3D
            key={item.path}
            name={item.name}
            position={pos}
            active={pathname === item.path}
            onClick={() => onNavigate(item.path)}
            onPositionUpdate={onNavPositionUpdate}
            motion={motion}
            paused={paused}
          />
        )
      })}
    </>
  )
}

// -----------------------------------------------------------------------------
// Error boundary
// -----------------------------------------------------------------------------
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("MetaverseNav 3D Error:", error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// ──────────────────────────────────────────────────────────────
// Dock (bottom-left) — SHARP / SQUARE version
// ──────────────────────────────────────────────────────────────
function HudDock({
  motionLevel,
  setMotionLevel,
  onExit,
  pageColor = "#00ffff",
}: {
  motionLevel: MotionLevel
  setMotionLevel: React.Dispatch<React.SetStateAction<MotionLevel>>
  onExit: () => void
  pageColor?: string
}) {
  // Base label chip (left "MOTION")
  const chipBase =
    "px-2.5 py-1.5 md:px-2 md:py-1 text-[11px] leading-none font-mono tracking-[0.15em] select-none whitespace-nowrap border rounded-none"

  // Segmented buttons (OFF/CALM/NORM)
  const segBtn = (active: boolean) =>
    [
      // bigger *hit target* first
      "relative inline-flex items-center justify-center",
      "min-h-11 md:min-h-9",        // 44px mobile / 36px desktop
      "px-4 py-2.5 md:px-3 md:py-1.5",
      "-mx-0.5",                    // pull spacing back a hair so it doesn’t look chunky
      "border rounded-none transition-colors",
      active
        ? "bg-white/5 border-emerald-300/70 text-emerald-200"
        : "border-white/20 text-white/75 hover:text-white",
      // keyboard focus
      "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px]",
      "focus-visible:[outline-color:var(--hud-accent)]",
    ].join(" ")

  // Exit button (also 44/36px)
  const exitBtn =
    "relative inline-flex items-center justify-center min-h-11 md:min-h-9 px-4 py-2.5 md:px-3 md:py-1.5" +
    " border rounded-none text-[11px] font-mono tracking-[0.15em] transition-colors" +
    " focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px]"

  return (
    <div
      className="pointer-events-auto fixed left-3 z-[80] flex flex-wrap items-center gap-2 md:gap-1.5"
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      }}
    >
      {/* Outer frame with clip-notch */}
      <div
        className="relative flex items-center gap-1.5 bg-black/55 border p-1.5 rounded-none"
        style={{
          borderColor: `${pageColor}40`,
          boxShadow: `inset 0 0 0 1px ${pageColor}1f`,
          clipPath:
            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
          WebkitClipPath:
            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        }}
        role="radiogroup"
        aria-label="Motion level"
      >
        {/* scanline overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
              backgroundSize: "100% 3px",
              mixBlendMode: "screen",
              opacity: 0.08,
              animation: "scan 6s linear infinite",
            }}
          />
        </div>

        <span
          className={chipBase}
          style={{ borderColor: `${pageColor}44`, color: `${pageColor}` }}
        >
          MOTION
        </span>

        <div className="flex items-center">
          <button
            className={segBtn(motionLevel === "off")}
            aria-pressed={motionLevel === "off"}
            role="radio"
            onClick={() => setMotionLevel("off")}
          >
            OFF
          </button>
          <button
            className={segBtn(motionLevel === "calm")}
            aria-pressed={motionLevel === "calm"}
            role="radio"
            onClick={() => setMotionLevel("calm")}
          >
            CALM
          </button>
          <button
            className={segBtn(motionLevel === "normal")}
            aria-pressed={motionLevel === "normal"}
            role="radio"
            onClick={() => setMotionLevel("normal")}
          >
            NORM
          </button>
        </div>

        <div className="mx-2 h-5 w-px bg-white/10" />

        <button
          onClick={onExit}
          className={exitBtn}
          style={{
            borderColor: "#f44/60",
            color: "#ff7b7b",
            boxShadow:
              "inset 0 0 10px rgba(255,0,0,0.15), 0 0 18px rgba(255,0,0,0.12)",
          }}
        >
          EXIT
        </button>
      </div>

      <div
        className="hidden md:block text-[10px] text-white/60 px-2 py-1 border rounded-none"
        style={{ borderColor: `${pageColor}33` }}
      >
        1–4 to jump • Click bars to travel
      </div>

      {/* Local keyframes for the scanline */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Top-level
// -----------------------------------------------------------------------------
export function MetaverseNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMetaverse, setShowMetaverse] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [canRender3D, setCanRender3D] = useState(false)

  const navPositionsRef = useRef<Record<string, { x: number; y: number; hovered: boolean }>>({})
  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const rafRef = useRef<number | null>(null)
  const hasShownInitialMetaverse = useRef(false)

  const prefersReduced = useReducedMotion()
  const [motionLevel, setMotionLevel] = useState<MotionLevel>("normal")
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (prefersReduced) setMotionLevel("off")
  }, [prefersReduced])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  // Auto-show metaverse ONLY on initial visit/refresh to homepage
  useEffect(() => {
    // Only show metaverse on homepage if it's the initial load and we haven't shown it yet
    if (pathname === "/" && !showMetaverse && !hasShownInitialMetaverse.current) {
      console.log("MetaverseNav: Initial visit to homepage, showing metaverse")
      hasShownInitialMetaverse.current = true
      setTransitioning(false)
      setTimeout(() => {
        setShowMetaverse(true)
      }, 100)
    }
  }, [pathname, showMetaverse])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        setCanRender3D(!!gl)
      } catch {
        setCanRender3D(false)
      }
    }
    checkMobile()
    checkWebGL()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navItems = [
    { name: "home", path: "/" },
    { name: "projects", path: "/projects" },
    { name: "blog", path: "/blog" },
    { name: "about", path: "/about" },
  ]

  const handleNavigate = (path: string) => {
    if (path === pathname) {
      // If clicking on current page, just close metaverse
      setShowMetaverse(false)
      setTransitioning(false)
      return
    }
    
    // Show loading transition, then navigate and close metaverse
    setTransitioning(true)
    setTimeout(() => {
      router.push(path)
      setShowMetaverse(false)
      setTransitioning(false)
    }, 500)
  }

  // --- Tweaked applyTransforms: per-chip hue on center chips ---
const lastStyles = useRef<Record<string, { x: number; y: number }>>({})
const applyTransforms = () => {
  rafRef.current = null

  navItems.forEach((item) => {
    const pos = navPositionsRef.current[item.name]
    const el = overlayRefs.current[item.name]
    if (!el) return

    if (pos) {
      // simple smoothing
      const last = lastStyles.current[item.name] || { x: pos.x, y: pos.y }
      const nx = last.x + (pos.x - last.x) * 0.6
      const ny = last.y + (pos.y - last.y) * 0.6
      lastStyles.current[item.name] = { x: nx, y: ny }

      el.style.display = "block"
      el.style.transform = `translate3d(${nx}px, ${ny}px, 0) translate(-50%, -50%)`

      // per-chip accent (ABOUT stays magenta, BLOG stays orange, etc.)
      const CHIP_ACCENT = pageAccent(item.path)
      const isActive = pathname === item.path

      const textColor = pos.hovered
        ? "#eaffff"
        : isActive
        ? CHIP_ACCENT
        : "rgba(214,246,246,0.92)"
      const borderColor = isActive ? `${CHIP_ACCENT}AA` : `${CHIP_ACCENT}55`
      const glow = isActive ? `${CHIP_ACCENT}66` : `${CHIP_ACCENT}22`

      Object.assign(el.style, {
        pointerEvents: "none",
        zIndex: "1000",
        fontSize: pos.hovered ? "13px" : "12px",
        letterSpacing: "0.12em",
        color: textColor,
        textShadow: "0 0 6px currentColor",
        transition: "color 0.15s ease, font-size 0.15s ease, transform 0.05s linear",
      } as Partial<CSSStyleDeclaration>)

      const chip = el.querySelector("[data-role='chip']") as HTMLDivElement
      if (chip) {
        Object.assign(chip.style, {
          padding: "6px 12px",
          borderRadius: "999px",
          border: `1px solid ${borderColor}`,
          background: "rgba(0,0,0,0.45)",
          boxShadow: `inset 0 0 12px ${glow}, 0 0 18px ${glow}`,
          backdropFilter: "blur(6px)",
        } as Partial<CSSStyleDeclaration>)
        chip.style.setProperty("-webkit-backdrop-filter", "blur(6px)")
      }

      const caret = el.querySelector("[data-role='caret']") as HTMLDivElement
      if (caret) {
        caret.style.opacity = isActive ? "1" : "0"
        caret.style.borderTopColor = CHIP_ACCENT
      }
    } else {
      el.style.display = "none"
    }
  })
}


  const handleNavPositionUpdate = (name: string, screenPos: { x: number; y: number }, hovered: boolean) => {
    navPositionsRef.current[name] = { ...screenPos, hovered }
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(applyTransforms)
  }

  useEffect(() => {
    const id = requestAnimationFrame(applyTransforms)
    return () => cancelAnimationFrame(id)
  }, [pathname, showMetaverse, transitioning])

  // Hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!showMetaverse) return
      const map: Record<string, string> = { "1": "/", "2": "/projects", "3": "/blog", "4": "/about" }
      if (map[e.key]) handleNavigate(map[e.key])
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [showMetaverse])

  const toggleMetaverse = () => {
    setTransitioning(false)
    setShowMetaverse((s) => !s)
  }
  const exitMetaverse = () => {
    setTransitioning(false)
    setShowMetaverse(false)
  }

  const brandRim = pageAccent(pathname)

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* inject unified HUD tokens */}
      <HUDStyleTokens />

      <header className="border-b border-border/40 backdrop-blur-sm h-20">
        <div className="container mx-auto px-4 h-full">
          <nav aria-label="Main navigation" className="flex items-center justify-between h-full">
            {/* keep old glitch brand you prefer */}
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
              <button
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>
            </div>

            <ul className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className={`command-prompt hover:text-primary transition-colors ${pathname === item.path ? "text-primary" : "text-white"}`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Overlay navigation (The Street) */}
      <motion.nav
        aria-label="Metaverse navigation"
        className="fixed inset-0 bg-black/90 z-50"
        initial={{ opacity: 0, clipPath: "circle(0% at 50% 0%)" }}
        animate={{
          opacity: showMetaverse ? 1 : 0,
          clipPath: showMetaverse ? "circle(150% at 50% 0%)" : "circle(0% at 50% 0%)",
          pointerEvents: showMetaverse ? "auto" : "none",
        }}
        transition={{ duration: 0.5 }}
      >
        <style jsx>{`
          /* Clip-notch (top-right cut) */
          .hud-notch {
            -webkit-clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
          }
          /* Optional diagonal glow so the notch is visible on dark */
          .hud-notch-accent {
            position: absolute;
            top: 0;
            right: 0;
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg, transparent 49%, rgba(0,255,200,0.45) 50%, transparent 52%);
            pointer-events: none;
            filter: drop-shadow(0 0 6px rgba(0,255,200,0.35));
            /* The accent sits inside the clipped corner, so it doesn't bleed */
          }
          /* Subtle breathing for the ribbon */
          @keyframes hudPulse {
            0%, 100% { filter: drop-shadow(0 0 0px rgba(0,255,200,0)); }
            50%      { filter: drop-shadow(0 0 6px rgba(0,255,200,0.35)); }
          }
        `}
        </style>

        {/* Status HUD (top-left) */}
        {showMetaverse && (
          <HUDOverlay
            motionLabel={motionLevel}
            pathname={pathname}
            accent={pageAccent(pathname)}   // same mapping as the dock
          />
        )}

        {/* Control Dock (bottom-left) */}
        <HudDock motionLevel={motionLevel} setMotionLevel={setMotionLevel} onExit={exitMetaverse} pageColor={pageAccent(pathname)} />

        <div className="w-full h-screen relative">
          {showMetaverse && (
            <ThreeErrorBoundary fallback={<div className="w-full h-screen bg-black flex items-center justify-center text-red-500">3D Navigation Error - Please refresh the page</div>}>
              {canRender3D ? (
                <>
                  <Canvas camera={{ fov: 75, near: 0.1, far: 1000 }}>
                    <Suspense fallback={null}>
                      <Street
                        navItems={navItems}
                        pathname={pathname}
                        onNavigate={handleNavigate}
                        isMobile={isMobile}
                        onNavPositionUpdate={handleNavPositionUpdate}
                        motion={MOTION_PRESETS[motionLevel]}
                        paused={motionLevel === "off" || paused}
                      />
                    </Suspense>
                  </Canvas>

                  {/* HTML chips anchored to 3D items */}
                  {!transitioning &&
                    navItems.map((item) => (
                      <div
                        key={item.path}
                        ref={(el) => {
                          overlayRefs.current[item.name] = el
                        }}
                        className="hud-chip hud-font hud-rim hud-scan hud-notch"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          transform: "translate(-50%, -50%)",
                          display: "none",
                          ["--hud" as any]: pageAccent(pathname),
                        } as React.CSSProperties}
                        aria-hidden
                      >
                        {item.name.toUpperCase()}
                      </div>
                    ))}
                </>
              ) : (
                <div className="w-full h-screen bg-black flex items-center justify-center text-yellow-500">WebGL not supported</div>
              )}
            </ThreeErrorBoundary>
          )}
        </div>

        <AnimatePresence>
          {transitioning && (
            <motion.div
              className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="status"
            >
              <div className="text-primary text-2xl font-bold glitch glitch-active" data-text="LOADING STREET...">
                LOADING STREET...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  )
}

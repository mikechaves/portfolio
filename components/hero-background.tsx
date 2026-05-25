"use client"

import { useEffect, useRef, useState } from "react"
import { useViewportSize } from "@/hooks/use-viewport-size"
import { createPortal } from "react-dom"
import * as THREE from "three"

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function createSeededRandom(seed: number) {
  let value = seed

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const gridRef = useRef<THREE.LineSegments | null>(null)
  const gridMaterialRef = useRef<THREE.LineBasicMaterial | null>(null)
  const particleMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  const frameRef = useRef<number>(0)
  const mousePosition = useRef({ x: 0, y: 0 })
  const viewportRef = useRef({ width: 1, height: 1 })
  const reducedMotionRef = useRef(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  )
  const viewport = useViewportSize()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    viewportRef.current = {
      width: Math.max(viewport.width, 1),
      height: Math.max(viewport.height, 1),
    }
    setIsMobile(viewport.width < 768)
  }, [viewport.height, viewport.width])

  useEffect(() => {
    if (!isMounted) return
    if (!containerRef.current) return
    if (sceneRef.current) return

    const random = createSeededRandom(isMobile ? 2407 : 8713)
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = reducedMotionQuery.matches

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      58,
      viewportRef.current.width / viewportRef.current.height,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 26)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      })
    } catch {
      return
    }

    sceneRef.current = scene
    cameraRef.current = camera
    renderer.setSize(viewportRef.current.width, viewportRef.current.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.15 : 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute("aria-hidden", "true")

    const container = containerRef.current
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const gridSize = isMobile ? 46 : 68
    const gridDivisions = isMobile ? 12 : 24
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff8c,
      transparent: true,
      opacity: isMobile ? 0.07 : 0.11,
    })
    gridMaterialRef.current = gridMaterial

    const gridGeometry = new THREE.BufferGeometry()
    const gridPositions: number[] = []
    const step = gridSize / gridDivisions
    const halfGrid = gridSize / 2

    for (let i = 0; i <= gridDivisions; i++) {
      const offset = i * step - halfGrid
      gridPositions.push(-halfGrid, offset, 0, halfGrid, offset, 0)
      gridPositions.push(offset, -halfGrid, 0, offset, halfGrid, 0)
    }

    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3))
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial)
    grid.rotation.x = Math.PI / 5
    grid.position.set(0, -3.5, -18)
    scene.add(grid)
    gridRef.current = grid

    const particleCount = reducedMotionRef.current ? (isMobile ? 90 : 220) : isMobile ? 170 : 520
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const baseSizes = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)
    const rotations = new Float32Array(particleCount)
    const types = new Float32Array(particleCount)
    const color = new THREE.Color()

    const xSpread = isMobile ? 26 : 42
    const ySpread = isMobile ? 24 : 34
    const zNear = isMobile ? 6 : 8
    const zDepth = isMobile ? 24 : 34
    const baseSize = isMobile ? 1.3 : 2.25
    const sizeVariation = isMobile ? 0.8 : 1.6

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      positions[i3] = (random() - 0.5) * xSpread
      positions[i3 + 1] = (random() - 0.5) * ySpread
      positions[i3 + 2] = zNear - random() * zDepth

      const accentRoll = random()
      if (accentRoll > 0.93) {
        color.setHSL(0.82, 0.85, 0.55 + random() * 0.18)
      } else if (accentRoll > 0.84) {
        color.setHSL(0.56, 0.85, 0.5 + random() * 0.18)
      } else {
        color.setRGB(0.05 + random() * 0.1, 0.62 + random() * 0.38, 0.34 + random() * 0.26)
      }

      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      baseSizes[i] = random() * sizeVariation + baseSize
      sizes[i] = baseSizes[i]
      speeds[i] = random() * 0.018 + 0.004
      rotations[i] = random() * Math.PI * 2
      types[i] = Math.floor(random() * 4)
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    particles.setAttribute("rotation", new THREE.BufferAttribute(rotations, 1))
    particles.setAttribute("type", new THREE.BufferAttribute(types, 1))

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        pixelRatio: { value: Math.min(window.devicePixelRatio || 1, isMobile ? 1.15 : 1.5) },
        globalOpacity: { value: isMobile ? 0.42 : 0.64 },
      },
      vertexShader: `
        attribute float size;
        attribute float rotation;
        attribute float type;

        varying vec3 vColor;
        varying float vRotation;
        varying float vType;

        uniform float pixelRatio;

        void main() {
          vColor = color;
          vRotation = rotation;
          vType = type;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vRotation;
        varying float vType;

        uniform float globalOpacity;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 uv = gl_PointCoord.xy - center;

          float s = sin(vRotation);
          float c = cos(vRotation);
          uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);

          float alpha = 0.0;

          if (vType < 1.0) {
            if (abs(uv.x) < 0.3 && abs(uv.y) < 0.3) {
              alpha = 0.65;
            }
          } else if (vType < 2.0) {
            if (abs(uv.x) < 0.05 && uv.y < 0.25 && uv.y > -0.25) {
              alpha = 0.7;
            }
          } else if (vType < 3.0) {
            vec2 p = abs(uv);
            if (p.x + p.y < 0.4) {
              alpha = 0.58;
            }
          } else {
            if ((abs(uv.x) < 0.1 && abs(uv.y) < 0.3) || (abs(uv.x) < 0.3 && abs(uv.y) < 0.1)) {
              alpha = 0.68;
            }
          }

          vec3 glow = vColor * 0.28;
          vec3 finalColor = mix(glow, vColor, alpha > 0.0 ? 1.0 : 0.0);
          gl_FragColor = vec4(finalColor, alpha * globalOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })
    particleMaterialRef.current = particleMaterial

    const pointCloud = new THREE.Points(particles, particleMaterial)
    scene.add(pointCloud)
    particlesRef.current = pointCloud

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / viewportRef.current.width) * 2 - 1
      mousePosition.current.y = -(event.clientY / viewportRef.current.height) * 2 + 1
    }

    const applyScrollState = () => {
      const viewportHeight = Math.max(viewportRef.current.height, 1)
      const scrollZone = clamp(window.scrollY / viewportHeight, 0, 4)
      const lowerPageCalm = clamp(scrollZone / 2.8, 0, 1)
      const heroIntensity = 1 - lowerPageCalm * (isMobile ? 0.48 : 0.58)
      const lowerDepth = clamp(scrollZone / 3.4, 0, 1)

      particleMaterial.uniforms.globalOpacity.value = (isMobile ? 0.4 : 0.62) * heroIntensity
      gridMaterial.opacity = (isMobile ? 0.065 : 0.105) * heroIntensity + 0.018

      camera.position.y = -lowerDepth * 2.2
      camera.position.z = 26 + lowerDepth * 3.5
      camera.rotation.z = mousePosition.current.x * 0.01

      pointCloud.position.y = lowerDepth * 1.4
      pointCloud.rotation.z = -lowerDepth * 0.07
      grid.position.y = -3.5 + lowerDepth * 1.8
      grid.rotation.z = lowerDepth * 0.04
    }

    const renderStill = () => {
      applyScrollState()
      renderer.render(scene, camera)
    }

    const handleScroll = () => {
      if (reducedMotionRef.current) {
        renderStill()
      }
    }

    const handleReducedMotionChange = () => {
      reducedMotionRef.current = reducedMotionQuery.matches
      if (reducedMotionRef.current) {
        renderStill()
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (document.hidden) return
      if (reducedMotionRef.current) {
        renderStill()
        return
      }

      const time = performance.now() * 0.001
      applyScrollState()

      pointCloud.rotation.y = time * 0.045 + mousePosition.current.x * 0.08
      pointCloud.rotation.x = mousePosition.current.y * 0.08

      const positionAttribute = pointCloud.geometry.attributes.position
      const sizeAttribute = pointCloud.geometry.attributes.size
      const rotationAttribute = pointCloud.geometry.attributes.rotation
      const particlePositions = positionAttribute.array as Float32Array
      const particleSizes = sizeAttribute.array as Float32Array
      const particleRotations = rotationAttribute.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        particlePositions[i3 + 1] += speeds[i] * 0.48

        if (particlePositions[i3 + 1] > ySpread / 2) {
          particlePositions[i3 + 1] = -ySpread / 2
          particlePositions[i3] = (random() - 0.5) * xSpread
          particlePositions[i3 + 2] = zNear - random() * zDepth
        }

        particleRotations[i] += 0.008 * (i % 2 === 0 ? 1 : -1)
        particleSizes[i] = (Math.sin(time * 1.35 + i) * 0.18 + 1.15) * (baseSizes[i] * 0.9)
      }

      positionAttribute.needsUpdate = true
      sizeAttribute.needsUpdate = true
      rotationAttribute.needsUpdate = true

      grid.position.x = Math.sin(time * 0.12) * (isMobile ? 0.18 : 0.32)
      grid.rotation.x = Math.PI / 5 + Math.sin(time * 0.08) * (isMobile ? 0.02 : 0.035)

      renderer.render(scene, camera)
    }

    if (reducedMotionRef.current) {
      renderStill()
    } else {
      animate()
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange)
      cancelAnimationFrame(frameRef.current)

      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }

      particles.dispose()
      particleMaterial.dispose()
      gridGeometry.dispose()
      gridMaterial.dispose()

      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      particlesRef.current = null
      gridRef.current = null
      gridMaterialRef.current = null
      particleMaterialRef.current = null
      frameRef.current = 0
    }
  }, [isMobile, isMounted])

  useEffect(() => {
    if (!cameraRef.current || !rendererRef.current) return

    const width = Math.max(viewport.width, 1)
    const height = Math.max(viewport.height, 1)
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.15 : 1.5)

    cameraRef.current.aspect = width / height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setPixelRatio(pixelRatio)
    rendererRef.current.setSize(width, height)

    if (particleMaterialRef.current?.uniforms) {
      particleMaterialRef.current.uniforms.pixelRatio.value = pixelRatio
    }
  }, [isMobile, viewport.height, viewport.width])

  if (!isMounted) return null

  return createPortal(
    <div className="home-webgl-stage fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        ref={containerRef}
        className="home-webgl-background absolute inset-0 z-0 overflow-hidden"
      />
      <div className="home-webgl-vignette" />
      <div className="home-corruption-overlay" />
      <div className="home-scan-distortion" />
    </div>,
    document.body,
  )
}

// @ts-nocheck
"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

// Import THREE from the same source to avoid duplicate instances
export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const gridRef = useRef<THREE.LineSegments | null>(null)
  const frameRef = useRef<number>(0)
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 20
    cameraRef.current = camera

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0) // Transparent background
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create cyberpunk grid
    const gridSize = 40
    const gridDivisions = isMobile ? 10 : 20 // Fewer grid lines on mobile
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff8c,
      transparent: true,
      opacity: isMobile ? 0.08 : 0.1, // Slightly more subtle on mobile
    })

    const gridGeometry = new THREE.BufferGeometry()
    const gridPositions = []

    // Create grid lines
    const step = gridSize / gridDivisions
    const halfGrid = gridSize / 2

    // Create horizontal lines
    for (let i = 0; i <= gridDivisions; i++) {
      const y = i * step - halfGrid
      gridPositions.push(-halfGrid, y, 0)
      gridPositions.push(halfGrid, y, 0)
    }

    // Create vertical lines
    for (let i = 0; i <= gridDivisions; i++) {
      const x = i * step - halfGrid
      gridPositions.push(x, -halfGrid, 0)
      gridPositions.push(x, halfGrid, 0)
    }

    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3))
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial)
    grid.rotation.x = Math.PI / 8 // Slight tilt for perspective
    grid.position.z = -10
    scene.add(grid)
    gridRef.current = grid

    // Create particles - reduce count on mobile
    const particleCount = isMobile ? 200 : 600
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)
    const rotations = new Float32Array(particleCount)
    const types = new Float32Array(particleCount)

    const color = new THREE.Color()

    // Adjust particle distribution for mobile
    const xSpread = isMobile ? 20 : 30
    const ySpread = isMobile ? 15 : 20
    const zSpread = isMobile ? 10 : 20

    // Adjust particle size for mobile
    const baseSize = isMobile ? 1.5 : 3
    const sizeVariation = isMobile ? 0.5 : 1.5

    for (let i = 0; i < particleCount; i++) {
      // Position - create a more layered depth effect
      positions[i * 3] = (Math.random() - 0.5) * xSpread // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * ySpread // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * zSpread // z - varying depths

      // Color - mostly our cyberpunk green with occasional variations
      if (Math.random() > 0.85) {
        // Occasional blue or purple particles
        color.setHSL(0.6 + Math.random() * 0.2, 1.0, 0.5 + Math.random() * 0.3)
      } else {
        // Mostly green particles with varying brightness
        color.setRGB(0, 1 * (0.5 + Math.random() * 0.5), 0.55 * (0.5 + Math.random() * 0.5))
      }

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Size - varying particle sizes, smaller on mobile
      sizes[i] = Math.random() * sizeVariation + baseSize

      // Speed - varying particle speeds
      speeds[i] = Math.random() * 0.02 + 0.005

      // Rotation - random initial rotation
      rotations[i] = Math.random() * Math.PI * 2

      // Type - different particle shapes (0-3)
      types[i] = Math.floor(Math.random() * 4)
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    particles.setAttribute("rotation", new THREE.BufferAttribute(rotations, 1))
    particles.setAttribute("type", new THREE.BufferAttribute(types, 1))

    // Create custom shader material for cyberpunk particles
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio },
      },
      vertexShader: `
        attribute float size;
        attribute float rotation;
        attribute float type;
        
        varying vec3 vColor;
        varying float vRotation;
        varying float vType;
        
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          vRotation = rotation;
          vType = type;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vRotation;
        varying float vType;
        
        void main() {
          // Center the coordinate system
          vec2 center = vec2(0.5, 0.5);
          vec2 uv = gl_PointCoord.xy - center;
          
          // Apply rotation
          float s = sin(vRotation);
          float c = cos(vRotation);
          uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
          
          // Determine shape based on type
          float alpha = 0.0;
          
          // Type 0: Square/Rectangle (digital pixel)
          if (vType < 1.0) {
            if (abs(uv.x) < 0.3 && abs(uv.y) < 0.3) {
              alpha = 0.6;
            }
          } 
          // Type 1: Binary (1/0)
          else if (vType < 2.0) {
            // Create a "1" shape
            if (abs(uv.x) < 0.05 && uv.y < 0.25 && uv.y > -0.25) {
              alpha = 0.7;
            }
          }
          // Type 2: Triangle
          else if (vType < 3.0) {
            vec2 p = abs(uv);
            if (p.x + p.y < 0.4) {
              alpha = 0.6;
            }
          }
          // Type 3: Plus/Cross
          else {
            if ((abs(uv.x) < 0.1 && abs(uv.y) < 0.3) || (abs(uv.x) < 0.3 && abs(uv.y) < 0.1)) {
              alpha = 0.7;
            }
          }
          
          // Add a subtle glow effect
          vec3 glow = vColor * 0.3;
          vec3 finalColor = mix(glow, vColor, alpha > 0.0 ? 1.0 : 0.0);
          
          // Reduce opacity on mobile
          gl_FragColor = vec4(finalColor, alpha * ${isMobile ? "0.5" : "0.7"});
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })

    // Create point cloud
    const pointCloud = new THREE.Points(particles, particleMaterial)
    scene.add(pointCloud)
    particlesRef.current = pointCloud

    // Track mouse movement for subtle interactivity
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation function
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      if (particleMaterial.uniforms) {
        particleMaterial.uniforms.time.value = time
      }

      if (particlesRef.current) {
        // Subtle rotation influenced by mouse position
        particlesRef.current.rotation.y = time * 0.05 + mousePosition.current.x * 0.1
        particlesRef.current.rotation.x = mousePosition.current.y * 0.1

        // Update particle positions for a flowing effect
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
        const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array
        const rotations = particlesRef.current.geometry.attributes.rotation.array as Float32Array

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3

          // Move particles upward with varying speeds
          positions[i3 + 1] += speeds[i] * 0.5

          // Reset particles that go out of bounds
          if (positions[i3 + 1] > 10) {
            positions[i3 + 1] = -10
            positions[i3] = (Math.random() - 0.5) * (isMobile ? 20 : 30)
            positions[i3 + 2] = (Math.random() - 0.5) * (isMobile ? 10 : 20)
          }

          // Rotate particles
          rotations[i] += 0.01 * (i % 2 === 0 ? 1 : -1)

          // Pulse size slightly - reduced effect on mobile
          const pulseIntensity = isMobile ? 0.2 : 0.3
          sizes[i] =
            (Math.sin(time * 1.5 + i) * pulseIntensity + 1.2) *
            (Math.random() * (isMobile ? 0.8 : 1.5) + (isMobile ? 0.3 : 0.5))
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true
        particlesRef.current.geometry.attributes.size.needsUpdate = true
        particlesRef.current.geometry.attributes.rotation.needsUpdate = true
      }

      if (gridRef.current) {
        // Subtle grid movement - reduced on mobile
        const movementIntensity = isMobile ? 0.3 : 0.5
        gridRef.current.position.y = Math.sin(time * 0.2) * movementIntensity
        gridRef.current.rotation.x = Math.PI / 8 + Math.sin(time * 0.1) * (isMobile ? 0.03 : 0.05)
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)

      if (particleMaterial.uniforms) {
        particleMaterial.uniforms.pixelRatio.value = window.devicePixelRatio
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(frameRef.current)

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose()
        ;(particlesRef.current.material as THREE.Material).dispose()
      }

      if (gridRef.current) {
        gridRef.current.geometry.dispose()
        ;(gridRef.current.material as THREE.Material).dispose()
      }
    }
  }, [isMobile]) // Re-run effect when isMobile changes

  return <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true" />
}

import * as THREE from './vendor/three.module.min.js'

// Two real spotlights, with inexpensive translucent geometry making their paths visible.
// The artwork keeps an emissive floor; illumination reveals its surface without bleaching it.
export function createPremiereLighting(scene, frames, initialProject) {
  const warm = new THREE.Color('#ffd5a5')
  const fillColor = new THREE.Color('#ffb977')
  const targetFill = fillColor.clone()
  const axis = new THREE.Vector3(0, 1, 0)
  const direction = new THREE.Vector3()
  const aim = new THREE.Vector3()
  let width = 1, height = 1, floorY = 0, time = 0, selected = initialProject
  let focus = 0, focusTarget = 0, initialized = false

  const beamMaterial = color => new THREE.ShaderMaterial({
    uniforms: { tint: { value: color }, strength: { value: .055 } },
    vertexShader: `varying vec2 vUv; varying vec3 vNormal; varying vec3 vView;
      void main() {
        vUv = uv;
        vec4 view = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal); vView = -view.xyz;
        gl_Position = projectionMatrix * view;
      }`,
    fragmentShader: `uniform vec3 tint; uniform float strength;
      varying vec2 vUv; varying vec3 vNormal; varying vec3 vView;
      void main() {
        float softSides = pow(abs(dot(normalize(vNormal), normalize(vView))), 1.8);
        float ends = smoothstep(0.0, .24, vUv.y) * (1.0 - smoothstep(.8, 1.0, vUv.y));
        gl_FragColor = vec4(tint, softSides * ends * strength);
      }`,
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
  })
  const poolMaterial = color => new THREE.ShaderMaterial({
    uniforms: { tint: { value: color }, strength: { value: .16 } },
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform vec3 tint; uniform float strength;
      void main() {
        float r = length((vUv - .5) * 2.0);
        float falloff = pow(max(0.0, 1.0 - r), 3.0);
        gl_FragColor = vec4(tint, falloff * strength);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })
  const lights = [warm, fillColor].map((color, index) => {
    // Artistic attenuation: no shadow maps, extra render targets, or postprocessing passes.
    const light = new THREE.SpotLight(color, index ? 1.7 : 3.1, 0, index ? .49 : .42, .9, 0)
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(.015, 1, 1, 32, 1, true), beamMaterial(color))
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), poolMaterial(color))
    const fixture = new THREE.Group()
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(7, 9, 18, 16), new THREE.MeshStandardMaterial({ color: '#302b30', metalness: .7, roughness: .32 }))
    const aperture = new THREE.Mesh(new THREE.CircleGeometry(5, 16), new THREE.MeshBasicMaterial({ color }))
    aperture.rotation.x = Math.PI / 2
    aperture.position.y = -9.1
    fixture.add(housing, aperture)
    pool.rotation.x = -Math.PI * .44
    beam.renderOrder = 2
    pool.renderOrder = 1
    scene.add(light, light.target, beam, pool, fixture)
    return { light, beam, pool, fixture }
  })
  for (const item of frames) item.lightWeight = item.element.dataset.theaterWork === selected ? 1 : 0

  function update(delta = 0, ambient = false, snap = false) {
    if (ambient) time += Math.min(delta, .05)
    const blend = snap || !initialized ? 1 : 1 - Math.exp(-delta * 8)
    const target = frames.find(item => item.element.dataset.theaterWork === selected) || frames[0]
    focus += (focusTarget - focus) * blend
    fillColor.lerp(targetFill, blend)
    for (const item of frames) {
      const weight = item === target ? 1 : 0
      item.lightWeight += (weight - item.lightWeight) * blend
      item.art.material.emissiveIntensity = .48 + .20 * item.lightWeight
      item.frame.material.emissiveIntensity = .025 + .12 * item.lightWeight
      item.frame.material.roughness = .38 - .13 * item.lightWeight
    }
    const drift = Math.sin(time * .21)
    const breathe = Math.cos(time * .17)
    for (const [index, rig] of lights.entries()) {
      const { light, beam, pool, fixture } = rig
      const side = index ? 1 : -1
      light.position.set(side * width * .4, height * .39, 130)
      aim.set(
        target.group.position.x + side * target.art.scale.x * .19 + (index ? 32 * breathe : 22 * drift),
        target.group.position.y + target.art.scale.y * (index ? .1 : .24),
        target.group.position.z + 9,
      )
      light.target.position.lerp(aim, blend)
      light.intensity = (index ? 1.7 : 3.1) * (1 - focus * .13)
      const length = direction.subVectors(light.position, light.target.position).length()
      beam.position.copy(light.position).add(light.target.position).multiplyScalar(.5)
      beam.quaternion.setFromUnitVectors(axis, direction.normalize())
      fixture.position.copy(light.position)
      fixture.quaternion.copy(beam.quaternion)
      beam.scale.set(length * Math.tan(light.angle) * .58, length, length * Math.tan(light.angle) * .58)
      beam.material.uniforms.strength.value = (index ? .09 : .15) * (1 - focus * .25)
      // The pool sits on the same inclined floor as the mirror. Its position follows the lit panel.
      const z = 145 + index * 70
      pool.position.set(light.target.position.x + side * 30, floorY - z * Math.tan(Math.PI * .06) + 2, z)
      pool.rotation.z = side * .17
      pool.scale.set(target.art.scale.x * (index ? 1.05 : 1.35), 350, 1)
      pool.material.uniforms.strength.value = (index ? .13 : .28) * (1 - focus * .15)
    }
    initialized = true
  }
  return {
    select(id) { selected = id },
    layout(w, h, y) { width = w; height = h; floorY = y },
    setFocus(open, lens) {
      focusTarget = open ? 1 : 0
      targetFill.set(lens === 'xr-accessibility' ? '#edc8c2' : lens === 'game-ux-creator-systems' ? '#f0bb94' : '#ffb977')
    },
    update,
  }
}

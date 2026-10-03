import * as THREE from './vendor/three.module.min.js'
import { Reflector } from './vendor/Reflector.js'

// Portfolio key art on dimensional metal frames. HTML remains the navigation layer.
export async function createTheater(root, { onFailure }) {
  const mount = root.querySelector('[data-theater-canvas]')
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 2, 1, 6000)
  camera.position.z = 1400
  const events = new AbortController()
  const loader = new THREE.TextureLoader()
  let observer, floor
  const frames = []
  const resources = new Set()
  const ambient = new THREE.HemisphereLight('#e9dffb','#1b1426',2.5)
  scene.add(ambient)
  const key = new THREE.DirectionalLight('#ffc08c',4)
  key.position.set(-700,600,800);scene.add(key)
  const rim = new THREE.DirectionalLight('#a49bff',3)
  rim.position.set(700,200,400);scene.add(rim)
  let disposed = false, visible = true, paused = false, raf = 0, last = 0, targetX=0, targetY=0, currentX=0, currentY=0
  let layoutUntil = 0, canvasWidth = 0, canvasHeight = 0
  try {
    const loads = await Promise.allSettled([...root.querySelectorAll('[data-theater-work]')].map(async (element) => {
      const image = element.querySelector('img')
      await image.decode()
      const source = image.currentSrc || image.src
      const texture = await loader.loadAsync(source)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = Math.min(4,renderer.capabilities.getMaxAnisotropy())
      resources.add(texture)
      const group = new THREE.Group()
      const metal = new THREE.MeshStandardMaterial({color:'#3d3542',metalness:.78,roughness:.24})
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),metal)
      const art = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({map:texture}))
      art.position.z=7
      group.add(frame,art);scene.add(group)
      const item = {element,group,frame,art,texture,source,request:0,baseX:0,baseY:0,rotation:0}
      frames.push(item)
      image.addEventListener('load', async () => {
        const source = image.currentSrc || image.src
        if (source === item.source) return
        const request = ++item.request
        try {
          const replacement = await loader.loadAsync(source)
          if (disposed || request !== item.request) { replacement.dispose(); return }
          replacement.colorSpace = THREE.SRGBColorSpace
          replacement.anisotropy = texture.anisotropy
          resources.delete(item.texture); item.texture.dispose()
          item.texture = replacement; item.source = source
          item.art.material.map = replacement; item.art.material.needsUpdate = true
          resources.add(replacement)
          resize()
        } catch { if (!disposed) onFailure() }
      }, { signal: events.signal })
    }))
    if (loads.some(result=>result.status==='rejected')) throw new Error('Project texture unavailable')
  } catch(error) { dispose(); throw error }
  if (!root.isConnected) { dispose(); throw new Error('Scene removed') }
  mount.append(renderer.domElement)
  renderer.domElement.setAttribute('aria-label','Dimensional frames and reflections for the three featured projects')
  floor = new Reflector(new THREE.PlaneGeometry(4200,2600),{color:'#473849',textureWidth:640,textureHeight:320,clipBias:.003})
  floor.rotation.x=-Math.PI/2
  floor.position.set(0,-170,0)
  // An inclined mirror gives a restrained, physically coherent reflection beneath the frames.
  floor.rotation.x=-Math.PI*.44
  scene.add(floor)
  floor.material.transparent=true
  floor.material.depthWrite=false
  floor.material.fragmentShader=floor.material.fragmentShader.replace('gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );', 'gl_FragColor = vec4( blendOverlay( base.rgb, color ), base.a * 0.2 );')
  function resize() {
    if (disposed) return
    measureLayout()
    renderOnce()
  }
  function measureLayout() {
    const bounds=mount.getBoundingClientRect(), width=Math.max(1,bounds.width),height=Math.max(1,bounds.height)
    if(width!==canvasWidth||height!==canvasHeight){renderer.setSize(width,height,false);canvasWidth=width;canvasHeight=height}
    camera.aspect=width/height;camera.position.set(0,0,height/(2*Math.tan(Math.PI/9)));camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld(true)
    for (const item of frames) {
      const rect=item.element.querySelector('.theater-picture').getBoundingClientRect()
      const matrix=new DOMMatrixReadOnly(getComputedStyle(item.element).transform)
      item.rotation=Math.atan2(-matrix.m13,matrix.m11)
      item.baseX=rect.left-bounds.left+rect.width/2-width/2
      item.baseY=height/2-(rect.top-bounds.top+rect.height/2)
      const w=rect.width/Math.cos(item.rotation),h=rect.height
      item.frame.scale.set(w+5,h+5,12);item.art.scale.set(w,h,1)
      const aspect=item.texture.image.naturalWidth/item.texture.image.naturalHeight,cardAspect=w/h
      item.texture.repeat.set(Math.min(1,cardAspect/aspect),Math.min(1,aspect/cardAspect))
      const position=getComputedStyle(item.element.querySelector('img')).objectPosition.split(' ').map(parseFloat)
      item.texture.offset.set((1-item.texture.repeat.x)*(position[0]/100),(1-item.texture.repeat.y)*(1-position[1]/100))
      item.group.position.set(item.baseX,item.baseY,matrix.m43)
      item.group.rotation.y=item.rotation
      item.group.rotation.z=-Math.atan2(matrix.m12,matrix.m22)
      // Keep the accessible HTML hit regions aligned with the perspective-rendered planes.
      for(let pass=0;pass<3;pass++){
        item.group.updateMatrixWorld(true)
        const corners=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([x,y])=>new THREE.Vector3(x,y,0).applyMatrix4(item.art.matrixWorld).project(camera))
        const xs=corners.map(p=>p.x*width/2),ys=corners.map(p=>p.y*height/2)
        const left=Math.min(...xs),right=Math.max(...xs),bottom=Math.min(...ys),top=Math.max(...ys)
        const sx=rect.width/(right-left),sy=rect.height/(top-bottom)
        item.art.scale.x*=sx;item.art.scale.y*=sy;item.frame.scale.x=item.art.scale.x+5;item.frame.scale.y=item.art.scale.y+5
        item.group.position.x+=item.baseX-(left+right)/2;item.group.position.y+=item.baseY-(top+bottom)/2
      }
    }
    const bottom=Math.min(...frames.map(i=>i.baseY-i.frame.scale.y/2))
    floor.position.y=bottom-9
    moveCamera()
  }
  observer=new ResizeObserver(resize);observer.observe(root)
  function renderOnce() { if(!disposed) {try {renderer.render(scene,camera)} catch {onFailure()}} }
  function tick(time) {
    raf=0
    if(disposed||!visible||(paused&&!layoutUntil))return
    if(time-last>32) {
      last=time
      if(!paused){currentX+=(targetX-currentX)*.055;currentY+=(targetY-currentY)*.055}
      if(layoutUntil){measureLayout();if(time>=layoutUntil)layoutUntil=0}
      moveCamera()
      renderOnce()
    }
    if(!paused||layoutUntil)raf=requestAnimationFrame(tick)
  }
  function moveCamera() {
    camera.position.x=currentX*7;camera.position.y=currentY*3
    camera.lookAt(0,0,0)
  }
  function run() {cancelAnimationFrame(raf);raf=0;if(visible&&(!paused||layoutUntil)&&!disposed)raf=requestAnimationFrame(tick)}
  function dispose() {
    if(disposed)return;disposed=true;cancelAnimationFrame(raf)
    observer?.disconnect();events.abort()
    scene.traverse(object=>{object.geometry?.dispose();if(object.material)for(const material of(Array.isArray(object.material)?object.material:[object.material]))material.dispose()})
    resources.forEach(resource=>resource.dispose());floor?.getRenderTarget().dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()
  }
  renderer.domElement.addEventListener('webglcontextlost',(event)=>{if(disposed)return;event.preventDefault();onFailure()},{once:true})
  resize();run()
  return {
    setPointer(x,y){targetX=x;targetY=y},
    setVisible(value){visible=value;if(value)resize();run()},
    setPaused(value){paused=value;run()},
    transitionLayout(duration){layoutUntil=performance.now()+duration;run()},
    setLens(id){key.color.set(id==='xr-accessibility'?'#c3c4ff':id==='game-ux-creator-systems'?'#e3b0ef':'#ffc08c');renderOnce()},
    dispose
  }
}

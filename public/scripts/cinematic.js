/* Real HTML links, a progressive carousel, and an optional dimensional scene. */
(() => {
  if (window.__cinematicMounted) return
  window.__cinematicMounted = true
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  const narrow = matchMedia('(max-width: 700px)')
  const coarse = matchMedia('(pointer: coarse)')
  const seen = new WeakSet(), scenes = new Map()
  const animate = () => !reduce.matches && !navigator.connection?.saveData
  let motionPaused = false
  try { motionPaused = sessionStorage.getItem('portfolio:motion-paused') === 'true' } catch { /* Optional preference storage. */ }
  const rememberPause = value => {
    motionPaused = value
    try { sessionStorage.setItem('portfolio:motion-paused', String(value)) } catch { /* Controls still work without storage. */ }
  }
  let modulePromise, graphicsPromise
  const acceleratedGraphics = () => graphicsPromise ??= new Promise(resolve => {
    if (typeof Worker !== 'function' || typeof OffscreenCanvas !== 'function') { resolve(null); return }
    let worker
    const finish = value => { clearTimeout(timeout); worker?.terminate(); resolve(value) }
    const timeout = setTimeout(() => finish(null), 3000)
    try {
      worker = new Worker('/scripts/project-theater-capability.js')
      worker.onmessage = event => finish(typeof event.data === 'boolean' ? event.data : null)
      worker.onerror = event => { event.preventDefault(); finish(null) }
    } catch { finish(null) }
  })
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = scenes.get(entry.target)
      if (state) {
        state.visible = entry.isIntersecting
        state.api?.setVisible(state.visible && !document.hidden)
        state.schedule()
        if (state.visible) state.load()
      } else if (entry.isIntersecting) {
        if (animate() && (!entry.target.matches('[data-premiere-opening]') || !motionPaused)) entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    }
  }, { threshold: .03 }) : null

  function setupScene(root) {
    const track = root.querySelector('[data-theater-track]')
    if (!track) return
    const works = [...root.querySelectorAll('[data-theater-work]')]
    const button = root.querySelector('[data-theater-motion]')
    const label = root.querySelector('[data-theater-motion-label]')
    const slideStatus = root.querySelector('[data-theater-slide-status]')
    const counter = root.querySelector('[data-theater-counter]')
    const initial = Math.max(0, works.findIndex(work => work.dataset.theaterSlot === 'center'))
    // A system suspension must not become a visitor's pause preference.
    const state = { api: null, active: initial, visible: true, visitorPaused: motionPaused, paused: !animate() || motionPaused, hovering: false, loading: false, failed: false, generation: 0 }
    const events = new AbortController()
    const focusPanel = document.querySelector('#adaptive-focus')
    let sceneController
    let timer, touch, suppressClickUntil = 0
    const clearTimer = () => { clearTimeout(timer); timer = undefined }
    const sync = () => {
      state.paused = state.visitorPaused || !animate()
      button.hidden = !animate()
      button.setAttribute('aria-pressed', String(state.paused))
      button.setAttribute('aria-label', state.paused ? 'Resume carousel' : 'Pause carousel')
      label.textContent = state.paused ? 'Play' : 'Pause'
      root.querySelector('[data-theater-play]').hidden = !state.paused
      root.querySelector('[data-theater-pause]').hidden = state.paused
      root.dataset.theaterPaused = String(state.paused)
      state.api?.setPaused(state.paused)
    }
    state.schedule = () => {
      clearTimer()
      if (state.paused || state.hovering || !state.visible || document.hidden || !animate()) return
      timer = setTimeout(() => select(state.active + 1, false), 7000)
    }
    const pause = () => { state.visitorPaused = true; clearTimer(); sync() }
    let journey, rotations = 0, animations = []
    const ease = t => t * t * (3 - 2 * t)
    const currentRotation = now => journey
      ? journey.from + (journey.to - journey.from) * ease(Math.min(1, Math.max(0, (now - journey.start) / journey.duration)))
      : rotations
    // All three panels share one continuous route. The wrapping neighbor recedes
    // behind the two front panels instead of cutting across their artwork.
    const pose = (index, rotation) => {
      const phase = ((index - initial - rotation) % works.length + works.length) % works.length
      const mobile = narrow.matches
      const center = { x:50, width:mobile ? 88 : 52, top:3, height:mobile ? 94 : 80, y:mobile ? -3 : -4, z:1, depth:20 }
      const side = { width:mobile ? 78 : 25, top:mobile ? 12 : 19, height:mobile ? 77 : 64 }
      let p
      if (phase <= 1 || phase >= 2) {
        const right = phase <= 1, t = right ? phase : 3 - phase
        const mix = (a,b) => a + (b-a) * t
        p = { x:mix(center.x, right ? (mobile ? 137 : 87.5) : (mobile ? -37 : 12.5)), width:mix(center.width,side.width), top:mix(center.top,side.top), height:mix(center.height,side.height), y:mix(center.y,(right ? -1 : 1)*(mobile ? 12 : 18)), z:mix(1,right ? -1 : 1), depth:mix(20,0) }
      } else {
        const t = phase - 1, arc = Math.sin(t * Math.PI)
        p = { x:(mobile ? 137 : 87.5) - (mobile ? 174 : 75)*t, width:side.width - (mobile ? 36 : 10)*arc, top:side.top + 5*arc, height:side.height - 14*arc, y:(2*t-1)*(mobile ? 12 : 18), z:2*t-1, depth:-340*arc }
      }
      return { left:`${p.x-p.width/2}%`, width:`${p.width}%`, top:`${p.top}%`, height:`${p.height}%`, transform:`translateZ(${p.depth}px) rotateY(${p.y}deg) rotateZ(${p.z}deg)` }
    }
    state.finishTransition = () => {
      animations.forEach(animation => animation.cancel()); animations = []; journey = null
      rotations = (state.active - initial + works.length) % works.length
      delete root.dataset.theaterTransitioning
    }
    const travel = delta => {
      const now = document.timeline.currentTime ?? performance.now()
      const from = currentRotation(now)
      rotations += delta
      animations.forEach(animation => animation.cancel())
      if (!animate() || typeof works[0].animate !== 'function') { state.finishTransition(); return 0 }
      const duration = Math.min(1250, 900 * Math.max(.7, Math.abs(rotations - from)))
      const trip = journey = { from, to:rotations, start:now, duration }
      root.dataset.theaterTransitioning = 'true'
      animations = works.map((work, index) => {
        const keyframes = Array.from({ length:49 }, (_, frame) => pose(index, from + (rotations-from)*ease(frame/48)))
        const animation = work.animate(keyframes, { duration, easing:'linear' })
        animation.startTime = now
        return animation
      })
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (journey !== trip) return
        journey = null; animations = []; delete root.dataset.theaterTransitioning
      }).catch(() => { /* A newer selection takes over from the current pose. */ })
      return duration
    }
    function select(index, manual = true) {
      if (manual) pause()
      const next = (index + works.length) % works.length
      const changed = next !== state.active
      const delta = (next - state.active + works.length) % works.length === 1 ? 1 : -1
      state.active = next
      works.forEach((work, i) => {
        const relative = (i - next + works.length) % works.length
        work.dataset.theaterSlot = relative === 0 ? 'center' : relative === 1 ? 'right' : 'left'
        if (i === next) {
          const image = work.querySelector('img')
          // Load larger cover variants only when a project takes the center position.
          image.sizes = '(max-width: 700px) 90vw, 52vw'
          if (!narrow.matches && !image.srcset.includes(work.dataset.theaterFullSrc)) image.srcset += `, ${work.dataset.theaterFullSrc} 1672w`
        }
      })
      root.dataset.theaterActive = works[next].dataset.theaterWork
      counter.textContent = `${String((next - initial + works.length) % works.length + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}`
      if (manual) slideStatus.textContent = `${works[next].dataset.theaterTitle}, project ${(next - initial + works.length) % works.length + 1} of ${works.length}`
      if (changed) {
        const duration = travel(delta)
        state.api?.transitionLayout(duration + 60)
      }
      state.schedule()
    }
    const fail = () => {
      state.failed = true
      state.api?.dispose(); state.api = null
      root.dataset.theaterReady = 'false'
      root.dataset.theaterRenderPath = 'html'
    }
    state.load = async () => {
      if (!root.isConnected || state.api || state.loading || state.failed || narrow.matches || !animate() || !state.visible || document.hidden) return
      state.loading = true
      const generation = state.generation
      try {
        if (await acceleratedGraphics() === false) { if (root.isConnected && generation === state.generation) fail(); return }
        // Preferences or viewport may have changed while the worker was running.
        if (!root.isConnected || generation !== state.generation || !animate() || narrow.matches) return
        modulePromise ??= import('/scripts/project-theater-scene.js')
        const { createTheater } = await modulePromise
        if (!root.isConnected || generation !== state.generation || !animate() || narrow.matches) return
        sceneController = new AbortController()
        const api = await createTheater(root, { onFailure: fail, signal: sceneController.signal })
        if (!root.isConnected || generation !== state.generation || state.failed) { api.dispose(); return }
        state.api = api
        api.setPaused(state.paused); api.setVisible(state.visible && !document.hidden)
        api.setLens(document.documentElement.dataset.focusLens)
        api.setFocusOpen(Boolean(focusPanel?.querySelector('details[open]')))
        root.dataset.theaterReady = 'true'
        root.dataset.theaterRenderPath = 'webgl'
      } catch { if (root.isConnected && generation === state.generation) fail() }
      finally { state.loading = false; sync(); if (generation !== state.generation) state.load() }
    }
    state.stopScene = () => {
      state.generation++
      sceneController?.abort(); sceneController = null
      state.api?.dispose(); state.api = null
      root.dataset.theaterReady = 'false'
      root.dataset.theaterRenderPath = 'html'
    }
    state.preferencesChanged = () => {
      sync()
      if (!animate()) { state.finishTransition(); state.stopScene() }
      else state.load()
      sync(); state.schedule()
    }
    state.suspend = () => { clearTimer(); state.finishTransition(); state.stopScene(); if (!root.isConnected) events.abort() }
    root.querySelector('[data-theater-previous]').addEventListener('click', () => select(state.active - 1))
    root.querySelector('[data-theater-next]').addEventListener('click', () => select(state.active + 1))
    button.addEventListener('click', () => { state.visitorPaused = !state.visitorPaused; rememberPause(state.visitorPaused); sync(); state.schedule(); state.load() })
    // Working with a role lens must never advance the featured project underneath it.
    focusPanel?.addEventListener('pointerdown', pause, { signal: events.signal })
    focusPanel?.addEventListener('focusin', pause, { signal: events.signal })
    focusPanel?.addEventListener('toggle', () => {
      const open = Boolean(focusPanel.querySelector('details[open]'))
      focusPanel.dataset.premiereOpen = String(open)
      state.api?.setFocusOpen(open)
    }, { capture: true, signal: events.signal })
    state.setLens = id => {
      state.api?.setLens(id)
      if (!focusPanel) return
      const buttons = [...focusPanel.querySelectorAll('.home-focus-presets [data-adaptive-focus-preset]')]
      const index = buttons.findIndex(item => item.dataset.adaptiveFocusPreset === id)
      focusPanel.dataset.premiereLens = id ? 'selected' : 'all'
      focusPanel.style.setProperty('--focus-light-x', `${index < 0 ? 50 : 41 + index * 17}%`)
    }
    state.setLens(document.documentElement.dataset.focusLens)
    track.addEventListener('pointerenter', event => { if (event.pointerType === 'touch') return; state.hovering = true; state.schedule() })
    track.addEventListener('pointerleave', () => { state.hovering = false; state.schedule(); state.api?.setPointer(0, 0) })
    root.addEventListener('pointermove', event => {
      if (!animate() || coarse.matches || state.paused) return
      const r = root.getBoundingClientRect()
      state.api?.setPointer((event.clientX - r.left) / r.width * 2 - 1, (event.clientY - r.top) / r.height * 2 - 1)
    }, { passive: true })
    root.addEventListener('focusin', event => {
      if (button.contains(event.target)) return
      pause()
      const index = works.indexOf(event.target.closest('[data-theater-work]'))
      if (index !== -1 && index !== state.active) select(index)
    })
    root.addEventListener('keydown', event => {
      const index = event.key === 'ArrowLeft' ? state.active - 1 : event.key === 'ArrowRight' ? state.active + 1 : event.key === 'Home' ? initial : event.key === 'End' ? initial + works.length - 1 : null
      if (index === null) return
      event.preventDefault()
      const focusedLink = works.includes(document.activeElement)
      select(index)
      if (focusedLink) works[state.active].focus({ preventScroll: true })
    })
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch') return
      touch = { x: event.clientX, y: event.clientY }
      pause()
    }, { passive: true })
    track.addEventListener('pointerup', event => {
      if (!touch) return
      const dx = event.clientX - touch.x, dy = event.clientY - touch.y
      touch = null
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.25) return
      suppressClickUntil = performance.now() + 500
      event.preventDefault()
      select(state.active + (dx < 0 ? 1 : -1))
    })
    track.addEventListener('pointercancel', () => { touch = null })
    track.addEventListener('click', event => {
      if (performance.now() >= suppressClickUntil) return
      event.preventDefault(); event.stopImmediatePropagation()
    }, true)
    scenes.set(root, state)
    root.querySelector('[data-theater-controls]').hidden = false
    root.dataset.carouselReady = 'true'
    sync(); state.schedule(); observer?.observe(root)
    if (!observer) state.load()
  }
  function scan() {
    document.querySelectorAll('[data-project-theater],[data-reveal],[data-premiere-opening],[data-art-plane],img[data-project-art]').forEach(element => {
      if (seen.has(element)) return
      seen.add(element)
      if (element.matches('[data-project-theater]')) setupScene(element)
      if (element.matches('[data-reveal],[data-premiere-opening]')) observer?.observe(element)
      if (element.matches('img[data-project-art]')) {
        const failed = () => { element.style.opacity = '0'; element.parentElement.dataset.mediaFailed = 'true' }
        element.addEventListener('error', failed)
        element.addEventListener('load', () => { element.style.removeProperty('opacity'); delete element.parentElement.dataset.mediaFailed })
        if (element.complete && !element.naturalWidth) failed()
      }
      if (element.matches('[data-art-plane]')) {
        element.addEventListener('pointermove', event => {
          if (!animate() || coarse.matches) return
          const r = element.getBoundingClientRect()
          element.style.setProperty('--tilt-x', `${((event.clientX - r.left) / r.width - .5) * 3}deg`)
          element.style.setProperty('--tilt-y', `${-((event.clientY - r.top) / r.height - .5) * 3}deg`)
        }, { passive: true })
        element.addEventListener('pointerleave', () => { element.style.removeProperty('--tilt-x'); element.style.removeProperty('--tilt-y') })
      }
    })
    for (const [root, state] of scenes) if (!root.isConnected) { state.suspend(); observer?.unobserve(root); scenes.delete(root) }
  }
  let pending = false
  new MutationObserver(() => {
    if (pending) return
    pending = true
    requestAnimationFrame(() => { pending = false; scan() })
  }).observe(document.body, { childList: true, subtree: true })
  reduce.addEventListener('change', () => { for (const state of scenes.values()) state.preferencesChanged() })
  narrow.addEventListener('change', () => { for (const state of scenes.values()) { state.finishTransition(); narrow.matches ? state.stopScene() : state.load() } })
  document.addEventListener('visibilitychange', () => {
    for (const state of scenes.values()) { state.api?.setVisible(state.visible && !document.hidden); state.schedule(); state.load() }
  })
  window.addEventListener('portfolio:focus-change', event => { for (const state of scenes.values()) state.setLens(event.detail?.presetId) })
  window.addEventListener('pagehide', () => { for (const state of scenes.values()) state.suspend() })
  window.addEventListener('pageshow', event => { if (event.persisted) for (const state of scenes.values()) { state.load(); state.schedule() } })
  const start = () => { 'requestIdleCallback' in window ? requestIdleCallback(scan, { timeout: 1800 }) : setTimeout(scan, 100) }
  document.readyState === 'complete' ? start() : window.addEventListener('load', start, { once: true })
})()

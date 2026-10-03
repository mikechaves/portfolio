/* Real HTML links, a progressive carousel, and an optional dimensional scene. */
(() => {
  if (window.__cinematicMounted) return
  window.__cinematicMounted = true
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  const narrow = matchMedia('(max-width: 700px)')
  const coarse = matchMedia('(pointer: coarse)')
  const seen = new WeakSet(), scenes = new Map()
  const animate = () => !reduce.matches && !navigator.connection?.saveData
  let modulePromise
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = scenes.get(entry.target)
      if (state) {
        state.visible = entry.isIntersecting
        state.api?.setVisible(state.visible && !document.hidden)
        state.schedule()
        if (state.visible) state.load()
      } else if (entry.isIntersecting) {
        if (animate()) entry.target.classList.add('is-revealed')
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
    const status = root.querySelector('[data-theater-status]')
    const slideStatus = root.querySelector('[data-theater-slide-status]')
    const counter = root.querySelector('[data-theater-counter]')
    const initial = Math.max(0, works.findIndex(work => work.dataset.theaterSlot === 'center'))
    const state = { api: null, active: initial, visible: true, paused: !animate(), hovering: false, loading: false, failed: false, generation: 0 }
    let timer, touch, suppressClickUntil = 0
    const clearTimer = () => { clearTimeout(timer); timer = undefined }
    const sync = () => {
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
    const pause = () => { state.paused = true; clearTimer(); sync() }
    function select(index, manual = true) {
      if (manual) pause()
      const next = (index + works.length) % works.length
      const changed = next !== state.active
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
      if (changed) state.api?.transitionLayout(animate() ? 1000 : 0)
      state.schedule()
    }
    const fail = () => {
      state.failed = true
      state.api?.dispose(); state.api = null
      root.dataset.theaterReady = 'false'
      status.textContent = 'Project carousel. Dimensional reflections unavailable.'
    }
    state.load = async () => {
      if (state.api || state.loading || state.failed || narrow.matches || !animate() || !state.visible || document.hidden) return
      state.loading = true
      const generation = state.generation
      try {
        modulePromise ??= import('/scripts/project-theater-scene.js')
        const { createTheater } = await modulePromise
        if (!root.isConnected || generation !== state.generation) return
        const api = await createTheater(root, { onFailure: fail })
        if (!root.isConnected || generation !== state.generation || state.failed) { api.dispose(); return }
        state.api = api
        api.setPaused(state.paused); api.setVisible(state.visible && !document.hidden)
        root.dataset.theaterReady = 'true'
        status.textContent = 'Project carousel with dimensional frames and reflections.'
      } catch { if (root.isConnected && generation === state.generation) fail() }
      finally { state.loading = false; sync() }
    }
    state.stopScene = () => {
      state.generation++
      state.api?.dispose(); state.api = null
      root.dataset.theaterReady = 'false'
    }
    state.preferencesChanged = () => {
      state.paused = !animate()
      if (!animate()) state.stopScene()
      else state.load()
      sync(); state.schedule()
    }
    state.suspend = () => { clearTimer(); state.stopScene() }
    root.querySelector('[data-theater-previous]').addEventListener('click', () => select(state.active - 1))
    root.querySelector('[data-theater-next]').addEventListener('click', () => select(state.active + 1))
    button.addEventListener('click', () => { state.paused = !state.paused; sync(); state.schedule(); state.load() })
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
    document.querySelectorAll('[data-project-theater],[data-reveal],[data-art-plane],img[data-project-art]').forEach(element => {
      if (seen.has(element)) return
      seen.add(element)
      if (element.matches('[data-project-theater]')) setupScene(element)
      if (element.matches('[data-reveal]')) observer?.observe(element)
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
  narrow.addEventListener('change', () => { for (const state of scenes.values()) narrow.matches ? state.stopScene() : state.load() })
  document.addEventListener('visibilitychange', () => {
    for (const state of scenes.values()) { state.api?.setVisible(state.visible && !document.hidden); state.schedule(); state.load() }
  })
  window.addEventListener('portfolio:focus-change', event => { for (const state of scenes.values()) state.api?.setLens(event.detail?.presetId) })
  window.addEventListener('pagehide', () => { for (const state of scenes.values()) state.suspend() })
  window.addEventListener('pageshow', event => { if (event.persisted) for (const state of scenes.values()) { state.load(); state.schedule() } })
  const start = () => { 'requestIdleCallback' in window ? requestIdleCallback(scan, { timeout: 1800 }) : setTimeout(scan, 100) }
  document.readyState === 'complete' ? start() : window.addEventListener('load', start, { once: true })
})()

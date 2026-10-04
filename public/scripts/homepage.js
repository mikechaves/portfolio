(() => {
  const analyticsEventName = "portfolio:analytics-event"
  const pendingKey = "adaptive-focus:pending:v2"

  const track = (name, properties) => {
    try {
      window.dispatchEvent(
        new CustomEvent(analyticsEventName, { detail: { name, properties } })
      )
    } catch {
      // Measurement must never interrupt the homepage journey.
    }
  }

  const focusForm = document.querySelector("[data-adaptive-focus-form]")
  const focusInput = document.getElementById("adaptive-focus-role-input")
  const focusSubmit = focusForm?.querySelector("[data-adaptive-focus-submit]")
  const focusSubmitLabel = focusForm?.querySelector("[data-adaptive-focus-submit-label]")
  const focusLoader = focusForm?.querySelector("[data-adaptive-focus-loader]")
  const focusCount = focusForm?.querySelector("[data-adaptive-focus-count]")
  const focusError = focusForm?.querySelector("[data-adaptive-focus-error]")
  const focusPresetButtons = Array.from(
    document.querySelectorAll("[data-adaptive-focus-preset]")
  )
  const workCollection = document.querySelector(".home-featured-grid")
  const originalWork = workCollection ? [...workCollection.children] : []
  const arrangeWork = (ids = []) => {
    const ordered = [...originalWork].sort((a,b) => {
      const ai = ids.indexOf(a.dataset.featuredProject), bi = ids.indexOf(b.dataset.featuredProject)
      return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi)
    })
    if (workCollection) ordered.forEach(card => workCollection.append(card))
  }
  const moreLenses = document.querySelector("[data-adaptive-focus-more]")
  let focusBusy = false

  const setFocusError = (message) => {
    if (!focusError) return
    focusError.textContent = message
    focusError.hidden = !message
  }
  const updateFocusInput = () => {
    if (!(focusInput instanceof HTMLTextAreaElement)) return
    const inputLength = focusInput.value.length
    if (focusCount) {
      focusCount.textContent = `${inputLength.toLocaleString()} / ${focusInput.maxLength.toLocaleString()}`
      focusCount.hidden = inputLength < focusInput.maxLength * 0.8
    }
    if (focusSubmit instanceof HTMLButtonElement) {
      focusSubmit.disabled = focusBusy || !focusInput.value.trim()
    }
  }
  const setFocusBusy = (busy) => {
    focusBusy = busy
    focusForm?.setAttribute("aria-busy", String(busy))
    focusPresetButtons.forEach((button) => {
      button.disabled = busy
    })
    if (focusLoader) focusLoader.hidden = !busy
    if (focusSubmitLabel) {
      focusSubmitLabel.textContent = busy ? "Opening role fit" : "Analyze role"
    }
    updateFocusInput()
  }

  focusInput?.addEventListener("input", updateFocusInput)
  focusForm?.addEventListener("submit", (event) => {
    event.preventDefault()
    if (!(focusInput instanceof HTMLTextAreaElement)) return
    const input = focusInput.value.trim()
    if (!input || focusBusy) return

    setFocusError("")
    setFocusBusy(true)
    track("adaptive_focus_started", { entry_point: "home", mode: "custom" })

    try {
      const payload = JSON.stringify({ version: 2, input, createdAt: Date.now() })
      window.sessionStorage.setItem(pendingKey, payload)
      if (window.sessionStorage.getItem(pendingKey) !== payload) {
        throw new Error("Temporary role storage is unavailable")
      }
      window.location.assign("/projects?focusSession=1")
    } catch {
      track("adaptive_focus_failed", { entry_point: "home", mode: "custom" })
      setFocusError(
        "Adaptive Focus could not prepare this brief. Try again or choose a preset lens."
      )
      setFocusBusy(false)
    }
  })
  moreLenses?.addEventListener("toggle", () => {
    if (moreLenses.open) {
      track("adaptive_focus_more_lenses_expanded", { entry_point: "home" })
    }
  })
  document.querySelector("[data-focus-reset]")?.addEventListener("click", () => {
    focusPresetButtons.forEach((button) => button.setAttribute("aria-pressed", "false"))
    document.querySelector("[data-focus-preview-label]").textContent = "Showing"
    document.querySelector("[data-focus-preview-title]").textContent = "All work"
    document.querySelector("[data-focus-preview-description]").textContent = "Choose an interest above, or explore everything."
    document.querySelector("[data-focus-preview-evidence]").textContent = ""
    const explore = document.querySelector("[data-focus-explore]")
    explore.href = "/projects"
    explore.firstChild.textContent = "Explore the work "
    if (focusInput) focusInput.value = ""
    setFocusError("")
    updateFocusInput()
    if (moreLenses) moreLenses.open = false
    arrangeWork()
    delete document.documentElement.dataset.focusLens
    window.dispatchEvent(new CustomEvent("portfolio:focus-change", { detail: { presetId: null } }))
  })
  document.querySelector("[data-focus-explore]")?.addEventListener("click", () => {
    if (document.documentElement.dataset.focusLens) track("adaptive_focus_started", { entry_point: "home", mode: "preset" })
  })
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return
    const presetButton = event.target.closest("button[data-adaptive-focus-preset]")
    if (presetButton instanceof HTMLButtonElement && !presetButton.disabled) {
      const presetId = presetButton.dataset.adaptiveFocusPreset
      if (!presetId) return
      event.preventDefault()
      focusPresetButtons.forEach((button) => button.setAttribute("aria-pressed", String(button === presetButton)))
      const preview = document.querySelector(".focus-preview")
      preview?.classList.remove("is-changing")
      document.querySelector("[data-focus-preview-label]").textContent = "Selected focus"
      document.querySelector("[data-focus-preview-title]").textContent = presetButton.dataset.focusTitle
      document.querySelector("[data-focus-preview-description]").textContent = presetButton.dataset.focusDescription
      document.querySelector("[data-focus-preview-evidence]").textContent = presetButton.dataset.focusEvidence || "Explore the reviewed evidence for this lens."
      const explore = document.querySelector("[data-focus-explore]")
      explore.href = `/projects?focusPreset=${encodeURIComponent(presetId)}`
      explore.firstChild.textContent = "Explore this focus "
      if (moreLenses) {
        const wasSecondary = moreLenses.contains(presetButton)
        moreLenses.open = false
        if (wasSecondary) explore.focus({ preventScroll: true })
      }
      arrangeWork((presetButton.dataset.focusOrder || "").split(","))
      document.documentElement.dataset.focusLens = presetId
      window.dispatchEvent(new CustomEvent("portfolio:focus-change", { detail: { presetId } }))
      requestAnimationFrame(() => preview?.classList.add("is-changing"))
      return
    }

    const link = event.target.closest("a[data-home-target-id]")
    if (!(link instanceof HTMLAnchorElement)) return
    const targetId = link.dataset.homeTargetId
    const target = targetId ? document.getElementById(targetId) : null
    if (!target) return

    event.preventDefault()
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
    window.history.replaceState(null, "", `#${targetId}`)

    const focusTargetId = link.dataset.homeFocusTargetId
    if (focusTargetId) {
      window.setTimeout(() => {
        document.getElementById(focusTargetId)?.focus({ preventScroll: true })
      }, reducedMotion ? 0 : 260)
    }
  })
})()

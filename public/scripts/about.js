(() => {
  const analyticsEventName = "portfolio:analytics-event"
  let enhancedForm = null

  const applyFocusContext = () => {
    const focusContext = document.querySelector("[data-focus-context]")
    if (!(focusContext instanceof HTMLElement)) return

    const focus = new URLSearchParams(window.location.search).get("focus")?.trim()
    const value = focusContext.querySelector("[data-focus-context-value]")
    if (focus && value instanceof HTMLElement) {
      value.textContent = focus
      focusContext.hidden = false
    }
  }

  const enhanceContactForm = () => {
    const form = document.querySelector("[data-about-contact-form]")
    if (!(form instanceof HTMLFormElement) || form === enhancedForm) return
    enhancedForm = form

    const state = form.querySelector("[data-contact-state]")
    const submit = form.querySelector("[data-contact-submit]")
    const status = form.querySelector("[data-contact-status]")
    const controls = [...form.querySelectorAll("input, textarea, button")]
    const allowedFailureTypes = new Set([
      "configuration",
      "validation",
      "delivery",
      "unexpected",
    ])
    let pending = false

    const dispatchAnalytics = (name, properties) => {
      try {
        window.dispatchEvent(
          new CustomEvent(analyticsEventName, { detail: { name, properties } })
        )
      } catch {
        // Measurement must never interrupt the contact path.
      }
    }

    const setPending = (nextPending) => {
      pending = nextPending
      form.setAttribute("aria-busy", String(nextPending))
      if (state instanceof HTMLElement) state.textContent = nextPending ? "SENDING" : "READY"
      if (submit instanceof HTMLButtonElement) {
        submit.textContent = nextPending ? "Sending..." : "Send Message"
      }
      for (const control of controls) {
        if (
          control instanceof HTMLInputElement ||
          control instanceof HTMLTextAreaElement ||
          control instanceof HTMLButtonElement
        ) {
          control.disabled = nextPending
        }
      }
    }

    const showStatus = (message, success) => {
      if (!(status instanceof HTMLElement)) return
      status.textContent = message
      status.className = success ? "profile-form-success" : "profile-form-error"
      status.hidden = false
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault()
      if (pending) return

      if (status instanceof HTMLElement) {
        status.hidden = true
        status.textContent = ""
      }
      const formData = new FormData(form)
      setPending(true)

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        })
        const result = await response.json()
        const success = response.ok && result?.success === true
        const message = typeof result?.message === "string"
          ? result.message
          : "An unexpected error occurred. Please try again."

        showStatus(message, success)
        if (success) {
          dispatchAnalytics("portfolio_contact_submitted", { source: "about_form" })
          form.reset()
        } else {
          const failureType = allowedFailureTypes.has(result?.failureType)
            ? result.failureType
            : "unexpected"
          dispatchAnalytics("portfolio_contact_failed", {
            failure_type: failureType,
            source: "about_form",
          })
        }
      } catch {
        showStatus("An unexpected error occurred. Please try again.", false)
        dispatchAnalytics("portfolio_contact_failed", {
          failure_type: "unexpected",
          source: "about_form",
        })
      } finally {
        setPending(false)
      }
    })
  }

  const initialize = () => {
    applyFocusContext()
    enhanceContactForm()
  }
  const scheduleInitialization = () => {
    const developmentRuntimePresent = [...document.scripts].some((script) =>
      script.src.includes("/_next/static/development/")
    )
    if (developmentRuntimePresent) {
      window.setTimeout(initialize, 250)
      return
    }
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(initialize, { timeout: 500 })
      return
    }
    window.setTimeout(initialize, 0)
  }

  if (document.readyState === "complete") {
    scheduleInitialization()
  } else {
    window.addEventListener("load", scheduleInitialization, { once: true })
  }
  window.addEventListener("pageshow", scheduleInitialization)
})()

(() => {
  const trigger = document.querySelector("[data-site-menu-open]")
  const dialog = document.querySelector("[data-site-menu]")
  const closeButton = dialog?.querySelector("[data-site-menu-close]")

  const closeMenu = (returnFocus = true) => {
    if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return
    dialog.close()
    if (returnFocus && trigger instanceof HTMLElement) trigger.focus()
  }

  if (trigger instanceof HTMLButtonElement && dialog instanceof HTMLDialogElement) {
    trigger.addEventListener("click", () => {
      dialog.showModal()
      trigger.setAttribute("aria-expanded", "true")
      if (closeButton instanceof HTMLElement) closeButton.focus()
    })
    closeButton?.addEventListener("click", () => closeMenu())
    dialog.addEventListener("close", () => {
      trigger.setAttribute("aria-expanded", "false")
      if (document.activeElement !== trigger) trigger.focus()
    })
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeMenu()
    })
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return

      const focusable = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element instanceof HTMLElement && element.offsetParent !== null)
      const first = focusable[0]
      const last = focusable.at(-1)

      if (event.shiftKey && document.activeElement === first && last instanceof HTMLElement) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last && first instanceof HTMLElement) {
        event.preventDefault()
        first.focus()
      }
    })
    dialog.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu(false))
    })
  }

  const isActive = (itemPath) => {
    const [itemPathname, itemHash = ""] = itemPath.split("#")
    const { pathname, hash } = window.location
    if (itemHash) return pathname === itemPathname && hash === `#${itemHash}`
    if (itemPathname === "/") return pathname === "/"
    if (itemPathname === "/about" && hash === "#professional-experience") return false
    return pathname === itemPathname || pathname.startsWith(`${itemPathname}/`)
  }

  const syncActiveRoute = () => {
    document.querySelectorAll("[data-site-nav-item]").forEach((link) => {
      const active = isActive(link.dataset.siteNavPath || "")
      link.toggleAttribute("aria-current", active)
      if (active) link.setAttribute("aria-current", "page")
      link.classList.toggle("text-primary", active)
      link.classList.toggle("text-zinc-300", !active && !link.closest("[data-site-menu]"))
      link.classList.toggle("text-zinc-100", !active && Boolean(link.closest("[data-site-menu]")))
    })
  }

  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method]
    window.history[method] = function (...args) {
      const result = original.apply(this, args)
      window.queueMicrotask(syncActiveRoute)
      return result
    }
  }

  window.addEventListener("hashchange", syncActiveRoute)
  window.addEventListener("popstate", syncActiveRoute)
  const scheduleInitialRouteSync = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(syncActiveRoute, { timeout: 2000 })
    } else {
      window.setTimeout(syncActiveRoute, 100)
    }
  }
  if (document.readyState === "complete") scheduleInitialRouteSync()
  else window.addEventListener("load", scheduleInitialRouteSync, { once: true })
})()

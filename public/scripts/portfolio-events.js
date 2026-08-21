(() => {
  const browserEventName = "portfolio:analytics-event"

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return
    const link = event.target.closest("a[data-portfolio-event]")
    if (!link) return

    try {
      const properties = JSON.parse(link.dataset.portfolioProperties || "{}")
      window.dispatchEvent(
        new CustomEvent(browserEventName, {
          detail: { name: link.dataset.portfolioEvent, properties },
        })
      )
    } catch {
      // Measurement must never interrupt navigation or conversion.
    }
  })
})()

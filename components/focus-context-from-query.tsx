"use client"

import { useEffect, useState } from "react"
import { FocusContextBadge } from "@/components/focus-context-badge"

export function FocusContextFromQuery() {
  const [focus, setFocus] = useState("")

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("focus")
    if (query) setFocus(query)
  }, [])

  return focus ? <FocusContextBadge focus={focus} /> : null
}

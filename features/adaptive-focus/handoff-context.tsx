"use client"

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react"
import {
  ADAPTIVE_FOCUS_PENDING_KEY,
  consumePendingAdaptiveFocusInput,
  savePendingAdaptiveFocusInput,
} from "./handoff"

interface AdaptiveFocusHandoffContextValue {
  preparePendingInput(input: string): void
  consumePendingInput(): string | null
}

const AdaptiveFocusHandoffContext = createContext<AdaptiveFocusHandoffContextValue | null>(null)

export function AdaptiveFocusHandoffProvider({ children }: { children: ReactNode }) {
  const pendingInput = useRef<string | null>(null)

  const preparePendingInput = useCallback((input: string) => {
    savePendingAdaptiveFocusInput(window.sessionStorage, input)
    pendingInput.current = input.trim()
  }, [])

  const consumePendingInput = useCallback((): string | null => {
    const inMemory = pendingInput.current
    pendingInput.current = null
    if (inMemory) {
      window.sessionStorage.removeItem(ADAPTIVE_FOCUS_PENDING_KEY)
      return inMemory
    }
    return consumePendingAdaptiveFocusInput(window.sessionStorage)
  }, [])

  const value = useMemo(
    () => ({ preparePendingInput, consumePendingInput }),
    [consumePendingInput, preparePendingInput]
  )

  return (
    <AdaptiveFocusHandoffContext.Provider value={value}>
      {children}
    </AdaptiveFocusHandoffContext.Provider>
  )
}

export function useAdaptiveFocusHandoff(): AdaptiveFocusHandoffContextValue {
  const context = useContext(AdaptiveFocusHandoffContext)
  if (!context) {
    throw new Error("useAdaptiveFocusHandoff must be used inside AdaptiveFocusHandoffProvider")
  }
  return context
}

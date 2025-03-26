"use client"

import type React from "react"

// Adapted from https://ui.shadcn.com/
import { useEffect, useState } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  REMOVE_ALL_TOASTS: "REMOVE_ALL_TOASTS",
} as const

const listeners: ((state: ToasterToast[]) => void)[] = []

let memoryState: ToasterToast[] = []

function dispatch(action: {
  type: keyof typeof actionTypes
  toast?: ToasterToast
  toastId?: string
}) {
  // Clear all existing toasts when adding a new one
  if (action.type === "ADD_TOAST") {
    // First dismiss all existing toasts
    memoryState.forEach((toast) => {
      if (toast.open) {
        dispatch({ type: "DISMISS_TOAST", toastId: toast.id })
      }
    })
  }

  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function reducer(
  state: ToasterToast[],
  action: {
    type: keyof typeof actionTypes
    toast?: ToasterToast
    toastId?: string
  },
) {
  switch (action.type) {
    case "ADD_TOAST":
      return [
        ...state,
        {
          id: action.toast?.id || genId(),
          ...action.toast,
          open: true,
        },
      ].slice(0, TOAST_LIMIT)

    case "UPDATE_TOAST":
      return state.map((t) => (t.id === action.toastId ? { ...t, ...action.toast } : t))

    case "DISMISS_TOAST": {
      const toastId = action.toastId

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return state.map((t) =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t,
      )
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return []
      }
      return state.filter((t) => t.id !== action.toastId)

    case "REMOVE_ALL_TOASTS":
      return []
  }
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export function useToast() {
  const [state, setState] = useState<ToasterToast[]>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    toasts: state,
    toast: (props: Omit<ToasterToast, "id">) => {
      // Clear any existing toasts first
      dispatch({ type: "REMOVE_ALL_TOASTS" })

      const id = genId()

      const update = (props: Omit<ToasterToast, "id">) =>
        dispatch({
          type: "UPDATE_TOAST",
          toast: { ...props },
          toastId: id,
        })

      const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) dismiss()
          },
        },
      })

      return {
        id,
        dismiss,
        update,
      }
    },
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}


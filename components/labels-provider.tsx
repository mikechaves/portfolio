'use client'

import * as React from 'react'

export interface UILabels {
  close: string
}

const defaultLabels: UILabels = {
  close: 'Close',
}

const LabelsContext = React.createContext<UILabels>(defaultLabels)

export function LabelsProvider({
  children,
  labels,
}: React.PropsWithChildren<{ labels?: Partial<UILabels> }>) {
  const value = React.useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
}

export function useLabels() {
  return React.useContext(LabelsContext)
}

"use client"

export function MetaverseNavFallback() {
  return (
    <>
      <div className="border-b border-border/40 backdrop-blur-sm h-20 w-full" />
      <div className="w-full h-screen flex items-center justify-center bg-black text-primary">
        Loading 3D Navigation...
      </div>
    </>
  )
}

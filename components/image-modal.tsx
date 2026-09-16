"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt: string
  caption?: string
  onPrev?: () => void
  onNext?: () => void
  title?: string
  onRestoreFocus?: () => void
  captionPlacement?: "overlay" | "below"
  imageWidth?: number
  imageHeight?: number
}

export function ImageModal({ open, onOpenChange, src, alt, caption, onPrev, onNext, title, onRestoreFocus, captionPlacement = "overlay", imageWidth = 1200, imageHeight = 800 }: ImageModalProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild onCloseAutoFocus={onRestoreFocus ? (event) => {
              event.preventDefault()
              onRestoreFocus()
            } : undefined}>
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={shouldReduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="sr-only">
                  <Dialog.Title>{title || "Image preview"}</Dialog.Title>
                  <Dialog.Description>{caption || alt}</Dialog.Description>
                </div>
                <div data-caption-placement={captionPlacement} className={captionPlacement === "below" ? "relative flex h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col gap-3" : "relative w-full max-w-5xl"}>
                  <div className={captionPlacement === "below" ? "flex min-h-0 flex-1 items-center justify-center" : "contents"}>
                    <Image
                      src={src}
                      alt={alt}
                      width={imageWidth}
                      height={imageHeight}
                      className={captionPlacement === "below" ? "h-auto max-h-full w-auto max-w-full object-contain rounded-md shadow-lg" : "w-full h-auto max-h-[90vh] object-contain rounded-md shadow-lg"}
                      style={captionPlacement === "below" ? undefined : { width: "100%", height: "auto" }}
                      sizes="100vw"
                      priority
                      quality={88}
                    />
                  </div>
                  {(title || caption) && (
                    <div data-image-caption className={captionPlacement === "below" ? "shrink-0 rounded border border-primary/25 bg-black/80 px-3 py-2 text-left" : "absolute bottom-2 left-2 right-2 rounded border border-primary/25 bg-black/80 px-3 py-2 text-left backdrop-blur-sm"}>
                      {title && <p className="font-mono text-sm text-primary">{title}</p>}
                      {caption && <p className="mt-1 text-xs leading-relaxed text-zinc-200 sm:text-sm">{caption}</p>}
                    </div>
                  )}
                  <div className={captionPlacement === "below" ? "flex shrink-0 items-center justify-center gap-3" : "contents"}>
                    <Dialog.Close asChild>
                      <button
                        className={`${captionPlacement === "below" ? "relative min-h-11 min-w-11" : "absolute top-2 right-2 min-h-10 min-w-10"} inline-flex items-center justify-center rounded-full bg-black/70 p-2 text-primary backdrop-blur-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                        aria-label="Close image viewer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                    {onPrev && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`${captionPlacement === "below" ? "relative min-h-11 min-w-11" : "absolute left-2 top-1/2 -translate-y-1/2"} bg-black/70 text-primary hover:text-white backdrop-blur-sm rounded-full focus-visible:ring-offset-background`}
                        onClick={onPrev}
                        aria-label="Previous image"
                        aria-keyshortcuts="ArrowLeft"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                    )}
                    {onNext && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`${captionPlacement === "below" ? "relative min-h-11 min-w-11" : "absolute right-2 top-1/2 -translate-y-1/2"} bg-black/70 text-primary hover:text-white backdrop-blur-sm rounded-full focus-visible:ring-offset-background`}
                        onClick={onNext}
                        aria-label="Next image"
                        aria-keyshortcuts="ArrowRight"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

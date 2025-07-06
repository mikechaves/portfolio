"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt: string
  onPrev?: () => void
  onNext?: () => void
}

export function ImageModal({ open, onOpenChange, src, alt, onPrev, onNext }: ImageModalProps) {
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
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="relative max-h-[90vh]">
                  <Image src={src} alt={alt} width={1200} height={800} className="max-h-[90vh] w-auto rounded-md shadow-lg" />
                  <Dialog.Close asChild>
                    <button
                      className="absolute top-2 right-2 text-primary hover:text-white bg-black/60 backdrop-blur-sm rounded-full p-1"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                  {onPrev && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-primary hover:text-white backdrop-blur-sm rounded-full"
                      onClick={onPrev}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                  )}
                  {onNext && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-primary hover:text-white backdrop-blur-sm rounded-full"
                      onClick={onNext}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

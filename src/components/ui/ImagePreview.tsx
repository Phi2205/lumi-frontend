import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface ImagePreviewProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  index?: number
  count?: number
  allImages?: string[]
}

export default function ImagePreview({ src, className, alt = "", index, count, allImages = [], ...props }: ImagePreviewProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      const idx = allImages.length > 0 ? allImages.indexOf(src) : 0
      setCurrentIndex(idx >= 0 ? idx : 0)
    }
  }, [open, src, allImages])

  const showPrev = allImages.length > 1 && currentIndex > 0
  const showNext = allImages.length > 1 && currentIndex < allImages.length - 1

  const currentSrc = allImages.length > 0 ? allImages[currentIndex] : src

  const modal = open ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <button 
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all z-50"
        onClick={() => setOpen(false)}
      >
        <X className="w-6 h-6" />
      </button>

      {showPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all z-50 group"
          onClick={(e) => {
            e.stopPropagation()
            setCurrentIndex((prev) => prev - 1)
          }}
        >
          <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
      )}

      <img
        src={currentSrc}
        alt={alt}
        className="max-h-[95vh] max-w-[95vw] object-contain transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      />

      {showNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all z-50 group"
          onClick={(e) => {
            e.stopPropagation()
            setCurrentIndex((prev) => prev + 1)
          }}
        >
          <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {allImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 text-sm">
          {currentIndex + 1} / {allImages.length}
        </div>
      )}
    </div>
  ) : null

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={cn("cursor-pointer rounded-lg", className)}
        onClick={(e) => {
          setOpen(true)
          props.onClick?.(e)
        }}
        {...props}  
      />
      {index === 3 && count && count > 4 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-2xl font-bold cursor-pointer" onClick={(e) => {
          setOpen(true)
          props.onClick?.(e as unknown as React.MouseEvent<HTMLImageElement>)
        }}>
          +{count - 4}
        </div>
      )}
      {mounted && createPortal(modal, document.body)}
    </>
  )
}

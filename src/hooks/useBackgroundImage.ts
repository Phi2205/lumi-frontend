"use client"

import { useState, useEffect, useRef } from "react"

export function useBackgroundImage(imagePath: string = "/bg12.jpg", isDarkMode: boolean) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (isDarkMode) return
    
    const img = document.createElement('img')
    img.src = imagePath
    
    img.onload = () => {
      setImageLoaded(true)
    }
    
    img.onerror = () => {
      setImageError(true)
    }

    imgRef.current = img

    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null
        imgRef.current.onerror = null
      }
    }
  }, [isDarkMode, imagePath])

  return { imageLoaded, imageError }
}

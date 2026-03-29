"use client"

import { useState, useEffect, useRef } from "react"

interface BackgroundImageProps {
  imagePath?: string
  gradientOverlay?: string
  className?: string
}

export function BackgroundImage({ 
  imagePath = "/bg12.jpg",
  gradientOverlay = "rgba(0,0,0,0.45)",
  className = ""
}: BackgroundImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    // Preload the background image
    const img = new Image()
    img.src = imagePath
    
    img.onload = () => {
      setImageLoaded(true)
    }
    
    img.onerror = () => {
      setImageError(true)
    }

    imgRef.current = img

    return () => {
      // Cleanup
      if (imgRef.current) {
        imgRef.current.onload = null
        imgRef.current.onerror = null
      }
    }
  }, [imagePath])

  return (
    <>
      {/* Gradient Fallback - Always visible */}
      <div 
        className={`fixed inset-0 -z-10 ${className}`}
        style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)'
        }}
      />

      {/* Blurred Placeholder - Shows while loading */}
      {!imageLoaded && !imageError && (
        <div 
          className={`fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 transition-opacity duration-500 ${className}`}
          style={{ 
            backgroundImage: `url(${imagePath})`,
            filter: 'blur(20px) brightness(0.3)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Full Background Image - Fades in when loaded */}
      <div 
        className={`fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{ 
          backgroundImage: `linear-gradient(${gradientOverlay}, ${gradientOverlay}), url(${imagePath})`
        }}
      />
    </>
  )
}

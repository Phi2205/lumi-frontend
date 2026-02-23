"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
  images: string[]
  isDarkMode?: boolean
}

export function ImageCarousel({ images, isDarkMode = true }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return null
  }

  const handlePrevClick = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setDragOffset(0)
  }

  const handleNextClick = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setDragOffset(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = e.clientX - startX
    setDragOffset(diff)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const diff = e.clientX - startX
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handlePrevClick()
      } else {
        handleNextClick()
      }
    }
    setDragOffset(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startX
    setDragOffset(diff)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const diff = e.changedTouches[0].clientX - startX
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handlePrevClick()
      } else {
        handleNextClick()
      }
    }
    setDragOffset(0)
  }

  return (
    <div 
      className="relative overflow-hidden bg-black/30 aspect-square group"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false)
        setDragOffset(0)
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images Container */}
      <div 
        className="flex transition-transform duration-300 ease-out h-full"
        style={{
          transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
          transitionDuration: isDragging ? '0ms' : '300ms'
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full flex-shrink-0"
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Image Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevClick}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
            style={{
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(8px)',
              color: 'rgb(255, 255, 255)'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
            style={{
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(8px)',
              color: 'rgb(255, 255, 255)'
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setDragOffset(0)
              }}
              className="rounded-full transition-all"
              style={{
                width: index === currentIndex ? '24px' : '6px',
                height: '6px',
                backgroundColor: index === currentIndex 
                  ? 'rgb(255, 255, 255)' 
                  : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div 
          className="absolute top-3 right-3 z-20 px-2.5 py-1.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(8px)',
            color: 'rgb(255, 255, 255)'
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

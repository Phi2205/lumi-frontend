"use client"

import { useState, useEffect } from "react"

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      return savedMode === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked)
    localStorage.setItem('darkMode', checked.toString())
  }

  // Detect dark mode with localStorage override
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true')
      return
    }
    
    const checkDarkMode = () => {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(darkModeQuery.matches)
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (localStorage.getItem('darkMode') === null) {
          setIsDarkMode(e.matches)
        }
      }
      
      darkModeQuery.addEventListener('change', handleChange)
      return () => darkModeQuery.removeEventListener('change', handleChange)
    }
    
    const cleanup = checkDarkMode()
    return cleanup
  }, [])

  return { isDarkMode, setIsDarkMode, handleDarkModeToggle }
}

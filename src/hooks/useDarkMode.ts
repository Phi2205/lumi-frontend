"use client"

import { useDarkMode as useDarkModeContext } from "@/contexts/DarkModeContext"

export function useDarkMode() {
  const { isDarkMode, toggleDarkMode } = useDarkModeContext()

  return { isDarkMode, handleDarkModeToggle: toggleDarkMode }
}


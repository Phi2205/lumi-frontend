"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface DarkModeContextType {
    isDarkMode: boolean
    toggleDarkMode: (checked: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === "undefined") return false
        const savedMode = localStorage.getItem("darkMode")
        if (savedMode !== null) {
            return savedMode === "true"
        }
        return false
    })

    const toggleDarkMode = (checked: boolean) => {
        setIsDarkMode(checked)
        localStorage.setItem("darkMode", checked.toString())
    }

    // Sync with localStorage
    useEffect(() => {
        if (typeof window === "undefined") return
        const savedMode = localStorage.getItem("darkMode")
        if (savedMode !== null) {
            setIsDarkMode(savedMode === "true")
        }
    }, [])

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}

export function useDarkMode() {
    const context = useContext(DarkModeContext)
    if (context === undefined) {
        throw new Error("useDarkMode must be used within a DarkModeProvider")
    }
    return context
}

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"

interface Option {
    value: string
    label: string
}

interface GlassSelectProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
}

export function GlassSelect({ options, value, onChange }: GlassSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const selectedOption = options.find(o => o.value === value) || options[0]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className="relative min-w-[140px]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-11 flex items-center justify-between px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
                <span className="truncate">{selectedOption.label}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute z-[100] left-0 right-0 p-1.5 backdrop-blur-3xl bg-black/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="max-h-[300px] overflow-y-auto scroll-glass space-y-1">
                            {options.map((option) => {
                                const isActive = option.value === value
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onChange(option.value)
                                            setIsOpen(false)
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group/item ${isActive
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-white/60 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="relative z-10">{option.label}</span>
                                        {isActive && (
                                            <motion.div layoutId="active-check" className="relative z-10">
                                                <Check className="w-3.5 h-3.5" />
                                            </motion.div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

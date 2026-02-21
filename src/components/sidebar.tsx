"use client"

import { Home, BookOpen, Zap, MessageSquare, User, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchPanel } from "@/components/SearchPanel"
import { useState, useRef, useEffect, useCallback } from "react"

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Sidebar({ activeTab = "home", onTabChange }: SidebarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const [animatingTab, setAnimatingTab] = useState<string | null>(null)

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Tìm kiếm", icon: Search },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "stories", label: "Stories", icon: Zap },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const mobileItems = menuItems.slice(0, 5)

  // Update sliding indicator position
  const updateIndicator = useCallback(() => {
    if (!mobileNavRef.current) return
    const activeIndex = mobileItems.findIndex((item) => item.id === activeTab)
    if (activeIndex === -1) return
    const buttons = mobileNavRef.current.querySelectorAll("[data-tab-btn]")
    const btn = buttons[activeIndex] as HTMLElement
    if (!btn) return
    const navRect = mobileNavRef.current.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    setIndicatorStyle({
      left: btnRect.left - navRect.left + btnRect.width / 2 - 16,
      width: 32,
    })
  }, [activeTab, mobileItems])

  useEffect(() => {
    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [updateIndicator])

  // Trigger bounce animation on tab change
  useEffect(() => {
    setAnimatingTab(activeTab)
    const timer = setTimeout(() => setAnimatingTab(null), 400)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleMenuClick = (itemId: string) => {
    if (itemId === "search") {
      setIsSearchOpen(!isSearchOpen)
    } else {
      setIsSearchOpen(false)
      onTabChange?.(itemId)
    }
  }

  return (
    <>
      <style>{`
        @keyframes tabBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.25); }
          50% { transform: scale(0.92); }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes dotPop {
          0% { transform: translateX(-50%) scale(0); opacity: 0; }
          60% { transform: translateX(-50%) scale(1.3); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] border-r border-white/20 backdrop-blur-3xl py-8 gap-2 transition-all duration-300 ${
        isSearchOpen ? 'w-20 px-3' : 'w-64 px-6'
      }`}>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = isSearchOpen 
              ? item.id === "search" 
              : activeTab === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full rounded-lg transition-all duration-200 ${
                  isSearchOpen ? 'justify-center px-0' : 'justify-start gap-3'
                } ${
                  isActive 
                    ? "text-white shadow-lg scale-[1.02]" 
                    : "hover:bg-white/10 text-white/70 hover:text-white scale-100"
                }`}
                style={isActive ? {
                  backgroundColor: 'var(--brand-primary)',
                  borderColor: 'var(--brand-primary)'
                } : {}}
                onClick={() => handleMenuClick(item.id)}
                title={isSearchOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5" />
                {!isSearchOpen && <span>{item.label}</span>}
              </Button>
            )
          })}
        </nav>
      </aside>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 flex md:hidden h-16 border-t border-white/20 bg-black/20 backdrop-blur-3xl px-4 z-50">
        <div ref={mobileNavRef} className="flex w-full items-center justify-around relative">
          {/* Sliding indicator pill */}
          <div
            className="absolute -top-[1px] h-[3px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              ...indicatorStyle,
              backgroundColor: 'var(--brand-primary)',
              boxShadow: '0 0 8px var(--brand-primary)',
            }}
          />

          {mobileItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const isBouncing = animatingTab === item.id

            return (
              <button
                key={item.id}
                data-tab-btn
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? "text-white" 
                    : "text-white/50 hover:text-white/80"
                }`}
                onClick={() => onTabChange?.(item.id)}
              >
                <div
                  style={isBouncing && isActive ? { animation: 'tabBounce 0.4s ease' } : {}}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Active dot indicator */}
                {isActive && (
                  <div
                    className="absolute -bottom-0.5 left-1/2 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      animation: 'dotPop 0.3s ease forwards',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
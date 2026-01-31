"use client"

import { Home, BookOpen, Zap, MessageSquare, User, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchPanel } from "@/components/SearchPanel"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Sidebar({ activeTab = "home", onTabChange }: SidebarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "search", label: "Tìm kiếm", icon: Search, href: null },
    { id: "blog", label: "Blog", icon: BookOpen, href: "/blog" },
    { id: "stories", label: "Stories", icon: Zap, href: "/stories" },
    { id: "messages", label: "Messages", icon: MessageSquare, href: "/messages" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  const handleMenuClick = (itemId: string, href: string | null) => {
    if (itemId === "search") {
      setIsSearchOpen(!isSearchOpen)
    } else {
      setIsSearchOpen(false)
      if (href) {
        router.push(href)
      }
      onTabChange?.(itemId)
    }
  }

  const isActive = (itemId: string, href: string | null) => {
    if (isSearchOpen) return itemId === "search"
    if (itemId === "home") return pathname === "/" || pathname === ""
    if (href) return pathname === href
    return activeTab === itemId
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] border-r border-white/20 backdrop-blur-3xl py-8 gap-2 transition-all duration-300 ${
        isSearchOpen ? 'w-20 px-3' : 'w-64 px-6'
      }`}>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const itemIsActive = isActive(item.id, item.href)
            return (
              <Button
                key={item.id}
                variant={itemIsActive ? "default" : "ghost"}
                className={`w-full rounded-lg transition-all ${
                  isSearchOpen ? 'justify-center px-0' : 'justify-start gap-3'
                } ${
                  itemIsActive 
                    ? "text-white shadow-lg" 
                    : "hover:bg-white/10 text-white/70 hover:text-white"
                }`}
                style={itemIsActive ? {
                  backgroundColor: 'var(--brand-primary)',
                  borderColor: 'var(--brand-primary)'
                } : {}}
                onClick={() => handleMenuClick(item.id, item.href)}
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
      <nav className="fixed bottom-0 left-0 right-0 flex md:hidden h-16 border-t border-white/20 backdrop-blur-3xl px-4">
        <div className="flex w-full items-center justify-around">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const itemIsActive = isActive(item.id, item.href)
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className={`rounded-lg transition-all ${
                  itemIsActive 
                    ? "text-white" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                style={itemIsActive ? {
                  backgroundColor: 'var(--brand-primary)',
                  borderColor: 'var(--brand-primary)'
                } : {}}
                onClick={() => handleMenuClick(item.id, item.href)}
              >
                <Icon className="h-5 w-5" />
              </Button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

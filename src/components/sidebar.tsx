import { Home, BookOpen, Zap, MessageSquare, User, Settings, Search, Users, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchPanel } from "@/components/SearchPanel"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  isMobileHidden?: boolean
}

const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "reels", label: "Reels", icon: Play },
  { id: "stories", label: "Stories", icon: Zap },
  { id: "friends", label: "Friends", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
]

const mobileItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "reels", label: "Reels", icon: Play },
  { id: "friends", label: "Friends", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
]

export function Sidebar({ activeTab: _activeTab, onTabChange, isMobileHidden }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const [animatingTab, setAnimatingTab] = useState<string | null>(null)

  // Determine active item based on pathname if possible, otherwise fallback to prop
  const currentActiveId = useMemo(() => {
    if (isSearchOpen) return "search"
    if (pathname === "/") return "home"
    if (pathname === "/profile") return "profile"
    const matchingItem = menuItems.find(item => item.id !== "home" && item.id !== "search" && pathname.startsWith(`/${item.id}`))
    return matchingItem ? matchingItem.id : (_activeTab || "home")
  }, [pathname, isSearchOpen, _activeTab, user])

  // Update sliding indicator position
  const updateIndicator = useCallback(() => {
    if (!mobileNavRef.current) return
    const activeIndex = mobileItems.findIndex((item) => item.id === currentActiveId)
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
  }, [currentActiveId])

  useEffect(() => {
    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [updateIndicator])

  // Trigger bounce animation on tab change
  useEffect(() => {
    setAnimatingTab(currentActiveId)
    const timer = setTimeout(() => setAnimatingTab(null), 400)
    return () => clearTimeout(timer)
  }, [currentActiveId])

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const getItemHref = (id: string) => {
    if (id === "home") return "/"
    if (id === "profile") return "/profile"
    return `/${id}`
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
      <aside className={`hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] border-r border-white/20 backdrop-blur-md py-8 gap-2 transition-[width,padding] duration-300 transform translate-z-0 ${(isSearchOpen || currentActiveId === "messages") ? 'w-20 px-3' : 'w-64 px-6'
        }`}>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentActiveId === item.id

            const buttonContent = (
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full rounded-lg transition-[transform,background-color,color] duration-200 ${(isSearchOpen || currentActiveId === "messages") ? 'justify-center px-0' : 'justify-start gap-3'
                  } ${isActive
                    ? "text-white shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 text-white/70 hover:text-white scale-100"
                  }`}
                style={isActive ? {
                  backgroundColor: 'var(--brand-primary)',
                  borderColor: 'var(--brand-primary)'
                } : {}}
                title={(isSearchOpen || currentActiveId === "messages") ? item.label : undefined}
                onClick={item.id === "search" ? handleSearchToggle : undefined}
              >
                <Icon className="h-5 w-5" />
                {!(isSearchOpen || currentActiveId === "messages") && <span>{item.label}</span>}
              </Button>
            )

            if (item.id === "search") {
              return <div key={item.id}>{buttonContent}</div>
            }

            return (
              <Link key={item.id} href={getItemHref(item.id)} className="block w-full">
                {buttonContent}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 md:hidden h-16 border-t border-white/20 bg-black/20 backdrop-blur-md px-4 z-50 transform translate-z-0 ${isMobileHidden ? 'hidden' : 'flex'
        }`}>
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
            const isActive = currentActiveId === item.id
            const isBouncing = animatingTab === item.id

            const mobileButtonContent = (
              <div
                data-tab-btn
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 ${isActive
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
                  }`}
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
              </div>
            )

            if (item.id === "search") {
              return (
                <button key={item.id} onClick={handleSearchToggle}>
                  {mobileButtonContent}
                </button>
              )
            }

            return (
              <Link key={item.id} href={getItemHref(item.id)}>
                {mobileButtonContent}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

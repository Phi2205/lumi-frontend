import { Home, BookOpen, Zap, MessageSquare, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Sidebar({ activeTab = "home", onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "stories", label: "Stories", icon: Zap },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-border bg-card px-6 py-8 gap-2">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
                }`}
                onClick={() => onTabChange?.(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 flex md:hidden h-16 border-t border-border bg-card px-4">
        <div className="flex w-full items-center justify-around">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className={isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                onClick={() => onTabChange?.(item.id)}
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
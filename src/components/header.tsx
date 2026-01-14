"use client"

import { Bell, Search, Menu, LogOut, User, Settings } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl sm:text-4xl text-foreground font-normal" style={{ fontFamily: 'var(--font-dancing-script), cursive', letterSpacing: '0.5px', fontWeight: 600 }}>
            Lumi
          </span>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts, people..."
              className="pl-10 rounded-full border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* Avatar with Dropdown Menu */}
          <div className="hidden sm:block relative group">
            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>{user?.username?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
            </Avatar>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-card border border-border rounded-lg shadow-lg py-2">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-3 transition-colors"
                    onClick={() => {
                      // TODO: Navigate to profile
                      console.log('Navigate to profile')
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-3 transition-colors"
                    onClick={() => {
                      // TODO: Navigate to settings
                      console.log('Navigate to settings')
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-border my-1"></div>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-3 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
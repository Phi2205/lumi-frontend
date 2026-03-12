"use client"

import { Bell, Menu, LogOut, Moon, User as UserIcon, Settings } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { SwitchMode } from "@/components/SwitchMode"
import { UploadHeaderIcon } from "@/components/common/UploadHeaderIcon"

interface HeaderProps {
  isDarkMode: boolean
  onDarkModeToggle: (checked: boolean) => void
}

export function Header({ isDarkMode, onDarkModeToggle }: HeaderProps) {
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
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/5 border-b border-white/20 transform translate-z-0">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200">
          <span className="text-3xl sm:text-4xl text-white font-normal" style={{ fontFamily: 'var(--font-dancing-script), cursive', letterSpacing: '0.5px', fontWeight: 600 }}>
            Lumi
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <UploadHeaderIcon />

          <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* Avatar with Dropdown Menu */}
          <div className="hidden sm:block relative group">
            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-[ring] duration-200 ring-2 ring-blue-400/30">
              <AvatarImage src={user?.avatar_url || "/avatar-default.jpg"} alt="User" />
              <AvatarFallback>{user?.username?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
            </Avatar>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="backdrop-blur-xl bg-neutral-900/90 border border-white/20 rounded-xl shadow-2xl py-2 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/20 bg-white/5">
                  <p className="text-sm font-semibold text-white font-weight-600">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-neutral-300 mt-0.5 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-white font-medium hover:bg-white/15 flex items-center gap-3 transition-all duration-150 rounded-lg mx-1.5 group/item"
                    onClick={() => {
                      // TODO: Navigate to profile
                      console.log('Navigate to profile')
                    }}
                  >
                    <UserIcon className="h-4 w-4 text-white/80 group-hover/item:text-white transition-colors" />
                    <span>Profile</span>
                  </button>

                  {/* Dark Mode Toggle */}
                  <div className="w-full px-4 py-2.5 text-left text-sm text-white font-medium hover:bg-white/15 flex items-center justify-between transition-all duration-150 rounded-lg mx-1.5 group/item">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Moon className="h-4 w-4 text-white/80 group-hover/item:text-white transition-colors" />
                      <span>Dark Mode</span>
                    </div>
                    <div className="flex-shrink-0">
                      <SwitchMode isDarkMode={isDarkMode} onToggle={onDarkModeToggle} />
                    </div>
                  </div>

                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-white font-medium hover:bg-white/15 flex items-center gap-3 transition-all duration-150 rounded-lg mx-1.5 group/item"
                    onClick={() => {
                      // TODO: Navigate to settings
                      console.log('Navigate to settings')
                    }}
                  >
                    <Settings className="h-4 w-4 text-white/80 group-hover/item:text-white transition-colors" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-white/20 my-1.5 mx-2"></div>

                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 font-semibold hover:bg-red-500/20 hover:text-red-300 flex items-center gap-3 transition-all duration-150 rounded-lg mx-1.5 group/item"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 text-red-400 group-hover/item:text-red-300 transition-colors" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
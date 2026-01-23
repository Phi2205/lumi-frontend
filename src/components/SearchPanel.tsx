"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { filterUser } from "@/services/user.service"
import { User } from "@/types/user.type"
import { useRouter } from "next/navigation"

interface SearchPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  // Debounce search - gọi API sau 1s khi dừng đánh
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    // Tạo timeout mới
    const timeoutId = setTimeout(async () => {
      try {
        const response = await filterUser({
          name: searchQuery,
          limit: 10,
          page: 1
        })
        setSearchResults(response.users || [])
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 1000) // 1 giây

    // Cleanup: xóa timeout cũ khi user đánh chữ mới
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleUserClick = (username: string) => {
    router.push(`/users/${username}`)
    setSearchQuery("")
    setSearchResults([])
    onClose()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed left-0 md:left-20 top-16 h-[calc(100vh-64px)] w-full md:w-96 border-r border-white/20 backdrop-blur-3xl bg-white/5 z-30">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Tìm kiếm</h2>
            <button
              type="button"
              aria-label="Đóng tìm kiếm"
              onClick={onClose}
              className="md:hidden text-white/60 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 rounded-xl border-white/20 backdrop-blur-2xl bg-white/10 text-white placeholder:text-white/50"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Xóa nội dung tìm kiếm"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!searchQuery ? (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-white/60 mb-4">Mới đây</h3>
              <p className="text-white/40 text-sm text-center py-8">
                Không có nội dung tìm kiếm mới đây.
              </p>
            </div>
          ) : isSearching ? (
            <div className="p-6 text-center text-white/60">
              Đang tìm kiếm...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-1">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user.username)}
                  className="w-full px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-all"
                >
                  <Avatar className="h-10 w-10 ring-1 ring-white/20">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-cyan-400 text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    {user.bio && (
                      <p className="text-white/60 text-xs truncate">{user.bio}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-white/60 text-sm">Không tìm thấy kết quả</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

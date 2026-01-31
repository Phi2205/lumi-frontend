"use client"

import { Search } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

export interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: boolean
  isOnline: boolean
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect?: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = conversations.filter((conv) => conv.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 100% 0%, rgba(34, 211, 238, 0.12) 0%, rgba(3, 0, 20, 0.8) 50%, #000000 100%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(circle 500px at 0% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Search Header */}
      <div 
        className="p-4 border-b backdrop-blur-[20px] relative z-10"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
          <input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm text-white placeholder-white/50 focus:outline-none transition-all"
            style={{
              backdropFilter: 'blur(18px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto relative z-10 space-y-1.5 p-2">
        {filtered.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect?.(conversation.id)}
            className={`w-full text-left gap-3 px-3 py-3 rounded-xl transition-all group cursor-pointer flex items-center`}
            style={selectedId === conversation.id ? {
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(59, 130, 246, 0.25)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)'
            } : {
              backdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12 border-2" style={{
                borderColor: selectedId === conversation.id ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.15)'
              }}>
                <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-semibold">{conversation.name[0]}</AvatarFallback>
              </Avatar>
              {conversation.isOnline && (
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-white/80 animate-pulse" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-sm font-medium truncate transition-colors ${
                  selectedId === conversation.id 
                    ? 'text-white' 
                    : 'text-white/90 group-hover:text-white'
                }`}>
                  {conversation.name}
                </p>
                <span className={`text-xs ml-2 flex-shrink-0 transition-colors ${
                  conversation.unread 
                    ? 'text-cyan-300 font-semibold' 
                    : 'text-white/50'
                }`}>
                  {conversation.timestamp}
                </span>
              </div>
              <p className={`text-xs truncate transition-colors ${
                conversation.unread 
                  ? 'font-medium text-white/80' 
                  : 'text-white/50 group-hover:text-white/70'
              }`}>
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && (
              <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

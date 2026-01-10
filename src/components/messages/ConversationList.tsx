"use client"

import { Search } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <div className="flex flex-col h-full border-r border-border bg-card">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full border-border bg-secondary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((conversation) => (
          <Button
            key={conversation.id}
            variant="ghost"
            className={`w-full justify-start gap-3 rounded-none px-4 py-3 h-auto border-b border-border last:border-b-0 ${
              selectedId === conversation.id ? "bg-secondary text-foreground" : "hover:bg-secondary/50 text-foreground"
            }`}
            onClick={() => onSelect?.(conversation.id)}
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              {conversation.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-card" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between">
                <p className={`font-medium truncate ${conversation.unread ? "font-semibold" : ""}`}>
                  {conversation.name}
                </p>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{conversation.timestamp}</span>
              </div>
              <p
                className={`text-sm truncate ${conversation.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />}
          </Button>
        ))}
      </div>
    </div>
  )
}

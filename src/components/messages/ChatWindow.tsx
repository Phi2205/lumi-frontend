"use client"

import { SendIcon, Phone, Video, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"

export interface Message {
  id: string
  sender: string
  senderAvatar: string
  content: string
  timestamp: string
  isOwn: boolean
}

interface ChatWindowProps {
  conversationName: string
  conversationAvatar: string
  messages: Message[]
  onSendMessage?: (content: string) => void
}

export function ChatWindow({ conversationName, conversationAvatar, messages, onSendMessage }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversationAvatar || "/placeholder.svg"} alt={conversationName} />
            <AvatarFallback>{conversationName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{conversationName}</p>
            <p className="text-xs text-muted-foreground">Active 2m ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-2 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
            {!message.isOwn && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.sender} />
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col gap-1 max-w-xs ${message.isOwn ? "items-end" : "items-start"}`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isOwn
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card px-4 py-4 sm:px-6">
        <div className="flex gap-2">
          <Input
            placeholder="Write a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full border-border bg-secondary text-foreground placeholder:text-muted-foreground"
          />
          <Button
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

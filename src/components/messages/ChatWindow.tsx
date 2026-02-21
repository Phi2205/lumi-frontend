"use client"

import { SendIcon, Phone, Video, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, useRef, useEffect } from "react"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassInput } from "@/lib/components/glass-input"
import { GlassCard } from "@/lib/components/glass-card"

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
  isDarkMode?: boolean
}

export function ChatWindow({ conversationName, conversationAvatar, messages, onSendMessage, isDarkMode = true }: ChatWindowProps) {
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
    <div className="flex flex-col h-full relative overflow-hidden">


      {/* Chat Header */}
      <div 
        className="flex items-center justify-between px-4 py-4 sm:px-6 border-b backdrop-blur-[20px] relative z-10"
        style={isDarkMode ? {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        } : {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border"
            style={{
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <AvatarImage src={conversationAvatar || "/placeholder.svg"} alt={conversationName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">{conversationName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{conversationName}</p>
            <p className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Active 2m ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GlassButton
            variant="ghost"
            size="sm"
            blur={18}
            refraction={0.1}
            depth={2}
            className="h-9 w-9 p-0"
          >
            <Phone className="h-4 w-4 text-cyan-300" />
          </GlassButton>
          <GlassButton
            variant="ghost"
            size="sm"
            blur={18}
            refraction={0.1}
            depth={2}
            className="h-9 w-9 p-0"
          >
            <Video className="h-4 w-4 text-cyan-300" />
          </GlassButton>
          <GlassButton
            variant="ghost"
            size="sm"
            blur={18}
            refraction={0.1}
            depth={2}
            className="h-9 w-9 p-0"
          >
            <MoreHorizontal className="h-4 w-4 text-cyan-300" />
          </GlassButton>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative z-10 scroll-glass">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
            {!message.isOwn && (
              <Avatar 
                className="h-8 w-8 flex-shrink-0 border"
                style={{
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.sender} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">{message.sender[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col gap-1 max-w-xs ${message.isOwn ? "items-end" : "items-start"}`}>
              <div
                className="rounded-2xl px-4 py-3 backdrop-blur-[18px] border text-sm break-words transition-all hover:scale-105"
                style={message.isOwn ? (isDarkMode ? {
                  backgroundColor: 'rgba(59, 130, 246, 0.35)',
                  borderColor: 'rgba(59, 130, 246, 0.5)',
                  color: 'rgb(255, 255, 255)',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                } : {
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 0.5)',
                  color: 'rgb(255, 255, 255)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                }) : (isDarkMode ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgb(255, 255, 255)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                } : {
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'rgb(20, 20, 20)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                })}
              >
                <p>{message.content}</p>
              </div>
              <span 
                className="text-xs"
                style={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
                }}
              >
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div 
        className="px-4 py-4 sm:px-6 border-t backdrop-blur-[20px] relative z-10"
        style={isDarkMode ? {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        } : {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: 'rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              placeholder="Write a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="w-full rounded-full px-4 py-2.5 text-sm focus:outline-none transition-all"
              style={isDarkMode ? {
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                color: 'rgb(255, 255, 255)'
              } : {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                color: 'rgb(20, 20, 20)'
              }}
            />
          </div>
          <GlassButton
            blur={22}
            refraction={0.15}
            depth={3}
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="h-10 w-10 p-0"
          >
            <SendIcon className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>
    </div>
  )
}

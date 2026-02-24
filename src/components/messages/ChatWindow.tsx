"use client"

import { SendIcon, Phone, Video, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, memo } from "react"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassInput } from "@/lib/components/glass-input"
import { GlassCard } from "@/lib/components/glass-card"

export interface MessageUI {
  id: string
  sender: string
  senderAvatar: string
  content: string
  timestamp: string
  isOwn: boolean
  isRead?: boolean
}

interface ChatWindowProps {
  conversationName: string
  conversationAvatar: string
  messages: MessageUI[]
  onSendMessage?: (content: string) => void
  isDarkMode?: boolean
}

const MessageItem = memo(({ message, isDarkMode }: { message: MessageUI, isDarkMode: boolean }) => {
  return (
    <div className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"} animate-in fade-in duration-400`}>
      {!message.isOwn && (
        <Avatar 
          className="h-9 w-9 flex-shrink-0 border"
          style={{
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.sender} />
          <AvatarFallback className="bg-zinc-800 text-white text-xs">{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col gap-1.5 max-w-[80%] ${message.isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-[14px] leading-[1.5] shadow-sm transition-all ${
            message.isOwn 
              ? 'bg-brand-primary text-white font-medium border border-white/10' 
              : isDarkMode 
                ? 'bg-zinc-800/80 text-white border border-white/5 font-normal'
                : 'bg-white/90 text-gray-900 border border-gray-200 font-normal'
          }`}
        >
          <p>{message.content}</p>
        </div>
        <div className="flex items-center gap-1.5 px-1">
          <span 
            className="text-[11px] uppercase tracking-wider font-semibold"
            style={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {message.timestamp}
          </span>
          {message.isOwn && (
            <div className="flex items-center">
              {message.isRead ? (
                <div className="flex">
                  <svg
                    className="w-3.5 h-3.5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                  <svg
                    className="w-3.5 h-3.5 text-blue-500 ml-[-7px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 14l3 3L21 6" />
                  </svg>
                </div>
              ) : (
                <svg
                  className="w-3.5 h-3.5 text-zinc-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l4 4L19 6" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export const ChatWindow = memo(({ conversationName, conversationAvatar, messages, onSendMessage, isDarkMode = true }: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState("")

  


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
        className="flex items-center justify-between px-4 py-4 sm:px-6 border-b backdrop-blur-md relative z-10 transform translate-z-0"
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
          <div className="relative">
            <Avatar className="h-10 w-10 border"
              style={{
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
              }}
            >
              <AvatarImage src={conversationAvatar || "/placeholder.svg"} alt={conversationName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">{conversationName[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-black/20" />
          </div>
          <div>
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{conversationName}</p>
            <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-gray-600'} font-semibold`}>Đang hoạt động</p>
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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col-reverse gap-4 relative z-10 scroll-glass">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* Input Area */}
      <div 
        className="px-4 py-4 sm:px-6 border-t backdrop-blur-md relative z-10 transform translate-z-0"
        style={isDarkMode ? {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        } : {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: 'rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-black/20 backdrop-blur-md rounded-2xl px-4 py-1 border border-white/10 focus-within:border-brand-primary/50 transition-[border-color] duration-200 min-w-0 transform translate-z-0"
            style={!isDarkMode ? {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'rgba(0, 0, 0, 0.1)'
            } : undefined}
          >
            <input
              placeholder="Aa..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="w-full py-2.5 text-[14px] bg-transparent border-none outline-none focus:outline-none transition-all"
              style={{
                color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
              }}
            />
          </div>
          <GlassButton
            blur={22}
            refraction={0.15}
            depth={3}
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="h-12 w-12 p-0"
          >
            <SendIcon className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>
    </div>
  )
});

ChatWindow.displayName = "ChatWindow";

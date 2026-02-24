"use client"

import { useState } from "react"
import { 
  X, Minus, Send, Mic, Image as ImageIcon, 
  Smile, ThumbsUp, ChevronDown, MoreHorizontal, 
  Sticker, Gift, Ghost
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { GlassButton } from "@/lib/components/glass-button"
import { useMessages } from "@/hooks/chat/useMessages"
import { useAuth } from "@/contexts/AuthContext"
import { useChatRealtime } from "@/socket/chat/useChatRealtime"

interface MiniChatProps {
  conversationId?: string
  recipientId: string
  recipientName: string
  recipientAvatar: string
  onClose: () => void
  onMinimize?: () => void
  isMinimized?: boolean
}

export function MiniChat({ 
  conversationId, 
  recipientId, 
  recipientName, 
  recipientAvatar, 
  onClose,
  onMinimize,
  isMinimized = false
}: MiniChatProps) {
  const [inputValue, setInputValue] = useState("")
  const { messages, appendRealtimeMessage, loading } = useMessages(conversationId)
  const { sendMessage } = useChatRealtime({
    conversationId,
    onNewMessageReceived: (msg) => {
      // Tin nhắn realtime sẽ được hook useMessages xử lý bên trong nếu chúng ta truyền callback
      // Nhưng ở đây MiniChat đang dùng hook useMessages độc lập.
      // Để đồng bộ nhất, ta nên để useMessages xử lý append.
      appendRealtimeMessage(msg);
    }
  })
  const { user } = useAuth()

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  if (isMinimized) {
    return (
      <div className="relative group pointer-events-auto" onClick={onMinimize}>
        <div className="absolute -top-1 -right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-5 h-5 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-700 hover:scale-110 transition-all"
          >
            <X className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="relative cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl">
          <Avatar className="h-14 w-14 ring-2 ring-white/20 ring-offset-2 ring-offset-black/20 hover:ring-brand-primary/50 transition-all">
            <AvatarImage src={recipientAvatar || "/avatar-default.jpg"} />
            <AvatarFallback className="bg-zinc-800 text-white text-lg">{recipientName[0]}</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-[#1c1c1c]" />
        </div>

        {/* Name Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl">
           <span className="text-xs font-semibold text-white tracking-wide">{recipientName}</span>
        </div>
      </div>
    )
  }



  return (
    <div className="w-[330px] h-[450px] relative rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-[20px] border border-white/20">
      {/* Exact Modal Background Styling */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <defs>
          <linearGradient id="miniChatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgba(30,30,30,0.98)" }} />
            <stop offset="50%" style={{ stopColor: "rgba(20,20,20,0.98)" }} />
            <stop offset="100%" style={{ stopColor: "rgba(10,10,10,0.99)" }} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#miniChatGrad)" />
      </svg>

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0 relative z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-1 ring-white/10">
              <AvatarImage src={recipientAvatar || "/avatar-default.jpg"} />
              <AvatarFallback className="bg-zinc-800 text-white">{recipientName[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-[#141414]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-white tracking-tight leading-tight">{recipientName}</span>
            <span className="text-[11px] text-white/40 font-medium tracking-wide">Đang hoạt động</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div 
            onClick={onMinimize}
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95"
          >
            <Minus className="h-4 w-4 text-white/80" />
          </div>
          <div 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-red-500/20 hover:scale-110 active:scale-95"
          >
            <X className="h-4 w-4 text-white/80" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4 scroll-glass relative z-10">
        {/* Message groups */}
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} animate-in fade-in duration-400`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-[1.5] shadow-md ${
              msg.isOwn 
                ? 'bg-brand-primary text-white font-medium border border-white/10' 
                : 'bg-white/10 backdrop-blur-md text-white border border-white/5 font-normal'
            }`}>
              {msg.content}
            </div>
            {msg.isOwn && (
              <div className="flex items-center mt-1 px-1">
                {msg.isRead ? (
                  <div className="flex">
                    <svg
                      className="w-3 h-3 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l4 4L19 6" />
                    </svg>
                    <svg
                      className="w-3 h-3 text-blue-400 ml-[-6px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 14l3 3L21 6" />
                    </svg>
                  </div>
                ) : (
                  <svg
                    className="w-3 h-3 text-white/30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Intro Section - Đưa xuống cuối DOM để hiển thị ở đầu danh sách khi dùng flex-col-reverse */}
        <div className="flex flex-col items-center py-6 px-4 gap-4 text-center">
          <Avatar className="h-20 w-20 ring-1 ring-white/10 shadow-2xl">
            <AvatarImage src={recipientAvatar || "/avatar-default.jpg"} />
            <AvatarFallback className="text-3xl bg-zinc-800 text-white">{recipientName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-xl text-white tracking-tight">{recipientName}</h3>
            <p className="text-xs text-white/40 mt-1">Các bạn là bạn bè</p>
          </div>
          <p className="text-[11px] text-white/30 px-6 mt-2 leading-relaxed italic border-t border-white/5 pt-4">
             🔒 Tin nhắn được mã hóa đầu cuối. <span className="text-brand-primary cursor-pointer hover:underline not-italic">Tìm hiểu thêm</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 pt-2 shrink-0 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center shrink-0">
             <div className="p-1.5 hover:bg-white/10 rounded-lg transition-all cursor-pointer">
              <ImageIcon className="h-5 w-5 text-brand-primary" />
             </div>
             <div className="p-1.5 hover:bg-white/10 rounded-lg transition-all cursor-pointer">
              <Sticker className="h-5 w-5 text-brand-primary" />
             </div>
          </div>

          <div className="flex-1 flex items-center bg-black/40 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 focus-within:border-brand-primary/50 transition-all min-w-0">
            <input 
              placeholder="Aa..."
              className="bg-transparent border-none outline-none text-[14px] flex-1 text-white placeholder-white/20 min-w-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Smile className="h-5 w-5 text-brand-primary cursor-pointer hover:opacity-80 transition-colors ml-1 shrink-0" />
          </div>

          <div className="shrink-0">
            {inputValue.trim() ? (
               <div className="p-2 bg-brand-primary hover:bg-brand-primary-light rounded-full shadow-lg transition-all cursor-pointer" onClick={handleSend}>
                <Send className="h-4 w-4 text-white" />
               </div>
            ) : (
              <div className="p-2 hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                <ThumbsUp className="h-5 w-5 text-brand-primary" />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}





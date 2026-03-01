"use client"

import { SendIcon, Phone, Video, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, memo, useEffect } from "react"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassInput } from "@/lib/components/glass-input"
import { GlassCard } from "@/lib/components/glass-card"
import { Participant } from "@/apis/conversation.api"
import { ParticipantUI } from "./ConversationList"

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
  participants: ParticipantUI[]
  currentUserId?: string
  onMessageViewed?: (messageId: string) => void
}

const listUserSeenMessage = (participants: ParticipantUI[], messageId: string, currentUserId: string | undefined) => {
  const listUserSeen = participants.filter(p => p.id !== currentUserId && p.lastSeenMessageId && parseInt(p.lastSeenMessageId) >= parseInt(messageId))
  return listUserSeen
}

export const MessageItem = memo(({ message, isDarkMode, participants, currentUserId, onMessageViewed, showAuto }: { message: MessageUI, isDarkMode: boolean, participants: ParticipantUI[], currentUserId?: string, onMessageViewed?: (id: string) => void, showAuto: boolean }) => {
  const [showDetails, setShowDetails] = useState(false);


  // useEffect(() => {
  //   // Chỉ gửi event nếu là tin nhắn của người khác và ID tin nhắn lớn hơn ID đã xem cuối cùng của mình
  //   const myInfo = participants.find(p => p.id === currentUserId);
  //   const myLastSeenId = myInfo?.lastSeenMessageId;
  //   console.log("myLastSeenId", myLastSeenId)
  //   // console.log("participants", participants)
  //   if (!onMessageViewed || message.isOwn || (myLastSeenId && message.id <= myLastSeenId)) return;

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         console.log("onMessageViewed", message.id)
  //         onMessageViewed(message.id);
  //         // console.log("myLastSeenId", myLastSeenId)
  //         // console.log("message.id", message.id)
  //         // console.log("onMessageViewed", message.id)
  //         observer.disconnect(); // Chỉ gửi một lần
  //       }
  //     },
  //     { threshold: 0.5 } // 50% tin nhắn hiện ra thì tính là đã xem
  //   );

  //   const currentEl = document.getElementById(`msg-${message.id}`);
  //   if (currentEl) observer.observe(currentEl);

  //   return () => observer.disconnect();
  // }, [message.id, onMessageViewed, message.isOwn, participants, currentUserId]);



  return (
    <div id={`msg-${message.id}`} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : "flex-row"} animate-in fade-in duration-400`}>

      {!message.isOwn && (
        <Avatar
          className="h-9 w-9 flex-shrink-0 border mt-6"
          style={{
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <AvatarImage src={message.senderAvatar || "/avatar-default.jpg"} alt={message.sender} />
          <AvatarFallback className="bg-zinc-800 text-white text-xs">{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 max-w-[80%] ${message.isOwn ? "items-end" : "items-start"}`}>
        <span
          className="text-[10px] px-2 mb-0.5 uppercase tracking-wider font-semibold opacity-60"
          style={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'
          }}
        >
          {message.timestamp}
        </span>
        <div
          onClick={() => setShowDetails(!showDetails)}
          className={`rounded-2xl px-4 py-2.5 text-[14px] cursor-pointer active:scale-[0.98] select-none leading-[1.5] shadow-sm transition-all ${message.isOwn
            ? 'bg-brand-primary text-white font-medium border border-white/10'
            : isDarkMode
              ? 'bg-zinc-800/80 text-white border border-white/5 font-normal'
              : 'bg-white/90 text-gray-900 border border-gray-200 font-normal'
            }`}
        >
          <p>{message.content}</p>
        </div>
        <div
          className={`grid transition-all duration-300 ease-in-out ${message.isOwn && (showAuto || showDetails)
            ? "grid-rows-[1fr] opacity-100 mt-1.5"
            : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
        >
          <div className="overflow-hidden">
            <div className="flex items-center justify-end px-1 pb-1">
              {(() => {
                const readBy = listUserSeenMessage(participants, message.id, currentUserId);
                if (readBy.length > 0) {
                  return (
                    <div className="flex -space-x-1.5">
                      {readBy.map((p) => (
                        <Avatar
                          key={p.id}
                          className="h-4 w-4 ring-1 ring-white/20 border-none transition-all hover:scale-110 active:scale-95"
                          title={p.name}
                        >
                          <AvatarImage src={p.avatar_url || "/avatar-default.jpg"} />
                          <AvatarFallback className="text-[6px] bg-zinc-800 text-white">
                            {p.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  );
                }
                return (
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
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export const ChatWindow = memo(({ conversationName, conversationAvatar, participants, currentUserId, messages, onSendMessage, onMessageViewed, isDarkMode = true }: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState("")

  // Biến đếm để chỉ cho phép hiển thị 1 lần (tin nhắn mới nhất có người xem)
  let autoShowCount = 1;

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue)
      console.log("input value", inputValue)
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
        <div className="flex items-center gap-3 ml-12 lg:ml-0">
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
        {messages.map((message, index) => {
          // Kiểm tra xem tin nhắn này có ai xem chưa
          const seenByCount = listUserSeenMessage(participants, message.id, currentUserId).length;

          let canShow = false;

          // 1. Nếu là tin nhắn mới nhất, là của mình và chưa ai đọc -> hiện dấu tích
          if (index === 0 && message.isOwn && seenByCount === 0) {
            canShow = true;
          }
          // 2. Nếu là tin nhắn của mình, đã có người đọc -> hiện avatar (chỉ hiện 1 cái mới nhất đã đọc)
          else if (message.isOwn && seenByCount > 0 && autoShowCount > 0) {
            canShow = true;
            autoShowCount--;
          }

          return (
            <MessageItem
              key={message.id}
              message={message}
              participants={participants}
              currentUserId={currentUserId}
              isDarkMode={isDarkMode}
              onMessageViewed={onMessageViewed}
              showAuto={canShow}
            />
          );
        })}
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

"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MiniChat } from './MiniChat'
import { usePathname } from 'next/navigation'
import { useChatRealtime } from '@/socket/chat/useChatRealtime'
import { useAuth } from '@/contexts/AuthContext'
import { getConversationDetailService, mapConversationToUI } from '@/services/conversation.service'

interface MiniChatSession {
  recipientId: string
  recipientName: string
  recipientAvatar: string
  conversationId?: string
  isMinimized?: boolean
  initialShowTooltip?: boolean
}

interface MiniChatContextType {
  openChat: (session: Omit<MiniChatSession, 'isMinimized'>) => void
  closeChat: (recipientId: string) => void
  toggleMinimize: (recipientId: string) => void
  chats: MiniChatSession[]
}

const MiniChatContext = createContext<MiniChatContextType | undefined>(undefined)

export function MiniChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [chats, setChats] = useState<MiniChatSession[]>([])
  const pathname = usePathname()
  const isMessagesPage = pathname?.startsWith('/messages')

  const openChat = (session: Omit<MiniChatSession, 'isMinimized'>) => {
    setChats((prev) => {
      // If already open, just bring to front or un-minimize
      if (prev.find((c) => c.recipientId === session.recipientId)) {
        return prev.map((c) =>
          c.recipientId === session.recipientId
            ? { ...c, isMinimized: false }
            : c
        )
      }

      // Max 3 chats for now to avoid cluttering
      const next = [...prev, { ...session, isMinimized: false }]
      if (next.length > 3) {
        return next.slice(1)
      }
      return next
    })
  }

  const closeChat = (recipientId: string) => {
    setChats((prev) => prev.filter((c) => c.recipientId !== recipientId))
  }

  const toggleMinimize = (recipientId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.recipientId === recipientId ? { ...c, isMinimized: !c.isMinimized } : c
      )
    )
  }

  useChatRealtime({
    onNewMessageReceived: (message) => {
      console.log('New message received:', message)
    },
    onConversationUpdate: async (data: { conversationId: string, lastMessage: any }) => {
      console.log('Conversation updated:', data)
      if (isMessagesPage) return; // Don't open mini chats if on messages page

      setChats((prev) => {
        const exists = prev.find((c) => c.conversationId === data.conversationId)
        if (!exists && user) {
          // Load conversation if not exists
          getConversationDetailService(data.conversationId)
            .then((res) => {
              if (res && res.data) {
                const mapped = mapConversationToUI(res.data, user.id)
                const recipient = mapped.participants.find((p) => p.id !== user.id)
                if (recipient) {
                  setChats((prev) => {
                    if (prev.find((c) => c.recipientId === recipient.id)) return prev
                    const next = [
                      ...prev,
                      {
                        recipientId: recipient.id,
                        recipientName: recipient.name,
                        recipientAvatar: recipient.avatar_url,
                        conversationId: mapped.id,
                        isMinimized: true,
                        initialShowTooltip: true,
                      },
                    ]
                    return next.length > 3 ? next.slice(1) : next
                  })
                }
              }
            })
            .catch((err) => console.error('Error loading conversation detail:', err))
        }
        return prev
      })
    },
  })

  const activeChats = chats.filter(c => !c.isMinimized)
  const minimizedChats = chats.filter(c => c.isMinimized)

  return (
    <MiniChatContext.Provider value={{ openChat, closeChat, toggleMinimize, chats }}>
      {children}

      {!isMessagesPage && (
        <>
          {/* Container for Active Chats (Positioned to the left of bubbles) */}
          <div className="fixed bottom-4 right-20 lg:right-24 z-50 hidden md:flex flex-row-reverse items-end gap-4 px-4 pointer-events-none transition-all duration-300">
            {activeChats.map((chat) => (
              <div key={chat.recipientId} className="pointer-events-auto">
                <MiniChat
                  conversationId={chat.conversationId}
                  recipientId={chat.recipientId}
                  recipientName={chat.recipientName}
                  recipientAvatar={chat.recipientAvatar}
                  onClose={() => closeChat(chat.recipientId)}
                  onMinimize={() => toggleMinimize(chat.recipientId)}
                  isMinimized={chat.isMinimized}
                />
              </div>
            ))}
          </div>

          {/* Container for Minimized Bubbles (Right Vertical Stack from bottom) */}
          <div className="fixed bottom-4 right-4 z-50 hidden md:flex flex-col-reverse items-end gap-3 pointer-events-none">
            {/* New Message Button (as seen in reference) */}
            <div className="pointer-events-auto">
              <div className="w-12 h-12 bg-white dark:bg-zinc-100 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all text-zinc-900 border border-white/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </div>
            </div>

            {minimizedChats.map((chat) => (
              <div key={chat.recipientId} className="pointer-events-auto">
                <MiniChat
                  conversationId={chat.conversationId}
                  recipientId={chat.recipientId}
                  recipientName={chat.recipientName}
                  recipientAvatar={chat.recipientAvatar}
                  onClose={() => closeChat(chat.recipientId)}
                  onMinimize={() => toggleMinimize(chat.recipientId)}
                  isMinimized={chat.isMinimized}
                  initialShowTooltip={chat.initialShowTooltip}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </MiniChatContext.Provider>
  )
}

export const useMiniChat = () => {
  const context = useContext(MiniChatContext)
  if (!context) {
    throw new Error('useMiniChat must be used within a MiniChatProvider')
  }
  return context
}

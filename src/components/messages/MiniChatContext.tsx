"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { MiniChat } from './MiniChat'
import { usePathname } from 'next/navigation'
import { useChatRealtime } from '@/socket/chat/useChatRealtime'
import { useAuth } from '@/contexts/AuthContext'
import { getConversationDetailService, mapConversationToUI } from '@/services/conversation.service'
import { ParticipantUI } from './ConversationList'

interface MiniChatSession {
  recipientId: string
  recipientName: string
  recipientAvatar: string
  conversationId?: string
  lastSeenMessageId?: string
  unreadCount?: number
  isMinimized?: boolean
  initialShowTooltip?: boolean
  participants?: ParticipantUI[]
}

interface MiniChatContextType {
  openChat: (session: Omit<MiniChatSession, 'isMinimized' | 'participants'> & { participants?: ParticipantUI[] }) => void
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

  const openChat = (session: Omit<MiniChatSession, 'isMinimized' | 'participants'> & { participants?: ParticipantUI[] }) => {
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

  useEffect(() => {
    console.log('chats', chats)
  }, [chats])

  useChatRealtime({
    onNewMessageReceived: (message) => {
      console.log('New message received in MiniChatContext:', message)
      const msgConvId = message.conversation_id;
      const isMe = message.senderId === user?.id || message.sender_id === user?.id;
      console.log('isMe', isMe)
      console.log('msgConvId', msgConvId)
      console.log('user?.id', user?.id)
      if (msgConvId && !isMe) {
        console.log('msgConvId', msgConvId)
        setChats((prev) => {
          console.log('Previous chats state:', prev);
          return prev.map((chat) => {
            const isMatch = chat.conversationId === msgConvId;
            console.log(`Checking chat ${chat.conversationId} against ${msgConvId}: match=${isMatch}`);
            if (isMatch) {
              const newCount = (chat.unreadCount || 0) + 1;
              console.log("newCount", newCount);
              console.log(`Updating unreadCount for ${chat.conversationId} from ${chat.unreadCount || 0} to ${newCount}`);
              return { ...chat, unreadCount: newCount };
            }
            return chat;
          });
        });
      }
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
                console.log('Mapped conversation:', mapped)
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
                        participants: mapped.participants,
                        lastSeenMessageId: mapped.lastSeenMessageId,
                        unreadCount: mapped.unreadCount,
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
    onUserReadMessage: (data: { conversation_id: string, user_id: string, last_seen_message_id?: string, message_id?: string }) => {
      console.log('User read message in MiniChatContext:', data)
      const lastSeenId = data.last_seen_message_id || data.message_id
      if (!lastSeenId) return

      setChats((prev) =>
        prev.map((chat) =>
          chat.conversationId === data.conversation_id
            ? {
              ...chat,
              lastSeenMessageId: data.user_id === user?.id ? lastSeenId : chat.lastSeenMessageId,
              unreadCount: data.user_id === user?.id ? 0 : chat.unreadCount,
              participants: chat.participants?.map((p) =>
                p.id === data.user_id
                  ? { ...p, lastSeenMessageId: lastSeenId }
                  : p
              )
            }
            : chat
        )
      )
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
                  participants={chat.participants}
                  lastSeenMessageId={chat.lastSeenMessageId}
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
                  participants={chat.participants}
                  lastSeenMessageId={chat.lastSeenMessageId}
                  unreadCount={chat.unreadCount}
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

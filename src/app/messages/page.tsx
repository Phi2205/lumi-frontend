"use client"

import { useState, useEffect, useCallback } from "react"
import { ConversationList, type ConversationUI } from "@/components/messages/ConversationList"
import { ChatWindow, type MessageUI } from "@/components/messages/ChatWindow"
import { useDarkMode } from "@/hooks/useDarkMode"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ChevronLeft } from "lucide-react"
import { GlassButton } from "@/lib/components/glass-button"
import { useAuth } from "@/contexts/AuthContext"
import { useConversations } from "@/hooks/chat/useConversations"
import { useMessages } from "@/hooks/chat/useMessages"
import { useChatRealtime } from "@/socket/chat/useChatRealtime"

// export default function Page() {
//   return <div>Test messages</div>
// }

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const { conversations, loading, error, reload, setConversations, markAsRead } = useConversations()
  const { messages, loading: messagesLoading, hasMore, loadMore, appendRealtimeMessage } = useMessages(selectedConversationId || undefined)
  const { sendMessage, markRead } = useChatRealtime({
    onNewMessageReceived: (msg) => {
      appendRealtimeMessage(msg)
    }
  })
  const { isDarkMode, handleDarkModeToggle } = useDarkMode()
  const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)
  const [showChatMobile, setShowChatMobile] = useState(false)



  // Set default selected conversation when list loads
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Auto-show chat on mobile when selection changed if not already shown
  useEffect(() => {
    if (window.innerWidth < 1024 && selectedConversationId) {
      // setShowChatMobile(true) 
      // We don't want to auto-trigger on initial load or it might be confusing
    }
  }, [selectedConversationId])

  const handleSendMessage = (message: string) => {
    if (selectedConversationId) {
      sendMessage(message, selectedConversationId)
    }
  }

  // Auto mark as read when selecting conversation or receiving new message in selected conversation
  useEffect(() => {
    if (selectedConversationId) {
      const selectedConv = conversations.find(c => c.id === selectedConversationId);
      if (selectedConv && (selectedConv.unreadCount || 0) > 0 && selectedConv.lastMessageId) {
        console.log("Auto-marking as read for:", selectedConversationId);
        markRead(selectedConv.lastMessageId, selectedConversationId);
        markAsRead(selectedConversationId, selectedConv.lastMessageId);
      }
    }
  }, [selectedConversationId, conversations, markRead, markAsRead]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    setShowChatMobile(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundRenderer
        isDarkMode={isDarkMode}
        imageLoaded={imageLoaded}
        imageError={imageError}
      />

      <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
      <Sidebar activeTab="messages" />

      {/* Instagram-style Layout */}
      <div className="flex h-[calc(100vh)] pt-16 md:ml-20">
        {/* Left Sidebar - Conversation List */}
        <div className={`w-full lg:w-[400px] flex-shrink-0 border-r border-white/10 overflow-hidden relative z-10 
          ${showChatMobile ? 'hidden lg:flex' : 'flex'}`}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
            loading={loading}
          />
        </div>

        {/* Right Area - Chat Window */}
        <div className={`flex-1 flex flex-col min-w-0 relative z-10 
          ${showChatMobile ? 'flex' : 'hidden lg:flex'}`}>
          {selectedConversationId ? (
            <div className="flex flex-col h-full bg-black/20 lg:bg-transparent">
              {/* Mobile Chat Header Back Button overlay */}
              <div className="lg:hidden absolute left-4 top-[1.15rem] z-[60]">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  blur={15}
                  onClick={() => setShowChatMobile(false)}
                  className="rounded-full h-9 w-9 p-0 flex items-center justify-center border-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </GlassButton>
              </div>
              <ChatWindow
                conversationName={conversations.find(c => c.id === selectedConversationId)?.name || ""}
                conversationAvatar={conversations.find(c => c.id === selectedConversationId)?.avatar || ""}
                participants={conversations.find(c => c.id === selectedConversationId)?.participants || []}
                currentUserId={user?.id}
                messages={messages}
                onSendMessage={handleSendMessage}
                onMessageViewed={(msgId) => {
                  if (selectedConversationId) {
                    console.log("onMessageViewed", msgId)
                    markRead(msgId, selectedConversationId)
                    markAsRead(selectedConversationId, msgId)
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-white/50 text-sm">Select a conversation to start messaging</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

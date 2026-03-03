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
import { useJumpMessages } from "@/hooks/chat/useJumpMessages"
import { useChatRealtime } from "@/socket/chat/useChatRealtime"
import { usePresenceRealtime } from "@/socket/presence/usePresenceRealtime"
import { CreateGroupModal } from "@/components/messages/CreateGroupModal"

// export default function Page() {
//   return <div>Test messages</div>
// }

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [jumpMessageId, setJumpMessageId] = useState<string | null>(null)
  const { conversations, loading, error, reload, setConversations, markAsRead } = useConversations()
  const { messages, loading: messagesLoading, hasMore, loadMore, appendRealtimeMessage } = useMessages(selectedConversationId || undefined)

  const {
    messages: jumpMessages,
    loading: jumpLoading,
    hasMoreAbove,
    hasMoreBelow,
    loadMoreAbove,
    loadMoreBelow,
    loadingAbove,
    loadingBelow
  } = useJumpMessages(selectedConversationId || undefined, jumpMessageId)

  const { sendMessage, markRead } = useChatRealtime({
    onNewMessageReceived: (msg) => {
      appendRealtimeMessage(msg)
    }
  })

  usePresenceRealtime({
    onStatusChanged: (data) => {
      setConversations(prev => prev.map(conv => {
        // Cập nhật cho hội thoại private (nếu User là người nhận)
        let isOnline = conv.isOnline;
        let lastOnline = conv.lastOnline;

        // Tìm người tham gia có ID trùng với data.userId
        const updatedParticipants = conv.participants.map(p => {
          if (p.id === data.userId || p.username === data.userId) { // Backends might send username or ID
            return {
              ...p,
              isOnline: data.is_online,
              lastOnline: data.last_online
            };
          }
          return p;
        });

        const targetParticipant = updatedParticipants.find(p => p.id === data.userId || p.username === data.userId);

        // Nếu là chat 1-1 và người status change là "đối phương"
        if (conv.participants.length === 2 && targetParticipant && targetParticipant.id !== user?.id) {
          isOnline = data.is_online;
          lastOnline = data.last_online;
        }

        return {
          ...conv,
          participants: updatedParticipants,
          isOnline,
          lastOnline
        };
      }));
    }
  });
  const { isDarkMode, handleDarkModeToggle } = useDarkMode()
  const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)
  const [showChatMobile, setShowChatMobile] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)



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

  const handleSendMessage = (message?: string, attachments?: { url: string; type: string }[]) => {
    if (selectedConversationId) {
      sendMessage(message, selectedConversationId, attachments)
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
    setJumpMessageId(null)
    setShowChatMobile(true)
  }

  const handleJumpToMessage = (messageId: string) => {
    setJumpMessageId(messageId)
  }

  const handleCloseJumpMode = () => {
    setJumpMessageId(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundRenderer
        isDarkMode={isDarkMode}
        imageLoaded={imageLoaded}
        imageError={imageError}
      />

      <div className={`${showChatMobile ? 'hidden lg:block' : 'block'}`}>
        <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
      </div>
      <Sidebar activeTab="messages" isMobileHidden={showChatMobile} />

      {/* Instagram-style Layout */}
      <div className={`flex h-[calc(100vh)] md:ml-20 ${showChatMobile ? 'pt-0 lg:pt-16' : 'pt-16'}`}>
        {/* Left Sidebar - Conversation List */}
        <div className={`w-full lg:w-[400px] flex-shrink-0 border-r border-white/10 overflow-hidden relative z-10 
          ${showChatMobile ? 'hidden lg:flex' : 'flex'}`}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
            loading={loading}
            onOpenCreateGroup={() => setIsGroupModalOpen(true)}
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
                conversationId={selectedConversationId}
                conversationName={conversations.find(c => c.id === selectedConversationId)?.name || ""}
                conversationAvatar={conversations.find(c => c.id === selectedConversationId)?.avatar || ""}
                participants={conversations.find(c => c.id === selectedConversationId)?.participants || []}
                currentUserId={user?.id}
                messages={jumpMessageId ? jumpMessages : messages}
                onSendMessage={handleSendMessage}
                onMessageViewed={(msgId) => {
                  if (selectedConversationId) {
                    console.log("onMessageViewed", msgId)
                    markRead(msgId, selectedConversationId)
                    markAsRead(selectedConversationId, msgId)
                  }
                }}
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoadingMore={messagesLoading}
                isOnline={conversations.find(c => c.id === selectedConversationId)?.isOnline || false}
                lastOnline={conversations.find(c => c.id === selectedConversationId)?.lastOnline || ""}
                conversation={conversations.find(c => c.id === selectedConversationId)}
                // Jump mode props
                targetMessageId={jumpMessageId}
                onLoadMoreAbove={loadMoreAbove}
                hasMoreAbove={hasMoreAbove}
                isLoadingMoreAbove={loadingAbove}
                onLoadMoreBelow={loadMoreBelow}
                hasMoreBelow={hasMoreBelow}
                isLoadingMoreBelow={loadingBelow}
                onCloseJumpMode={handleCloseJumpMode}
                onJumpToMessage={handleJumpToMessage}
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

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreated={(id) => {
          reload()
          handleSelectConversation(id)
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}

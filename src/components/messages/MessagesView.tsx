"use client"

import { useState, useEffect } from "react"
import { ConversationList } from "./ConversationList"
import { ChatWindow } from "./ChatWindow"
import { useConversations } from "@/hooks/chat/useConversations"
import { useMessages } from "@/hooks/chat/useMessages"
import { useSocketContext } from "@/contexts/SocketContext"
import { useChatRealtime } from "@/socket/chat/useChatRealtime"

export function MessagesView() {
  const { conversations, setConversations, loading: loadingConvs } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const socket = useSocketContext();

  // Redirect to first conversation if none selected
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const { 
    messages, 
    appendRealtimeMessage
  } = useMessages(selectedConversationId);
  
  const { sendMessage } = useChatRealtime({
    conversationId: selectedConversationId,
    onNewMessageReceived: appendRealtimeMessage
  });

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  // Listen for conversation list updates (last message, unread count, etc.)
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = (data: { conversationId: string; lastMessage: any }) => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === data.conversationId) {
          return {
            ...conv,
            lastMessage: data.lastMessage.content,
            timestamp: "now",
            unread: conv.id !== selectedConversationId
          };
        }
        return conv;
      }));
    };

    socket.on("conversation_updated", handleConversationUpdated);
    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [socket, selectedConversationId, setConversations]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl mx-1 sm:mx-4 my-2">
      {/* Conversation List */}
      <div className="hidden sm:flex w-full sm:w-[400px] flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId || ""}
          onSelect={setSelectedConversationId}
          loading={loadingConvs}
        />
      </div>

      {/* Chat Window */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow
            conversationName={selectedConversation.name}
            conversationAvatar={selectedConversation.avatar}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/60 font-medium">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  )
}

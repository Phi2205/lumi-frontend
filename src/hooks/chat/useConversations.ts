import { useCallback, useEffect, useState } from "react";
import { ConversationUI } from "@/components/messages/ConversationList";
import { getConversationsService, mapConversationToUI } from "@/services/conversation.service";
import { useAuth } from "@/contexts/AuthContext";
import { useChatRealtime } from "@/socket/chat/useChatRealtime";

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    // If not authenticated, don't attempt to load
    if (!user) return;

    setLoading(true);
    setError(null);

    const controller = new AbortController();

    try {
      const response = await getConversationsService(1, 50, controller.signal);
      
      let conversationsData: any[] = [];
      if (response && response.success && response.data) {
        conversationsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.items || response.data.conversations || []);
      } else if (Array.isArray(response)) {
        conversationsData = response;
      }

      const mapped = conversationsData.map((conv: any) => 
        mapConversationToUI(conv, user.id)
      );
      
      setConversations(mapped);
    } catch (err: any) {
      if (err.name !== "AbortError" && err.code !== "ERR_CANCELED") {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleConversationUpdate = useCallback((data: any) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === data.conversationId) {
        return {
          ...conv,
          lastMessage: data.lastMessage.content,
          timestamp: "now",
          unread: true,
          unreadCount: (conv.unreadCount || 0) + 1
        };
      }
      return conv;
    }));
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unread: false,
          unreadCount: 0
        };
      }
      return conv;
    }));
  }, []);

  // Realtime conversation updates
  useChatRealtime({
    onConversationUpdate: handleConversationUpdate
  });


  return {
    conversations,
    loading,
    error,
    reload: loadConversations,
    setConversations,
    markAsRead
  };
};

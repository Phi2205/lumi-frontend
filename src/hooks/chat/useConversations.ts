import { useCallback, useEffect, useState } from "react";
import { ConversationUI } from "@/components/messages/ConversationList";
import { getConversationsService, mapConversationToUI } from "@/services/conversation.service";
import { useAuth } from "@/contexts/AuthContext";
import { useChatRealtime } from "@/socket/chat/useChatRealtime";
import { formatTime } from "@/utils/format";

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationUI[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Update relative timestamps automatically every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setConversations(prev => prev.map(conv => {
        if (!conv.lastMessageAt) return conv;
        const newTimestamp = formatTime(conv.lastMessageAt);
        if (newTimestamp === conv.timestamp) return conv;
        return { ...conv, timestamp: newTimestamp };
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleConversationUpdate = useCallback((data: any) => {
    setConversations(prev => {
      const convIndex = prev.findIndex(conv => conv.id === data.conversationId);
      if (convIndex === -1) return prev;

      const isMe = user?.id === data.senderId;

      const updatedConv = {
        ...prev[convIndex],
        lastMessage: data.lastMessage.content,
        lastMessageId: data.message_id,
        lastMessageAt: data.lastMessage.createdAt || new Date().toISOString(),
        timestamp: "vừa xong",
        unread: isMe ? prev[convIndex].unread : true,
        unreadCount: isMe ? prev[convIndex].unreadCount : (prev[convIndex].unreadCount || 0) + 1
      };

      const filtered = prev.filter((_, i) => i !== convIndex);
      return [updatedConv, ...filtered];
    });
  }, [user?.id]);

  const handleUserReadMessage = useCallback((data: any) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === data.conversation_id) {
        return {
          ...conv,
          participants: conv.participants.map(p =>
            p.id === data.user_id
              ? { ...p, lastSeenMessageId: data.last_seen_message_id }
              : p
          )
        };
      }
      return conv;
    }));
  }, []);

  const markAsRead = useCallback((conversationId: string, lastMessageId?: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId && user) {
        return {
          ...conv,
          unread: false,
          unreadCount: 0,
          participants: conv.participants.map(p =>
            p.id === user.id
              ? { ...p, lastSeenMessageId: lastMessageId || p.lastSeenMessageId }
              : p
          )
        };
      }
      return conv;
    }));
  }, [user]);

  // Realtime conversation updates
  useChatRealtime({
    onConversationUpdate: handleConversationUpdate,
    onUserReadMessage: handleUserReadMessage
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

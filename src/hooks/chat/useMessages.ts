import { useCallback, useEffect, useRef, useState } from "react";
import { MessageUI } from "@/components/messages/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { getMessagesService } from "@/services/conversation.service";
import { useChatRealtime } from "@/socket/chat/useChatRealtime";


type MessageCache = {
  messages: MessageUI[];
  nextCursor?: string;
  hasMore: boolean;
  loaded: boolean;
};

// Helper function to map API message to MessageUI
const mapMessageToUI = (m: any, currentUserId: string): MessageUI => ({
  id: m.id,
  sender: m.sender?.name || m.sender?.username || "Unknown",
  senderAvatar: m.sender?.avatar_url || "/avatar-default.jpg",
  content: m.content,
  timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  isOwn: m.sender?.id === currentUserId || m.sender_id === currentUserId,
  isRead: m.is_read
});

export const useMessages = (conversationId?: string) => {
  const { user } = useAuth();
  const cacheRef = useRef<Record<string, MessageCache>>({});
  const abortRef = useRef<AbortController | null>(null);

  const [messages, setMessages] = useState<MessageUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMessages = useCallback(
    async (cursor?: string) => {
      if (!conversationId || !user) return;

      // nếu chưa load lần đầu
      const cache = cacheRef.current[conversationId];

      if (!cursor && cache?.loaded) {
        setMessages(cache.messages);
        setHasMore(cache.hasMore);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const res = await getMessagesService(conversationId, cursor);

        // if (!res.ok) throw new Error("Failed to load messages");
        const result = res.data;
        const incoming: MessageUI[] = (result.items || []).map((m: any) => mapMessageToUI(m, user.id));
        setMessages(prev => {
          // Tin nhắn mới nhất nằm đầu mảng
          const merged = cursor ? [...prev, ...incoming] : incoming;

          const unique = Array.from(
            new Map(merged.map(m => [m.id, m])).values()
          );

          // update cache
          cacheRef.current[conversationId] = {
            messages: unique,
            nextCursor: result.nextCursor,
            hasMore: !!result.nextCursor,
            loaded: true,
          };

          return unique;
        });

        setHasMore(!!result.nextCursor);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [conversationId, user]
  );

  // Load khi conversationId đổi
  useEffect(() => {
    if (!conversationId) return;

    loadMessages();
    return () => abortRef.current?.abort();
  }, [conversationId, loadMessages]);



  const loadMore = useCallback(() => {
    if (!conversationId) return;

    const cache = cacheRef.current[conversationId];
    if (!cache?.hasMore || loading) return;

    loadMessages(cache.nextCursor);
  }, [conversationId, loadMessages, loading]);

  const appendRealtimeMessage = useCallback(
    (messageData: any) => {
      if (!conversationId || !user) return;

      const message = mapMessageToUI(messageData, user.id);

      setMessages(prev => {
        if (prev.find(m => m.id === message.id)) return prev;

        // Tin nhắn mới realtime nằm ở đầu mảng
        const updated = [message, ...prev];

        cacheRef.current[conversationId] = {
          ...cacheRef.current[conversationId],
          messages: updated,
        };

        return updated;
      });
    },
    [conversationId, user]
  );

  return {
    messages,
    loading,
    hasMore,
    loadMore,
    appendRealtimeMessage,
  };
};


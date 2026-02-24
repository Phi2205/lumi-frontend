import { useEffect, useCallback } from "react";
import { useSocketContext } from "@/contexts/SocketContext";
import { 
  onNewMessage, 
  offNewMessage, 
  onConversationUpdated, 
  offConversationUpdated,
  sendMessageEmit 
} from "./chat.socket";

interface ChatRealtimeOptions {
  conversationId?: string;
  onNewMessageReceived?: (message: any) => void;
  onConversationUpdate?: (data: any) => void;
}

export const useChatRealtime = (options?: ChatRealtimeOptions) => {
  const socket = useSocketContext();
  const { conversationId, onNewMessageReceived, onConversationUpdate } = options || {};

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      // Logic lọc theo conversationId nếu có
      if (conversationId) {
        if (message.conversationId === conversationId || message.conversation_id === conversationId) {
          onNewMessageReceived?.(message);
        }
      } else {
        onNewMessageReceived?.(message);
      }
    };

    const handleConvUpdate = (data: any) => {
      onConversationUpdate?.(data);
    };

    onNewMessage(handleNewMessage);
    onConversationUpdated(handleConvUpdate);

    return () => {
      offNewMessage(handleNewMessage);
      offConversationUpdated(handleConvUpdate);
    };
  }, [socket, conversationId, onNewMessageReceived, onConversationUpdate]);

  const sendMessage = useCallback((content: string, convId?: string) => {
    const id = convId || conversationId;
    if (!id || !content.trim()) return;

    sendMessageEmit({
      conversationId: id,
      content: content.trim(),
    });
  }, [conversationId]);

  return {
    sendMessage,
    socket
  };
};

import { useEffect, useCallback } from "react";
import { useSocketContext } from "@/contexts/SocketContext";
import {
  onNewMessage,
  offNewMessage,
  onConversationUpdated,
  offConversationUpdated,
  sendMessageEmit,
  markReadEmit,
  onUserReadMessage,
  offUserReadMessage
} from "./chat.socket";

interface ChatRealtimeOptions {
  conversationId?: string;
  onNewMessageReceived?: (message: any) => void;
  onConversationUpdate?: (data: any) => void;
  onUserReadMessage?: (data: any) => void;
}

export const useChatRealtime = (options?: ChatRealtimeOptions) => {
  const socket = useSocketContext();
  const { conversationId, onNewMessageReceived, onConversationUpdate, onUserReadMessage: onUserRead } = options || {};

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

    const handleUserRead = (data: any) => {
      if (conversationId && data.conversation_id === conversationId) {
        onUserRead?.(data);
      } else if (!conversationId) {
        onUserRead?.(data);
      }
    };

    onNewMessage(handleNewMessage);
    onConversationUpdated(handleConvUpdate);
    onUserReadMessage(handleUserRead);

    return () => {
      offNewMessage(handleNewMessage);
      offConversationUpdated(handleConvUpdate);
      offUserReadMessage(handleUserRead);
    };
  }, [socket, conversationId, onNewMessageReceived, onConversationUpdate, onUserRead]);

  const sendMessage = useCallback((content?: string, convId?: string, attachments: { url: string; type: string }[] = []) => {
    const id = convId || conversationId;
    if (!id || (!content?.trim() && attachments.length === 0)) return;
    sendMessageEmit({
      conversationId: id,
      content: content?.trim(),
      attachments
    });
  }, [conversationId]);

  const markRead = useCallback((lastMessageId: string, convId?: string) => {
    const id = convId || conversationId;
    if (!id || !lastMessageId) return;

    markReadEmit({
      conversationId: id,
      lastMessageId,
    });
  }, [conversationId]);

  return {
    sendMessage,
    markRead,
    socket
  };
};

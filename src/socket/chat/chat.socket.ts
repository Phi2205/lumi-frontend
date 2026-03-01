import { getSocket } from "@/lib/socket";
import { SocketEvents } from "../events";

const socket = getSocket();

export const sendMessageEmit = (data: {
  conversationId: string;
  content?: string;
  attachments?: { url: string; type: string }[]
}) => {
  socket.emit(SocketEvents.SEND_MESSAGE, data);
};

export const onNewMessage = (callback: (message: any) => void) => {
  socket.on(SocketEvents.NEW_MESSAGE, callback);
};

export const offNewMessage = (callback: (message: any) => void) => {
  socket.off(SocketEvents.NEW_MESSAGE, callback);
};

export const onConversationUpdated = (callback: (data: any) => void) => {
  socket.on(SocketEvents.CONVERSATION_UPDATED, callback);
};

export const offConversationUpdated = (callback: (data: any) => void) => {
  socket.off(SocketEvents.CONVERSATION_UPDATED, callback);
};

export const markReadEmit = (data: { conversationId: string; lastMessageId: string }) => {
  socket.emit(SocketEvents.MARK_READ, data);
};

export const onUserReadMessage = (callback: (data: any) => void) => {
  socket.on(SocketEvents.USER_READ_MESSAGE, callback);
};

export const offUserReadMessage = (callback: (data: any) => void) => {
  socket.off(SocketEvents.USER_READ_MESSAGE, callback);
};

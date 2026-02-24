import { getSocket } from "@/lib/socket";
import { SocketEvents } from "../events";

const socket = getSocket();

export const sendMessageEmit = (data: { conversationId: string; content: string }) => {
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

import { getSocket } from "@/lib/socket";
import { SocketEvents } from "../events";

const socket = getSocket();

export const joinPostRoom = (postId: string) => {
  socket.emit(SocketEvents.JOIN_POST, { postId });
};

export const sendComment = (data: any) => {
  socket.emit(SocketEvents.NEW_COMMENT, data);
};

export const onNewComment = (callback: any) => {
  socket.on(SocketEvents.NEW_COMMENT, callback);
};

export const offNewComment = (callback: any) => {
  socket.off(SocketEvents.NEW_COMMENT, callback);
};

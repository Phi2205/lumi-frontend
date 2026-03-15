import { getSocket } from "@/lib/socket";
import { SocketEvents } from "../events";

const socket = getSocket();

export const joinReelRoom = (reelId: string) => {
    socket.emit(SocketEvents.JOIN_REEL, { reelId });
};

export const leaveReelRoom = (reelId: string) => {
    socket.emit(SocketEvents.LEAVE_REEL, { reelId });
};

export const sendReelComment = (data: any) => {
    socket.emit(SocketEvents.NEW_REEL_COMMENT, data);
};

export const onNewReelComment = (callback: any) => {
    socket.on(SocketEvents.NEW_REEL_COMMENT, callback);
};

export const offNewReelComment = (callback: any) => {
    socket.off(SocketEvents.NEW_REEL_COMMENT, callback);
};

export const onDeleteReelComment = (callback: any) => {
    socket.on(SocketEvents.DELETE_REEL_COMMENT, callback);
};

export const offDeleteReelComment = (callback: any) => {
    socket.off(SocketEvents.DELETE_REEL_COMMENT, callback);
};

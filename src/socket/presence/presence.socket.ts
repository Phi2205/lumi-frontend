import { getSocket } from "@/lib/socket";

export const getOnlineUsers = (payload: { limit?: number; exclude?: string[] }, callback: (users: any[]) => void) => {
    const socket = getSocket();
    socket.emit('get_online_users', payload, callback);
};

export const onUserStatusChanged = (handler: (data: { userId: string; is_online: boolean; last_online?: string }) => void) => {
    const socket = getSocket();
    socket.on('user_status_changed', handler);
};

export const offUserStatusChanged = (handler: (data: { userId: string; is_online: boolean; last_online?: string }) => void) => {
    const socket = getSocket();
    socket.off('user_status_changed', handler);
};

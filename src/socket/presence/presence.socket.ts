import { getSocket } from "@/lib/socket";

export const onUserStatusChanged = (handler: (data: { userId: string; is_online: boolean; last_online?: string }) => void) => {
    const socket = getSocket();
    socket.on('user_status_changed', handler);
};

export const offUserStatusChanged = (handler: (data: { userId: string; is_online: boolean; last_online?: string }) => void) => {
    const socket = getSocket();
    socket.off('user_status_changed', handler);
};

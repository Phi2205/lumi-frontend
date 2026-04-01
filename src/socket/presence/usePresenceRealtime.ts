import { useEffect } from "react";
import { useSocketContext } from "@/contexts/SocketContext";
import { onUserStatusChanged, offUserStatusChanged } from "./presence.socket";

interface PresenceRealtimeOptions {
    onStatusChanged?: (data: { userId: string; is_online: boolean; last_online?: string }) => void;
}

export const usePresenceRealtime = (options?: PresenceRealtimeOptions) => {
    const socket = useSocketContext();
    const { onStatusChanged } = options || {};

    useEffect(() => {
        if (!socket) return;

        const handleStatusChanged = (data: { userId: string; is_online: boolean; last_online?: string }) => {
            console.log(`User ${data.userId} is now ${data.is_online ? 'Online' : 'Offline'}`);
            if (!data.is_online && data.last_online) {
                console.log(`Last active: ${data.last_online}`);
            }
            onStatusChanged?.(data);
        };

        onUserStatusChanged(handleStatusChanged);

        return () => {
            offUserStatusChanged(handleStatusChanged);
        };
    }, [socket, onStatusChanged]);

    return { socket };
};

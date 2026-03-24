import { getSocket } from "@/lib/socket";

export const onStoryStatusChanged = (handler: (data: { userId: string; hasStory: boolean; timestamp: string }) => void) => {
    const socket = getSocket();
    socket.on('story_status_changed', handler);
};

export const offStoryStatusChanged = (handler: (data: { userId: string; hasStory: boolean; timestamp: string }) => void) => {
    const socket = getSocket();
    socket.off('story_status_changed', handler);
};

import { useEffect } from "react";
import { onStoryStatusChanged, offStoryStatusChanged } from "./story.socket";

interface StoryRealtimeOptions {
    onStoryStatusChanged?: (data: { userId: string; hasStory: boolean; timestamp: string }) => void;
}

export const useStoryRealtime = (options?: StoryRealtimeOptions) => {
    const { onStoryStatusChanged: onStatusChanged } = options || {};

    useEffect(() => {
        const handleStatusChanged = (data: { userId: string; hasStory: boolean; timestamp: string }) => {
            console.log(`User ${data.userId} story status: ${data.hasStory ? 'New story' : 'No story'}`);

            // Dispatch custom event for components to react
            window.dispatchEvent(new CustomEvent('storyUpdate', {
                detail: data
            }));

            onStatusChanged?.(data);
        };

        onStoryStatusChanged(handleStatusChanged);

        return () => {
            offStoryStatusChanged(handleStatusChanged);
        };
    }, [onStatusChanged]);
};

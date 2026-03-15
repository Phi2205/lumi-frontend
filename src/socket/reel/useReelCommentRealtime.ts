import { useEffect } from "react";
import {
    joinReelRoom,
    leaveReelRoom,
    onNewReelComment,
    offNewReelComment,
    onDeleteReelComment,
    offDeleteReelComment,
} from "./reelComment.socket";

export const useReelCommentRealtime = (
    reelId: string,
    onReceive: (comment: any) => void,
    onDelete: (data: { reel_id: string; comment_id: string }) => void
) => {
    useEffect(() => {
        if (!reelId) return;

        joinReelRoom(reelId);
        onNewReelComment(onReceive);
        onDeleteReelComment(onDelete);

        return () => {
            leaveReelRoom(reelId);
            offNewReelComment(onReceive);
            offDeleteReelComment(onDelete);
        };
    }, [reelId, onReceive, onDelete]);
};

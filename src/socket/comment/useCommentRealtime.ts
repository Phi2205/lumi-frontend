import { useEffect } from "react";
import {
  joinPostRoom,
  onNewComment,
  offNewComment,
} from "./comment.socket";

export const useCommentRealtime = (
  postId: string,
  onReceive: (comment: any) => void
) => {
  useEffect(() => {
    if (!postId) return;

    joinPostRoom(postId);
    onNewComment(onReceive);

    return () => {
      offNewComment(onReceive);
    };
  }, [postId]);
};

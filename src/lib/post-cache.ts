import { Post as ApiPost } from "@/apis/post.api";

const postCache = new Map<string, ApiPost>();

export const setCachedPost = (id: string, post: ApiPost) => {
    postCache.set(id, post);
};

export const getCachedPost = (id: string) => {
    return postCache.get(id);
};

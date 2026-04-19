import * as postApi from '@/apis/post.api';
import { PostMediaItem } from '@/apis/post.api';

const viewedQueue = new Set<string>();
const localViewed = new Set<string>();

export const markAsViewed = (postId: string) => {
    if (localViewed.has(postId)) return;
    localViewed.add(postId);
    viewedQueue.add(postId);
}

export const clearViewedCache = () => {
    localViewed.clear();
    viewedQueue.clear();
}

setInterval(async () => {
    if (viewedQueue.size === 0) return;

    const postIds = Array.from(viewedQueue);
    viewedQueue.clear();

    try {
        await postApi.markAsSeenApi(postIds);
        console.log('Sent viewed posts:', postIds);
    } catch (error) {
        console.error('Failed to send viewed posts:', error);
    }
}, 3000);


export const createPost = async (content: string, media: PostMediaItem[]) => {
    try {
        const response = await postApi.createPostApi({ content, media });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnseenPosts = async (limit: number = 5) => {
    try {
        const response = await postApi.getUnseenPosts(limit);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const likePost = async (postId: string) => {
    try {
        const response = await postApi.likePost(postId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const postComments = async (postId: string, limit: number, page: number) => {
    try {
        const response = await postApi.getComments(postId, limit, page);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const sendComment = async (postId: string, content: string, parentId?: string) => {
    try {
        const response = await postApi.addComment(postId, content, parentId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getReplies = async (postId: string, commentId: string, limit: number, page: number) => {
    try {
        const response = await postApi.getReplies(postId, commentId, limit, page);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getLikes = async (postId: string, limit: number, page: number) => {
    try {
        const response = await postApi.getLikes(postId, limit, page);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteComment = async (postId: string, commentId: string) => {
    try {
        const response = await postApi.deleteComment(postId, commentId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const sharePost = async (postId: string, content: string) => {
    try {
        const response = await postApi.sharePost(postId, content);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPostById = async (postId: string) => {
    try {
        const response = await postApi.getPostById(postId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAsSeen = async (postIds: string[]) => {
    try {
        const response = await postApi.markAsSeenApi(postIds);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPostsByMe = async (cursor?: string, limit: number = 12) => {
    try {
        const response = await postApi.getPostsByMe(cursor, limit);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPostsByUserId = async (userId: string, cursor?: string, limit: number = 12) => {
    try {
        const response = await postApi.getPostsByUserId(userId, cursor, limit);
        return response.data;
    } catch (error) {
        throw error;
    }
}

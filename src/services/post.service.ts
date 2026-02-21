import * as postApi from '@/apis/post.api';
import { PostMediaItem } from '@/apis/post.api';

export const createPost = async (content: string, media: PostMediaItem[]) => {
    try {
        const response = await postApi.createPostApi({ content, media });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnseenPosts = async (limit: number, page: number) => {
    try {
        const response = await postApi.getUnseenPosts(limit, page);
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

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
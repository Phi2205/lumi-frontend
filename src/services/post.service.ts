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
import * as storyApi from '@/apis/story.api';

export const createStory = async (file: File) => {
    try {
        const response = await storyApi.createStoryApi(file);
        return response.data;
    } catch (error) {
        throw error;
    }
}

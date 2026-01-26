import * as storyApi from '@/apis/story.api';

export const createStory = async (file: File) => {
    try {
        const response = await storyApi.createStoryApi(file);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getStoryFriends = async (page: number, limit: number) => {
    try {
        const response = await storyApi.getStoryFriendsApi(page, limit);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getStories = async (userId: string) => {
    try {
        const response = await storyApi.getStoriesApi(userId);
        return response.data;
    } catch (error) {
        throw error;
    }
}
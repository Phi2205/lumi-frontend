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

export const viewStory = async (storyId: string) => {
    try {
        const response = await storyApi.viewStoryApi(storyId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getStoryViews = async (storyId: string, cursor?: string, limit: number = 10) => {
    try {
        const response = await storyApi.getStoryViewsApi(storyId, cursor, limit);
        return response.data;
    } catch (error) {
        throw error;
    }
}
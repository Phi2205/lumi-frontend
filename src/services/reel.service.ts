import { getMyReelsApi, getUserReelsApi, likeReelApi, getReelLikesApi } from "../apis/reel.api";

export const getMyReelsService = async (cursor?: string, limit: number = 12) => {
    try {
        const response = await getMyReelsApi(cursor, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching my reels:', error);
        throw error;
    }
};

export const getUserReelsService = async (userId: string, cursor?: string, limit: number = 12) => {
    try {
        const response = await getUserReelsApi(userId, cursor, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching user reels:', error);
        throw error;
    }
};

export const likeReelService = async (reelId: string) => {
    try {
        const response = await likeReelApi(reelId);
        return response.data;
    } catch (error) {
        console.error('Error liking reel:', error);
        throw error;
    }
};

export const getReelLikesService = async (reelId: string, cursor?: string, limit: number = 20) => {
    try {
        const response = await getReelLikesApi(reelId, cursor, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching reel likes:', error);
        throw error;
    }
};

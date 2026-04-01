import {
    getMyReelsApi,
    getUserReelsApi,
    likeReelApi,
    getReelLikesApi,
    getReelCommentsApi,
    getReelCommentRepliesApi,
    createReelCommentApi,
    deleteReelCommentApi,
    markReelsAsSeenApi,
    getReelRecommendationsApi,
    getReelByIdApi
} from "../apis/reel.api";

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

export const getReelCommentsService = async (reelId: string, cursor?: string, limit: number = 10) => {
    try {
        const response = await getReelCommentsApi(reelId, cursor, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching reel comments:', error);
        throw error;
    }
};

export const getReelCommentRepliesService = async (reelId: string, parentId: string, cursor?: string, limit: number = 10) => {
    try {
        const response = await getReelCommentRepliesApi(reelId, parentId, cursor, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching reel comment replies:', error);
        throw error;
    }
};

export const createReelCommentService = async (reelId: string, content: string, parentId?: string) => {
    try {
        const response = await createReelCommentApi(reelId, content, parentId);
        return response.data;
    } catch (error) {
        console.error('Error creating reel comment:', error);
        throw error;
    }
};

export const deleteReelCommentService = async (reelId: string, commentId: string) => {
    try {
        const response = await deleteReelCommentApi(reelId, commentId);
        return response.data;
    } catch (error) {
        console.error('Error deleting reel comment:', error);
        throw error;
    }
};

export const markReelsAsSeenService = async (reelIds: string[]) => {
    try {
        const response = await markReelsAsSeenApi(reelIds);
        return response.data;
    } catch (error) {
        console.error('Error marking reels as seen:', error);
        throw error;
    }
};

export const viewReelService = async (reelId: string) => {
    return markReelsAsSeenService([reelId]);
};

export const getReelRecommendationsService = async (limit: number = 5) => {
    try {
        const response = await getReelRecommendationsApi(limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching reel recommendations:', error);
        throw error;
    }
};

export const getReelByIdService = async (reelId: string) => {
    try {
        const response = await getReelByIdApi(reelId);
        return response.data;
    } catch (error) {
        console.error('Error fetching reel:', error);
        throw error;
    }
};

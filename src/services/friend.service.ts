import { getFriendsApi, getMutualFriendsApi, getCountFriendsApi, getFriendsUserIdApi, deleteFriendApi, searchFriendsApi } from "../apis/friend.api";

export const getFriendsUserIdService = async (userId: string, limit: string, page: string) => {
    try {
        const response = await getFriendsUserIdApi(userId, limit, page);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getFriendsService = async (limit: string, page: string) => {
    try {
        const response = await getFriendsApi(limit, page);
        return response.data;
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
    }
};

export const getMutualFriendsService = async (userId: string) => {
    try {
        const response = await getMutualFriendsApi(userId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCountFriendsService = async (userId: string) => {
    try {
        const response = await getCountFriendsApi(userId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteFriendService = async (userId: string) => {
    try {
        const response = await deleteFriendApi(userId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const searchFriendsService = async (q: string, userId: string, limit: string, page: string) => {
    try {
        const response = await searchFriendsApi(q, userId, limit, page);
        return response.data;
    } catch (error) {
        throw error;
    }
}
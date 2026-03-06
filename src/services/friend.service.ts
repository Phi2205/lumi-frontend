import { getFriendsApi } from "../apis/friend.api";

export const getFriendsService = async (limit: string, page: string) => {
    try {
        const response = await getFriendsApi(limit, page);
        return response.data;
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
    }
};
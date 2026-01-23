import * as friendRequestApi from '@/apis/friendRequest.api';

export const sendFriendRequest = async (receiver_id: string) => {
    try {
        const response = await friendRequestApi.sendFriendRequestApi({ receiver_id });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const acceptFriendRequest = async (requestId: string) => {
    try {
        const response = await friendRequestApi.acceptFriendRequestApi(requestId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const rejectFriendRequest = async (requestId: string) => {
    try {
        const response = await friendRequestApi.rejectFriendRequestApi(requestId);
        return response.data;
    } catch (error) {
        throw error;
    }
}
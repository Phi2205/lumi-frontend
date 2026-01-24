import * as friendRequestApi from '@/apis/friendRequest.api';
import type { FriendRequestsResponse } from '@/apis/friendRequest.api';
import type { ApiResponse } from '@/types/response.type';

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
        const response = await friendRequestApi.acceptFriendRequestApi({ requester_id: requestId });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const rejectFriendRequest = async (requestId: string) => {
    try {
        const response = await friendRequestApi.rejectFriendRequestApi({ requester_id: requestId });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const cancelFriendRequest = async (receiver_id: string) => {
    try {
        const response = await friendRequestApi.cancelFriendRequestApi({ receiver_id });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getFriendRequests = async (page: number, limit: number): Promise<ApiResponse<FriendRequestsResponse>> => {
    try {
        const response = await friendRequestApi.getFriendRequestsApi({ page, limit });
        return response.data;
    } catch (error) {
        throw error;
    }
}
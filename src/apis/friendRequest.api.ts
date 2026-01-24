import axiosInstance from './axiosInstance';
import { ApiResponse } from '@/types/response.type';
import { Pagination } from '@/types/pagination.type';
export interface FriendRequest {
    limit: number;
    page: number;
}


export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected' | string;

export interface FriendRequestRequester {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
}

// Note: backend response sample doesn't include `id`, so keep it optional.
export interface FriendRequestItem {
    id?: string;
    requester_id: string;
    receiver_id: string;
    status: FriendRequestStatus;
    created_at: string;
    responded_at: string | null;
    requester: FriendRequestRequester;
}

export interface FriendRequestsResponse {
    items: FriendRequestItem[];
    pagination: Pagination;
}

export const sendFriendRequestApi = (data: { receiver_id: string }) =>
    axiosInstance.post<ApiResponse<any>>('/friend-requests', data);

export const acceptFriendRequestApi = (data: { requester_id: string }) =>
    axiosInstance.patch<ApiResponse<any>>(`/friend-requests/accept`, data);

export const rejectFriendRequestApi = (data: { requester_id: string }) =>
    axiosInstance.patch<ApiResponse<any>>(`/friend-requests/reject`, data);

export const cancelFriendRequestApi = (data: { receiver_id: string }) =>
    axiosInstance.delete<ApiResponse<any>>(`/friend-requests/`, { data });

export const getFriendRequestsApi = (data: FriendRequest) =>
    axiosInstance.get<ApiResponse<FriendRequestsResponse>>('/friend-requests', { params: data });
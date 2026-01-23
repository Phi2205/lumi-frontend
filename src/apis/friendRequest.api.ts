import axiosInstance from './axiosInstance';
import { ApiResponse } from '@/types/response.type';

export const sendFriendRequestApi = (data: { receiver_id: string }) =>
    axiosInstance.post<ApiResponse<any>>('/friend-requests', data);

export const acceptFriendRequestApi = (requestId: string) =>
    axiosInstance.patch<ApiResponse<any>>(`/friend-requests/${requestId}/accept`);

export const rejectFriendRequestApi = (requestId: string) =>
    axiosInstance.patch<ApiResponse<any>>(`/friend-requests/${requestId}/reject`);
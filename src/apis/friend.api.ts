import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/types/response.type";

import { User } from "../types/user.type";
import { Pagination } from "@/types/pagination.type";

export interface CountFriendsResponse {
    total_friends: number;
    mutual_friends: number;
}

export interface SearchFriendsResponse {
    users: User[];
    pagination: Pagination;
}

export const getFriendsApi = (limit: string, page: string) =>
    axiosInstance.get<ApiResponse<User[]>>('/friends', { params: { limit, page } });

export const getMutualFriendsApi = (userId: string) =>
    axiosInstance.get<ApiResponse<User[]>>(`/friends/mutual/${userId}`);

export const getFriendsUserIdApi = (userId: string, limit: string, page: string) =>
    axiosInstance.get<ApiResponse<User[]>>(`/friends/user/${userId}`, { params: { limit, page } });

export const getCountFriendsApi = (userId: string) =>
    axiosInstance.get<ApiResponse<CountFriendsResponse>>(`/friends/count-with-mutual/${userId}`);

export const deleteFriendApi = (userId: string) =>
    axiosInstance.delete<ApiResponse<void>>(`/friends/${userId}`);

export const searchFriendsApi = (q: string, userId: string, limit: string, page: string) =>
    axiosInstance.get<ApiResponse<SearchFriendsResponse>>(`/friends/user/${userId}/search`, { params: { q, limit, page } });


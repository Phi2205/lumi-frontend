import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/types/response.type";

import { User } from "../types/user.type";

export interface CountFriendsResponse {
    total_friends: number;
    mutual_friends: number;
}

export const getFriendsApi = (limit: string, page: string) =>
    axiosInstance.get<ApiResponse<User[]>>('/friends', { params: { limit, page } });

export const getMutualFriendsApi = (userId: string) =>
    axiosInstance.get<ApiResponse<User[]>>(`/friends/mutual/${userId}`);

export const getFriendsUserIdApi = (userId: string, limit: string, page: string) =>
    axiosInstance.get<ApiResponse<User[]>>(`/friends/${userId}`, { params: { limit, page } });

export const getCountFriendsApi = (userId: string) =>
    axiosInstance.get<ApiResponse<CountFriendsResponse>>(`/friends/count-with-mutual/${userId}`);
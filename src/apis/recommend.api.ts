import { User } from "@/types/user.type";
import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "@/types/response.type";


export interface RecommendedUser {
    user: User;
    score: number;
}

export interface RecommendedUserResponse {
    recommendations: RecommendedUser[];
}

export interface IngestInteractionPayload {
    item_id: string;
    item_type: 'post' | 'reel' | 'user';
    interaction_type: 'view' | 'like' | 'comment' | 'share' | 'follow';
}

export interface SimilarUserResponse {
    users: User[];
}

export const getRecommendedUsers = (limit: number = 10) => {
    return axiosInstance.get<ApiResponse<RecommendedUserResponse>>("/recommend/users");
}

export const getSimilarUsers = (userId: string, limit: number = 10) => {
    return axiosInstance.get<ApiResponse<SimilarUserResponse>>(`/recommend/similar-users/${userId}`, {
        params: { limit }
    });
}

export const ingestInteraction = (data: IngestInteractionPayload) => {
    return axiosInstance.post<ApiResponse<any>>("/recommend/ingest", data);
}
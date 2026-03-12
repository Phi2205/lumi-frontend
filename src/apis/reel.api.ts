import axiosInstance from "./axiosInstance";
import { User } from "../types/user.type";
import { ApiResponse } from "../types/response.type";

export interface CreateReelRequest {
    video_url: string;
    thumbnail_url: string;
    public_id: string;
    caption: string;
    music_name: string;
    duration: number;
}

export interface Reel {
    id: string;
    user_id: string;
    user: User;
    thumbnail_url: string;
    video_url: string;
    streaming_url?: string;
    caption: string;
    music_name: string;
    duration: number;
    create_at: string;
    like_count: number;
    comment_count: number;
    share_count: number;
    has_liked: boolean;
}

export interface PaginatedReels {
    items: Reel[];
    nextCursor: string | null;
    hasMore: boolean;
}

export const creatReelApi = (request: CreateReelRequest) =>
    axiosInstance.post<ApiResponse<Reel>>("/reels", request);

export const getMyReelsApi = (cursor?: string, limit: number = 12) =>
    axiosInstance.get<ApiResponse<PaginatedReels>>("/reels/me", {
        params: { cursor, limit }
    });

export const getUserReelsApi = (userId: string, cursor?: string, limit: number = 12) =>
    axiosInstance.get<ApiResponse<PaginatedReels>>(`/reels/user/${userId}`, {
        params: { cursor, limit }
    });

export const likeReelApi = (reelId: string) =>
    axiosInstance.post<ApiResponse<any>>(`/reels/${reelId}/like`);

export const getReelLikesApi = (reelId: string, cursor?: string, limit: number = 20) =>
    axiosInstance.get<ApiResponse<any>>(`/reels/${reelId}/likes`, {
        params: { cursor, limit }
    });

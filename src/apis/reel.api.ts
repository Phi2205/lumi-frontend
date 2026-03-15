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

export interface ReelComment {
    id: string;
    reel_id: string;
    user_id: string;
    content: string;
    parent_id: string | null;
    depth: number;
    created_at: string;
    user: User;
    replies: ReelComment[];
    has_replies: boolean;
}

export interface ReelCommentResponse {
    items: ReelComment[];
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

export const getReelCommentsApi = (reelId: string, cursor?: string, limit: number = 10) =>
    axiosInstance.get<ApiResponse<ReelCommentResponse>>(`/reels/${reelId}/comments`, {
        params: { cursor, limit }
    });

export const getReelCommentRepliesApi = (reelId: string, parentId: string, cursor?: string, limit: number = 10) =>
    axiosInstance.get<ApiResponse<ReelCommentResponse>>(`/reels/${reelId}/comments/${parentId}/replies`, {
        params: { cursor, limit }
    });

export const createReelCommentApi = (reelId: string, content: string, parentId?: string) =>
    axiosInstance.post<ApiResponse<ReelComment>>(`/reels/${reelId}/comments`, { content, parentId });

export const deleteReelCommentApi = (reelId: string, commentId: string) =>
    axiosInstance.delete<ApiResponse<any>>(`/reels/${reelId}/comments/${commentId}`);

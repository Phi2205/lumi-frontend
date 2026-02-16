import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "@/types/response.type";
import { Pagination } from "@/types/pagination.type";

export type PostMediaType = "image" | "video";

export interface PostMediaItem {
  file: File;
  media_type: PostMediaType;
  order: number;
}

export interface CreatePostPayload {
  content: string;
  media: PostMediaItem[];
}

export interface PostUser {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
}


export interface PostMedia {
  id: string;
  media_url: string;
  media_type: PostMediaType;
  order: number;
  created_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  has_liked: boolean;
  user: PostUser;
  post_media: PostMedia[];
}

export interface PostFeedResponse {
  items: Post[];
  pagination: Pagination;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  depth: number;
  parent_id: string | null;
  created_at: string;
  user: PostUser;
  replies: Comment[];
}

export interface CommentResponse {
  items: Comment[];
  pagination: Pagination;
}

export const createPostApi = (data: CreatePostPayload) => {
  const formData = new FormData();

  // Text content
  formData.append("content", data.content);

  // Files: backend expects multiple "files" fields
  data.media.forEach((m) => {
    formData.append("files", m.file);
  });

  return axiosInstance.post<ApiResponse<Post>>("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getUnseenPosts = (limit: number, page: number) => {
  return axiosInstance.get<ApiResponse<PostFeedResponse>>("/posts/unseen", {
    params: {
      limit,
      page,
    },
  });
};

export const likePost = (postId: string) => {
  return axiosInstance.post<ApiResponse<Comment>>(`/posts/${postId}/like`);
}


export const getComments = (postId: string, limit: number, page: number) => {
  return axiosInstance.get<ApiResponse<CommentResponse>>(`/posts/${postId}/comments`, {
    params: {
      limit,
      page,
    },
  });
}


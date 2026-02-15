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
  user: PostUser;
  post_media: PostMedia[];
}

export interface PostFeedResponse {
  items: Post[];
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


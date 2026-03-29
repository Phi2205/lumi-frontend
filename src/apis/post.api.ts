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
  has_story: boolean;
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
  original_post_id: string;
  original_post: Post;
}

export interface PostFeedResponse {
  data: Post[];
}

export interface PostMeResponse {
  items: Post[];
  nextCursor: string | null;
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
  has_replies: boolean;
}

export interface CommentResponse {
  items: Comment[];
  pagination: Pagination;
}

export interface Like {
  user_id: string;
  post_id: string;
  created_at: string;
  user: PostUser;
}

export interface LikeResponse {
  items: Like[];
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

export const getUnseenPosts = (limit: number = 5) => {
  return axiosInstance.get<ApiResponse<Post[]>>("/posts/recommendations", {
    params: {
      limit
    },
  });
};

export const getPostById = (postId: string) => {
  return axiosInstance.get<ApiResponse<Post>>(`/posts/${postId}`);
}

export const likePost = (postId: string) => {
  return axiosInstance.post<ApiResponse<Comment>>(`/posts/${postId}/like`);
}

export const getLikes = (postId: string, limit: number, page: number) => {
  return axiosInstance.get<ApiResponse<CommentResponse>>(`/posts/${postId}/likes`, {
    params: {
      limit,
      page,
    },
  });
}

export const getComments = (postId: string, limit: number, page: number) => {
  return axiosInstance.get<ApiResponse<CommentResponse>>(`/posts/${postId}/comments`, {
    params: {
      limit,
      page,
    },
  });
}

export const getReplies = (postId: string, commentId: string, limit: number, page: number) => {
  return axiosInstance.get<ApiResponse<CommentResponse>>(`/posts/${postId}/comments/${commentId}/replies`, {
    params: {
      limit,
      page,
    },
  });
}

export const addComment = (postId: string, content: string, parentId?: string) => {
  return axiosInstance.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, {
    content,
    parentId,
  });
}

export const deleteComment = (postId: string, commentId: string) => {
  return axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
}

export const sharePost = (postId: string, content: string) => {
  return axiosInstance.post<ApiResponse<Post>>(`/posts/${postId}/share`, { originalPostId: postId, content });
}

export const markAsSeenApi = (postIds: string[]) => {
  return axiosInstance.post<ApiResponse<any>>(`/posts/seen`, { postIds });
}

export const getPostsByMe = (cursor?: string, limit: number = 12) => {
  return axiosInstance.get<ApiResponse<PostMeResponse>>(`/posts/me`, {
    params: {
      cursor,
      limit,
    },
  });
}

export const getPostsByUserId = (userId: string, cursor?: string, limit: number = 12) => {
  return axiosInstance.get<ApiResponse<PostMeResponse>>(`/posts/user/${userId}`, {
    params: {
      cursor,
      limit,
    },
  });
}


import { Pagination } from "@/types/pagination.type";
import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/types/response.type";
import { User } from "@/types/user.type";

export interface CreateStoryPayload {
  file: File; // Image or video file
}

export interface StoryFriend {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  story_count: number;
  lastest_story_time: string;
  latest_story_media_url?: string;
  latest_story_media_type?: string;
}

export interface Story {
  id: string;
  media_url: string;
  media_type: string;
  created_at: string;
  expires_at: string;
  streaming_url: string;
}

export interface StoryFriendsResponse {
  items: StoryFriend[];
  pagination: Pagination;
}

export interface StoriesResponse {
  user: User;
  stories: Story[];
}

export interface UserStoryView extends User {
  viewed_at: string;
}

export interface StoryViewsResponse {
  items: UserStoryView[];
  nextCursor: string | null;
}

export const createStoryApi = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return axiosInstance.post("/stories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStoryFriendsApi = (page: number, limit: number) => {
  return axiosInstance.get<ApiResponse<StoryFriendsResponse>>("/stories/feed", {
    params: {
      page,
      limit,
    },
  });
};


export const getStoriesApi = (userId: string) => 
  axiosInstance.get<ApiResponse<StoriesResponse>>(`/stories/user/${userId}`);

export const viewStoryApi = (storyId: string) =>
  axiosInstance.post<ApiResponse<void>>(`/stories/${storyId}/view`);

export const getStoryViewsApi = (storyId: string, cursor?: string, limit: number = 10) =>
  axiosInstance.get<ApiResponse<StoryViewsResponse>>(`/stories/${storyId}/views`, {
    params: { cursor, limit }
  });
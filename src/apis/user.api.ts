import { User, UserHoverCard } from "@/types/user.type";
import axiosInstance from "./axiosInstance"
import { ApiResponse } from "@/types/response.type";

export interface FilterUserPayload {
  name: string;
  limit: number;
  page: number;
};

export interface FilterUserResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
};

export interface EditProfilePayload extends Location{
  bio?: string;
  birthday?: string;
}

export const filterUserApi = (data: FilterUserPayload) =>
  axiosInstance.get<ApiResponse<FilterUserResponse>>('/users', { params: data });

export const getUserByUsernameApi = (username: string) =>
  axiosInstance.get<ApiResponse<User>>(`/users/username/${username}`);

export const editProfileApi = (data: EditProfilePayload) =>
  axiosInstance.patch<ApiResponse<User>>(`/users/profile`, data);

export const userHoverCardApi = (userId: string) =>
  axiosInstance.get<ApiResponse<UserHoverCard>>(`/users/${userId}/hover-card`);
import { User } from "@/types/user.type";
import axiosInstance from "./axiosInstance"

export interface FilterUserPayload {
  name: string;
  limit: number;
  page: number;
};

export interface FilterUserResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
};


export const filterUserApi = (data: FilterUserPayload) =>
  axiosInstance.get<FilterUserResponse>('/users', { params: data });
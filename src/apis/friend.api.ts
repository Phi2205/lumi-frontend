import axiosInstance from "./axiosInstance";
import { ApiResponse } from "@/types/response.type";

import { User } from "../types/user.type";



export const getFriendsApi = (limit: string, page: string) =>
    axiosInstance.get<ApiResponse<User[]>>('/friends', { params: { limit, page } });
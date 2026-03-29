import * as userApi from '@/apis/user.api';
import { FilterUserPayload } from '@/apis/user.api';

export const filterUser = async (data: FilterUserPayload) => {
    try {
        const response = await userApi.filterUserApi(data);
        // unwrap ApiResponse<FilterUserResponse> -> FilterUserResponse
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const getUserByUsername = async (username: string) => {
    try {
        const response = await userApi.getUserByUsernameApi(username);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const editProfile = async (data: userApi.EditProfilePayload) => {
    try {
        const response = await userApi.editProfileApi(data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const userHoverCard = async (userId: string) => {
    try {
        const response = await userApi.userHoverCardApi(userId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

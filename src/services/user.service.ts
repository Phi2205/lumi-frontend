import * as userApi from '@/apis/user.api';
import { FilterUserPayload } from '@/apis/user.api';

export const filterUser = async (data: FilterUserPayload) => {
    try {
        const response = await userApi.filterUserApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
import * as authApi from '@/apis/auth.api';

export const loginUser = async (data: { email: string, password: string }) => {
    try {
        const response = await authApi.loginApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logoutUser = async () => {
    try {
        // Call logout API if needed (optional, depends on your backend)
        await authApi.logoutApi();
    } catch (error) {
        // Even if API call fails, we still want to clear local storage
        console.error('Logout API error:', error);
    } finally {
        // Always clear user from localStorage
        localStorage.removeItem('user');
    }
}

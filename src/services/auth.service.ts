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

export const registerUser = async (data: { email: string, password: string, name: string }) => {
    try {
        const response = await authApi.registerApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const verifyOtp = async (data: { email: string, otp: string }) => {
    try {
        const response = await authApi.verifyOtpApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const resendOtp = async (data: { email: string }) => {
    try {
        const response = await authApi.resendOtpApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMe = async () => {
    try {
        const response = await authApi.getMeApi();
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (data: { oldPassword: string, newPassword: string }) => {
    try {
        const response = await authApi.changePasswordApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (data: { email: string }) => {
    try {
        const response = await authApi.forgotPasswordApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (data: { email: string, otp: string, newPassword: string }) => {
    try {
        const response = await authApi.resetPasswordApi(data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

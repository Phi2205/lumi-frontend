import axiosInstance from './axiosInstance';
import axios from 'axios';
import { reconnectSocket } from '@/lib/socket';
import { User } from '@/types/user.type';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface VerifyPayload {
  email: string;
  otp: string;
}

export interface UserResponse extends User {
  birthday: string;
  bio: string;
}

// Axios instance riêng cho refresh token (không dùng interceptor chung)
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosPublic = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginApi = async (data: LoginPayload) => {
  if (typeof window !== 'undefined') {
    // Clear old auth data
    localStorage.removeItem('user');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  return axiosPublic.post('/auth/login', data);
};

export const logoutApi = () =>
  axiosInstance.post('/auth/logout');

export const registerApi = (data: RegisterPayload) =>
  axiosPublic.post('/auth/register', data);

export const verifyOtpApi = (data: VerifyPayload) =>
  axiosPublic.post('/auth/verify-otp', data);

export const resendOtpApi = (data: { email: string }) =>
  axiosPublic.post('/auth/resend-otp', data);

const axiosRefresh = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const refreshTokenApi = () =>
  axiosRefresh.post('/auth/refresh');

export const getMeApi = () =>
  axiosInstance.get('/auth/me');

export const changePasswordApi = (data: { oldPassword: string, newPassword: string }) =>
  axiosInstance.post('/auth/change-password', data);

export const forgotPasswordApi = (data: { email: string }) =>
  axiosPublic.post('/auth/forgot-password', data);

export const resetPasswordApi = (data: { email: string, otp: string, newPassword: string }) =>
  axiosPublic.post('/auth/reset-password', data);

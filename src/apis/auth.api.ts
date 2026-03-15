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

export interface VerifyPayload{
  email: string;
  otp: string;
}

export interface UserResponse extends User {
  birthday: string;
  bio: string;
}

export const loginApi = (data: LoginPayload) => 
  axiosInstance.post('/auth/login', data);

export const logoutApi = () => 
  axiosInstance.post('/auth/logout');

export const registerApi = (data: RegisterPayload) => 
  axiosInstance.post('/auth/register', data);

export const verifyOtpApi = (data: VerifyPayload) => 
  axiosInstance.post('/auth/verify-otp', data);

export const resendOtpApi = (data: { email: string }) => 
  axiosInstance.post('/auth/resend-otp', data);

// Axios instance riêng cho refresh token (không dùng interceptor chung)
const baseURL = process.env.NEXT_PUBLIC_API_URL;

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

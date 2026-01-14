import axiosInstance from './axiosInstance';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface VerifyPayload{
  email: string;
  otp: string;
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
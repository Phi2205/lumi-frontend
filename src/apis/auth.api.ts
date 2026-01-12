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

export const loginApi = (data: LoginPayload) => 
  axiosInstance.post('/auth/login', data);

export const logoutApi = () => 
  axiosInstance.post('/auth/logout');

export const registerApi = (data: RegisterPayload) => 
  axiosInstance.post('/auth/register', data);
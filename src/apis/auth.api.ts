import axiosInstance from './axiosInstance';

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginApi = (data: LoginPayload) => 
  axiosInstance.post('/auth/login', data);

export const logoutApi = () => 
  axiosInstance.post('/auth/logout');
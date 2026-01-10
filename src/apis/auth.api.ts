import { api } from '../lib/axios';

export const loginApi = (data: {
  email: string;
  password: string;
}) => {
  return api.post('/auth/login', data);
};

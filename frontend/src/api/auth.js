import apiClient from '../lib/api.js';

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data?.data;
};

export const logout = async () => {
  await apiClient.post('/auth/logout');
};

export const register = async (payload) => {
  const response = await apiClient.post('/user/register', payload);
  return response.data?.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data?.data;
};



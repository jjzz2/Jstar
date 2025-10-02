import { apiClient } from '../api';

export const authService = {
  login: async (username, password) => {
    const { data } = await apiClient.post('/auth/login', { username, password });
    return data; // { token, user }
  },
  
  getProfile: async () => {
    const { data } = await apiClient.get('/auth/profile');
    return data; // { id, name }
  },
};

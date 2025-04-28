import axios from 'axios';
import { authService } from '@/services/authService';
import router from '@/router';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => {
    if (response.data.success === false) {
      authService.clearSession();
      router.push('/login');
    }
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      authService.clearSession();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
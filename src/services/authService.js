import axios from '@/plugins/axios';
import mitt from 'mitt';

const API_URL   = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'sales_token';
const USER_KEY  = 'sales_user';

const emitter = mitt();

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        const token = response.data.data.token;
        const user = response.data.data.user;
        
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        emitter.emit('auth-change', true);

        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Login failed.' };
    }
  },

  async logout() {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });
    } catch (error) {
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      emitter.emit('auth-change', false);
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    emitter.emit('auth-change', false);
  },

  onAuthChange(callback) {
    emitter.on('auth-change', callback);
  },

  offAuthChange(callback) {
    emitter.off('auth-change', callback);
  }
};
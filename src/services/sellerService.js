import axios from '@/plugins/axios';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export const sellerService = {
  async list() {
    try {
      const response = await axios.get(`${API_URL}/sellers`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to list sellers.' };
    }
  },

  async show(id) {
    try {
      const response = await axios.get(`${API_URL}/sellers/${id}`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to get seller.' };
    }
  },

  async store(data) {
    try {
      const response = await axios.post(`${API_URL}/sellers`, data, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to create seller.' };
    }
  },

  async update(id, data) {
    try {
      const response = await axios.put(`${API_URL}/sellers/${id}`, data, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to update seller.' };
    }
  },

  async destroy(id) {
    try {
      const response = await axios.delete(`${API_URL}/sellers/${id}`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        }
      });

      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to delete seller.' };
    }
  }
};

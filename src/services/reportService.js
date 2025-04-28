import axios from '@/plugins/axios';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export const reportService = {
  async sendAdminReport(adminId) {
    try {
      const response = await axios.post(`${API_URL}/reports/admin/${adminId}`, {}, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to send admin report.' };
    }
  },

  async sendSellerReport(sellerId) {
    try {
      const response = await axios.post(`${API_URL}/reports/seller/${sellerId}`, {}, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to send seller report.' };
    }
  }
};
import axios from '@/plugins/axios';

const API_URL   = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'sales_token';

export const saleService = {
  async list() {
    try {
      const response = await axios.get(`${API_URL}/sales`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to fetch sales.' };
    }
  },

  async show(id) {
    try {
      const response = await axios.get(`${API_URL}/sales/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to fetch sale.' };
    }
  },

  async store(data) {
    try {
      const response = await axios.post(`${API_URL}/sales`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to create sale.' };
    }
  },

  async update(id, data) {
    try {
      const response = await axios.put(`${API_URL}/sales/${id}`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to update sale.' };
    }
  },

  async destroy(id) {
    try {
      const response = await axios.delete(`${API_URL}/sales/${id}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message ?? 'Failed to delete sale.' };
    }
  }
};
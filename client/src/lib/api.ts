import axios from 'axios';
import { toast } from '@/hooks/use-toast';

class ApiService {
  private axiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please log in again.'));
        }

        if (error.response?.status >= 400 && error.response?.status < 500) {
          // Client errors
          const message = error.response?.data?.message || error.response?.data?.error || 'Request failed';
          return Promise.reject(new Error(message));
        }

        if (error.response?.status >= 500) {
          // Server errors
          toast({
            variant: "destructive",
            title: "Server Error",
            description: "Something went wrong on our end. Please try again later.",
          });
          return Promise.reject(new Error('Server error occurred'));
        }

        // Network errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Could not connect to server. Please check your connection.",
          });
          return Promise.reject(new Error('Network error'));
        }

        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  async get(url: string, config = {}) {
    return this.axiosInstance.get(url, config);
  }

  async post(url: string, data = {}, config = {}) {
    return this.axiosInstance.post(url, data, config);
  }

  async put(url: string, data = {}, config = {}) {
    return this.axiosInstance.put(url, data, config);
  }

  async delete(url: string, config = {}) {
    return this.axiosInstance.delete(url, config);
  }
  async patch(url: string, data = {}, config = {}) {
    return this.axiosInstance.patch(url, data, config);
  }
}

export const apiService = new ApiService();
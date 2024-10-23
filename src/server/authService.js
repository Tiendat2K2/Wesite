import axios from 'axios';
import API_URL from './server';
import { jwtDecode } from 'jwt-decode';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refresh_token: refreshToken });
    
    if (response.data.status === 1) {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      setAuthToken(access_token);
      return access_token;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearAuthData();
    window.location.reload(); // Refresh trang
    throw error;
  }
};

const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('userId');
  localStorage.removeItem('roleId');
  setAuthToken(null);
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        try {
          token = await refreshToken();
        } catch (error) {
          clearAuthData();
          window.location.reload(); // Refresh trang
          return Promise.reject(error);
        }
      }
      
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearAuthData();
        window.location.reload(); // Refresh trang
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      Username: username,
      Password: password,
    });

    if (response.data.status === 1) {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      setAuthToken(access_token);

      const decodedToken = jwtDecode(access_token);
      localStorage.setItem('userId', decodedToken.id);
      localStorage.setItem('roleId', decodedToken.roleId);

      return { success: true, roleId: decodedToken.roleId };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.response?.data?.message || 'Không thể kết nối đến máy chủ!' };
  }
};

export default axiosInstance;
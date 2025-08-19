import axios from 'axios';
import { BASE_URL } from '../config/config';

const API_URL = `${BASE_URL}api/auth`;

// Register user  
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
const getMe = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get user data';
  }
};

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;
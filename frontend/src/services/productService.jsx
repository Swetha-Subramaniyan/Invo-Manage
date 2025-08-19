import axios from 'axios';
import { BASE_URL } from '../config/config';

const API_URL = `${BASE_URL}api/products`;

// Get token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// Get all products
const getProducts = async (params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    params,
  };
  
  const response = await axios.get(API_URL, config);
  return response.data.data;
};

// Search products
const searchProducts = async (name) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    params: { name },
  };
  
  const response = await axios.get(`${API_URL}/search`, config);
  return response.data.data;
};

// Create product
const createProduct = async (productData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  
  const response = await axios.post(API_URL, productData, config);
  return response.data.data;
};

// Update product
const updateProduct = async (id, productData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  
  const response = await axios.put(`${API_URL}/${id}`, productData, config);
  return response.data.data;
};

// Delete product
const deleteProduct = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

//Delete Multiple Products
const deleteManyProducts = async (ids) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  const response = await axios.post(`${API_URL}/delete-many`, { ids }, config);
  return response.data;
};

// Import products
const importProducts = async (formData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  
  const response = await axios.post(`${API_URL}/import`, formData, config);
  return response.data;
};

// Export products
const exportProducts = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      responseType: 'blob',
    },
  };
  
  const response = await axios.get(`${API_URL}/export`, config);
  return response;
};

// Get inventory history
const getInventoryHistory = async (productId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/${productId}/history`, config);
  return response.data.data;
};

const productService = {
  getProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  importProducts,
  exportProducts,
  getInventoryHistory,
};

export default productService;
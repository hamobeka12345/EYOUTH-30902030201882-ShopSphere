import api, { getToken } from './api';

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const createProduct = (formData) =>
  api.post('/products', formData, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' }
  });

export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' }
  });

export const deleteProduct = (id) => api.delete(`/products/${id}`, authHeader());

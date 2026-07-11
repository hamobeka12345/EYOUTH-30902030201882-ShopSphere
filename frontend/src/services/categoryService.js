import api, { getToken } from './api';

export const getCategories = () => api.get('/categories');

export const createCategory = (data) =>
  api.post('/categories', data, { headers: { Authorization: `Bearer ${getToken()}` } });

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data, { headers: { Authorization: `Bearer ${getToken()}` } });

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });

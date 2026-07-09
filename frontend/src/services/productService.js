import api from './api';

export const fetchProducts = (params) => api.get('/products', { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (body) => api.post('/products', body);
export const updateProduct = (id, body) => api.put(`/products/${id}`, body);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

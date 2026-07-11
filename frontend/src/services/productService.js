import api from './api';

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (product, token) => api.post('/products', product, { headers: { Authorization: `Bearer ${token}` } });

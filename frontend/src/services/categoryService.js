import api from './api';

export const fetchCategories = () => api.get('/categories');
export const createCategory = (body) => api.post('/categories', body);
export const updateCategory = (id, body) => api.put(`/categories/${id}`, body);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

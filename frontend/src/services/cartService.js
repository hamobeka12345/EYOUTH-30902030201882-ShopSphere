import api, { getToken } from './api';

const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const getCart = () => api.get('/cart', authHeader());
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart/items', { productId, quantity }, authHeader());
export const updateCartItem = (id, quantity) =>
  api.put(`/cart/items/${id}`, { quantity }, authHeader());
export const removeCartItem = (id) => api.delete(`/cart/items/${id}`, authHeader());
export const clearCart = () => api.delete('/cart', authHeader());

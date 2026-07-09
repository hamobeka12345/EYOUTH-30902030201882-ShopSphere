import api from './api';

export const fetchCart = () => api.get('/cart');
export const addCartItem = (body) => api.post('/cart', body);
export const updateCartItem = (id, body) => api.put(`/cart/${id}`, body);
export const removeCartItem = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart');

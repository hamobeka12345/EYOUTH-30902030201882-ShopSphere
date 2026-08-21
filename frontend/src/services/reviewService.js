import api from './api';

export const getReviews = (productId) => api.get(`/reviews/${productId}`);
export const createReview = (productId, data) => api.post(`/reviews/${productId}`, data);

import axios from 'axios';

const REVIEW_API_URL = 'https://eyouth-30902030201882-shopsphere-re-nine.vercel.app';

const reviewApi = axios.create({
  baseURL: REVIEW_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getReviews = (productId) => reviewApi.get(`/products/${productId}/reviews`);
export const createReview = (productId, data) => reviewApi.post(`/products/${productId}/reviews`, data);

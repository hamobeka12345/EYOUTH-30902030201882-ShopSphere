const express = require('express');
const router = express.Router();
const axios = require('axios');

const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'https://review-service-eight.vercel.app';

router.get('/:productId', async (req, res) => {
  try {
    const response = await axios.get(`${REVIEW_SERVICE_URL}/products/${req.params.productId}/reviews`);
    res.json(response.data);
  } catch (err) {
    console.error('Review service proxy error (GET):', err.message);
    res.status(502).json({ message: 'Failed to fetch reviews from review service' });
  }
});

router.post('/:productId', async (req, res) => {
  try {
    const response = await axios.post(`${REVIEW_SERVICE_URL}/products/${req.params.productId}/reviews`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Review service proxy error (POST):', err.message);
    res.status(502).json({ message: 'Failed to submit review to review service' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'https://review-service-eight.vercel.app';

router.get('/:productId', async (req, res) => {
  try {
    const response = await fetch(`${REVIEW_SERVICE_URL}/products/${req.params.productId}/reviews`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Review service proxy error (GET):', err.message);
    res.status(502).json({ message: 'Failed to fetch reviews from review service' });
  }
});

router.post('/:productId', async (req, res) => {
  try {
    const response = await fetch(`${REVIEW_SERVICE_URL}/products/${req.params.productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Review service proxy error (POST):', err.message);
    res.status(502).json({ message: 'Failed to submit review to review service' });
  }
});

module.exports = router;

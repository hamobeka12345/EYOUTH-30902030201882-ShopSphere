const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'review-service', status: 'ok' });
});

app.get('/reviews', (req, res) => {
  res.json({ message: 'Review service - get reviews' });
});

app.post('/reviews', (req, res) => {
  res.json({ message: 'Review service - create review' });
});

app.get('/products/:productId/reviews', (req, res) => {
  res.json({ message: 'Review service - get reviews for product', productId: req.params.productId });
});

app.post('/products/:productId/reviews', (req, res) => {
  const review = {
    id: Date.now(),
    productId: Number(req.params.productId),
    userId: req.body.userId || 1,
    rating: req.body.rating || 5,
    comment: req.body.comment || '',
    createdAt: new Date().toISOString()
  };
  res.json({ message: 'Review service - create review for product', productId: Number(req.params.productId), review });
});

app.use((err, req, res, next) => {
  console.error('Review service error:', err.stack || err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

module.exports = (req, res) => {
  return app(req, res);
};

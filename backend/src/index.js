const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
console.log('dotenv loaded:', dotenvResult.parsed ? true : false, 'DATABASE_URL exists:', !!process.env.DATABASE_URL);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { uploadSingle, handleUploadError } = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.set('Retry-After', '60');
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

const writeLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.set('Retry-After', '60');
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

const writeMethods = ['POST', 'PUT', 'DELETE'];
const writePaths = ['/api/products', '/api/categories', '/api/cart', '/api/reviews'];

app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return authLimiter(req, res, next);
  }
  if (writeMethods.includes(req.method) && writePaths.some(p => req.path.startsWith(p))) {
    return writeLimiter(req, res, next);
  }
  next();
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), studentId: 'EYOUTH-30902030201882', service: 'ShopSphere' });
});

app.post('/api/upload', uploadSingle, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});
app.use(handleUploadError);

app.use('/uploads', express.static(require('path').resolve(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  console.error('API error:', err.stack || err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;


const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const logger = require('./utils/logger');
logger.info('dotenv loaded', { exists: !!dotenvResult.parsed, databaseUrlExists: !!process.env.DATABASE_URL });
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
app.use(logger.http);

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.set('Retry-After', '120');
    res.status(429).json({ message: 'Too many requests, please try again later.', retryAfter: 120 });
  }
});

const writeLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.set('Retry-After', '120');
    res.status(429).json({ message: 'Too many requests, please try again later.', retryAfter: 120 });
  }
});

const writeMethods = ['POST', 'PUT', 'DELETE'];

app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/products', (req, res, next) => {
  if (writeMethods.includes(req.method)) return writeLimiter(req, res, next);
  next();
}, productRoutes);
app.use('/api/categories', (req, res, next) => {
  if (writeMethods.includes(req.method)) return writeLimiter(req, res, next);
  next();
}, categoryRoutes);
app.use('/api/cart', (req, res, next) => {
  if (writeMethods.includes(req.method)) return writeLimiter(req, res, next);
  next();
}, cartRoutes);
app.use('/api/reviews', (req, res, next) => {
  if (writeMethods.includes(req.method)) return writeLimiter(req, res, next);
  next();
}, reviewRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), studentId: 'EYOUTH-30902030201882', service: 'ShopSphere', pipeline: 'github-actions' });
});

app.post('/api/upload', uploadSingle, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});
app.use(handleUploadError);

app.use('/uploads', express.static(require('path').resolve(__dirname, '..', 'uploads')));

app.use((err, req, res, next) => {
  logger.error(err.message || 'Internal server error', { stack: err.stack, method: req.method, path: req.originalUrl || req.url });
  res.status(500).json({ message: err.message || 'Internal server error' });
});

if (require.main === module) {
  logger.info('Server starting', { port: PORT });
  app.listen(PORT, () => logger.info('Server running', { port: PORT }));
}

module.exports = app;


const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
console.log('dotenv loaded:', dotenvResult.parsed ? true : false, 'DATABASE_URL exists:', !!process.env.DATABASE_URL);
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use((err, req, res, next) => {
  console.error('API error:', err.stack || err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


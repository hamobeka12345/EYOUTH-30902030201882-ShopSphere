require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const uploadRoutes = require('./routes/upload');
const app = express();
/** @type {NodeJS.Process} */
const _process = process;

const PORT = _process.env.PORT || 5000;

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.send('Backend running...'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


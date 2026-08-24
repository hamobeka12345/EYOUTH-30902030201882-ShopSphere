import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import RateLimitBanner from './components/RateLimitBanner';

function App() {
  throw new Error('ROLLBACK TEST - intentional failure');
  return (
    <AuthProvider>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <RateLimitBanner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/products/:id' element={<ProductDetailPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/admin' element={<AdminPage />} />
            <Route path='*' element={<div style={{ padding: '1.5rem' }}>Page not found</div>} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

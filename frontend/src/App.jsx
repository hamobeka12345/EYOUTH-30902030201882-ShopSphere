import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import Header from './components/Header';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/cart' element={<div style={{ padding: '1.5rem' }}>Cart page coming soon</div>} />
          <Route path='/admin' element={<div style={{ padding: '1.5rem' }}>Admin dashboard coming soon</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

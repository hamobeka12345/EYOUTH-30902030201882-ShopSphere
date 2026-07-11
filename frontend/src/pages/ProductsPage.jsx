import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getProducts({ limit: 10 })
      .then((response) => {
        setProducts(response.data.items);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Products</h1>
      {status === 'loading' && <p>Loading products...</p>}
      {status === 'error' && <p>Could not load products.</p>}
      {status === 'loaded' && products.length === 0 && <p>No products available yet.</p>}
      {status === 'loaded' && products.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {products.map((product) => (
            <div key={product.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h2>{product.name}</h2>
              <p style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
              <p>{product.description}</p>
              {product.category?.name && <p style={{ color: '#555' }}>Category: {product.category.name}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

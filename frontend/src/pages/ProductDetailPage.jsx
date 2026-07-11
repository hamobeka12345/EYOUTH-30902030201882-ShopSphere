import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setStatus('loading');
    getProduct(id)
      .then((res) => {
        setProduct(res.data.product);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      alert('Added to cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  if (status === 'loading') return <p style={{ padding: '1.5rem' }}>Loading...</p>;
  if (status === 'error' || !product) return <p style={{ padding: '1.5rem' }}>Product not found.</p>;

  return (
    <div style={{ padding: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '320px', height: '320px', objectFit: 'cover', borderRadius: '8px' }}
        />
      )}
      <div style={{ flex: '1 1 300px' }}>
        <h1>{product.name}</h1>
        {product.category?.name && <p style={{ color: '#555' }}>Category: {product.category.name}</p>}
        <p style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>${Number(product.price).toFixed(2)}</p>
        <p>{product.description}</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
          <label>
            Quantity:{' '}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              style={{ width: '60px', padding: '0.3rem' }}
            />
          </label>
          <button onClick={handleAddToCart} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Add to cart
          </button>
        </div>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/products">Back to products</Link>
        </p>
      </div>
    </div>
  );
}

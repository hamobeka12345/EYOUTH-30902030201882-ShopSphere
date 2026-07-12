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
  const [addToCartMsg, setAddToCartMsg] = useState('');


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
      setAddToCartMsg('Added to cart');
      setTimeout(() => setAddToCartMsg(''), 2000);

    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  if (status === 'loading') return <p className="loading" style={{ padding: '1.5rem' }}>Loading...</p>;
  if (status === 'error' || !product) return <p className="notice" style={{ padding: '1.5rem' }}>Product not found.</p>;

  return (
    <div className="product-detail">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
        />
      )}
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        {product.category?.name && <p className="product-detail-category">Category: {product.category.name}</p>}
        <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
        <p className="product-detail-desc">{product.description}</p>
        <div className="product-detail-actions">
          <label>
            Quantity:{' '}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
          <button onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>

        {addToCartMsg && (
          <p className="notice" style={{ marginTop: 12 }}>{addToCartMsg}</p>
        )}

        <p className="product-detail-back">
          <Link to="/products" className="btn back-to-products">Back to products</Link>
        </p>


      </div>
    </div>
  );
}

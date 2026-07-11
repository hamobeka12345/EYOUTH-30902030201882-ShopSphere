import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading');

  const loadCart = useCallback(() => {
    setStatus('loading');
    getCart()
      .then((res) => {
        setItems(res.data.items);
        setTotal(res.data.total);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user, loading, navigate, loadCart]);

  const handleQty = async (id, quantity) => {
    try {
      const res = await updateCartItem(id, quantity);
      setItems(res.data.items);
      setTotal(res.data.items.reduce((s, i) => s + i.quantity * i.product.price, 0));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update');
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await removeCartItem(id);
      setItems(res.data.items);
      setTotal(res.data.items.reduce((s, i) => s + i.quantity * i.product.price, 0));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove');
    }
  };

  const handleClear = async () => {
    try {
      const res = await clearCart();
      setItems(res.data.items);
      setTotal(0);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not clear');
    }
  };

  if (status === 'loading') return <p style={{ padding: '1.5rem' }}>Loading cart...</p>;
  if (status === 'error') return <p style={{ padding: '1.5rem' }}>Could not load cart.</p>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Your Cart</h1>
      {items.length === 0 && (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/products">Browse products</Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem' }}>{item.product.name}</h3>
                  <p style={{ margin: 0 }}>${Number(item.product.price).toFixed(2)} each</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQty(item.id, Math.max(1, Number(e.target.value) || 1))}
                  style={{ width: '60px', padding: '0.3rem' }}
                />
                <p style={{ fontWeight: 'bold', width: '90px', textAlign: 'right' }}>
                  ${(item.quantity * item.product.price).toFixed(2)}
                </p>
                <button onClick={() => handleRemove(item.id)} style={{ padding: '0.4rem 0.7rem', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handleClear} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Clear cart
            </button>
            <h2>Total: ${Number(total).toFixed(2)}</h2>
          </div>
        </>
      )}
    </div>
  );
}

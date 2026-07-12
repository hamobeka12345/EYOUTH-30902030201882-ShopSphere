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

  if (status === 'loading') return <p className="loading" style={{ padding: '1.5rem' }}>Loading cart...</p>;
  if (status === 'error') return <p className="notice" style={{ padding: '1.5rem' }}>Could not load cart.</p>;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {items.length === 0 && (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/products">Browse products</Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.name} />
                )}
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p>${Number(item.product.price).toFixed(2)} each</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQty(item.id, Math.max(1, Number(e.target.value) || 1))}
                  className="cart-item-qty"
                />
                <p className="cart-item-total">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </p>
                <button onClick={() => handleRemove(item.id)} className="cart-item-remove">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <button onClick={handleClear} className="cart-clear">
              Clear cart
            </button>
            <h2>Total: ${Number(total).toFixed(2)}</h2>
          </div>
        </>
      )}
    </div>
  );
}

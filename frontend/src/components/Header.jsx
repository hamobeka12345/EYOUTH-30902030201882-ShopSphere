import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../services/cartService';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    getCart()
      .then((res) => setCartCount(res.data.count || 0))
      .catch(() => setCartCount(0));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to='/'>Home</Link>
        <Link to='/products'>Products</Link>
        <Link to='/cart'>Cart{cartCount > 0 ? ` (${cartCount})` : ''}</Link>
        {isAdmin && <Link to='/admin'>Admin</Link>}
      </nav>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </header>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        const u = await login(form.email, form.password);
        if (u.role === 'admin') navigate('/admin');
        else navigate('/products');
      } else {
        const u = await register(form.name, form.email, form.password);
        if (u.role === 'admin') navigate('/admin');
        else navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mode === 'register' && (
          <input type="text" placeholder="Name" value={form.name} onChange={update('name')} style={{ padding: '0.5rem' }} required />
        )}
        <input type="email" placeholder="Email" value={form.email} onChange={update('email')} style={{ padding: '0.5rem' }} required />
        <input type="password" placeholder="Password" value={form.password} onChange={update('password')} style={{ padding: '0.5rem' }} required />
        <button type="submit" disabled={busy} style={{ padding: '0.6rem', cursor: 'pointer' }}>
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        {mode === 'login' ? (
          <span>
            No account?{' '}
            <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
              Register
            </button>
          </span>
        ) : (
          <span>
            Have an account?{' '}
            <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
              Login
            </button>
          </span>
        )}
      </p>
    </div>
  );
}

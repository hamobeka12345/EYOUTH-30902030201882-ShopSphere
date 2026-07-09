import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const mutation = useMutation(loginUser, {
    onSuccess: (response) => {
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      navigate('/products');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button type="submit" disabled={mutation.isLoading}>Login</button>
        {mutation.isError && <p style={{ color: 'red' }}>{mutation.error.response?.data?.message || 'Login failed'}</p>}
      </form>
    </div>
  );
};

export default LoginPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const mutation = useMutation(registerUser, {
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button type="submit" disabled={mutation.isLoading}>Register</button>
        {mutation.isError && <p style={{ color: 'red' }}>{mutation.error.response?.data?.message || 'Registration failed'}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;

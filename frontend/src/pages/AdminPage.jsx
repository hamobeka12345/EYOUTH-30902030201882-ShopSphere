import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/productService';
import { createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState('products');

  if (loading) {
    return <p style={{ padding: '1.5rem' }}>Loading...</p>;
  }

  if (!isAdmin) {
    return <p style={{ padding: '1.5rem' }}>Access denied. Admin only.</p>;
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setTab('products')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: tab === 'products' ? 'bold' : 'normal' }}>
          Products
        </button>
        <button onClick={() => setTab('categories')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: tab === 'categories' ? 'bold' : 'normal' }}>
          Categories
        </button>
      </div>
      {tab === 'products' ? <ProductManager /> : <CategoryManager />}
    </div>
  );
}

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', image: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    getProducts({ limit: 1000 }).then((res) => setProducts(res.data.items)).catch(() => setProducts([]));
    getCategories().then((res) => setCategories(res.data.items)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', categoryId: '', image: '' });
    setFile(null);
    setMessage('');
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      categoryId: p.categoryId ? String(p.categoryId) : '',
      image: p.image && !p.image.startsWith('/uploads/') ? p.image : ''
    });
    setFile(null);
    setMessage('');
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setBusy(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    if (form.categoryId) fd.append('categoryId', form.categoryId);
    if (file) fd.append('image', file);
    else if (form.image) fd.append('image', form.image);

    try {
      if (editing) {
        await updateProduct(editing, fd);
        setMessage('Product updated.');
      } else {
        await createProduct(fd);
        setMessage('Product created.');
      }
      resetForm();
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div>
      {message && <p style={{ color: message.includes('fail') || message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}

      <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '420px', marginBottom: '2rem' }}>
        <input type="text" placeholder="Name" value={form.name} onChange={update('name')} style={{ padding: '0.5rem' }} required />
        <textarea placeholder="Description" value={form.description} onChange={update('description')} style={{ padding: '0.5rem' }} />
        <input type="number" step="0.01" min="0" placeholder="Price" value={form.price} onChange={update('price')} style={{ padding: '0.5rem' }} required />
        <select value={form.categoryId} onChange={update('categoryId')} style={{ padding: '0.5rem' }}>
          <option value="">Select category (optional)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
        <input type="text" placeholder="Or image URL" value={form.image} onChange={update('image')} style={{ padding: '0.5rem' }} disabled={!!file} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={busy} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && <button type="button" onClick={resetForm} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancel</button>}
        </div>
      </form>

      <h2>All Products</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Price</th>
            <th style={cellStyle}>Category</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={cellStyle}>{p.id}</td>
              <td style={cellStyle}>{p.name}</td>
              <td style={cellStyle}>${Number(p.price).toFixed(2)}</td>
              <td style={cellStyle}>{p.category?.name || '-'}</td>
              <td style={cellStyle}>
                <button onClick={() => startEdit(p)} style={{ marginRight: '0.5rem', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td style={cellStyle} colSpan="5">No products yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    getCategories().then((res) => setCategories(res.data.items)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.name.trim()) return;
    try {
      if (editing) {
        await updateCategory(editing, { name: form.name });
        setMessage('Category updated.');
      } else {
        await createCategory({ name: form.name });
        setMessage('Category created.');
      }
      setForm({ name: '' });
      setEditing(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed.');
    }
  };

  const startEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div>
      {message && <p style={{ color: message.includes('fail') || message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
      <h2>{editing ? 'Edit Category' : 'Add Category'}</h2>
      <form onSubmit={submit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input type="text" placeholder="Category name" value={form.name} onChange={(e) => setForm({ name: e.target.value })} style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>{editing ? 'Update' : 'Create'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '' }); }} style={{ cursor: 'pointer' }}>Cancel</button>}
      </form>

      <h2>All Categories</h2>
      <ul>
        {categories.map((c) => (
          <li key={c.id} style={{ marginBottom: '0.5rem' }}>
            {c.name} {typeof c._count?.products === 'number' ? `(${c._count.products} products)` : ''}
            <button onClick={() => startEdit(c)} style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => remove(c.id)} style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
        {categories.length === 0 && <li>No categories yet.</li>}
      </ul>
    </div>
  );
}

const cellStyle = {
  border: '1px solid #ddd',
  padding: '0.5rem',
  textAlign: 'left'
};

import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

export default function ProductsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');

  const loadCategories = useCallback(() => {
    getCategories()
      .then((res) => setCategories(res.data.items))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    setStatus('loading');
    const params = { limit: 8, page, category: category || undefined, sort, search: search || undefined };
    getProducts(params)
      .then((res) => {
        setProducts(res.data.items);
        setTotalPages(res.data.totalPages || 1);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [page, category, sort, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId, 1);
      alert('Added to cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Products</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 200px' }}
        />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={{ padding: '0.5rem' }}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} style={{ padding: '0.5rem' }}>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Search</button>
      </form>

      {status === 'loading' && <p>Loading products...</p>}
      {status === 'error' && <p>Could not load products.</p>}
      {status === 'loaded' && products.length === 0 && <p>No products available yet.</p>}

      {status === 'loaded' && products.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {products.map((product) => (
              <div key={product.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }}
                  />
                )}
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>{product.name}</h2>
                </Link>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem' }}>${Number(product.price).toFixed(2)}</p>
                {product.category?.name && <p style={{ color: '#555', margin: '0 0 0.5rem' }}>Category: {product.category.name}</p>}
                <button
                  onClick={() => handleAddToCart(product.id)}
                  style={{ marginTop: 'auto', padding: '0.5rem', cursor: 'pointer' }}
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
              Previous
            </button>
            <span style={{ padding: '0.4rem' }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

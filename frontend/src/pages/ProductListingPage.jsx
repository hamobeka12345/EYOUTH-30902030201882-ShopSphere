import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/productService';
import { fetchCategories } from '../services/categoryService';
import { Link } from 'react-router-dom';

const ProductListingPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery(['categories'], fetchCategories);
  const { data, isLoading, isError } = useQuery(['products', query, category, sort, page], () =>
    fetchProducts({ search: query, category, sortBy: sort, page, limit: 12 }).then((res) => res.data)
  );

  const pagination = useMemo(() => data?.pagination || { page: 1, limit: 12, total: 0 }, [data]);

  return (
    <div>
      <h1>Products</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.data?.categories?.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
        </select>
      </div>

      {isLoading && <p>Loading products...</p>}
      {isError && <p style={{ color: 'red' }}>Failed to load products.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
        {data?.products?.map((product) => (
          <article key={product.id} style={{ border: '1px solid #ddd', padding: '1rem' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <Link to={`/products/${product.id}`}>View details</Link>
          </article>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button disabled={pagination.page === 1} onClick={() => setPage((current) => current - 1)}>
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {pagination.page}</span>
        <button disabled={pagination.page * pagination.limit >= pagination.total} onClick={() => setPage((current) => current + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductListingPage;

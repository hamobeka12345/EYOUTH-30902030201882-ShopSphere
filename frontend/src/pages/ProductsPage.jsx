import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

const Img = ({ p }) => {
  const [failed, setFailed] = useState(false);
  return p.image && !failed ? (
    <img src={p.image} alt={p.name} onError={() => setFailed(true)} />
  ) : (
    <div className="image-fallback">Morrow</div>
  );
};

// Derive how many product cards fit the visible area so the rest is paginated.
// Columns come from the live grid track count; rows from the viewport height.
function getPageSize(grid) {
  if (!grid) return 8;
  const cs = getComputedStyle(grid);
  const columns = cs.gridTemplateColumns.split(' ').filter(Boolean).length || 1;
  const rowGap = parseFloat(cs.rowGap) || 24;
  const card = grid.querySelector('.product-card');
  const cardHeight = card ? card.getBoundingClientRect().height : 280;
  const top = grid.getBoundingClientRect().top;
  // Reserve space below the grid for pagination controls + bottom margin.
  const available = window.innerHeight - top - 120;
  const rows = Math.max(1, Math.floor((available + rowGap) / (cardHeight + rowGap)));
  return Math.max(1, columns * rows);
}

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || 1);

  const gridRef = useRef(null);
  const [limit, setLimit] = useState(8);

  const change = (next) =>
    setParams({
      ...Object.fromEntries(params),
      ...next,
      page: next.page || 1,
    });

  const q = useQuery({
    queryKey: ['products', { search, category, sort, page, limit }],
    queryFn: () =>
      getProducts({ search, category, sort, page, limit }).then((r) => r.data),
  });

  const cats = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data.items),
  });

  // Re-measure the grid whenever it renders and on viewport/container resize.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => setLimit(getPageSize(grid));
    measure();
    window.addEventListener('resize', measure);
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(grid);
    }
    return () => {
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, [q.data]);

  // When the fitted page size changes, return to the first page.
  useEffect(() => {
    if (page !== 1) change({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return (
    <main className="page container">
      <div className="section-head">
        <div>
          <div className="eyebrow">The full collection</div>
          <h1>Objects with a point of view.</h1>
        </div>
        <span>{q.data?.total || 0} pieces</span>
      </div>

      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          change({ search: e.currentTarget.search.value.trim() });
        }}
      >
        <input
          className="field"
          name="search"
          defaultValue={search}
          placeholder="Search the collection"
        />

        <select
          className="field"
          value={category}
          onChange={(e) => change({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {cats.data?.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="field"
          value={sort}
          onChange={(e) => change({ sort: e.target.value })}
        >
          <option value="newest">Newest arrivals</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
        </select>

        <button className="btn">Apply</button>
      </form>

      {q.isLoading ? (
        <div className="loading">Curating the collection…</div>
      ) : q.isError ? (
        <div className="notice">
          Couldn’t load products.{' '}
          <button className="text-button" onClick={() => q.refetch()}>
            Try again
          </button>
        </div>
      ) : q.data.items.length === 0 ? (
        <div className="notice no-products-notice">
          <div>No pieces match that search. Try a different category or search.</div>
          <button
            className="btn secondary no-products-action"
            type="button"
            onClick={() => setParams({})}
          >
            Browse products
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid" ref={gridRef}>
            {q.data.items.map((p) => (
              <Link className="product-card" to={`/products/${p.id}`} key={p.id}>
                <Img p={p} />
                <div className="card-body">
                  <div className="eyebrow">{p.category?.name || 'Collection'}</div>
                  <h3>{p.name}</h3>
                  <div className="price">${Number(p.price || 0).toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination">
            <button
              className="btn secondary"
              disabled={page === 1}
              onClick={() => change({ page: page - 1 })}
            >
              Previous
            </button>
            <span>
              Page {page} of {q.data.totalPages || 1}
            </span>
            <button
              className="btn secondary"
              disabled={page >= q.data.totalPages}
              onClick={() => change({ page: page + 1 })}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

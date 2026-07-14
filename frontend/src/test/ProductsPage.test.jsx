import React from 'react';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import ProductsPage from '../pages/ProductsPage';

const sampleProducts = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, image: '', category: { name: 'Electronics' } },
  { id: 2, name: 'Modern JavaScript Book', price: 29.99, image: '', category: { name: 'Books' } },
  { id: 3, name: 'Smart LED TV', price: 349.99, image: '', category: { name: 'Electronics' } },
];

const server = setupServer(
  http.get(/\/api\/products(\?.*)?$/, () =>
    HttpResponse.json({ items: sampleProducts, total: 20, page: 1, limit: sampleProducts.length, totalPages: 7 })
  ),
  http.get(/\/api\/categories$/, () =>
    HttpResponse.json({
      items: [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Books' },
        { id: 3, name: 'Home & Kitchen' },
      ],
    })
  )
);

beforeAll(() => {
  // jsdom has no layout engine, so the responsive getPageSize() would compute
  // limit=1. Simulate a desktop viewport + a multi-column grid for the test only.
  try { Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true }); } catch { window.innerHeight = 1080; }
  const realGCS = window.getComputedStyle.bind(window);
  window.getComputedStyle = (el) => {
    const cs = realGCS(el);
    if (el && typeof el.className === 'string' && el.className.includes('product-grid')) {
      Object.defineProperty(cs, 'gridTemplateColumns', { value: '240px 240px 240px 240px', configurable: true });
      Object.defineProperty(cs, 'rowGap', { value: '24px', configurable: true });
      Object.defineProperty(cs, 'columnGap', { value: '24px', configurable: true });
    }
    return cs;
  };
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/products']}>
        <ProductsPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ProductsPage', () => {
  it('renders products fetched from the API (mocked with MSW)', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      expect(screen.getByText('Modern JavaScript Book')).toBeInTheDocument();
      expect(screen.getByText('Smart LED TV')).toBeInTheDocument();
    });
  });

  it('shows pagination controls after data loads', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });
  });

  it('renders the filter controls (search + category + sort)', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search the collection/i)).toBeInTheDocument();
      expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
    });
  });
});

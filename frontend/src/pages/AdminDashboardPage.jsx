import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/productService';
import { fetchCategories } from '../services/categoryService';

const AdminDashboardPage = () => {
  const { data: productsData, isLoading: productsLoading } = useQuery(['adminProducts'], () => fetchProducts({ page: 1, limit: 50 }).then((res) => res.data));
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(['adminCategories'], () => fetchCategories().then((res) => res.data));

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>Products</h2>
        {productsLoading && <p>Loading products...</p>}
        <ul>
          {productsData?.products?.map((product) => (
            <li key={product.id}>{product.name} - ${product.price}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Categories</h2>
        {categoriesLoading && <p>Loading categories...</p>}
        <ul>
          {categoriesData?.categories?.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboardPage;

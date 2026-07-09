import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to E-Commerce</h1>
      <p>Find products, shop online, and manage your store.</p>
      <Link to="/products">Browse Products</Link>
    </div>
  );
};

export default HomePage;

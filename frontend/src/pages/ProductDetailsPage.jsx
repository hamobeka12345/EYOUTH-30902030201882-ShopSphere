import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductById } from '../services/productService';
import { addCartItem } from '../services/cartService';
import { useState } from 'react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(['product', id], () => fetchProductById(id).then((res) => res.data));

  const addToCartMutation = useMutation((body) => addCartItem(body), {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      alert('Item added to cart');
    },
    onError: () => {
      alert('Unable to add item to cart');
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate({ productId: Number(id), quantity });
  };

  if (isLoading) return <p>Loading product...</p>;
  if (isError) return <p style={{ color: 'red' }}>Failed to load product.</p>;

  const product = data.product;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      {product.image && <img src={product.image} alt={product.name} style={{ width: '300px' }} />}
      <div>
        <label>Quantity</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" />
        <button onClick={handleAddToCart}>Add to cart</button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

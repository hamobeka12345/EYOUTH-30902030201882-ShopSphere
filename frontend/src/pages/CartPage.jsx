import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService';

const CartPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery(['cart'], fetchCart);

  const updateMutation = useMutation(({ id, quantity }) => updateCartItem(id, { quantity }), {
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });
  const removeMutation = useMutation((id) => removeCartItem(id), {
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });
  const clearMutation = useMutation(clearCart, {
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });

  if (isLoading) return <p>Loading cart...</p>;
  if (isError) return <p style={{ color: 'red' }}>Failed to load cart.</p>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      {data.cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {data.cartItems.map((item) => (
            <div key={item.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
              <h2>{item.product.name}</h2>
              <p>${item.product.price}</p>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => updateMutation.mutate({ id: item.id, quantity: Number(e.target.value) })}
              />
              <button onClick={() => removeMutation.mutate(item.id)}>Remove</button>
            </div>
          ))}
          <button onClick={() => clearMutation.mutate()}>Clear Cart</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

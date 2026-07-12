import { createContext, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
export const cartKey = ['cart'];

export function CartProvider({ children }) {
  const { user } = useAuth();
  const client = useQueryClient();
  const cartQuery = useQuery({ queryKey: cartKey, queryFn: () => getCart().then((r) => r.data), enabled: !!user, staleTime: 30_000 });
  const refresh = () => client.invalidateQueries({ queryKey: cartKey });
  const mutation = (fn) => useMutation({ mutationFn: fn, onSuccess: refresh });
  const value = {
    items: cartQuery.data?.items || [], total: Number(cartQuery.data?.total || 0), count: cartQuery.data?.count || 0,
    isLoading: cartQuery.isLoading, isError: cartQuery.isError, refetch: cartQuery.refetch,
    add: mutation(({ productId, quantity }) => addToCart(productId, quantity)),
    update: mutation(({ id, quantity }) => updateCartItem(id, quantity)),
    remove: mutation((id) => removeCartItem(id)), clear: mutation(clearCart)
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used inside CartProvider'); return context; }

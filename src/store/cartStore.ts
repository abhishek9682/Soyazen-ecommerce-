import { create } from 'zustand';
import API from '@/lib/api';

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartItems') || '[]') : [],
  
  fetchCart: async () => {
    try {
        const { data } = await API.get('/cart');
        set({ cartItems: data.items || [] });
        localStorage.setItem('cartItems', JSON.stringify(data.items || []));
    } catch (error) {
        console.error('Failed to fetch cart', error);
    }
  },

  addItem: async (item) => {
    try {
        const { data } = await API.post('/cart', item);
        set({ cartItems: data.items });
        localStorage.setItem('cartItems', JSON.stringify(data.items));
    } catch (error) {
        // Optimistic fallback for guest users or network failure
        set((state) => {
            const existItem = state.cartItems.find((x) => x.product === item.product);
            let newItems;
            if (existItem) {
                newItems = state.cartItems.map((x) => x.product === existItem.product ? item : x);
            } else {
                newItems = [...state.cartItems, item];
            }
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return { cartItems: newItems };
        });
    }
  },

  removeItem: async (id) => {
    try {
        const { data } = await API.delete(`/cart/${id}`);
        set({ cartItems: data.items });
        localStorage.setItem('cartItems', JSON.stringify(data.items));
    } catch (error) {
        set((state) => {
            const newItems = state.cartItems.filter((x) => x.product !== id);
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return { cartItems: newItems };
        });
    }
  },

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [] });
  },
}));

import { create } from 'zustand';
import API from '@/lib/api';

interface FavoriteState {
    favorites: any[]; // Array of product objects
    fetchFavorites: () => Promise<void>;
    toggleFavorite: (productId: string) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
    favorites: [],
    fetchFavorites: async () => {
        try {
            const { data } = await API.get('/favorites');
            set({ favorites: data.products || [] });
        } catch (error) {
            console.error('Failed to fetch favorites', error);
        }
    },
    toggleFavorite: async (productId) => {
        try {
            // Optimistic toggle could be added here
            const { data } = await API.post('/favorites', { productId });
            // The backend returns the updated list of product objects/IDs
            // We'll re-fetch or use data if it's full
            const { data: updatedData } = await API.get('/favorites');
            set({ favorites: updatedData.products || [] });
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    },
}));

import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface AuthState {
  user: any;
  setUser: (userData: any) => void;
  logout: () => void;
  updateProfile: (userData: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo') || 'null') : null,
  setUser: (user) => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },
  updateProfile: (userData) => {
    const existing = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const updated = { ...existing, ...userData };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    set({ user: updated });
  }
}));

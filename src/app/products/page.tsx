"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, ShoppingCart, Loader2, ChevronRight, LayoutGrid, List, Heart } from "lucide-react";
import Link from "next/link";
import API from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";

interface Product {
  _id: string;
  name: string;
  title?: string;
  price: number;
  weight?: string;
  category: string;
  description: string;
  images?: string[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const addItem = useCartStore((state) => state.addItem);
  const { favorites, toggleFavorite, fetchFavorites } = useFavoriteStore();

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data.products || data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setProducts([
        { _id: '1', name: 'Premium Soya Paneer', title: 'Stone-Pressed Silk', price: 120, weight: '200g', category: 'tofu', description: 'Fresh, organic, and ultra-smooth texture.', images: ['/products/silk-tofu.png'] },
        { _id: '2', name: 'Organic Soy Milk', title: 'Pure Plant Energy', price: 60, weight: '500ml', category: 'milk', description: 'Pure soy milk with zero preservatives.', images: ['/products/soy-milk.png'] },
        { _id: '3', name: 'Spicy Soy Crisps', title: 'Protein Packed Crunch', price: 45, weight: '100g', category: 'snacks', description: 'Crunchy and healthy soy-based snacks.', images: ['https://images.unsplash.com/photo-1510443415848-18e00fb3039d?auto=format&fit=crop&q=80&w=800'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Collection' },
    { id: 'tofu', name: 'Soya Paneer' },
    { id: 'milk', name: 'Soy Milk' },
    { id: 'snacks', name: 'Soy Snacks' },
    { id: 'drinks', name: 'Flavored Drinks' },
    { id: 'organic', name: 'Organic Beans' },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-primary/5 py-24 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-[10rem] -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-12">
            <div className="max-w-2xl">
              <nav className="flex items-center space-x-3 text-sm text-gray-400 mb-6 font-bold uppercase tracking-widest">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-primary underline decoration-2 underline-offset-8">Shop Selection</span>
              </nav>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-sans tracking-tight leading-[1.1]">
                Our <span className="text-primary italic">Soyazen</span> Curations
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                Sourced from organic Himalayan farms, processed with ancient techniques. Discover the purest plant-based nutrition.
              </p>
            </div>
            <div className="relative w-full md:w-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Search premium soy..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-16 pr-10 py-6 bg-white border-2 border-primary/5 rounded-[2rem] shadow-2xl shadow-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full md:w-[28rem] transition-all font-bold text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border-2 ${
                  filter === cat.id 
                    ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-105' 
                    : 'bg-white text-gray-400 border-gray-50 hover:border-primary/20 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="text-xs font-bold uppercase tracking-widest mr-4">View:</div>
            <button className="p-4 hover:text-primary transition-colors text-primary bg-primary/5 rounded-2xl"><LayoutGrid size={22}/></button>
            <button className="p-4 hover:text-primary transition-colors bg-gray-50 rounded-2xl"><List size={22}/></button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="text-primary animate-spin mb-6" size={64} />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Syncing Soyazen Catalog</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={product._id}
                    className="group bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700"
                  >
                    <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center text-primary/10 font-bold group-hover:scale-110 transition-transform duration-700">
                         {product.images && product.images.length > 0 ? (
                           <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           />
                         ) : (
                           <ShoppingCart size={100} />
                         )}
                      </div>
                      
                      {/* Favorite Toggle */}
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleFavorite(product._id); }}
                        className={`absolute top-8 left-8 p-4 rounded-3xl backdrop-blur-md transition-all duration-500 shadow-lg ${
                          favorites.some(f => (f._id || f) === product._id) 
                            ? 'bg-red-500 text-white shadow-red-500/20' 
                            : 'bg-white/80 text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} fill={favorites.some(f => (f._id || f) === product._id) ? "currentColor" : "none"} />
                      </button>

                      <div className="absolute top-8 right-8">
                        <span className="bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl text-[10px] font-bold text-primary uppercase tracking-[0.2em] shadow-lg">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-10">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/products/${product._id}`}>
                          <h3 className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors font-sans tracking-tight">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      <div className="text-xs font-bold text-primary uppercase tracking-[0.1em] mb-6 italic">{product.title || 'Organic Edition'} • {product.weight || '200g'}</div>
                      
                      <div className="flex items-center justify-between mb-10">
                         <div className="text-3xl font-bold text-gray-900 font-sans">₹{product.price}</div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">Incl. Taxes</div>
                      </div>

                      <button 
                        onClick={() => addItem({ product: product._id, name: product.name, price: product.price, image: product.images?.[0] || '', qty: 1 })}
                        className="w-full bg-gray-900 text-white py-6 rounded-3xl font-bold hover:bg-primary shadow-xl hover:shadow-primary/30 transition-all duration-500 flex items-center justify-center space-x-4 group/btn relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                        <ShoppingCart size={22} />
                        <span className="tracking-wide">Add to Cart</span>
                        <ChevronRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-40 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                <span className="text-8xl mb-8 block grayscale opacity-50">🌱</span>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">No creations found</h3>
                <p className="text-gray-500 font-medium text-lg italic">The Soyazen fields are currently quiet for this selection.</p>
                <button 
                  onClick={() => {setFilter('all'); setSearch('');}}
                  className="mt-10 bg-primary/10 text-primary px-10 py-5 rounded-3xl font-bold hover:bg-primary hover:text-white transition-all duration-500 uppercase tracking-widest text-[10px]"
                >
                  Clear Discovery Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useCartStore } from "@/store/cartStore";

const WishlistPage = () => {
    const { favorites, fetchFavorites, toggleFavorite } = useFavoriteStore();
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        fetchFavorites();
    }, []);

    // NOTE: In a real app, I'd populate the favorite products with details from the backend.
    // For now, I'll filter the products or show the list.
    // Assuming the store or a local state handles the product details.
    
    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="bg-primary/5 py-24 mb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/products" className="flex items-center space-x-2 text-primary font-bold mb-8 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Shop</span>
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-sans tracking-tight">
                        Your <span className="text-primary italic">Soyazen</span> Favorites
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                        A curated collection of your favorite plant-based choices. Move them to your cart when you're ready for nutrition.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {favorites.length === 0 ? (
                    <div className="text-center py-40 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <Heart size={48} className="text-gray-200" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Your heart is open</h3>
                        <p className="text-gray-500 font-medium text-lg italic max-w-md mx-auto">
                            Explore our catalog and save the products that inspire your healthy lifestyle.
                        </p>
                        <Link 
                            href="/products"
                            className="mt-10 inline-block bg-primary text-white px-12 py-5 rounded-3xl font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20"
                        >
                            Explore Creations
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {favorites.map((product: any) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={product._id}
                                    className="group bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-700"
                                >
                                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5" />
                                        <div className="absolute inset-0 flex items-center justify-center text-primary/10">
                                            <Sparkles size={80} />
                                        </div>
                                        <button 
                                            onClick={() => toggleFavorite(product._id)}
                                            className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-3xl text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="p-10">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sans">{product.name}</h3>
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-6 italic">{product.category}</p>
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                                            <span className="text-xs font-medium text-gray-400">{product.weight || '200g'}</span>
                                        </div>
                                        <button 
                                            onClick={() => addItem({ product: product._id, name: product.name, price: product.price, image: '', qty: 1 })}
                                            className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-bold hover:bg-primary transition-all flex items-center justify-center space-x-3"
                                        >
                                            <ShoppingCart size={20} />
                                            <span>Move to Cart</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;

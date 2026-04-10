"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, Phone, MessageCircle, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./Logo";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <Link href="/products" className="text-gray-600 hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">Shop</Link>
            <Link href="/about" className="text-gray-600 hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">Our Story</Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-3 mr-4 border-r pr-6 border-gray-100">
               <a href={`tel:${theme?.contactPhone}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <Phone size={18} />
               </a>
               <a href={`https://wa.me/${theme?.whatsappNumber}`} className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                  <MessageCircle size={18} />
               </a>
            </div>
            
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-all">
              <ShoppingCart size={22} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-primary/20">
                  {cartCount}
                </span>
              )}
            </Link>
            {mounted && user ? (
              <div className="flex items-center space-x-4">
                <Link href="/wishlist" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Heart size={20} />
                </Link>
                <Link href="/profile" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:text-primary hover:bg-primary/5 transition-all">
                  <User size={20} />
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all">Admin</Link>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-primary/10">
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-green-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link href="/products" className="block py-2 text-gray-700">Shop</Link>
              <Link href="/about" className="block py-2 text-gray-700">Our Story</Link>
              <Link href="/contact" className="block py-2 text-gray-700">Contact</Link>
              <div className="pt-4 flex items-center space-x-4">
                <Link href="/cart" className="relative p-2 text-gray-600">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {user ? (
                  <Link href="/profile" className="p-2 text-gray-600"><User size={24} /></Link>
                ) : (
                  <Link href="/login" className="bg-green-600 text-white px-6 py-2 rounded-full">Login</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

'use client';

import React from "react";
import Link from "next/link";
import { MessageCircle, Mail, MapPin, Globe, Leaf, Phone } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand & Mission */}
          <div className="space-y-8">
            <Link href="/" className="text-3xl font-bold font-sans tracking-tight">
              Soy<span className="text-primary italic">azen</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              We're on a mission to bring high-quality, plant-based nutrition to your doorstep. Our soy products are locally sourced, organic, and crafted with love.
            </p>
            <div className="flex space-x-4 pt-2">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary group cursor-pointer hover:bg-primary hover:text-white transition-all">
                <Leaf size={18} />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/products" className="hover:text-green-600 transition-colors">Our Products</Link></li>
              <li><Link href="/about" className="hover:text-green-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-green-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-green-600 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Categories</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/products?category=tofu" className="hover:text-green-600 transition-colors">Soya Paneer (Tofu)</Link></li>
              <li><Link href="/products?category=milk" className="hover:text-green-600 transition-colors">Soy Milk</Link></li>
              <li><Link href="/products?category=snacks" className="hover:text-green-600 transition-colors">Soy Snacks</Link></li>
              <li><Link href="/products?category=drinks" className="hover:text-green-600 transition-colors">Flavored Soy Drinks</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Get in Touch</h4>
            <div className="flex items-start space-x-3 text-sm text-gray-500">
              <MapPin size={18} className="text-green-600 flex-shrink-0" />
              <span>123 Green Valley Road, Plant Based City, PB 560001</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Mail size={18} className="text-green-600 flex-shrink-0" />
              <span>hello@soypure.com</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Phone size={18} className="text-green-600 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="pt-4 flex flex-col space-y-2">
              <Link 
                href="https://wa.me/919876543210" 
                target="_blank"
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 hover:bg-green-200 transition-colors"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Order</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2026 SoyPure E-Commerce. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-green-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-green-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

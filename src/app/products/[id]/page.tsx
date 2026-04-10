'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Leaf, Star, ChevronRight, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import API from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  benefits?: string[];
  images?: string[];
}

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
        // Fallback for demo
        setProduct({
          _id: id as string,
          name: 'Premium Soya Paneer (Tofu)',
          price: 120,
          description: 'Experience the finest, most velvety tofu you\'ve ever tasted. Our Premium Soya Paneer is made from organic, non-GMO soybeans using traditional stone-pressing methods that preserve nutrients and create an unmatched texture.',
          category: 'tofu',
          stock: 50,
          benefits: ['100% Organic', 'High Protein', 'No Preservatives', 'Stone-Pressed'],
          images: ['/products/silk-tofu.png'],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        qty: qty
      });
      router.push('/cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!product) return <div>Product not found</div>;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-primary">Products</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square bg-primary/5 rounded-[3rem] overflow-hidden flex items-center justify-center">
               {product.images && product.images.length > 0 ? (
                 <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                 />
               ) : (
                 <Leaf size={160} className="text-primary/10" />
               )}
            </div>
            <div className="absolute top-6 left-6">
               <span className="bg-white px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-primary uppercase tracking-widest text-center">
                  Premium Selection
               </span>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <span className="text-gray-400 text-sm">(48 Verified Reviews)</span>
            </div>

            <div className="text-3xl font-bold text-primary mb-8">
              ₹{product.price}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Benefits Tags */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {product.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-6 mb-10">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl p-2 bg-white">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="px-6 font-bold text-xl w-16 text-center">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="text-sm font-medium text-gray-500">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} units)</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold text-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={24} />
              <span>Add to Cart & Order Now</span>
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-gray-50">
              <div className="flex flex-col items-center text-center">
                <Truck className="text-gray-400 mb-2" size={24} />
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="text-gray-400 mb-2" size={24} />
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Guaranteed Quality</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Leaf className="text-gray-400 mb-2" size={24} />
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">100% Organic</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

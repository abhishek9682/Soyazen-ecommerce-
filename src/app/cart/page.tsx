'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import API from '@/lib/api';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cartItems, addItem, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'cod'>('cod');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/orders', {
        orderItems: cartItems,
        shippingAddress: {
          address: 'Test Address',
          city: 'Test City',
          postalCode: '123456',
          country: 'India',
        },
        paymentMethod: paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      });

      if (paymentMethod === 'cod') {
        clearCart();
        router.push(`/profile?orderId=${data.order._id}`);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "SoyZen",
        description: "Payment for your healthy soy products",
        order_id: data.razorpayOrder.id,
        handler: async (response: any) => {
          try {
            await API.post('/orders/verify', {
              ...response,
              orderId: data.order._id,
            });
            clearCart();
            router.push(`/profile?orderId=${data.order._id}`);
          } catch (err) {
            console.error('Payment verification failed', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4CAF50",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="bg-primary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-sans tracking-tight">
            Your <span className="text-primary italic">Healthy</span> Cart
          </h1>
          <p className="text-gray-500 font-medium">Review your selection and proceed to secure checkout.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
            <ShoppingCart size={80} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">Looks like you haven't added any healthy soy products yet. Let's change that!</p>
            <Link 
              href="/products" 
              className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:brightness-110 transition-all inline-flex items-center space-x-2 shadow-xl shadow-primary/20"
            >
              <ArrowLeft size={18} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-3xl border border-gray-100 group hover:shadow-xl transition-all"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center mb-4 sm:mb-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ShoppingCart className="text-primary/20" size={32} />
                      )}
                    </div>
                    <div className="sm:ml-6 flex-grow text-center sm:text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-primary font-bold mb-4 sm:mb-0">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-100 rounded-xl p-1">
                        <button 
                          onClick={() => addItem({ ...item, qty: Math.max(1, item.qty - 1) })}
                          className="p-1 hover:bg-gray-50 rounded-lg"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold">{item.qty}</span>
                        <button 
                          onClick={() => addItem({ ...item, qty: item.qty + 1 })}
                          className="p-1 hover:bg-gray-50 rounded-lg"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product)}
                        className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Link href="/products" className="inline-flex items-center space-x-2 text-primary font-bold hover:translate-x-[-4px] transition-transform pt-4">
                <ArrowLeft size={18} />
                <span>Add more products</span>
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-24">
                <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Tax (18%)</span>
                    <span className="text-white font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white font-medium">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${paymentMethod === 'cod' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                      COD
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('Razorpay')}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${paymentMethod === 'Razorpay' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                      Razorpay
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-8">
                   <p className="text-xs text-gray-400 leading-relaxed italic">
                     "Free shipping on orders above ₹500. Your health is our priority."
                   </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center space-x-3 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Proceed to Checkout</span>
                    </>
                  )}
                </button>
                
                <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500 text-xs uppercase font-bold tracking-widest">
                   <ShieldCheck size={14} className="text-primary" />
                   <span>Secure Encryption</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

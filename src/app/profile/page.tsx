'use client';

import React, { useEffect, useState } from 'react';
import { Package, User as UserIcon, Settings, LogOut, CheckCircle2, Clock, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';

const ProfilePage = () => {
    const { user, logout, updateProfile } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || { street: '', city: '', state: '', zip: '', country: '' }
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        try {
            const { data } = await API.put('/users/profile', formData);
            updateProfile(data);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-primary/5 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 rounded-l-[10rem] -z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
                       <div className="flex flex-col md:flex-row items-center md:items-center space-y-6 md:space-y-0 md:space-x-10">
                          <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center border-4 border-white relative group">
                             <div className="absolute inset-0 bg-primary/10 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Settings size={32} className="text-primary animate-pulse" />
                             </div>
                             <UserIcon size={64} className="text-primary" />
                          </div>
                          <div className="text-center md:text-left">
                             <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                                <h1 className="text-5xl font-bold text-gray-900 font-sans tracking-tight">{user.name}</h1>
                                <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">Soyazen Member</span>
                             </div>
                             <p className="text-lg text-gray-500 font-medium italic">{user.email} • {user.phoneNumber || 'Add Phone'}</p>
                          </div>
                       </div>
                       <div className="flex space-x-4">
                          <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-white text-gray-900 border-2 border-primary/10 font-bold px-10 py-4 rounded-[2rem] hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/50 flex items-center space-x-3"
                          >
                             <Settings size={20} />
                             <span>Edit Profile</span>
                          </button>
                          <button 
                            onClick={handleLogout}
                            className="bg-red-50 text-red-500 font-bold px-8 py-4 rounded-[2rem] hover:bg-red-100 transition-all shadow-xl shadow-red-200/20"
                          >
                             <LogOut size={20} />
                          </button>
                       </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Panel */}
                    <div className="lg:col-span-1 space-y-12">
                        <div className="bg-gray-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <CheckCircle2 size={120} />
                            </div>
                            <h3 className="text-2xl font-bold mb-8 font-sans tracking-tight">Soyazen Loyalty</h3>
                            <div className="space-y-8">
                               <div className="flex items-center space-x-6">
                                  <div className="bg-primary/20 p-5 rounded-3xl text-primary"><CheckCircle2 size={28}/></div>
                                  <div>
                                     <p className="font-bold text-lg">Himalayan Elite</p>
                                     <p className="text-xs text-gray-400 font-medium">Early access to limited harvests</p>
                                  </div>
                               </div>
                               <div className="flex items-center space-x-6">
                                  <div className="bg-primary/20 p-5 rounded-3xl text-primary"><Clock size={28}/></div>
                                  <div>
                                     <p className="font-bold text-lg">Green Express</p>
                                     <p className="text-xs text-gray-400 font-medium">Free stone-pressed delivery</p>
                                  </div>
                               </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100">
                           <h3 className="text-xl font-bold text-gray-900 mb-8 font-sans">Contact & Address</h3>
                           <div className="space-y-8 text-gray-600 font-medium italic">
                              <div>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Phone</p>
                                 <p className="text-gray-900">{user.phoneNumber || 'Not provided'}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Default Residence</p>
                                 <p className="text-gray-900">
                                    {user.address?.street ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.zip}` : 'No address saved'}
                                 </p>
                              </div>
                           </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-12">
                           <h2 className="text-4xl font-bold text-gray-900 font-sans tracking-tight leading-none">Order Chronicle</h2>
                           <span className="bg-primary/10 text-primary px-6 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest">{orders.length} Deliveries</span>
                        </div>

                        {loading ? (
                           <div className="flex justify-center py-40">
                              <Loader2 className="text-primary animate-spin" size={64} />
                           </div>
                        ) : orders.length === 0 ? (
                           <div className="bg-gray-50 rounded-[4rem] p-24 text-center border-2 border-dashed border-gray-100">
                              <Package size={80} className="mx-auto text-gray-200 mb-8" />
                              <h3 className="text-2xl font-bold text-gray-900 mb-3">A clean slate</h3>
                              <p className="text-gray-500 font-medium text-lg italic mb-10">Start your Soyazen journey with our premium collection.</p>
                              <Link href="/products" className="bg-primary text-white px-12 py-5 rounded-[2rem] font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20">Explore Catalog</Link>
                           </div>
                        ) : (
                           <div className="space-y-10">
                              {orders.map((order: any) => (
                                 <motion.div 
                                    key={order._id}
                                    whileHover={{ y: -8 }}
                                    className="bg-white p-12 rounded-[3.5rem] border border-gray-100 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500"
                                 >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10">
                                       <div className="flex items-center space-x-6">
                                          <div className="bg-primary/5 p-6 rounded-3xl text-primary">
                                             <Package size={32} />
                                          </div>
                                          <div>
                                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">ID: #{order._id.slice(-8)}</p>
                                             <p className="text-gray-900 font-bold text-lg">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                          </div>
                                       </div>
                                       <div className="flex items-center space-y-4 md:space-y-0 md:space-x-12">
                                          <div className="text-left md:text-right">
                                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Checkout Amount</p>
                                             <p className="text-4xl font-bold text-gray-900 font-sans">₹{order.totalPrice}</p>
                                          </div>
                                          <div className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg ${
                                             order.isPaid ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-orange-500 text-white shadow-orange-500/20'
                                          }`}>
                                             {order.isPaid ? 'Confirmed' : 'Pending'}
                                          </div>
                                       </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                                       {order.orderItems.map((item: any, idx: number) => (
                                          <div key={idx} className="flex-shrink-0 bg-gray-50 px-6 py-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 min-w-[120px]">
                                              <span className="text-[10px] font-bold text-gray-900 mb-1">{item.name}</span>
                                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.qty}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-white rounded-[4rem] w-full max-w-2xl relative z-[101] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                        >
                            <div className="p-12 overflow-y-auto">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">Redefine Identity</h3>
                                    <button onClick={() => setIsEditModalOpen(false)} className="p-4 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-3xl transition-all">
                                        <ChevronRight size={24} className="rotate-90" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Full Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Email Address</label>
                                        <input
                                            disabled
                                            value={formData.email}
                                            className="w-full bg-gray-100 border-none rounded-3xl px-8 py-5 text-gray-400 font-bold cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Phone Number</label>
                                        <input
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="e.g., +91 99999 88888"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Street Address</label>
                                            <input
                                                value={formData.address.street}
                                                onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                                                className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">City</label>
                                            <input
                                                value={formData.address.city}
                                                onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                                                className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Postal Zip</label>
                                            <input
                                                value={formData.address.zip}
                                                onChange={(e) => setFormData({...formData, address: {...formData.address, zip: e.target.value}})}
                                                className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-6 rounded-3xl font-bold text-xl hover:brightness-110 shadow-2xl shadow-primary/30 transition-all active:scale-[0.98]"
                                    >
                                        Update Soyazen Profile
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import ProductManager from '@/components/admin/ProductManager';
import ThemeSettings from '@/components/admin/ThemeSettings';
import { useAuthStore } from '@/store/authStore';
import { Loader2, ShieldAlert } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
        if (!userInfo || !userInfo.isAdmin) {
          router.push('/login?redirect=admin');
        } else {
          setChecking(false);
        }
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <Loader2 className="text-primary animate-spin mb-4" size={48} />
        <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Authenticating Admin Access</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardStats />;
      case 'products': return <ProductManager />;
      case 'theme': return <ThemeSettings />;
      default: return <DashboardStats />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
            {/* Header / Info bar */}
             <div className="flex justify-between items-center mb-16">
                <div>
                   <h1 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em]">Soyazen Management Console</h1>
                   <span className="text-xs text-gray-300">System Version 2.0.0 - Soyazen Edition</span>
                </div>
               <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-gray-900 font-bold text-sm">{user?.name}</p>
                    <p className="text-primary font-bold text-[10px] uppercase tracking-wider">System Administrator</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                     <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ShieldAlert size={18} className="text-primary" />
                     </div>
                  </div>
               </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

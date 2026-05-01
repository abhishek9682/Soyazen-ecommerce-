'use client';

import React from 'react';
import { LayoutDashboard, ShoppingBag, Palette, ChevronRight, LogOut, Users, ShoppingCart, MessageSquare, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../layout/Logo';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    unreadMessages?: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, unreadMessages = 0 }) => {
    const { logout } = useAuthStore();
    const router = useRouter();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, badge: null },
        { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} />, badge: null },
        { id: 'products', label: 'Products', icon: <ShoppingBag size={20} />, badge: null },
        { id: 'customers', label: 'Customers', icon: <Users size={20} />, badge: null },
        { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, badge: unreadMessages > 0 ? unreadMessages : null },
        { id: 'theme', label: 'Theme Settings', icon: <Palette size={20} />, badge: null },
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="w-64 bg-gray-900 h-full fixed left-0 top-0 text-white p-6 flex flex-col z-50 shadow-2xl">
            <div className="mb-10 px-2 flex flex-col items-center">
                <Logo className="h-28 w-auto mb-4 invert brightness-200" />
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">Admin Console</p>
            </div>

            <nav className="flex-grow space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                            activeTab === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            {item.icon}
                            <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {item.badge && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                    {item.badge}
                                </span>
                            )}
                            {activeTab === item.id && <ChevronRight size={14} />}
                        </div>
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;

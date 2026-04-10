'use client';

import React from 'react';
import { LayoutDashboard, ShoppingBag, Palette, ChevronRight, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'products', label: 'Products', icon: <ShoppingBag size={20} /> },
        { id: 'theme', label: 'Theme Settings', icon: <Palette size={20} /> },
        { id: 'settings', label: 'General Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="w-64 bg-gray-900 h-full fixed left-0 top-0 text-white p-6 flex flex-col">
            <div className="mb-12 px-2">
                <h2 className="text-2xl font-bold font-sans tracking-tight">
                    Soy<span className="text-primary italic">azen</span> Admin
                </h2>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Management Portal</p>
            </div>

            <nav className="flex-grow space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 ${
                            activeTab === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            {item.icon}
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </div>
                        {activeTab === item.id && <ChevronRight size={14} />}
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
                <button className="w-full flex items-center space-x-3 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
                    <LogOut size={20} />
                    <span className="font-bold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;

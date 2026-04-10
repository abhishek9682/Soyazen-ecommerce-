'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const FloatingActions = () => {
    const { theme } = useTheme();

    return (
        <div className="fixed bottom-8 right-8 z-[60] flex flex-col space-y-4">
            <motion.a
                href={`tel:${theme?.contactPhone || '919876543210'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-primary p-4 rounded-full shadow-2xl border border-primary/10 flex items-center justify-center group relative"
            >
                <Phone size={24} />
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Call Us
                </span>
            </motion.a>

            <motion.a
                href={`https://wa.me/${theme?.whatsappNumber || '919876543210'}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center group relative"
            >
                <MessageCircle size={24} />
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    WhatsApp Order
                </span>
            </motion.a>
        </div>
    );
};

export default FloatingActions;

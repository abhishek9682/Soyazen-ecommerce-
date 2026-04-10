'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        className="h-full w-auto"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Soy Bean Shape */}
        <ellipse cx="50" cy="65" rx="30" ry="20" fill="currentColor" className="text-primary" />
        
        {/* Leaf Shape */}
        <path
          d="M50 45 C70 15, 90 35, 50 65 C10 35, 30 15, 50 45"
          fill="currentColor"
          className="text-primary opacity-80"
        />
        
        {/* Detail Line */}
        <path
          d="M50 45 Q50 65 50 65"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>
      <span className="text-2xl font-bold font-sans tracking-tight text-gray-900">
        Soy<span className="text-primary italic">azen</span>
      </span>
    </div>
  );
};

export default Logo;

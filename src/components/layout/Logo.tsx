'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "h-16 w-auto" }) => {
  return (
    <motion.div 
      className={`flex items-center ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -5, 0] 
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        },
        duration: 0.8
      }}
    >
      <motion.img
        whileHover={{ scale: 1.05, rotate: 2 }}
        src="/logo.jpg"
        alt="Soyazen Logo"
        className="h-full w-auto object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
};

export default Logo;

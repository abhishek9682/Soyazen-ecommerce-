'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Shield, Leaf, Smile, Dumbbell } from 'lucide-react';

const benefits = [
  {
    title: 'High Protein Content',
    description: 'Soy is one of the few plant foods that provide all essential amino acids, making it a complete protein source perfect for muscle growth and repair.',
    icon: <Dumbbell className="text-primary" size={24} />,
    color: 'bg-blue-50',
  },
  {
    title: 'Heart Health',
    description: 'Rich in unsaturated fats and isoflavones, soy helps maintain healthy cholesterol levels and supports overall cardiovascular wellness.',
    icon: <Heart className="text-red-500" size={24} />,
    color: 'bg-red-50',
  },
  {
    title: 'Natural Energy',
    description: 'Packed with B vitamins and complex carbohydrates, our soy products provide sustained energy without the crash.',
    icon: <Zap className="text-yellow-500" size={24} />,
    color: 'bg-yellow-50',
  },
  {
    title: 'Immune Support',
    description: 'Contains zinc and other essential minerals that help strengthen your natural defense system.',
    icon: <Shield className="text-primary" size={24} />,
    color: 'bg-green-50',
  },
  {
    title: 'Lactose Free',
    description: 'A delicious and nutritious alternative for those with lactose intolerance or dairy allergies.',
    icon: <Smile className="text-blue-500" size={24} />,
    color: 'bg-purple-50',
  },
  {
    title: 'Sustainable Choice',
    description: 'Soy production requires significantly less water and land than dairy, making it a win for you and the planet.',
    icon: <Leaf className="text-primary" size={24} />,
    color: 'bg-primary/5',
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
              The SoyZen Advantage
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
              Powerful Benefits for a <span className="text-primary italic">Better Life</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover why soy is considered one of nature's most perfect foods and how SoyZen brings you its maximum nutritional value.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              className="p-8 rounded-3xl border border-gray-100 bg-white transition-all cursor-default group"
            >
              <div className={`${benefit.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

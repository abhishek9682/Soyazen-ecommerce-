'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, ShieldCheck, Target, Award, Heart, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const AboutPage = () => {
  const { theme, loading } = useTheme();

  const stats = [
    { label: 'Happy Customers', value: '10k+' },
    { label: 'Products', value: '15+' },
    { label: 'Years Experience', value: '5+' },
    { label: 'Organic Partners', value: '50+' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const aboutContent = {
    title: theme?.aboutTitle || 'Our Soy Story',
    description: theme?.aboutDescription || 'At SoyZen, we believe that plant-based nutrition is the key to a sustainable and healthy future. We are dedicated to providing the highest quality, organic soy products that nourish your body and protect our planet.',
    mission: theme?.mission || 'Our mission is to make high-protein, plant-based nutrition accessible and delicious for everyone while promoting sustainable farming practices.',
    vision: theme?.vision || 'To become the global leader in sustainable plant-based nutrition, setting the standard for purity and quality.',
    imageUrl: theme?.aboutImageUrl || null
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-sans">
              {aboutContent.title.split(':')[0]}: <span className="text-primary">{aboutContent.title.split(':')[1] || 'Pure Nutrition'}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {aboutContent.description}
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-12 lg:mb-0"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
              <div className="space-y-6">
                <div>
                    <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Our Mission</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">{aboutContent.mission}</p>
                </div>
                <div>
                    <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Our Vision</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">{aboutContent.vision}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-12">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-gray-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-primary/10 rounded-[3rem] overflow-hidden flex items-center justify-center shadow-2xl">
                 {aboutContent.imageUrl ? (
                     <img src={aboutContent.imageUrl} alt="About Us" className="w-full h-full object-cover" />
                 ) : (
                    <Leaf size={120} className="text-primary/20" />
                 )}
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-2xl shadow-xl max-w-xs border border-primary/5">
                <Heart className="text-red-500 mb-4" size={32} />
                <p className="text-gray-900 font-bold italic text-lg leading-tight">"Health and flavor at the heart of every creation."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sans tracking-tight">Our Core Values</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'Quality First', 
                desc: 'We never compromise on the purity of our ingredients. 100% Non-GMO soy always.',
                icon: <Award className="text-primary" size={40} />
              },
              { 
                title: 'Sustainability', 
                desc: 'Our processes are eco-friendly, ensuring a minimal carbon footprint on our planet.',
                icon: <Leaf className="text-primary" size={40} />
              },
              { 
                title: 'Customer Wellbeing', 
                desc: 'Your health is our ultimate profit. We prioritize nutrition above all else.',
                icon: <ShieldCheck className="text-primary" size={40} />
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="bg-primary/5 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

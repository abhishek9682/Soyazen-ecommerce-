'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, ShieldCheck, Target, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Happy Customers', value: '10k+' },
    { label: 'Products', value: '15+' },
    { label: 'Years Experience', value: '5+' },
    { label: 'Organic Partners', value: '50+' },
  ];

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
              Our Mission: <span className="text-primary">Pure Nutrition</span> for Every Home
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At SoyZen, we believe that plant-based nutrition is the key to a sustainable and healthy future. We are dedicated to providing the highest quality, organic soy products that nourish your body and protect our planet.
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
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Founded in 2020, SoyZen started with a simple goal: to make high-protein, plant-based nutrition accessible and delicious. We noticed a gap in the market for truly organic, minimally processed soy products.
              </p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                What began as a small family venture in a local farm kitchen has grown into a premium brand trusted by thousands. Our commitment to traditional methods combined with modern quality standards remains unchanged.
              </p>
              <div className="grid grid-cols-2 gap-8">
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
              <div className="aspect-[4/3] bg-primary/10 rounded-3xl overflow-hidden flex items-center justify-center">
                 <Leaf size={120} className="text-primary/20" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-2xl shadow-xl max-w-xs">
                <Heart className="text-red-500 mb-4" size={32} />
                <p className="text-gray-900 font-bold italic">"We put health and flavor at the heart of everything we do."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
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
                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all"
              >
                <div className="bg-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

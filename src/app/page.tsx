"use client";

import Hero from "@/components/home/Hero";
import BenefitsSection from "@/components/home/BenefitsSection";
import { motion } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featuredCategories = [
    { title: "Soya Paneer", image: "/cat-tofu.png", path: "/products?category=tofu" },
    { title: "Soy Milk", image: "/cat-milk.png", path: "/products?category=milk" },
    { title: "Soy Snacks", image: "/cat-snacks.png", path: "/products?category=snacks" },
    { title: "Flavored Drinks", image: "/cat-drinks.png", path: "/products?category=drinks" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />

      {/* Categories Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our Collection</span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl font-sans">Premium Soy Selections</h2>
            <div className="mt-6 w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -12 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Leaf size={40} className="text-primary/20" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-sans">{cat.title}</h3>
                    <Link 
                      href={cat.path} 
                      className="text-primary font-bold flex items-center space-x-2 group-hover:translate-x-2 transition-transform"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BenefitsSection />

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] px-8 py-20 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-bold mb-8 font-sans">Start Your Healthy Journey Today</h2>
              <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of happy customers who have made the switch to pure, organic soy nutrition with SoyZen.
              </p>
              <Link 
                href="/products" 
                className="bg-white text-primary px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95 inline-block"
              >
                Order Your First Soy Box
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

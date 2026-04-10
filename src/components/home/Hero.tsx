"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40">
      {/* Background patterns/blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-6">
              <Leaf size={16} />
              <span>100% Organic & Plant-Based</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
              Healthy Living with <span className="text-primary">Pure Soy</span> Nutrition
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              Experience the best in soy-based products. From fresh tofu to flavored milk, we bring you the finest organic soy products crafted for your wellness.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/products" 
                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link 
                href="/about" 
                className="bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-full font-bold text-lg hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center"
              >
                Our Story
              </Link>
            </div>

            {/* Features trust badges */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Truck size={18} className="text-green-600" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ShieldCheck size={18} className="text-green-600" />
                <span>Organic Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Leaf size={18} className="text-green-600" />
                <span>Zero Preservatives</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-16 lg:mt-0 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
               <img 
                 src="/hero-soy.png" 
                 alt="Healthy Soy Products" 
                 className="w-full h-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-700"
               />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-600 rounded-2xl -z-10 opacity-10 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

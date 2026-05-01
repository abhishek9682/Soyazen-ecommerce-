'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ContactPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone className="text-primary" size={24} />,
      label: 'Call Us Directly',
      value: theme?.contactPhone || '+91 98765 43210',
      link: `tel:${theme?.contactPhone}`
    },
    {
      icon: <Mail className="text-primary" size={24} />,
      label: 'Email Support',
      value: theme?.contactEmail || 'support@soyzen.com',
      link: `mailto:${theme?.contactEmail}`
    },
    {
      icon: <MessageCircle className="text-primary" size={24} />,
      label: 'WhatsApp Chat',
      value: 'Instant Response',
      link: `https://wa.me/${theme?.whatsappNumber}`
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-primary/5 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-sans tracking-tight">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Have questions about our premium soy products? We're here to help you on your health journey.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info Cards */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {contactInfo.map((item, idx) => (
                    <motion.a
                      key={idx}
                      href={item.link}
                      whileHover={{ y: -5 }}
                      className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all block group"
                    >
                      <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                        {React.cloneElement(item.icon as React.ReactElement, { 
                            className: "group-hover:text-white transition-colors" 
                        })}
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
                      <p className="text-lg font-bold text-gray-900">{item.value}</p>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
                    <p className="text-gray-400 leading-relaxed mb-8">
                        We aim to respond to all inquiries within 24 hours. Your feedback helps us improve our plant-based nutrition for everyone.
                    </p>
                    <div className="flex items-center space-x-4 text-sm font-bold text-primary">
                        <Clock size={18} />
                        <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Leaf size={120} className="text-white" />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-[3.5rem] border border-gray-100 p-12 shadow-2xl shadow-primary/5">
              {submitted ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                    <p className="text-gray-500 max-w-xs mx-auto">Thank you for reaching out. Our team will get back to you shortly.</p>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="mt-10 text-primary font-bold hover:underline"
                    >
                        Send another message
                    </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                        <input
                          required
                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          required
                          type="email"
                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                      <input
                        required
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Inquiry about Tofu"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                      <textarea
                        required
                        rows={5}
                        className="w-full bg-gray-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Send size={20} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Leaf = ({ className, size }: { className?: string, size: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-8 8Z" />
        <path d="M11 20c0-2.5-3.5-6-3.5-10-3.5 0-7.5 3-7.5 7 0 2.6 2.5 3 5 3Z" />
        <path d="M11 20c5 0 8-1 8-1" />
    </svg>
);

export default ContactPage;

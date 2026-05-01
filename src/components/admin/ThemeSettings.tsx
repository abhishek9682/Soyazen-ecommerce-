'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCcw, Smartphone, Monitor, Palette, Check, RefreshCw } from 'lucide-react';
import API from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeSettings = () => {
    const { theme, refreshTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        primaryColor: '#4CAF50',
        secondaryColor: '#8BC34A',
        accentColor: '#F1F8E9',
        companyName: 'SoyPure',
        contactEmail: 'info@soypure.com',
        contactPhone: '+919876543210',
        whatsappNumber: '919876543210',
        aboutTitle: 'Our Soy Story',
        aboutDescription: 'We are committed to providing the purest plant-based nutrition to our community.',
        mission: 'To revolutionize health through high-quality soy products.',
        vision: 'To become the global leader in sustainable plant-based nutrition.',
        aboutImageUrl: '',
    });

    useEffect(() => {
        if (theme) {
            setFormData({
                primaryColor: theme.primaryColor || '#4CAF50',
                secondaryColor: theme.secondaryColor || '#8BC34A',
                accentColor: theme.accentColor || '#F1F8E9',
                companyName: theme.companyName || 'SoyPure',
                contactEmail: theme.contactEmail || 'info@soypure.com',
                contactPhone: theme.contactPhone || '+919876543210',
                whatsappNumber: theme.whatsappNumber || '919876543210',
                aboutTitle: theme.aboutTitle || 'Our Soy Story',
                aboutDescription: theme.aboutDescription || 'We are committed to providing the purest plant-based nutrition to our community.',
                mission: theme.mission || 'To revolutionize health through high-quality soy products.',
                vision: theme.vision || 'To become the global leader in sustainable plant-based nutrition.',
                aboutImageUrl: theme.aboutImageUrl || '',
            });
        }
    }, [theme]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put('/theme', formData);
            await refreshTheme();
            alert('Theme updated successfully! The changes will be applied globally.');
        } catch (error) {
            console.error('Failed to update theme', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4 font-sans tracking-tight">Dynamic Branding</h2>
              <p className="text-gray-500 mt-2 font-medium italic">Sculpt the visual identity of SoyZen in real-time.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Primary Brand Color</label>
                                <div className="flex items-center space-x-4">
                                  <input
                                      type="color"
                                      name="primaryColor"
                                      value={formData.primaryColor}
                                      onChange={handleChange}
                                      className="w-16 h-16 rounded-2xl border-none p-0 cursor-pointer overflow-hidden"
                                  />
                                  <span className="font-mono text-sm bg-gray-50 px-3 py-1 rounded-lg text-gray-400">{formData.primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Secondary Accent</label>
                                <div className="flex items-center space-x-4">
                                  <input
                                      type="color"
                                      name="secondaryColor"
                                      value={formData.secondaryColor}
                                      onChange={handleChange}
                                      className="w-16 h-16 rounded-2xl border-none p-0 cursor-pointer overflow-hidden"
                                  />
                                  <span className="font-mono text-sm bg-gray-50 px-3 py-1 rounded-lg text-gray-400">{formData.secondaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Background Accent</label>
                                <div className="flex items-center space-x-4">
                                  <input
                                      type="color"
                                      name="accentColor"
                                      value={formData.accentColor}
                                      onChange={handleChange}
                                      className="w-16 h-16 rounded-2xl border-none p-0 cursor-pointer overflow-hidden"
                                  />
                                  <span className="font-mono text-sm bg-gray-50 px-3 py-1 rounded-lg text-gray-400">{formData.accentColor}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-50 w-full" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Company Identity</label>
                                    <input
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                        placeholder="SoyZen"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Support Email</label>
                                    <input
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                        placeholder="support@soyzen.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Direct Contact</label>
                                    <input
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                        placeholder="+91..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">WhatsApp Hook</label>
                                    <input
                                        name="whatsappNumber"
                                        value={formData.whatsappNumber}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                        placeholder="91..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-50 w-full" />

                        <div className="space-y-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-4 mb-8">Brand Storytelling (About Us)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="col-span-full">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About Us Title</label>
                                        <input
                                            name="aboutTitle"
                                            value={formData.aboutTitle}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                            placeholder="Our Soy Story"
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About Us Narrative</label>
                                        <textarea
                                            name="aboutDescription"
                                            value={formData.aboutDescription}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium resize-none"
                                            placeholder="We are committed to..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Our Mission</label>
                                        <input
                                            name="mission"
                                            value={formData.mission}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                            placeholder="To revolutionize..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Our Vision</label>
                                        <input
                                            name="vision"
                                            value={formData.vision}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                            placeholder="To become the global leader..."
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Storytelling Image URL</label>
                                        <div className="flex gap-4">
                                            <input
                                                name="aboutImageUrl"
                                                value={formData.aboutImageUrl}
                                                onChange={handleChange}
                                                className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-medium"
                                                placeholder="https://.../about.jpg"
                                            />
                                            {formData.aboutImageUrl && (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <img src={formData.aboutImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-bold shadow-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center space-x-3"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Check size={20} className="text-primary" />}
                                <span>Save & Deploy Theme</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-100 rounded-[3rem] p-4 flex flex-col items-center shadow-inner">
                        <div className="w-full h-12 flex items-center space-x-4 px-6 mb-4">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 rounded-full bg-red-400" />
                              <div className="w-3 h-3 rounded-full bg-yellow-400" />
                              <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="bg-white/50 h-6 flex-grow rounded-lg" />
                        </div>
                        <div className="bg-white w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 aspect-[10/16] relative group">
                            {/* Dummy Site Preview */}
                            <div className="p-6 h-full flex flex-col">
                                <nav className="flex justify-between items-center mb-12">
                                    <div className="font-bold text-sm" style={{ color: formData.primaryColor }}>{formData.companyName}</div>
                                    <div className="w-4 h-4 rounded-full bg-gray-100" />
                                </nav>
                                <div className="space-y-4 mb-12">
                                    <div className="h-4 w-3/4 rounded-full bg-gray-100" />
                                    <div className="h-12 w-full rounded-2xl" style={{ backgroundColor: `${formData.primaryColor}20` }} />
                                    <div className="h-4 w-1/2 rounded-full bg-gray-100" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 rounded-2xl bg-gray-50" />
                                    <div className="h-24 rounded-2xl bg-gray-50" />
                                </div>
                                <div className="mt-auto">
                                    <div className="h-10 w-full rounded-xl" style={{ backgroundColor: formData.primaryColor }} />
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl">
                                    Real-time Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettings;

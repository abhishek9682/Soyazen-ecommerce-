'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, PlusCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import API from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        price: '',
        category: 'tofu',
        stock: '',
        weight: '',
        description: '',
        benefits: '',
        isFeatured: false,
    });

    const fetchProducts = async () => {
        try {
            const { data } = await API.get('/products');
            setProducts(data.products || data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const productData = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          benefits: formData.benefits.split(',').map(b => b.trim())
        };

        try {
            if (editingProduct) {
                await API.put(`/products/${editingProduct._id}`, productData);
            } else {
                await API.post('/products', productData);
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', title: '', price: '', category: 'tofu', stock: '', weight: '', description: '', benefits: '', isFeatured: false });
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            title: product.title || '',
            price: product.price?.toString() || '',
            category: product.category || 'tofu',
            stock: product.stock?.toString() || '',
            weight: product.weight || '',
            description: product.description || '',
            benefits: (product.benefits || []).join(', '),
            isFeatured: !!product.isFeatured,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Failed to delete product', error);
            }
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4 font-sans tracking-tight">Catalog Management</h2>
                  <p className="text-gray-500 mt-2 font-medium italic">Sculpting the healthy choices for Soyazen customers.</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                    className="bg-primary text-white px-10 py-5 rounded-2x; font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center space-x-3 active:scale-[0.98]"
                >
                    <PlusCircle size={24} />
                    <span>Create New Product</span>
                </button>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="px-10 py-8">Product Identity</th>
                                <th className="px-10 py-8">Category</th>
                                <th className="px-10 py-8">Price</th>
                                <th className="px-10 py-8">Weight</th>
                                <th className="px-10 py-8">Stock</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product: any) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary/30 group-hover:bg-primary/10 transition-colors">
                                                <ShoppingBag size={28} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-lg leading-none mb-1">{product.name}</div>
                                                <div className="text-xs text-gray-400 font-medium italic">{product.title || 'Classic Edition'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/5">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 font-bold text-gray-900 text-lg">₹{product.price}</td>
                                    <td className="px-10 py-8 text-gray-500 font-medium">{product.weight || 'N/A'}</td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full shadow-inner ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-gray-900 font-bold">{product.stock} units</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right space-x-2">
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            className="p-4 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product._id)}
                                            className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-white rounded-[4rem] w-full max-w-4xl relative z-[101] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                        >
                            <div className="p-12 overflow-y-auto">
                                <div className="flex justify-between items-center mb-12">
                                    <div>
                                        <h3 className="text-4xl font-bold text-gray-900 font-sans tracking-tight">
                                            {editingProduct ? 'Edit Soy Selection' : 'Unveil New Creation'}
                                        </h3>
                                        <p className="text-gray-400 mt-1 font-medium italic">Crafting health for the Soyazen community.</p>
                                    </div>
                                    <button onClick={() => setIsFormOpen(false)} className="p-4 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-3xl transition-all">
                                        <X size={28} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Product Name (Required)</label>
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="e.g., Organic Stone-Pressed Tofu"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Title / Tagline</label>
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="e.g., Silk Smooth Texture"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Market Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="e.g., 299"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Net Weight / Volume</label>
                                        <input
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="e.g., 500g, 1L"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Category Selection</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900 appearance-none"
                                        >
                                            <option value="tofu">Soya Paneer (Tofu)</option>
                                            <option value="milk">Soy Milk</option>
                                            <option value="snacks">Soy Snacks</option>
                                            <option value="drinks">Flavored Drinks</option>
                                            <option value="organic">Organic Beans</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Inventory Stock</label>
                                        <input
                                            required
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="Units available"
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2 flex items-center justify-between">
                                          <span>Key Nutritional Benefits (Comma separated)</span>
                                          <div className="flex items-center space-x-2">
                                            <input 
                                              type="checkbox" 
                                              name="isFeatured" 
                                              checked={formData.isFeatured}
                                              onChange={handleChange}
                                              className="w-5 h-5 accent-primary"
                                            />
                                            <span className="normal-case">Feature on Landing Page</span>
                                          </div>
                                        </label>
                                        <input
                                            name="benefits"
                                            value={formData.benefits}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900"
                                            placeholder="High Protein, Organic, Non-GMO, No Preservatives"
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Detailed Narrative</label>
                                        <textarea
                                            required
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full bg-gray-50 border-none rounded-[2.5rem] px-8 py-8 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-900 resize-none mb-8"
                                            placeholder="Tell the brand story of this creation..."
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-white py-6 rounded-3xl font-bold text-xl hover:brightness-110 shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-3"
                                        >
                                            <CheckCircle2 size={28} />
                                            <span>{editingProduct ? 'Commit Updates' : 'Publish to Catalog'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManager;

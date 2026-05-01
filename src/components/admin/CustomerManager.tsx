'use client';

import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit2, Eye, X, Phone, Mail, MapPin, ShoppingBag, UserCheck, UserX, Shield, ShieldOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '@/lib/api';

interface Address {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

interface Customer {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    isAdmin: boolean;
    address?: Address;
    createdAt: string;
}

const CustomerManager: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '', phoneNumber: '', isAdmin: false });
    const [saving, setSaving] = useState(false);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/users');
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleView = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowDetail(true);
        setShowEdit(false);
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditForm({
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber || '',
            isAdmin: customer.isAdmin
        });
        setShowEdit(true);
        setShowDetail(false);
    };

    const handleSave = async () => {
        if (!selectedCustomer) return;
        setSaving(true);
        try {
            const { data } = await API.put(`/users/${selectedCustomer._id}`, editForm);
            setCustomers(prev => prev.map(c => c._id === selectedCustomer._id ? { ...c, ...data } : c));
            setShowEdit(false);
        } catch (error) {
            console.error('Failed to update customer', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;
        try {
            await API.delete(`/users/${id}`);
            setCustomers(prev => prev.filter(c => c._id !== id));
            setShowDetail(false);
            setShowEdit(false);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete customer');
        }
    };

    const handleToggleAdmin = async (customer: Customer) => {
        try {
            const { data } = await API.put(`/users/${customer._id}`, { isAdmin: !customer.isAdmin });
            setCustomers(prev => prev.map(c => c._id === customer._id ? { ...c, isAdmin: data.isAdmin } : c));
        } catch (error) {
            console.error('Failed to toggle admin status', error);
        }
    };

    const filtered = customers.filter(c =>
        search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.phoneNumber || '').includes(search)
    );

    const adminCount = customers.filter(c => c.isAdmin).length;
    const customerCount = customers.filter(c => !c.isAdmin).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4">Customer Management</h2>
                <p className="text-gray-500 mt-2 font-medium">View and manage all registered users.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Users', value: customers.length, color: 'bg-gray-900 text-white' },
                    { label: 'Customers', value: customerCount, color: 'bg-primary text-white' },
                    { label: 'Admins', value: adminCount, color: 'bg-indigo-600 text-white' },
                ].map(s => (
                    <div key={s.label} className={`${s.color} p-5 rounded-2xl`}>
                        <p className="text-3xl font-bold">{s.value}</p>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Customer</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Contact</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Location</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Role</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Joined</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(customer => (
                                    <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${customer.isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10 text-primary'}`}>
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                                                    <p className="text-xs text-gray-400">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {customer.phoneNumber && (
                                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                                        <Phone size={10} className="text-gray-400" /> {customer.phoneNumber}
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail size={10} className="text-gray-400" /> {customer.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {customer.address?.city || '—'}{customer.address?.state ? `, ${customer.address.state}` : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full w-fit ${customer.isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {customer.isAdmin ? <Shield size={11} /> : <UserCheck size={11} />}
                                                {customer.isAdmin ? 'Admin' : 'Customer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-400">{new Date(customer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleView(customer)} className="p-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-all" title="View">
                                                    <Eye size={14} />
                                                </button>
                                                <button onClick={() => handleEdit(customer)} className="p-2 bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-600 rounded-lg transition-all" title="Edit">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleToggleAdmin(customer)} className="p-2 bg-gray-100 hover:bg-indigo-500 hover:text-white text-gray-600 rounded-lg transition-all" title="Toggle Admin">
                                                    {customer.isAdmin ? <ShieldOff size={14} /> : <Shield size={14} />}
                                                </button>
                                                <button onClick={() => handleDelete(customer._id)} className="p-2 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 rounded-lg transition-all" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetail && selectedCustomer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDetail(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Customer Profile</h3>
                                    <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
                                </div>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${selectedCustomer.isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10 text-primary'}`}>
                                        {selectedCustomer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${selectedCustomer.isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {selectedCustomer.isAdmin ? '⚡ Admin' : '👤 Customer'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Mail size={18} className="text-primary" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Email</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedCustomer.email}</p>
                                        </div>
                                    </div>
                                    {selectedCustomer.phoneNumber && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Phone size={18} className="text-primary" />
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Phone</p>
                                                <p className="text-sm font-semibold text-gray-900">{selectedCustomer.phoneNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedCustomer.address?.city && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <MapPin size={18} className="text-primary" />
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Address</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {selectedCustomer.address.street && `${selectedCustomer.address.street}, `}
                                                    {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zip}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <ShoppingBag size={18} className="text-primary" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Member Since</p>
                                            <p className="text-sm font-semibold text-gray-900">{new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button onClick={() => handleEdit(selectedCustomer)} className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
                                        Edit Profile
                                    </button>
                                    <button onClick={() => handleDelete(selectedCustomer._id)} className="py-3 px-6 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold text-sm transition-all">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEdit && selectedCustomer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEdit(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Edit Customer</h3>
                                    <button onClick={() => setShowEdit(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                                        <input
                                            type="text"
                                            value={editForm.phoneNumber}
                                            onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="isAdmin"
                                            checked={editForm.isAdmin}
                                            onChange={e => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                                            className="w-5 h-5 accent-primary"
                                        />
                                        <label htmlFor="isAdmin" className="text-sm font-semibold text-gray-700">Grant Admin Privileges</label>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button onClick={() => setShowEdit(false)} className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerManager;

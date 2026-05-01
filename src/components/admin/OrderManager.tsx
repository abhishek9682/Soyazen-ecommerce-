'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, CheckCircle, Truck, Clock, XCircle, ChevronDown, Filter, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '@/lib/api';

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
}

interface Order {
    _id: string;
    user: { _id: string; name: string; email: string; phoneNumber?: string } | null;
    orderItems: OrderItem[];
    shippingAddress: { address: string; city: string; postalCode: string; country: string };
    paymentMethod: string;
    totalPrice: number;
    taxPrice: number;
    shippingPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> },
    shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-700', icon: <Truck size={12} /> },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> },
};

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, status: string) => {
        setUpdatingStatus(orderId);
        try {
            const { data } = await API.put(`/orders/${orderId}/status`, { status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...data } : o));
            if (selectedOrder?._id === orderId) {
                setSelectedOrder(prev => prev ? { ...prev, ...data } : null);
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleDelete = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        try {
            await API.delete(`/orders/${orderId}`);
            setOrders(prev => prev.filter(o => o._id !== orderId));
            if (selectedOrder?._id === orderId) setShowDetail(false);
        } catch (error) {
            console.error('Failed to delete order', error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchSearch = search === '' ||
            order._id.toLowerCase().includes(search.toLowerCase()) ||
            (order.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (order.user?.email || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.orderStatus === 'pending').length,
        shipped: orders.filter(o => o.orderStatus === 'shipped').length,
        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
        cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4">Order Management</h2>
                <p className="text-gray-500 mt-2 font-medium">Manage, track and update all customer orders.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-5 gap-4">
                {[
                    { label: 'Total', value: stats.total, color: 'bg-gray-900 text-white', filter: 'all' },
                    { label: 'Pending', value: stats.pending, color: 'bg-amber-500 text-white', filter: 'pending' },
                    { label: 'Shipped', value: stats.shipped, color: 'bg-blue-500 text-white', filter: 'shipped' },
                    { label: 'Delivered', value: stats.delivered, color: 'bg-green-500 text-white', filter: 'delivered' },
                    { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500 text-white', filter: 'cancelled' },
                ].map(stat => (
                    <button
                        key={stat.filter}
                        onClick={() => setStatusFilter(stat.filter)}
                        className={`${stat.color} p-4 rounded-2xl text-center transition-all hover:opacity-90 hover:scale-105 ${statusFilter === stat.filter ? 'ring-4 ring-offset-2 ring-gray-900/20' : ''}`}
                    >
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mt-1">{stat.label}</p>
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Package size={48} className="mb-4 opacity-30" />
                        <p className="font-semibold">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Order ID</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Customer</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Items</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Total</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Payment</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Status</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Date</th>
                                    <th className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => {
                                    const sc = statusConfig[order.orderStatus] || statusConfig.pending;
                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{order.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-gray-700">{order.orderItems.reduce((a, i) => a + i.qty, 0)} items</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-semibold text-gray-600 uppercase">{order.paymentMethod}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {order.isPaid ? 'PAID' : 'UNPAID'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative group">
                                                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer ${sc.color}`}>
                                                        {sc.icon}
                                                        {sc.label}
                                                        <ChevronDown size={10} />
                                                    </span>
                                                    <div className="absolute top-full left-0 mt-1 z-10 hidden group-hover:block bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                                                        {['pending', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                            <button
                                                                key={s}
                                                                onClick={() => handleUpdateStatus(order._id, s)}
                                                                disabled={order.orderStatus === s}
                                                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 flex items-center gap-2 transition-colors ${order.orderStatus === s ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                            >
                                                                {statusConfig[s as keyof typeof statusConfig].icon}
                                                                {statusConfig[s as keyof typeof statusConfig].label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setSelectedOrder(order); setShowDetail(true); }}
                                                        className="p-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order._id)}
                                                        className="p-2 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 rounded-lg transition-all"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {showDetail && selectedOrder && (
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
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8">
                                {/* Modal Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
                                        <p className="text-gray-400 font-mono text-sm mt-1">#{selectedOrder._id.toUpperCase()}</p>
                                    </div>
                                    <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Status Update */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Update Status</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(['pending', 'shipped', 'delivered', 'cancelled'] as const).map(s => {
                                            const sc = statusConfig[s];
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                                                    disabled={selectedOrder.orderStatus === s || updatingStatus === selectedOrder._id}
                                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                                        selectedOrder.orderStatus === s 
                                                            ? `${sc.color} border-current` 
                                                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {sc.icon} {sc.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Customer</p>
                                        <p className="font-bold text-gray-900">{selectedOrder.user?.name || 'Guest'}</p>
                                        <p className="text-sm text-gray-500 mt-1">{selectedOrder.user?.email}</p>
                                        {selectedOrder.user?.phoneNumber && (
                                            <p className="text-sm text-gray-500">{selectedOrder.user.phoneNumber}</p>
                                        )}
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Shipping Address</p>
                                        <p className="font-semibold text-gray-900 text-sm">{selectedOrder.shippingAddress.address}</p>
                                        <p className="text-sm text-gray-500">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                        <p className="text-sm text-gray-500">{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Order Items</p>
                                    <div className="space-y-3">
                                        {selectedOrder.orderItems.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                                                </div>
                                                <p className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{(selectedOrder.totalPrice - selectedOrder.taxPrice - selectedOrder.shippingPrice).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Tax</span>
                                        <span>₹{selectedOrder.taxPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span>₹{selectedOrder.shippingPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Payment + Date */}
                                <div className="mt-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest">Payment</p>
                                        <p className="font-semibold text-gray-900 capitalize">{selectedOrder.paymentMethod}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedOrder.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {selectedOrder.isPaid ? '✓ Paid' : '✗ Unpaid'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest">Ordered On</p>
                                        <p className="font-semibold text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => { handleDelete(selectedOrder._id); setShowDetail(false); }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold text-sm transition-all"
                                    >
                                        <Trash2 size={16} /> Delete Order
                                    </button>
                                    <button
                                        onClick={() => setShowDetail(false)}
                                        className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all"
                                    >
                                        Close
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

export default OrderManager;

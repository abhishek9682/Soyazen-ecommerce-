'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import API from '@/lib/api';

const DashboardStats = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        avgOrderValue: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, statsRes, ordersRes, usersRes] = await Promise.allSettled([
                    API.get('/orders/analytics'),
                    API.get('/orders/stats'),
                    API.get('/orders'),
                    API.get('/users')
                ]);

                if (analyticsRes.status === 'fulfilled') setChartData(analyticsRes.value.data);
                if (statsRes.status === 'fulfilled') {
                    const s = statsRes.value.data;
                    setStats(prev => ({ ...prev, ...s }));
                }
                if (ordersRes.status === 'fulfilled') {
                    setRecentOrders(ordersRes.value.data.slice(0, 5));
                }
                if (usersRes.status === 'fulfilled') {
                    setStats(prev => ({ ...prev, activeUsers: usersRes.value.data.length }));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
                // Fallback chart data
                setChartData([
                    { date: '04/24', revenue: 4000, profit: 1200 },
                    { date: '04/25', revenue: 3000, profit: 900 },
                    { date: '04/26', revenue: 2000, profit: 600 },
                    { date: '04/27', revenue: 2780, profit: 800 },
                    { date: '04/28', revenue: 1890, profit: 480 },
                    { date: '04/29', revenue: 2390, profit: 700 },
                    { date: '04/30', revenue: 3490, profit: 1100 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
            icon: <DollarSign className="text-blue-500" size={22} />,
            trend: '+12.5%',
            trendUp: true,
            bg: 'bg-blue-50',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: <Package className="text-orange-500" size={22} />,
            trend: '+5.2%',
            trendUp: true,
            bg: 'bg-orange-50',
        },
        {
            label: 'Active Users',
            value: stats.activeUsers.toLocaleString(),
            icon: <Users className="text-purple-500" size={22} />,
            trend: '+8.1%',
            trendUp: true,
            bg: 'bg-purple-50',
        },
        {
            label: 'Avg. Order Value',
            value: `₹${Math.round(stats.avgOrderValue).toLocaleString('en-IN')}`,
            icon: <TrendingUp className="text-primary" size={22} />,
            trend: '+4.3%',
            trendUp: true,
            bg: 'bg-green-50',
        },
    ];

    const orderStatusCards = [
        { label: 'Pending', value: stats.pendingOrders, icon: <Clock size={18} className="text-amber-500" />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        { label: 'Delivered', value: stats.deliveredOrders, icon: <CheckCircle size={18} className="text-green-500" />, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
    ];

    const statusConfig: Record<string, { label: string, color: string }> = {
        pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
        shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-700' },
        delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
        cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4">Business Intelligence</h2>
                <p className="text-gray-500 mt-2 italic font-medium">Real-time performance analytics for the Soyazen ecosystem.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-5">
                            <div className={`${stat.bg} p-3.5 rounded-2xl`}>{stat.icon}</div>
                            <div className={`flex items-center space-x-1 text-xs font-bold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                                <span>{stat.trend}</span>
                                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Order Status Row */}
            <div className="grid grid-cols-2 gap-6">
                {orderStatusCards.map((card, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${card.bg} flex items-center gap-5`}>
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{card.label} Orders</p>
                            <p className={`text-4xl font-bold ${card.color}`}>{loading ? '—' : card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold text-gray-900">Revenue Analysis</h4>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Last 7 Days</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9BA3AF', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9BA3AF', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold text-gray-900">Profit Trends</h4>
                        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">30% Margin</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9BA3AF', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9BA3AF', fontSize: 11 }} />
                                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="profit" fill="#4CAF50" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            {recentOrders.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <h4 className="text-xl font-bold text-gray-900">Recent Orders</h4>
                        <span className="text-xs text-gray-400 font-semibold">Last 5 orders</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentOrders.map((order: any) => {
                            const sc = statusConfig[order.orderStatus] || statusConfig.pending;
                            return (
                                <div key={order._id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-600 text-sm">
                                            #{order._id.slice(-4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{order.user?.name || 'Guest Customer'}</p>
                                            <p className="text-xs text-gray-400">{order.orderItems?.length || 0} items • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${sc.color}`}>{sc.label}</span>
                                        <span className="font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardStats;

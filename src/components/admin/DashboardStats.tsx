'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import API from '@/lib/api';

const DashboardStats = () => {
    const [data, setData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 24500,
        totalOrders: 124,
        avgTicket: 198,
        activeUsers: 856
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await API.get('/orders/analytics');
                setData(data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
                // Fallback demo data
                setData([
                    { date: '2024-04-01', revenue: 4000, profit: 1200 },
                    { date: '2024-04-02', revenue: 3000, profit: 900 },
                    { date: '2024-04-03', revenue: 2000, profit: 600 },
                    { date: '2024-04-04', revenue: 2780, profit: 800 },
                    { date: '2024-04-05', revenue: 1890, profit: 480 },
                    { date: '2024-04-06', revenue: 2390, profit: 700 },
                    { date: '2024-04-07', revenue: 3490, profit: 1100 },
                ]);
            }
        };
        fetchAnalytics();
    }, []);

    const statCards = [
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-blue-500" />, trend: '+12.5%', trendUp: true },
        { label: 'Total Orders', value: stats.totalOrders, icon: <Package className="text-orange-500" />, trend: '+5.2%', trendUp: true },
        { label: 'Active Customers', value: stats.activeUsers.toLocaleString(), icon: <Users className="text-purple-500" />, trend: '-2.1%', trendUp: false },
        { label: 'Profit Margin', value: '32.4%', icon: <TrendingUp className="text-primary" />, trend: '+4.3%', trendUp: true },
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4">Business Intelligence</h2>
                <p className="text-gray-500 mt-2 italic font-medium">Real-time performance analytics for Soyazen ecosystem.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-gray-50 p-4 rounded-2xl">{stat.icon}</div>
                            <div className={`flex items-center space-x-1 text-xs font-bold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                                <span>{stat.trend}</span>
                                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h4 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Revenue Analysis</h4>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Last 7 Days</span>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9BA3AF', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9BA3AF', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h4 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Profit Trends</h4>
                        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">Projected Net</span>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9BA3AF', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9BA3AF', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#F9FAFB'}}
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                />
                                <Bar dataKey="profit" fill="#4CAF50" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Search, Phone, Mail, Clock, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Message {
    _id: string;
    sender: string;
    senderName: string;
    senderRole: 'customer' | 'admin';
    message: string;
    conversationId: string;
    isRead: boolean;
    createdAt: string;
}

interface Conversation {
    _id: string; // conversationId = userId
    lastMessage: string;
    lastMessageAt: string;
    senderName: string;
    unreadCount: number;
    user?: { _id: string; name: string; email: string; phoneNumber?: string };
}

const AdminMessages: React.FC = () => {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeConv, setActiveConv] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollRef = useRef<NodeJS.Timeout | null>(null);

    const fetchConversations = async () => {
        try {
            const { data } = await API.get('/messages/conversations');
            setConversations(data);
            setLoading(false);
        } catch (error: any) {
            console.error('Failed to fetch conversations', error);
            if (error.response?.status === 401) {
                // Token might be expired or invalid (e.g. after database reseed)
                localStorage.removeItem('userInfo');
                window.location.href = '/login?redirect=admin';
            }
            setLoading(false);
        }
    };

    const fetchMessages = async (convId: string) => {
        try {
            const { data } = await API.get(`/messages/${convId}`);
            setMessages(data);
            // Update unread count in conversations list
            setConversations(prev => prev.map(c => c._id === convId ? { ...c, unreadCount: 0 } : c));
        } catch (error: any) {
            console.error('Failed to fetch messages', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                window.location.href = '/login?redirect=admin';
            }
        }
    };

    useEffect(() => {
        fetchConversations();
        // Poll for new messages every 5 seconds
        pollRef.current = setInterval(() => {
            fetchConversations();
            if (activeConv) {
                fetchMessages(activeConv._id);
            }
        }, 5000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [activeConv]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectConversation = async (conv: Conversation) => {
        setActiveConv(conv);
        await fetchMessages(conv._id);
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !activeConv) return;
        setSending(true);
        try {
            await API.post('/messages', {
                message: newMessage.trim(),
                conversationId: activeConv._id,
                messageType: 'text'
            });
            setNewMessage('');
            await fetchMessages(activeConv._id);
        } catch (error) {
            console.error('Failed to send message', error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const filteredConversations = conversations.filter(conv =>
        search === '' ||
        (conv.user?.name || conv.senderName).toLowerCase().includes(search.toLowerCase()) ||
        (conv.user?.email || '').toLowerCase().includes(search.toLowerCase())
    );

    const totalUnread = conversations.reduce((a, c) => a + c.unreadCount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4">Customer Messages</h2>
                    {totalUnread > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{totalUnread} unread</span>
                    )}
                </div>
                <p className="text-gray-500 mt-2 font-medium">Real-time chat with customers. Respond to inquiries and support requests.</p>
            </div>

            {/* Chat Layout */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '70vh' }}>
                <div className="flex h-full">
                    {/* Conversations List */}
                    <div className="w-80 border-r border-gray-100 flex flex-col">
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-400 px-4 text-center">
                                    <MessageSquare size={32} className="mb-2 opacity-30" />
                                    <p className="text-sm font-medium">No conversations yet</p>
                                </div>
                            ) : (
                                filteredConversations.map(conv => {
                                    const name = conv.user?.name || conv.senderName || 'Unknown Customer';
                                    const isActive = activeConv?._id === conv._id;
                                    return (
                                        <button
                                            key={conv._id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${isActive ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <p className={`font-semibold text-sm truncate ${isActive ? 'text-primary' : 'text-gray-900'}`}>{name}</p>
                                                        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                                                            {conv.unreadCount > 0 && (
                                                                <span className="bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{conv.unreadCount}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {conv.user?.email && (
                                                        <p className="text-[10px] text-gray-400 truncate">{conv.user.email}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1 truncate">{conv.lastMessage}</p>
                                                    <p className="text-[10px] text-gray-300 mt-1 flex items-center gap-1">
                                                        <Clock size={9} /> {new Date(conv.lastMessageAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col">
                        {!activeConv ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p className="font-semibold text-lg">Select a conversation</p>
                                <p className="text-sm mt-1">Choose a customer from the list to start chatting</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            {(activeConv.user?.name || activeConv.senderName || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{activeConv.user?.name || activeConv.senderName || 'Customer'}</p>
                                            {activeConv.user?.email && <p className="text-xs text-gray-400">{activeConv.user.email}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {activeConv.user?.phoneNumber && (
                                            <a href={`tel:${activeConv.user.phoneNumber}`} className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors">
                                                <Phone size={14} /> Call Customer
                                            </a>
                                        )}
                                        {activeConv.user?.email && (
                                            <a href={`mailto:${activeConv.user.email}`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                                                <Mail size={14} /> Email
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg) => {
                                            const isAdmin = msg.senderRole === 'admin';
                                            return (
                                                <motion.div
                                                    key={msg._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                                        {!isAdmin && (
                                                            <p className="text-[10px] font-semibold text-gray-400 px-1">{msg.senderName}</p>
                                                        )}
                                                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                                            isAdmin
                                                                ? 'bg-primary text-white rounded-br-none'
                                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                        }`}>
                                                            {msg.message}
                                                        </div>
                                                        <div className={`flex items-center gap-1 px-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                            <p className="text-[10px] text-gray-300">
                                                                {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            {isAdmin && <CheckCheck size={12} className={msg.isRead ? 'text-blue-400' : 'text-gray-300'} />}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-100">
                                    <div className="flex items-end gap-3">
                                        <textarea
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type a message... (Enter to send)"
                                            rows={2}
                                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!newMessage.trim() || sending}
                                            className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                        >
                                            {sending ? (
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                            ) : (
                                                <Send size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;

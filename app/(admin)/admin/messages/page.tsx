'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/materials', label: 'Materials', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/admin/messages', label: 'Messages', icon: '💬' },
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch (err) {
      toast.error('Error loading messages');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 1000);
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-brand-base">
      <nav className="bg-brand-secondary-light border-b border-brand-accent-dark sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">BrandON</span>
                <span className="text-sm text-brand-primary">Admin</span>
              </Link>
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-primary text-white'
                          : 'text-gray-300 hover:text-white hover:bg-brand-accent/20'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
          <div className="md:hidden flex overflow-x-auto py-2 space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : 'text-gray-300 hover:text-white hover:bg-brand-accent/20'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 whitespace-nowrap"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Customer Messages</h1>
          <p className="text-sm text-gray-400 mt-1">View and manage contact form submissions</p>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 bg-brand-secondary-light rounded-xl border border-brand-accent/30">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Customer inquiries will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1 space-y-3">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedMessage?.id === msg.id
                      ? 'bg-brand-primary/20 border-brand-primary/50'
                      : 'bg-brand-secondary-light border-brand-accent/30 hover:border-brand-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-medium text-sm truncate">{msg.name}</h3>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{msg.phone}</p>
                  <p className="text-gray-500 text-xs line-clamp-2">{msg.message}</p>
                  <p className="text-gray-600 text-xs mt-2">{formatDate(msg.createdAt)}</p>
                </button>
              ))}
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-brand-secondary-light rounded-xl border border-brand-accent/30 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedMessage.name}</h2>
                      <p className="text-gray-400 text-sm mt-1">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-brand-base rounded-lg p-4">
                      <p className="text-gray-500 text-xs mb-1">Phone</p>
                      <p className="text-white text-sm">{selectedMessage.phone}</p>
                    </div>
                    <div className="bg-brand-base rounded-lg p-4">
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-white text-sm">{selectedMessage.email || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="bg-brand-base rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-2">Message</p>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-secondary-light rounded-xl border border-brand-accent/30 p-12 text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400">Select a message to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

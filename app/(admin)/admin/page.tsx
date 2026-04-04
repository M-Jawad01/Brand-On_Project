'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/materials', label: 'Materials', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  ];

  // Fetch orders on page load
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        calculateStats(data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(ordersData: Order[]) {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalPrice, 0);
    
    setStats({
      totalOrders,
      pendingOrders,
      totalRevenue,
    });
  }

  // Handle logout
  async function handleLogout() {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  }

  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
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
              </div>
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-base">
      {/* Admin Navigation */}
      <nav className="bg-brand-secondary-light border-b border-brand-accent-dark sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">BrandON</span>
                <span className="text-sm text-brand-primary">Admin</span>
              </Link>

              {/* Desktop Navigation Links */}
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

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Navigation */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Orders Card */}
          <div className="bg-gradient-to-br from-brand-secondary-light to-brand-secondary rounded-xl p-6 border border-brand-accent/30 hover:border-brand-primary/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-primary/20 rounded-lg">
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">All Time</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</h3>
            <p className="text-gray-400 text-sm">Total Orders</p>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-gradient-to-br from-brand-secondary-light to-brand-secondary rounded-xl p-6 border border-brand-accent/30 hover:border-brand-primary/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Needs Attention</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.pendingOrders}</h3>
            <p className="text-gray-400 text-sm">Pending Orders</p>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-gradient-to-br from-brand-secondary-light to-brand-secondary rounded-xl p-6 border border-brand-accent/30 hover:border-brand-primary/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Lifetime</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-brand-secondary-light rounded-xl p-6 border border-brand-accent/30">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/materials"
                  className="flex items-center justify-between p-3 bg-brand-base rounded-lg hover:bg-brand-accent/20 transition group"
                >
                  <span className="text-gray-300 group-hover:text-white">Manage Materials</span>
                  <span className="text-brand-primary">→</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center justify-between p-3 bg-brand-base rounded-lg hover:bg-brand-accent/20 transition group"
                >
                  <span className="text-gray-300 group-hover:text-white">View All Orders</span>
                  <span className="text-brand-primary">→</span>
                </Link>
                <Link
                  href="/admin/gallery"
                  className="flex items-center justify-between p-3 bg-brand-base rounded-lg hover:bg-brand-accent/20 transition group"
                >
                  <span className="text-gray-300 group-hover:text-white">Manage Gallery</span>
                  <span className="text-brand-primary">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-brand-secondary-light rounded-xl border border-brand-accent/30 overflow-hidden">
              <div className="p-6 border-b border-brand-accent/30">
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                <p className="text-sm text-gray-400 mt-1">Latest 5 orders</p>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p>No orders yet</p>
                  <p className="text-sm mt-1">Orders will appear here once customers place them</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-brand-base border-b border-brand-accent/30">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Order #
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-accent/30">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-brand-accent/10 transition">
                          <td className="px-6 py-4">
                            <Link 
                              href={`/admin/orders/${order.id}`}
                              className="text-brand-primary hover:text-brand-primary/80 font-mono text-sm"
                            >
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white text-sm">{order.customerName}</p>
                              <p className="text-gray-500 text-xs">{order.customerEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white text-sm font-semibold">
                              {formatCurrency(order.totalPrice)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {recentOrders.length > 0 && (
                <div className="p-4 border-t border-brand-accent/30 text-center">
                  <Link
                    href="/admin/orders"
                    className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium inline-flex items-center gap-1"
                  >
                    View All Orders
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
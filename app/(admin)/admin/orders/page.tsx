'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress: string | null;
  materialId: string;
  material: { name: string };
  widthFt: number;
  heightFt: number;
  quantity: number;
  totalPrice: number;
  designFileUrl: string | null;
  specialNotes: string | null;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/materials', label: 'Materials', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/admin/messages', label: 'Messages', icon: '💬' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  async function fetchOrders() {
    try {
      const query = filterStatus ? `?status=${filterStatus}` : '';
      const res = await fetch(`/api/orders${query}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch {
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updated = await res.json();
          setSelectedOrder(updated);
        }
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update status');
      }
    } catch {
      toast.error('Error updating order');
    }
  }

  async function handleLogout() {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 1000);
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CONFIRMED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'IN_PROGRESS': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-brand-base">
      {/* Admin Nav */}
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
                        isActive ? 'bg-brand-primary text-white' : 'text-gray-300 hover:text-white hover:bg-brand-accent/20'
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
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Order Management</h1>
            <p className="text-sm text-gray-400 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setFilterStatus(''); setLoading(true); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                !filterStatus ? 'bg-brand-primary text-white' : 'bg-brand-secondary-light text-gray-300 hover:bg-brand-accent/20'
              }`}
            >
              All
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setLoading(true); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterStatus === s ? 'bg-brand-primary text-white' : 'bg-brand-secondary-light text-gray-300 hover:bg-brand-accent/20'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-brand-secondary-light rounded-xl border border-brand-accent/30">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-brand-secondary-light rounded-xl border border-brand-accent/30 hover:border-brand-primary/30 transition overflow-hidden"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-brand-primary font-mono text-sm">#{order.orderNumber.slice(-8)}</p>
                        <p className="text-white font-semibold">{order.customerName}</p>
                        <p className="text-gray-500 text-xs">{order.customerPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(order.totalPrice)}</p>
                        <p className="text-gray-500 text-xs">{order.material?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {selectedOrder?.id === order.id && (
                  <div className="px-5 pb-5 border-t border-brand-accent/30 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Dimensions</p>
                        <p className="text-white text-sm">{order.widthFt} × {order.heightFt} ft ({(order.widthFt * order.heightFt).toFixed(1)} sqft)</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Quantity</p>
                        <p className="text-white text-sm">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Email</p>
                        <p className="text-white text-sm">{order.customerEmail || 'Not provided'}</p>
                      </div>
                      {order.customerAddress && (
                        <div className="md:col-span-3">
                          <p className="text-gray-500 text-xs mb-1">Address</p>
                          <p className="text-white text-sm">{order.customerAddress}</p>
                        </div>
                      )}
                      {order.specialNotes && (
                        <div className="md:col-span-3">
                          <p className="text-gray-500 text-xs mb-1">Special Notes</p>
                          <p className="text-white text-sm">{order.specialNotes}</p>
                        </div>
                      )}
                      {order.designFileUrl && (
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Design File</p>
                          <a href={order.designFileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary text-sm hover:underline">
                            View Design →
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Status Update Actions */}
                    {VALID_TRANSITIONS[order.status]?.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-2 border-t border-brand-accent/20">
                        <span className="text-gray-500 text-xs self-center mr-2">Update to:</span>
                        {VALID_TRANSITIONS[order.status].map((nextStatus) => (
                          <button
                            key={nextStatus}
                            onClick={() => handleStatusUpdate(order.id, nextStatus)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${getStatusColor(nextStatus)} hover:opacity-80`}
                          >
                            {nextStatus.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

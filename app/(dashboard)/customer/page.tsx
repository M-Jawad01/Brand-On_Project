'use client';

import Link from 'next/link';

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-brand-secondary-light border-b border-brand-accent-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
              <p className="text-sm text-gray-400">Welcome back, Customer!</p>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-brand-primary">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Summary */}
        <div className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-brand-primary/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">John Doe</h2>
              <p className="text-gray-400 text-sm mt-1">john.doe@example.com</p>
              <p className="text-gray-400 text-sm">+92 300 1234567</p>
              <button className="mt-3 text-sm text-brand-primary hover:text-brand-primary-light">
                Edit Profile →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-accent-dark/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-xs text-gray-400 mt-1">Total Orders</p>
              </div>
              <div className="bg-brand-accent-dark/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-gray-400 mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/services" className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30 hover:border-brand-primary/50 transition">
            <div className="bg-brand-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">New Order</h3>
            <p className="text-sm text-gray-400">Browse services and place a new order</p>
          </Link>

          <button className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30 hover:border-brand-primary/50 transition text-left">
            <div className="bg-brand-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Track Order</h3>
            <p className="text-sm text-gray-400">Check the status of your orders</p>
          </button>

          <button className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30 hover:border-brand-primary/50 transition text-left">
            <div className="bg-brand-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Get Support</h3>
            <p className="text-sm text-gray-400">Contact us for help or inquiries</p>
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-brand-secondary-light rounded-lg border border-brand-accent-dark/30 overflow-hidden">
          <div className="p-6 border-b border-brand-accent-dark/30">
            <h2 className="text-xl font-semibold text-white">My Orders</h2>
          </div>

          <div className="divide-y divide-brand-accent-dark/20">
            {/* Order 1 */}
            <div className="p-6 hover:bg-brand-accent-dark/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">Custom LED Signboard</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-500">
                      In Progress
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Order #ORD-1234 • Placed on Jan 15, 2024</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Size</p>
                      <p className="text-white font-medium">4ft x 6ft</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-white font-medium">PKR 45,000</p>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-brand-accent-light hover:bg-brand-accent rounded text-sm text-white transition">
                  View Details
                </button>
              </div>
            </div>

            {/* Order 2 */}
            <div className="p-6 hover:bg-brand-accent-dark/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">Vinyl Banner</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-500">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Order #ORD-1223 • Delivered on Jan 10, 2024</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Size</p>
                      <p className="text-white font-medium">3ft x 5ft</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-white font-medium">PKR 8,500</p>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark rounded text-sm text-white transition">
                  Reorder
                </button>
              </div>
            </div>

            {/* Order 3 */}
            <div className="p-6 hover:bg-brand-accent-dark/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">Flex Banner</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-500">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Order #ORD-1198 • Delivered on Jan 5, 2024</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Size</p>
                      <p className="text-white font-medium">2ft x 4ft</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-white font-medium">PKR 5,000</p>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark rounded text-sm text-white transition">
                  Reorder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

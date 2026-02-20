'use client';

import Link from 'next/link';

export default function AgentDashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-brand-secondary-light border-b border-brand-accent-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Dashboard</h1>
              <p className="text-sm text-gray-400">Product & Order Management</p>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-brand-primary">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Services</p>
                <p className="text-3xl font-bold text-white mt-2">12</p>
              </div>
              <div className="bg-brand-primary/20 p-3 rounded-lg">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Orders</p>
                <p className="text-3xl font-bold text-white mt-2">23</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed Orders</p>
                <p className="text-3xl font-bold text-white mt-2">156</p>
              </div>
              <div className="bg-brand-primary/20 p-3 rounded-lg">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-brand-accent-dark">
          <div className="flex gap-4">
            <button className="px-4 py-3 text-brand-primary border-b-2 border-brand-primary font-medium">
              Orders
            </button>
            <button className="px-4 py-3 text-gray-400 hover:text-white transition">
              Services
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-brand-secondary-light rounded-lg border border-brand-accent-dark/30 overflow-hidden">
          <div className="p-6 border-b border-brand-accent-dark/30">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-brand-accent-light hover:bg-brand-accent rounded text-sm text-white transition">
                  Filter
                </button>
                <button className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark rounded text-sm text-white transition">
                  + New Order
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-accent-dark/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-accent-dark/20">
                <tr className="hover:bg-brand-accent-dark/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    #ORD-1234
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    John Doe
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Custom LED Signboard
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-500">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    PKR 45,000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    2024-01-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-brand-primary hover:text-brand-primary-light">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-brand-accent-dark/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    #ORD-1233
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Jane Smith
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Vinyl Banner
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-500">
                      In Progress
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    PKR 8,500
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    2024-01-14
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-brand-primary hover:text-brand-primary-light">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-brand-accent-dark/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    #ORD-1232
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Mike Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Flex Banner
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-500">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    PKR 5,000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    2024-01-13
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-brand-primary hover:text-brand-primary-light">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

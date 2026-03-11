import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-brand-secondary-light border-b border-brand-accent-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">BrandON Control Panel</p>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-brand-primary">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30">
            <h2 className="text-xl font-semibold text-white mb-2">Materials</h2>
            <p className="text-gray-400 text-sm mb-4">Add and manage banner materials and pricing</p>
            <span className="text-brand-primary text-sm">Coming soon →</span>
          </div>

          <div className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30">
            <h2 className="text-xl font-semibold text-white mb-2">Orders</h2>
            <p className="text-gray-400 text-sm mb-4">View and process customer orders</p>
            <span className="text-brand-primary text-sm">Coming soon →</span>
          </div>

          <div className="bg-brand-secondary-light p-6 rounded-lg border border-brand-accent-dark/30">
            <h2 className="text-xl font-semibold text-white mb-2">Gallery</h2>
            <p className="text-gray-400 text-sm mb-4">Manage portfolio images</p>
            <span className="text-brand-primary text-sm">Coming soon →</span>
          </div>
        </div>

        <div className="bg-brand-secondary-light p-8 rounded-lg border border-brand-accent-dark/30 text-center text-gray-400">
          <p>Admin features will be built in the next phase.</p>
          <p className="text-sm mt-2">Materials management, order processing, and gallery management.</p>
        </div>
      </div>
    </div>
  );
}

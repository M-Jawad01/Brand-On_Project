import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-brand-base p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-10">BrandON Control Panel</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Materials Box - Live Connection */}
          <Link href="/admin/materials" className="bg-brand-secondary-light rounded-xl p-8 border border-brand-accent/30 hover:border-brand-primary transition-all group">
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Materials</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Add and manage banner materials and pricing</p>
            <span className="text-brand-primary font-bold text-sm group-hover:underline">MANAGE MATERIALS →</span>
          </Link>

          {/* Orders Box - Live Connection */}
          <Link href="/admin/orders" className="bg-brand-secondary-light rounded-xl p-8 border border-brand-accent/30 hover:border-brand-primary transition-all group">
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Orders</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">View and process customer orders</p>
            <span className="text-brand-primary font-bold text-sm group-hover:underline">VIEW ORDERS →</span>
          </Link>

          {/* Gallery Box - Coming Soon */}
          <div className="bg-brand-secondary-light rounded-xl p-8 border border-brand-accent/30 opacity-50">
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Gallery</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Manage portfolio images</p>
            <span className="text-gray-500 font-bold text-sm italic">COMING SOON →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
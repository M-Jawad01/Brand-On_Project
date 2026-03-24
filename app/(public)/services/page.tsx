import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function ServicesPage() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-brand-base p-10 font-sans flex flex-col items-center">
      <div className="max-w-7xl w-full pt-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">Banner Materials</h1>
          <p className="text-gray-400 text-lg">Choose your banner material — pricing is per square foot</p>
        </div>

        {materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-white mt-4">Materials will be loaded from the database.</p>
            <p className="text-gray-500 text-sm mt-2">Admin needs to add materials first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.map((item) => (
              <div key={item.id} className="bg-brand-secondary-light border border-brand-accent/30 rounded-2xl p-8 hover:border-brand-primary transition-all group shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 h-12 overflow-hidden">
                    High quality and durable printing material suitable for all your branding and outdoor needs.
                  </p>
                </div>
                <div className="flex justify-between items-end border-t border-brand-accent/30 pt-6">
                  <div>
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">Price</p>
                    <p className="text-3xl font-black text-white tracking-tighter">৳{item.pricePerSqFt}<span className="text-sm text-gray-400 font-medium tracking-normal">/sq.ft</span></p>
                  </div>
                  <Link href={`/order/${item.id}`} className="bg-brand-primary hover:bg-green-700 text-white font-black py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-primary/20 text-sm tracking-widest uppercase">
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 bg-brand-secondary p-12 rounded-2xl text-center border border-brand-accent/30 w-full">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Our team is ready to bring your unique vision to life. Contact us for personalized quotes.</p>
          <Link href="/contact" className="bg-brand-primary hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
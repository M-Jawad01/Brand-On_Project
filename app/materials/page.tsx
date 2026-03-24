import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function PublicMaterialsPage() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-brand-base p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">Premium Printing Materials</h1>
          <p className="text-gray-400 text-lg">Choose the perfect material for your next big banner.</p>
        </div>

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
      </div>
    </div>
  );
}
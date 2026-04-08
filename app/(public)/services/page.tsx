import Link from 'next/link';
import prisma from '@/lib/prisma';
import MaterialCard from '@/components/MaterialCard';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const materials = await prisma.material.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-secondary-light to-brand-base py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Banner Materials
            </h1>
            <p className="text-xl text-gray-300">
              Choose your banner material — pricing is per square foot
            </p>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {materials.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg">No materials available yet.</p>
              <p className="text-sm mt-2">Check back soon — we&apos;re updating our catalog.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-secondary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our team is ready to bring your unique vision to life. Contact us for personalized quotes.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-primary hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

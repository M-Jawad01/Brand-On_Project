
import prisma from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-brand-base">
      <section className="bg-gradient-to-b from-brand-secondary to-brand-base py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project <span className="text-brand-primary">Gallery</span></h1>
          <p className="text-gray-300">See our latest print-on-demand success stories</p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-400">Gallery is currently empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group bg-brand-secondary-light rounded-xl overflow-hidden border border-brand-accent/30 hover:border-brand-primary/50 transition-all">
                <div className="relative aspect-video">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  {item.description && <p className="text-gray-400 text-sm mt-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
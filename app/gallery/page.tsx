import { mockGalleryItems } from '@/lib/data/mockServices';

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-secondary to-brand-base py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Portfolio
            </h1>
            <p className="text-xl text-gray-300">
              Showcasing our finest work and successful projects
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Grid Layout - Strict 4 columns on desktop, responsive on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockGalleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-brand-secondary rounded-lg overflow-hidden hover:shadow-xl hover:shadow-brand-primary/20 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-brand-accent overflow-hidden">
                  {/* Placeholder Image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-brand-base/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white space-y-1 w-full">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-brand-primary text-white text-xs px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Info Section (Visible on Mobile, Hidden on Hover Desktop) */}
                <div className="p-4 lg:hidden">
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2">{item.description}</p>
                  {item.clientName && (
                    <p className="text-xs text-gray-400">Client: {item.clientName}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(item.projectDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button (Optional for future) */}
          <div className="text-center mt-12">
            <button className="bg-brand-secondary hover:bg-brand-accent text-white font-semibold px-8 py-3 rounded-lg transition">
              Load More Projects
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let us bring your vision to life with our expertise and creativity. Contact us today for a free consultation.
          </p>
          <a
            href="/services"
            className="inline-block bg-brand-primary hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg transition"
          >
            Explore Our Services
          </a>
        </div>
      </section>
    </div>
  );
}

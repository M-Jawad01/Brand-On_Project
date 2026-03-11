export default function GalleryPage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-secondary to-brand-base py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-brand-primary">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300">
            Showcasing our finest work and successful projects
          </p>
        </div>
      </section>

      {/* Portfolio placeholder — will load from DB */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-20 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">Portfolio items will be loaded from the database.</p>
            <p className="text-sm mt-2">Admin needs to add gallery items first.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Want to see your brand here?</h2>
          <a
            href="/services"
            className="inline-block bg-brand-primary hover:bg-green-700 text-white font-bold px-10 py-4 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            Start Your Journey
          </a>
        </div>
      </section>
    </div>
  );
}

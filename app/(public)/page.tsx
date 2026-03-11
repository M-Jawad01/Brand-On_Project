import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-brand-secondary to-brand-base">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Welcome to <span className="text-brand-primary">BrandON</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Your Premier Custom Banner Printing Partner
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Pick your banner material, upload your design, and get high-quality custom banners printed and delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="bg-brand-primary hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
              >
                Browse Materials
              </Link>
              <Link
                href="/gallery"
                className="bg-brand-secondary-light hover:bg-brand-accent text-white font-bold py-4 px-8 rounded-lg transition text-lg border-2 border-brand-primary"
              >
                Our Portfolio
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-base to-transparent"></div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get your custom banner in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-primary">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose Material</h3>
              <p className="text-gray-400 text-sm">Pick from our range of banner materials at transparent per-sqft pricing</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-primary">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload Design</h3>
              <p className="text-gray-400 text-sm">Upload your banner image, specify the size, and we calculate the price instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-primary">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">Place Order</h3>
              <p className="text-gray-400 text-sm">Submit your order, we call to confirm, and deliver via Cash on Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-brand-secondary-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose BrandON?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Materials</h3>
              <p className="text-gray-400 text-sm">Premium banner materials for every need</p>
            </div>

            <div className="text-center">
              <div className="bg-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Turnaround</h3>
              <p className="text-gray-400 text-sm">Quick delivery without compromising quality</p>
            </div>

            <div className="text-center">
              <div className="bg-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cash on Delivery</h3>
              <p className="text-gray-400 text-sm">Pay when you receive — no upfront payment</p>
            </div>

            <div className="text-center">
              <div className="bg-brand-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Transparent Pricing</h3>
              <p className="text-gray-400 text-sm">See exact per-sqft rates upfront, no hidden charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our materials, pick your size, upload your design and place your order today.
          </p>
          <Link
            href="/services"
            className="inline-block bg-brand-primary hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg transition"
          >
            Browse Materials →
          </Link>
        </div>
      </section>
    </div>
  );
}

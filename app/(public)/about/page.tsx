export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-secondary-light to-brand-base py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About BrandON
            </h1>
            <p className="text-xl text-gray-300">
              Elevating Your Brand with Premium Advertising Solutions
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-brand-secondary-light p-8 md:p-12 rounded-lg border border-brand-accent-dark/30">
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  BrandON is a leading digital advertising agency specializing in custom signage, banners,
                  and branding solutions. With over 10 years of experience, we help businesses create
                  impactful visual identities that drive growth and recognition.
                </p>
                <p>
                  We specialize in a wide range of advertising solutions including custom banners,
                  LED signboards, and more. Every project we undertake is executed with
                  precision, creativity, and a commitment to excellence.
                </p>
                <p>
                  Our state-of-the-art facilities and expert team ensure that your brand message is delivered with
                  maximum impact, whether it&apos;s for a small local business or a large corporate enterprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-brand-secondary-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Get in Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="bg-brand-accent p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p className="text-gray-300">+92 300 1234567</p>
                    <p className="text-sm text-gray-400 mt-1">Call us anytime</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-accent p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-300">info@brandonagency.com</p>
                    <p className="text-sm text-gray-400 mt-1">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-accent p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-300">Shop #12, Green Plaza, Main Boulevard, City Center</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-accent p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-300">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <div className="bg-brand-accent rounded-lg h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400 p-8">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p>Google Maps Integration</p>
                  <p className="text-sm mt-2">Visit us at our office</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

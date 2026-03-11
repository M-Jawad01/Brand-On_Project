export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-secondary to-brand-base py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300">
              Have a question or ready to start your project? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-brand-secondary p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-300 mb-8">
                  Feel free to reach out to us through any of the following channels.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-brand-secondary p-6 rounded-lg flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p className="text-gray-300">+92 300 1234567</p>
                    <p className="text-sm text-gray-400 mt-1">Mon-Sat, 9AM-6PM</p>
                  </div>
                </div>

                <div className="bg-brand-secondary p-6 rounded-lg flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-300">info@brandonagency.com</p>
                    <p className="text-sm text-gray-400 mt-1">24-hour response time</p>
                  </div>
                </div>

                <div className="bg-brand-secondary p-6 rounded-lg flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Office Location</h3>
                    <p className="text-gray-300">Shop #12, Green Plaza, Main Boulevard, City Center</p>
                    <p className="text-sm text-gray-400 mt-1">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

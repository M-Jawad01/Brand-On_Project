import { mockServices } from '@/lib/data/mockServices';
import ServiceCard from '@/components/ServiceCard';

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-secondary-light to-brand-base py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Services
            </h1>
            <p className="text-xl text-gray-300">
              Premium advertising solutions tailored to elevate your brand
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter - Optional for future enhancement */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <button className="px-6 py-2 bg-brand-primary text-white rounded-lg font-semibold">
              All Services
            </button>
            <button className="px-6 py-2 bg-brand-secondary hover:bg-brand-accent text-gray-300 rounded-lg transition">
              Signage
            </button>
            <button className="px-6 py-2 bg-brand-secondary hover:bg-brand-accent text-gray-300 rounded-lg transition">
              Banners
            </button>
            <button className="px-6 py-2 bg-brand-secondary hover:bg-brand-accent text-gray-300 rounded-lg transition">
              Branding
            </button>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-brand-secondary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our team is ready to bring your unique vision to life. Contact us for personalized quotes and expert guidance.
          </p>
          <a
            href="/contact"
            className="inline-block bg-brand-primary hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg transition"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { mockServices, companyInfo } from '@/lib/data/mockServices';
import { notFound } from 'next/navigation';
import OrderFormModal from '@/components/OrderFormModal';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = mockServices.find((s) => s.id === params.id);
  const [selectedSize, setSelectedSize] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  if (!service) {
    notFound();
  }

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Service Detail Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Image */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="bg-brand-secondary rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  <div className="text-gray-400 text-center p-8">
                    <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Service Image Placeholder</p>
                  </div>
                </div>
                <div className="mt-4 bg-brand-secondary p-4 rounded-lg">
                  <span className="text-brand-primary font-semibold">Category: </span>
                  <span className="text-gray-300">{service.category}</span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-400">
                <span className="hover:text-brand-primary cursor-pointer">Services</span>
                <span className="mx-2">/</span>
                <span className="text-white">{service.name}</span>
              </div>

              {/* Title and Price */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {service.name}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-brand-primary">
                    PKR {service.baseRate}
                  </span>
                  <span className="text-xl text-gray-400">
                    {service.priceUnit}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">Description</h2>
                <p className="text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Size Selection */}
              {service.allowCustomSize && (
                <div className="space-y-4 bg-brand-secondary p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white">Select Size</h3>
                  
                  {/* Standard Sizes */}
                  <div className="grid grid-cols-2 gap-3">
                    {service.standardSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setCustomSize('');
                        }}
                        className={`p-3 rounded-lg border-2 transition ${
                          selectedSize === size
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-brand-accent text-gray-300 hover:border-brand-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Custom Size Input */}
                  <div className="pt-4 border-t border-brand-accent">
                    <label className="block text-sm text-gray-400 mb-2">
                      Or enter custom size:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 5x7 feet"
                      value={customSize}
                      onChange={(e) => {
                        setCustomSize(e.target.value);
                        setSelectedSize('');
                      }}
                      className="w-full px-4 py-2 bg-brand-base border border-brand-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              )}

              {/* Order Button */}
              <button
                onClick={handleOrderClick}
                disabled={service.allowCustomSize && !selectedSize && !customSize}
                className="w-full bg-brand-primary hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition text-lg"
              >
                Order Custom Design
              </button>

              {/* Features/Highlights */}
              <div className="bg-brand-secondary p-6 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">High-quality materials and printing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Custom designs and sizes available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Fast turnaround time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Professional installation available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section (Mandatory) */}
      <section className="py-16 bg-brand-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">About BrandON</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Who We Are</h3>
                <p className="text-gray-300 leading-relaxed">
                  {companyInfo.about}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Contact Information</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {companyInfo.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {companyInfo.email}
                  </p>
                  <p className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {companyInfo.location}
                  </p>
                  <p className="text-sm text-gray-400 mt-4">
                    {companyInfo.businessHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder & Social Links */}
            <div className="space-y-6">
              {/* Map Placeholder */}
              <div>
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Location</h3>
                <div className="bg-brand-accent rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm">Google Maps Integration</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Connect With Us</h3>
                <div className="flex gap-4">
                  {companyInfo.socialMedia.facebook && (
                    <a
                      href={companyInfo.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-accent hover:bg-brand-primary p-3 rounded-lg transition"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {companyInfo.socialMedia.instagram && (
                    <a
                      href={companyInfo.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-accent hover:bg-brand-primary p-3 rounded-lg transition"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  <a
                    href={companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-accent hover:bg-brand-primary p-3 rounded-lg transition"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Modal */}
      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        service={service}
        selectedSize={customSize || selectedSize}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { mockGalleryItems } from '@/lib/data/mockServices';

export default function GalleryPage() {
  // Filter set and logics
  const [filter, setFilter] = useState('All');

  // unique catagory list create
const categories = ['All', ...Array.from(new Set(mockGalleryItems.map((item) => item.category)))];
  const filteredItems = filter === 'All'
    ? mockGalleryItems
    : mockGalleryItems.filter((item) => item.category === filter);

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

      {/* filter button section */}
      <section className="py-8 bg-brand-base">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  filter === cat
                    ? 'bg-brand-primary text-white shadow-lg'
                    : 'bg-brand-secondary text-gray-400 hover:bg-brand-accent hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* portfolio grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-brand-secondary rounded-lg overflow-hidden hover:shadow-xl hover:shadow-brand-primary/20 transition-all duration-300"
              >
                {/* image container */}
                <div className="relative aspect-square overflow-hidden bg-brand-accent">
                  
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/*hover overlay*/}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-brand-base/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white space-y-1">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-xs text-gray-300 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  {/* catagory badge*/}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-brand-primary text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>

          
                <div className="p-4 lg:hidden bg-brand-secondary">
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">Client: {item.clientName || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No projects found in this category.
            </div>
          )}
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
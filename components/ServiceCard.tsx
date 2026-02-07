import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/lib/data/mockServices';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`}>
      <div className="bg-brand-secondary rounded-lg overflow-hidden hover:shadow-xl hover:shadow-brand-primary/20 transition-all duration-300 group h-full">
        {/* Service Image */}
        <div className="relative h-64 bg-brand-accent overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-base/80 to-transparent z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-brand-primary text-white text-xs px-3 py-1 rounded-full">
              {service.category}
            </span>
          </div>
        </div>

        {/* Service Details */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition">
            {service.name}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {service.description}
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-brand-primary">
                PKR {service.baseRate}
              </span>
              <span className="text-gray-400 text-sm ml-2">
                {service.priceUnit}
              </span>
            </div>
            <div className="text-brand-primary group-hover:translate-x-1 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Custom Size Badge */}
          {service.allowCustomSize && (
            <div className="mt-4 pt-4 border-t border-brand-accent">
              <span className="text-xs text-gray-400">✓ Custom sizes available</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

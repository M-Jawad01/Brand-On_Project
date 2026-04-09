import Link from 'next/link';
import Image from 'next/image';

interface MaterialCardProps {
  material: {
    id: string;
    name: string;
    description: string | null;
    pricePerSqFt: number;
    imageUrl: string | null;
  };
  isAdmin?: boolean;
}

export default function MaterialCard({ material, isAdmin = false }: MaterialCardProps) {
  return (
    <div className="group bg-brand-secondary-light rounded-xl overflow-hidden border border-brand-accent/30 hover:border-brand-primary/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
      {/* Image Section */}
      <div className="h-48 bg-brand-accent/20 flex items-center justify-center overflow-hidden">
        {material.imageUrl ? (
          <img 
            src={material.imageUrl} 
            alt={material.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Placeholder SVG
          <svg 
            className="w-16 h-16 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-1 line-clamp-1">
          {material.name}
        </h3>
        
        {material.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {material.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-brand-primary font-bold text-lg">
              PKR {material.pricePerSqFt.toLocaleString()}
            </span>
            <span className="text-gray-500 text-xs ml-1">/sqft</span>
          </div>
          
          {!isAdmin && (
            <Link
              href={`/order?material=${material.id}`}
              className="bg-brand-primary hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200 hover:shadow-lg"
            >
              Order Now →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
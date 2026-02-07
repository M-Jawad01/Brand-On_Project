// Mock service data for BrandON Digital Advertising Agency

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  baseRate: number;
  priceUnit: string; // e.g., "per sq ft", "per piece"
  imageUrl: string;
  allowCustomSize: boolean;
  standardSizes: string[];
}

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'LED Letter Signboard',
    description: 'Premium quality LED letter signboards perfect for storefronts, offices, and commercial spaces. Energy-efficient with long-lasting illumination.',
    category: 'Signage',
    baseRate: 150,
    priceUnit: 'per sq ft',
    imageUrl: '/images/services/led-signboard.jpg',
    allowCustomSize: true,
    standardSizes: ['2x3 ft', '3x5 ft', '4x6 ft', '5x8 ft'],
  },
  {
    id: '2',
    name: 'Birthday Banner',
    description: 'Vibrant, colorful birthday banners customized with your design. Perfect for parties, celebrations, and special events.',
    category: 'Banners',
    baseRate: 25,
    priceUnit: 'per sq ft',
    imageUrl: '/images/services/birthday-banner.jpg',
    allowCustomSize: true,
    standardSizes: ['3x5 ft', '4x6 ft', '5x8 ft', '6x10 ft'],
  },
  {
    id: '3',
    name: 'Political Campaign Banner',
    description: 'High-impact political campaign banners with weather-resistant materials. Bold designs that capture attention.',
    category: 'Banners',
    baseRate: 30,
    priceUnit: 'per sq ft',
    imageUrl: '/images/services/political-banner.jpg',
    allowCustomSize: true,
    standardSizes: ['4x6 ft', '5x8 ft', '6x10 ft', '8x12 ft'],
  },
  {
    id: '4',
    name: 'Showroom Branding',
    description: 'Complete showroom branding solutions including wall graphics, displays, and signage. Create an immersive brand experience.',
    category: 'Branding',
    baseRate: 200,
    priceUnit: 'per project',
    imageUrl: '/images/services/showroom-branding.jpg',
    allowCustomSize: true,
    standardSizes: ['Small Showroom', 'Medium Showroom', 'Large Showroom'],
  },
  {
    id: '5',
    name: 'Flex Banner Printing',
    description: 'Durable flex banners for outdoor and indoor use. High-resolution printing with UV-resistant inks.',
    category: 'Banners',
    baseRate: 20,
    priceUnit: 'per sq ft',
    imageUrl: '/images/services/flex-banner.jpg',
    allowCustomSize: true,
    standardSizes: ['3x5 ft', '4x6 ft', '5x10 ft', '6x12 ft'],
  },
  {
    id: '6',
    name: 'Neon Sign Boards',
    description: 'Eye-catching neon sign boards that add a modern, vibrant look to any business. Custom colors and designs available.',
    category: 'Signage',
    baseRate: 180,
    priceUnit: 'per sq ft',
    imageUrl: '/images/services/neon-sign.jpg',
    allowCustomSize: true,
    standardSizes: ['2x2 ft', '2x4 ft', '3x5 ft', '4x6 ft'],
  },
  {
    id: '7',
    name: 'Vehicle Branding',
    description: 'Professional vehicle wraps and branding for cars, vans, and trucks. Turn your vehicle into a mobile billboard.',
    category: 'Branding',
    baseRate: 500,
    priceUnit: 'per vehicle',
    imageUrl: '/images/services/vehicle-branding.jpg',
    allowCustomSize: false,
    standardSizes: ['Car', 'Van', 'Truck', 'Bus'],
  },
  {
    id: '8',
    name: 'Shop Fascia Board',
    description: 'Premium fascia boards for shop fronts with custom designs. Weather-resistant and long-lasting.',
    category: 'Signage',
    baseRate: 120,
    priceUnit: 'per sq ft',
    imageUrl: '/images/services/fascia-board.jpg',
    allowCustomSize: true,
    standardSizes: ['6x2 ft', '8x2 ft', '10x2 ft', '12x3 ft'],
  },
];

// Gallery/Portfolio mock data
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  projectDate: string;
  clientName?: string;
}

export const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Luxury Showroom Transformation',
    description: 'Complete branding solution for a premium automobile showroom',
    imageUrl: '/images/gallery/showroom-1.jpg',
    category: 'Branding',
    projectDate: '2024-12-15',
    clientName: 'Elite Motors',
  },
  {
    id: '2',
    title: 'LED Signboard - Restaurant',
    description: 'Custom LED letter signboard with warm lighting',
    imageUrl: '/images/gallery/led-restaurant.jpg',
    category: 'Signage',
    projectDate: '2024-11-20',
    clientName: 'Spice Garden',
  },
  {
    id: '3',
    title: 'Political Campaign - Election 2024',
    description: 'Large-scale campaign banner installations across the city',
    imageUrl: '/images/gallery/political-campaign.jpg',
    category: 'Banners',
    projectDate: '2024-10-05',
  },
  {
    id: '4',
    title: 'Birthday Celebration Setup',
    description: 'Vibrant birthday banners with custom character designs',
    imageUrl: '/images/gallery/birthday-setup.jpg',
    category: 'Event',
    projectDate: '2024-12-01',
  },
  {
    id: '5',
    title: 'Corporate Office Branding',
    description: 'Wall graphics and wayfinding signage for tech startup',
    imageUrl: '/images/gallery/office-branding.jpg',
    category: 'Branding',
    projectDate: '2024-09-18',
    clientName: 'TechVista Inc',
  },
  {
    id: '6',
    title: 'Neon Cafe Sign',
    description: 'Custom neon signboard with animated effects',
    imageUrl: '/images/gallery/neon-cafe.jpg',
    category: 'Signage',
    projectDate: '2024-11-10',
    clientName: 'Brew & Beans',
  },
  {
    id: '7',
    title: 'Vehicle Fleet Branding',
    description: 'Complete fleet branding for logistics company',
    imageUrl: '/images/gallery/vehicle-fleet.jpg',
    category: 'Branding',
    projectDate: '2024-10-22',
    clientName: 'Swift Logistics',
  },
  {
    id: '8',
    title: 'Retail Store Fascia',
    description: 'Modern fascia board with backlit elements',
    imageUrl: '/images/gallery/store-fascia.jpg',
    category: 'Signage',
    projectDate: '2024-12-08',
    clientName: 'Fashion Hub',
  },
];

// Company/About Information
export interface CompanyInfo {
  companyName: string;
  tagline: string;
  about: string;
  location: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  businessHours: string;
}

export const companyInfo: CompanyInfo = {
  companyName: 'BrandON',
  tagline: 'Elevating Your Brand with Premium Advertising Solutions',
  about: 'BrandON is a leading digital advertising agency specializing in custom signage, banners, and branding solutions. With over 10 years of experience, we help businesses create impactful visual identities that drive growth and recognition. Our team of expert designers and craftsmen deliver quality work that exceeds expectations.',
  location: 'Shop #12, Green Plaza, Main Boulevard, City Center',
  phone: '+92 300 1234567',
  email: 'info@brandonagency.com',
  whatsapp: '+92 300 1234567',
  website: 'https://brandonagency.com',
  socialMedia: {
    facebook: 'https://facebook.com/brandonagency',
    instagram: 'https://instagram.com/brandonagency',
    twitter: 'https://twitter.com/brandonagency',
    linkedin: 'https://linkedin.com/company/brandonagency',
  },
  businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
};

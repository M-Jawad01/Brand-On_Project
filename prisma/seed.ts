import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.material.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.companyProfile.deleteMany();

  await prisma.material.createMany({
    data: [
      { name: 'Star Flex', description: 'Durable outdoor flex banner material', pricePerSqFt: 15, isActive: true },
      { name: 'Vinyl', description: 'High-quality vinyl for indoor/outdoor use', pricePerSqFt: 25, isActive: true },
      { name: 'PVC', description: 'Rigid PVC board for signs and displays', pricePerSqFt: 35, isActive: true },
      { name: 'Backlit', description: 'Translucent material for lightbox displays', pricePerSqFt: 40, isActive: true },
      { name: 'Canvas', description: 'Premium canvas for art prints and banners', pricePerSqFt: 45, isActive: true },
    ],
  });

  await prisma.galleryItem.createMany({
    data: [
      { title: 'Shop Front Banner', category: 'Banners', imageUrl: '/uploads/placeholder.jpg' },
      { title: 'Event Backdrop', category: 'Events', imageUrl: '/uploads/placeholder.jpg' },
    ],
  });

  await prisma.companyProfile.create({
    data: {
      companyName: 'BrandON',
      tagline: 'Your Premier Custom Banner Printing Partner',
      about: 'We specialize in high-quality custom banner printing for businesses and events.',
      location: 'Lahore, Pakistan',
      phone: '+92 300 1234567',
      email: 'info@brand-on.pk',
      businessHours: 'Mon-Sat: 9AM - 6PM',
    },
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
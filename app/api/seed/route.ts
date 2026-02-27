import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    let admin = await prisma.user.findUnique({
      where: { email: "admin@brandon.com" }
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      admin = await prisma.user.create({
        data: {
          name: "System Admin",
          email: "admin@brandon.com",
          passwordHash: hashedPassword,
          role: "ADMIN",
          profile: { create: {} }
        }
      });
    }

    const existingServicesCount = await prisma.serviceProduct.count();

    if (existingServicesCount === 0) {
      await prisma.serviceProduct.createMany({
        data: [
          {
            name: "Custom LED Signboard",
            description: "High-quality custom LED signboards for your business storefront.",
            baseRate: 45000,
            category: "Signage",
            allowCustomSize: true,
            standardSizes: JSON.stringify(["3x6 ft", "4x8 ft", "5x10 ft"]),
            createdById: admin.id,
          },
          {
            name: "Vinyl Banner",
            description: "Durable and weather-resistant vinyl banners for events and promotions.",
            baseRate: 8500,
            category: "Banners",
            allowCustomSize: true,
            standardSizes: JSON.stringify(["2x4 ft", "3x6 ft", "4x8 ft"]),
            createdById: admin.id,
          },
          {
            name: "Showroom Branding",
            description: "Complete interior branding solutions including wall graphics and 3D logos.",
            baseRate: 150000,
            category: "Branding",
            allowCustomSize: false,
            createdById: admin.id,
          }
        ]
      });
    }

    const services = await prisma.serviceProduct.findMany();

    return NextResponse.json({
      message: "Database seeded successfully!",
      services: services
    }, { status: 200 });

  } catch (error) {
    console.error("SEEDING_ERROR:", error);
    return NextResponse.json({ error: "Failed to seed the database" }, { status: 500 });
  }
}
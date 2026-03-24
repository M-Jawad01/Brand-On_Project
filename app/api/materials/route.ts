import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, pricePerSqFt } = body;

    const material = await prisma.material.create({
      data: {
        name,
        description,
        pricePerSqFt: parseFloat(pricePerSqFt),
        isActive: true,
      },
    });

    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}